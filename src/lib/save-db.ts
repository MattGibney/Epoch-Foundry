const DB_NAME = 'epochFoundry.db'
const DB_VERSION = 2
const SAVE_STORE = 'save_slots'

export type SaveSlotKey = 'main' | 'backup'

export interface SaveSlotPayload {
  format: string
  schemaVersion: number
  savedAtMs: number
  state: unknown
}

interface SaveSlotRecord extends SaveSlotPayload {
  key: SaveSlotKey
  updatedAtMs: number
}

type Migration = (db: IDBDatabase, tx: IDBTransaction) => void

function isSaveSlotKey(value: unknown): value is SaveSlotKey {
  return value === 'main' || value === 'backup'
}

function normalizeRecord(value: unknown): SaveSlotRecord | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  if (!isSaveSlotKey(candidate.key)) {
    return null
  }

  const updatedAtMs =
    typeof candidate.updatedAtMs === 'number' && Number.isFinite(candidate.updatedAtMs)
      ? Math.floor(candidate.updatedAtMs)
      : Date.now()

  if (
    typeof candidate.format === 'string' &&
    typeof candidate.schemaVersion === 'number' &&
    Number.isFinite(candidate.schemaVersion) &&
    typeof candidate.savedAtMs === 'number' &&
    Number.isFinite(candidate.savedAtMs)
  ) {
    return {
      key: candidate.key,
      format: candidate.format,
      schemaVersion: Math.floor(candidate.schemaVersion),
      savedAtMs: Math.floor(candidate.savedAtMs),
      state: candidate.state,
      updatedAtMs,
    }
  }

  // v1 fallback shape: { key, raw, updatedAtMs }
  if (typeof candidate.raw === 'string') {
    try {
      const parsed: unknown = JSON.parse(candidate.raw)
      if (!parsed || typeof parsed !== 'object') {
        return null
      }

      const legacy = parsed as Record<string, unknown>
      if (
        typeof legacy.format !== 'string' ||
        typeof legacy.schemaVersion !== 'number' ||
        !Number.isFinite(legacy.schemaVersion) ||
        typeof legacy.savedAtMs !== 'number' ||
        !Number.isFinite(legacy.savedAtMs)
      ) {
        return null
      }

      return {
        key: candidate.key,
        format: legacy.format,
        schemaVersion: Math.floor(legacy.schemaVersion),
        savedAtMs: Math.floor(legacy.savedAtMs),
        state: legacy.state,
        updatedAtMs,
      }
    } catch {
      return null
    }
  }

  return null
}

const MIGRATIONS: Record<number, Migration> = {
  1: (db) => {
    if (!db.objectStoreNames.contains(SAVE_STORE)) {
      db.createObjectStore(SAVE_STORE, { keyPath: 'key' })
    }
  },
  2: (_db, tx) => {
    const store = tx.objectStore(SAVE_STORE)
    const cursorRequest = store.openCursor()

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (!cursor) {
        return
      }

      const normalized = normalizeRecord(cursor.value)
      if (normalized) {
        cursor.update(normalized)
      }

      cursor.continue()
    }
  },
}

let dbPromise: Promise<IDBDatabase> | null = null

function runMigrations(
  db: IDBDatabase,
  tx: IDBTransaction,
  oldVersion: number,
  newVersion: number,
): void {
  for (let version = oldVersion + 1; version <= newVersion; version += 1) {
    const migration = MIGRATIONS[version]
    if (!migration) {
      throw new Error(`Missing IndexedDB migration for version ${version}`)
    }

    migration(db, tx)
  }
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB is not available in this environment.'))
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = request.result
      const tx = request.transaction
      if (!tx) {
        reject(new Error('Missing IndexedDB upgrade transaction.'))
        return
      }

      runMigrations(db, tx, event.oldVersion, DB_VERSION)
    }

    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to open IndexedDB.'))
    }

    request.onblocked = () => {
      reject(new Error('IndexedDB open blocked by another open connection.'))
    }
  })
}

async function getDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase().catch((error) => {
      dbPromise = null
      throw error
    })
  }

  return dbPromise
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await getDatabase()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(SAVE_STORE, mode)
    const store = tx.objectStore(SAVE_STORE)
    let request: IDBRequest<T>

    try {
      request = operation(store)
    } catch (error) {
      reject(error)
      return
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB request failed.'))
  })
}

export async function readSaveSlotRecord(
  key: SaveSlotKey,
): Promise<SaveSlotPayload | null> {
  const rawRecord = await withStore<unknown>('readonly', (store) => store.get(key))
  const normalized = normalizeRecord(rawRecord)
  if (!normalized) {
    return null
  }

  return {
    format: normalized.format,
    schemaVersion: normalized.schemaVersion,
    savedAtMs: normalized.savedAtMs,
    state: normalized.state,
  }
}

export async function writeSaveSlotRecord(
  key: SaveSlotKey,
  payload: SaveSlotPayload,
): Promise<void> {
  await withStore<IDBValidKey>('readwrite', (store) =>
    store.put({
      key,
      format: payload.format,
      schemaVersion: payload.schemaVersion,
      savedAtMs: payload.savedAtMs,
      state: payload.state,
      updatedAtMs: Date.now(),
    } satisfies SaveSlotRecord),
  )
}

export async function removeSaveSlot(key: SaveSlotKey): Promise<void> {
  await withStore<undefined>('readwrite', (store) => store.delete(key))
}
