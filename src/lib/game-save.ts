import Decimal from 'decimal.js'

import {
  BUY_AMOUNT_OPTIONS,
  createInitialGameState,
  type GameState,
} from '@/lib/mvp-engine'

const SAVE_KEY = 'epochFoundry.save.main'
const SAVE_FORMAT = 'epoch-foundry-save'
const SAVE_SCHEMA_VERSION = 1

interface SaveEnvelopeV1 {
  format: string
  schemaVersion: number
  savedAtMs: number
  state: GameState
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
    if (!parsed.isFinite()) {
      return null
    }

    return parsed.toString()
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

function parseLegacyState(value: unknown): GameState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  if (!('total' in candidate) || !('selectedMultiplier' in candidate)) {
    return null
  }

  const credits = parseDecimalString(candidate.total)
  if (!credits) {
    return null
  }

  const migrated = createInitialGameState(Date.now())
  migrated.resources.credits = credits
  migrated.stats.totalCredits = credits
  migrated.stats.runCredits = credits

  return migrated
}

function parseModernState(value: unknown): GameState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  const resources = candidate.resources as Record<string, unknown> | undefined
  const generators = candidate.generators as Record<string, unknown> | undefined
  const runUpgrades = candidate.runUpgrades as Record<string, unknown> | undefined
  const treeNodes = candidate.treeNodes as Record<string, unknown> | undefined
  const overclock = candidate.overclock as Record<string, unknown> | undefined
  const contract = candidate.contract as Record<string, unknown> | undefined
  const stats = candidate.stats as Record<string, unknown> | undefined
  const buyAmount = candidate.buyAmount

  if (
    !resources ||
    !generators ||
    !runUpgrades ||
    !treeNodes ||
    !overclock ||
    !contract ||
    !stats
  ) {
    return null
  }

  const credits = parseDecimalString(resources.credits)
  const components = parseDecimalString(resources.components)
  const research = parseDecimalString(resources.research)
  const influence = parseDecimalString(resources.influence)

  const miners = parseNonNegativeInt(generators.miners)
  const refiners = parseNonNegativeInt(generators.refiners)
  const labs = parseNonNegativeInt(generators.labs)

  const drills = parseNonNegativeInt(runUpgrades.drills)
  const refining = parseNonNegativeInt(runUpgrades.refining)
  const labTech = parseNonNegativeInt(runUpgrades.labTech)

  const industry = parseBool(treeNodes.industry)
  const automation = parseBool(treeNodes.automation)
  const chronotech = parseBool(treeNodes.chronotech)

  const activeUntilMs = parseNonNegativeInt(overclock.activeUntilMs)
  const cooldownUntilMs = parseNonNegativeInt(overclock.cooldownUntilMs)

  const contractIndex = parseNonNegativeInt(contract.index)
  const completedCount = parseNonNegativeInt(contract.completedCount)

  const startedAtMs = parseNonNegativeInt(stats.startedAtMs)
  const lastTickAtMs = parseNonNegativeInt(stats.lastTickAtMs)
  const reboots = parseNonNegativeInt(stats.reboots)
  const runCredits = parseDecimalString(stats.runCredits)
  const totalCredits = parseDecimalString(stats.totalCredits)
  const totalComponents = parseDecimalString(stats.totalComponents)
  const totalResearch = parseDecimalString(stats.totalResearch)

  if (
    !credits ||
    !components ||
    !research ||
    !influence ||
    miners === null ||
    refiners === null ||
    labs === null ||
    drills === null ||
    refining === null ||
    labTech === null ||
    industry === null ||
    automation === null ||
    chronotech === null ||
    activeUntilMs === null ||
    cooldownUntilMs === null ||
    contractIndex === null ||
    completedCount === null ||
    startedAtMs === null ||
    lastTickAtMs === null ||
    reboots === null ||
    !runCredits ||
    !totalCredits ||
    !totalComponents ||
    !totalResearch
  ) {
    return null
  }

  const buy = parseNonNegativeInt(buyAmount)
  const normalizedBuyAmount =
    buy !== null && BUY_AMOUNT_OPTIONS.includes(buy as 1 | 10 | 100)
      ? buy
      : BUY_AMOUNT_OPTIONS[0]

  return {
    resources: {
      credits,
      components,
      research,
      influence,
    },
    generators: {
      miners,
      refiners,
      labs,
    },
    runUpgrades: {
      drills,
      refining,
      labTech,
    },
    treeNodes: {
      industry,
      automation,
      chronotech,
    },
    overclock: {
      activeUntilMs,
      cooldownUntilMs,
    },
    contract: {
      index: contractIndex,
      completedCount,
    },
    stats: {
      startedAtMs,
      lastTickAtMs,
      reboots,
      runCredits,
      totalCredits,
      totalComponents,
      totalResearch,
    },
    buyAmount: normalizedBuyAmount,
  }
}

function parseState(value: unknown): GameState | null {
  return parseModernState(value) ?? parseLegacyState(value)
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') {
    return createInitialGameState(Date.now())
  }

  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) {
      return createInitialGameState(Date.now())
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return createInitialGameState(Date.now())
    }

    const saveEnvelope = parsed as Partial<SaveEnvelopeV1>
    if (
      saveEnvelope.format !== SAVE_FORMAT ||
      saveEnvelope.schemaVersion !== SAVE_SCHEMA_VERSION ||
      !Number.isFinite(saveEnvelope.savedAtMs)
    ) {
      return createInitialGameState(Date.now())
    }

    return parseState(saveEnvelope.state) ?? createInitialGameState(Date.now())
  } catch {
    return createInitialGameState(Date.now())
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
