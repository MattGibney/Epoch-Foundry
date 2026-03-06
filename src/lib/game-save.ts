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

  const candidate = value as Record<string, unknown>
  const credits = parseDecimalString(candidate.credits)
  const stats = candidate.stats as Record<string, unknown> | undefined
  const generators = candidate.generators as Record<string, unknown> | undefined
  const purchasedUpgrades = candidate.purchasedUpgrades as Record<string, unknown> | undefined
  const buyAmount = parseNonNegativeInt(candidate.buyAmount)
  const settings = parseSettings(candidate.settings)

  if (!credits || !stats || !generators || !purchasedUpgrades) {
    return null
  }

  const startedAtMs = parseNonNegativeInt(stats.startedAtMs)
  const lastTickAtMs = parseNonNegativeInt(stats.lastTickAtMs)
  const totalCredits = parseDecimalString(stats.totalCredits)

  if (startedAtMs === null || lastTickAtMs === null || !totalCredits) {
    return null
  }

  const parsedGenerators = {} as Record<GeneratorKey, number>
  for (const key of GENERATOR_ORDER) {
    const parsed = parseNonNegativeInt(generators[key])
    if (parsed === null) {
      return null
    }

    parsedGenerators[key] = parsed
  }

  const parsedUpgrades = {} as Record<RunUpgradeKey, boolean>
  for (const key of UPGRADE_ORDER) {
    const parsed = parseBool(purchasedUpgrades[key])
    if (parsed === null) {
      return null
    }

    parsedUpgrades[key] = parsed
  }

  const normalizedBuyAmount =
    buyAmount !== null && BUY_AMOUNT_OPTIONS.includes(buyAmount as 1 | 10 | 100)
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
      lastTickAtMs,
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

export function loadGameStateWithSummary(): LoadGameStateResult {
  if (typeof window === 'undefined') {
    return createFreshLoadResult(Date.now())
  }

  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) {
      return createFreshLoadResult(Date.now())
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return createFreshLoadResult(Date.now())
    }

    const saveEnvelope = parsed as Partial<SaveEnvelopeV1>
    if (
      saveEnvelope.format !== SAVE_FORMAT ||
      saveEnvelope.schemaVersion !== SAVE_SCHEMA_VERSION ||
      !Number.isFinite(saveEnvelope.savedAtMs)
    ) {
      return createFreshLoadResult(Date.now())
    }

    const parsedState = parseState(saveEnvelope.state)
    if (!parsedState) {
      return createFreshLoadResult(Date.now())
    }

    const nowMs = Date.now()
    const elapsedSeconds = Math.max(
      0,
      (Math.max(nowMs, parsedState.stats.lastTickAtMs) - parsedState.stats.lastTickAtMs) /
        1_000,
    )
    const cappedSeconds = Math.min(
      elapsedSeconds,
      getOfflineProgressCapSeconds(parsedState),
    )
    const hydratedState = applyOfflineProgress(parsedState, nowMs)
    const producedCredits = new Decimal(hydratedState.credits).minus(parsedState.credits)

    if (
      hydratedState.credits !== parsedState.credits ||
      hydratedState.stats.totalCredits !== parsedState.stats.totalCredits ||
      hydratedState.stats.lastTickAtMs !== parsedState.stats.lastTickAtMs
    ) {
      const payload: SaveEnvelopeV1 = {
        format: SAVE_FORMAT,
        schemaVersion: SAVE_SCHEMA_VERSION,
        savedAtMs: Date.now(),
        state: hydratedState,
      }

      try {
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
      } catch {
        // Intentionally swallow storage exceptions for MVP stability.
      }
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

export function clearGameSave(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(SAVE_KEY)
  } catch {
    // Intentionally swallow storage exceptions for MVP stability.
  }
}
