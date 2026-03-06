import Decimal from 'decimal.js'

const SAVE_KEY = 'epochFoundry.save.main'
const SAVE_FORMAT = 'epoch-foundry-save'
const SAVE_SCHEMA_VERSION = 1

export const MULTIPLIER_OPTIONS = [
  '1',
  '1e3',
  '1e6',
  '1e9',
  '1e12',
  '1e15',
  '1e18',
  '1e21',
  '1e24',
  '10e12345',
] as const

const MULTIPLIER_DECIMALS = MULTIPLIER_OPTIONS.map(
  (value) => new Decimal(value),
)

export type Multiplier = (typeof MULTIPLIER_OPTIONS)[number]

export interface GameState {
  total: string
  selectedMultiplier: Multiplier
}

interface SaveEnvelopeV1 {
  format: string
  schemaVersion: number
  savedAtMs: number
  state: GameState
}

const DEFAULT_STATE: GameState = {
  total: '0',
  selectedMultiplier: '1',
}

function isMultiplier(value: unknown): value is Multiplier {
  return MULTIPLIER_OPTIONS.includes(value as Multiplier)
}

function parseDecimal(value: unknown): Decimal | null {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }

  if (typeof value === 'number' && !Number.isFinite(value)) {
    return null
  }

  try {
    const parsed = new Decimal(value)
    return parsed.isFinite() ? parsed : null
  } catch {
    return null
  }
}

function normalizeMultiplier(value: unknown): Multiplier {
  if (isMultiplier(value)) {
    return value
  }

  const parsed = parseDecimal(value)
  if (!parsed) {
    return MULTIPLIER_OPTIONS[0]
  }

  for (let index = MULTIPLIER_OPTIONS.length - 1; index >= 0; index -= 1) {
    const option = MULTIPLIER_OPTIONS[index]
    const optionDecimal = MULTIPLIER_DECIMALS[index]

    if (!option || !optionDecimal) {
      continue
    }

    if (parsed.greaterThanOrEqualTo(optionDecimal)) {
      return option
    }
  }

  return MULTIPLIER_OPTIONS[0]
}

function parseGameState(value: unknown): GameState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Partial<Record<keyof GameState, unknown>>
  const total = parseDecimal(candidate.total)
  if (!total) {
    return null
  }

  const normalizedTotal = total.lessThan(0) ? new Decimal(0) : total

  return {
    total: normalizedTotal.toString(),
    selectedMultiplier: normalizeMultiplier(candidate.selectedMultiplier),
  }
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE
  }

  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) {
      return DEFAULT_STATE
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_STATE
    }

    const saveEnvelope = parsed as Partial<SaveEnvelopeV1>
    if (
      saveEnvelope.format !== SAVE_FORMAT ||
      saveEnvelope.schemaVersion !== SAVE_SCHEMA_VERSION ||
      !Number.isFinite(saveEnvelope.savedAtMs)
    ) {
      return DEFAULT_STATE
    }

    const restoredState = parseGameState(saveEnvelope.state)
    return restoredState ?? DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') {
    return
  }

  const payload: SaveEnvelopeV1 = {
    format: SAVE_FORMAT,
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAtMs: Date.now(),
    state,
  }

  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  } catch {
    // Intentionally swallow storage exceptions for MVP stability.
  }
}
