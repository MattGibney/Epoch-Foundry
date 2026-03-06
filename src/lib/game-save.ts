import Decimal from 'decimal.js'

import {
  applyOfflineProgress,
  BUY_AMOUNT_OPTIONS,
  createInitialGameState,
  GENERATOR_ORDER,
  getOfflineProgressCapSeconds,
  type GameState,
  type GeneratorKey,
  UPGRADE_ORDER,
  type RunUpgradeKey,
} from '@/lib/game-engine'

const SAVE_KEY = 'epochFoundry.save.main'
const SAVE_BACKUP_KEY = 'epochFoundry.save.backup'
const SAVE_FORMAT = 'epoch-foundry-save'
const SAVE_SCHEMA_VERSION = 1

interface SaveEnvelopeV1 {
  format: string
  schemaVersion: number
  savedAtMs: number
  state: GameState
}

export interface OfflineProgressLoadSummary {
  appliedSeconds: number
  producedCredits: string
}

export interface LoadGameStateResult {
  state: GameState
  offlineProgress: OfflineProgressLoadSummary | null
}

function createFreshLoadResult(nowMs = Date.now()): LoadGameStateResult {
  return {
    state: createInitialGameState(nowMs),
    offlineProgress: null,
  }
}

function parseDecimalString(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }

  if (typeof value === 'number' && !Number.isFinite(value)) {
    return null
  }

  try {
    const parsed = new Decimal(value)
    return parsed.isFinite() ? parsed.toString() : null
  } catch {
    return null
  }
}

function parseNonNegativeInt(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }

  const rounded = Math.floor(value)
  return rounded >= 0 ? rounded : null
}

function parseBool(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null
}

function parseSettings(value: unknown): GameState['settings'] {
  if (!value || typeof value !== 'object') {
    return {
      showPurchasedUpgrades: false,
    }
  }

  const candidate = value as Record<string, unknown>
  const showPurchasedUpgrades = parseBool(candidate.showPurchasedUpgrades)

  return {
    showPurchasedUpgrades: showPurchasedUpgrades ?? false,
  }
}

function parseModernState(value: unknown): GameState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const nowMs = Date.now()
  const initial = createInitialGameState(nowMs)
  const candidate = value as Record<string, unknown>
  const credits = parseDecimalString(candidate.credits)
  const stats = candidate.stats as Record<string, unknown> | undefined
  const generators = candidate.generators as Record<string, unknown> | undefined
  const purchasedUpgrades = candidate.purchasedUpgrades as Record<string, unknown> | undefined
  const buyAmount = parseNonNegativeInt(candidate.buyAmount)
  const settings = parseSettings(candidate.settings)

  if (!credits) {
    return null
  }

  const startedAtMs = parseNonNegativeInt(stats?.startedAtMs) ?? nowMs
  const lastTickAtMs = parseNonNegativeInt(stats?.lastTickAtMs) ?? startedAtMs
  const totalCredits = parseDecimalString(stats?.totalCredits) ?? credits

  const normalizedLastTickAtMs = Math.max(startedAtMs, lastTickAtMs)

  const parsedGenerators = {} as Record<GeneratorKey, number>
  for (const key of GENERATOR_ORDER) {
    const parsed = parseNonNegativeInt(generators?.[key])
    parsedGenerators[key] = parsed ?? initial.generators[key]
  }

  const parsedUpgrades = {} as Record<RunUpgradeKey, boolean>
  for (const key of UPGRADE_ORDER) {
    const parsed = parseBool(purchasedUpgrades?.[key])
    parsedUpgrades[key] = parsed ?? false
  }

  const normalizedBuyAmount =
    buyAmount !== null &&
    BUY_AMOUNT_OPTIONS.includes(buyAmount as (typeof BUY_AMOUNT_OPTIONS)[number])
      ? buyAmount
      : BUY_AMOUNT_OPTIONS[0]

  return {
    credits,
    generators: {
      miners: parsedGenerators.miners,
      drills: parsedGenerators.drills,
      extractors: parsedGenerators.extractors,
      refineries: parsedGenerators.refineries,
      megaRigs: parsedGenerators.megaRigs,
      orbitalPlatforms: parsedGenerators.orbitalPlatforms,
    },
    purchasedUpgrades: {
      minerTuning: parsedUpgrades.minerTuning,
      minerSwarm: parsedUpgrades.minerSwarm,
      drillGrease: parsedUpgrades.drillGrease,
      drillAI: parsedUpgrades.drillAI,
      extractorCooling: parsedUpgrades.extractorCooling,
      extractorClusters: parsedUpgrades.extractorClusters,
      refineryCatalysts: parsedUpgrades.refineryCatalysts,
      refineryOverdrive: parsedUpgrades.refineryOverdrive,
      megaRigServos: parsedUpgrades.megaRigServos,
      megaRigNanites: parsedUpgrades.megaRigNanites,
      orbitalDrones: parsedUpgrades.orbitalDrones,
      orbitalCommand: parsedUpgrades.orbitalCommand,
      automationLoops: parsedUpgrades.automationLoops,
      quantumForecasts: parsedUpgrades.quantumForecasts,
      archiveBatteries: parsedUpgrades.archiveBatteries,
      temporalVaults: parsedUpgrades.temporalVaults,
    },
    buyAmount: normalizedBuyAmount,
    stats: {
      startedAtMs,
      lastTickAtMs: normalizedLastTickAtMs,
      totalCredits,
    },
    settings,
  }
}

function parseLegacyState(value: unknown): GameState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  const initial = createInitialGameState(Date.now())

  const directCredits = parseDecimalString(candidate.total)
  const resources = candidate.resources as Record<string, unknown> | undefined
  const resourceCredits = parseDecimalString(resources?.credits)
  const recoveredCredits = resourceCredits ?? directCredits

  if (!recoveredCredits) {
    return null
  }

  initial.credits = recoveredCredits
  initial.stats.totalCredits = recoveredCredits

  const legacyGenerators = candidate.generators as Record<string, unknown> | undefined
  const legacyMiners = parseNonNegativeInt(legacyGenerators?.miners)
  if (legacyMiners !== null) {
    initial.generators.miners = Math.max(initial.generators.miners, legacyMiners)
  }

  return initial
}

function parseState(value: unknown): GameState | null {
  return parseModernState(value) ?? parseLegacyState(value)
}

function parseStateFromEnvelope(raw: string): GameState | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  if (!parsed || typeof parsed !== 'object') {
    return null
  }

  const saveEnvelope = parsed as Partial<SaveEnvelopeV1>
  if (
    saveEnvelope.format !== SAVE_FORMAT ||
    typeof saveEnvelope.schemaVersion !== 'number' ||
    saveEnvelope.schemaVersion > SAVE_SCHEMA_VERSION ||
    !Number.isFinite(saveEnvelope.savedAtMs)
  ) {
    return null
  }

  return parseState(saveEnvelope.state)
}

function createSaveEnvelope(state: GameState): SaveEnvelopeV1 {
  return {
    format: SAVE_FORMAT,
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAtMs: Date.now(),
    state,
  }
}

function writeSaveEnvelope(payload: SaveEnvelopeV1, backupRaw?: string | null): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const nextRaw = JSON.stringify(payload)

    if (backupRaw !== undefined) {
      if (backupRaw) {
        window.localStorage.setItem(SAVE_BACKUP_KEY, backupRaw)
      } else {
        window.localStorage.removeItem(SAVE_BACKUP_KEY)
      }
    } else {
      const currentRaw = window.localStorage.getItem(SAVE_KEY)
      if (currentRaw) {
        window.localStorage.setItem(SAVE_BACKUP_KEY, currentRaw)
      }
    }

    window.localStorage.setItem(SAVE_KEY, nextRaw)
  } catch {
    // Intentionally swallow storage exceptions for MVP stability.
  }
}

export function loadGameStateWithSummary(): LoadGameStateResult {
  if (typeof window === 'undefined') {
    return createFreshLoadResult(Date.now())
  }

  try {
    const mainRaw = window.localStorage.getItem(SAVE_KEY)
    const backupRaw = window.localStorage.getItem(SAVE_BACKUP_KEY)
    const mainState = mainRaw ? parseStateFromEnvelope(mainRaw) : null
    const backupState = backupRaw ? parseStateFromEnvelope(backupRaw) : null

    const loadedState = mainState ?? backupState
    const loadedSource = mainState ? 'main' : backupState ? 'backup' : null
    const loadedRaw = mainState ? mainRaw : backupState ? backupRaw : null

    if (!loadedState || !loadedSource || loadedRaw === null) {
      return createFreshLoadResult(Date.now())
    }

    const nowMs = Date.now()
    const elapsedSeconds = Math.max(
      0,
      (Math.max(nowMs, loadedState.stats.lastTickAtMs) - loadedState.stats.lastTickAtMs) /
        1_000,
    )
    const cappedSeconds = Math.min(
      elapsedSeconds,
      getOfflineProgressCapSeconds(loadedState),
    )
    const hydratedState = applyOfflineProgress(loadedState, nowMs)
    const producedCredits = new Decimal(hydratedState.credits).minus(loadedState.credits)

    const didStateChangeFromHydration =
      hydratedState.credits !== loadedState.credits ||
      hydratedState.stats.totalCredits !== loadedState.stats.totalCredits ||
      hydratedState.stats.lastTickAtMs !== loadedState.stats.lastTickAtMs
    const shouldRewriteMain =
      loadedSource === 'backup' || didStateChangeFromHydration

    if (shouldRewriteMain) {
      writeSaveEnvelope(
        createSaveEnvelope(hydratedState),
        loadedSource === 'backup' ? loadedRaw : undefined,
      )
    }

    return {
      state: hydratedState,
      offlineProgress:
        cappedSeconds > 0 && producedCredits.greaterThan(0)
          ? {
              appliedSeconds: cappedSeconds,
              producedCredits: producedCredits.toString(),
            }
          : null,
    }
  } catch {
    return createFreshLoadResult(Date.now())
  }
}

export function loadGameState(): GameState {
  return loadGameStateWithSummary().state
}

export function saveGameState(state: GameState): void {
  writeSaveEnvelope(createSaveEnvelope(state))
}

export function clearGameSave(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(SAVE_KEY)
    window.localStorage.removeItem(SAVE_BACKUP_KEY)
  } catch {
    // Intentionally swallow storage exceptions for MVP stability.
  }
}
