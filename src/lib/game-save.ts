import Decimal from 'decimal.js'

import {
  ACHIEVEMENT_ORDER,
  applyOfflineProgress,
  BUY_AMOUNT_OPTIONS,
  createInitialGameState,
  GENERATOR_ORDER,
  getOfflineProgressCapSeconds,
  getUnlockedAchievementCount,
  LEGACY_UPGRADE_ORDER,
  MINER_SUBSYSTEM_GENERATOR_ORDER,
  MINER_SUBSYSTEM_UPGRADE_ORDER,
  type GameState,
  type GeneratorKey,
  type LegacyUpgradeKey,
  type MinerSubsystemGeneratorKey,
  type MinerSubsystemUpgradeKey,
  syncAchievements,
  type AchievementKey,
  UPGRADE_ORDER,
  type RunUpgradeKey,
} from '@/lib/game-engine'
import {
  readSaveSlotRecord,
  removeSaveSlot,
  writeSaveSlotRecord,
  type SaveSlotPayload,
} from '@/lib/save-db'
import { type UpdateFrequencyMode } from '@/lib/consts'

const MAIN_SAVE_SLOT = 'main'
const BACKUP_SAVE_SLOT = 'backup'
const SAVE_FORMAT = 'epoch-foundry-save'
const SAVE_SCHEMA_VERSION = 2

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

function parseUpdateFrequency(value: unknown): UpdateFrequencyMode | null {
  if (value === 'slow' || value === 'medium' || value === 'fast') {
    return value
  }

  return null
}

function parseRepeatTapScrollDirection(
  value: unknown,
): GameState['settings']['repeatTapScrollDirection'] | null {
  if (value === 'topToBottom' || value === 'bottomToTop') {
    return value
  }

  return null
}

function parseSettings(value: unknown): GameState['settings'] {
  if (!value || typeof value !== 'object') {
    return {
      showPurchasedUpgrades: false,
      updateFrequency: 'slow',
      repeatTapScrollDirection: 'topToBottom',
    }
  }

  const candidate = value as Record<string, unknown>
  const showPurchasedUpgrades = parseBool(candidate.showPurchasedUpgrades)
  const updateFrequency = parseUpdateFrequency(candidate.updateFrequency)
  const repeatTapScrollDirection = parseRepeatTapScrollDirection(candidate.repeatTapScrollDirection)

  return {
    showPurchasedUpgrades: showPurchasedUpgrades ?? false,
    updateFrequency: updateFrequency ?? 'slow',
    repeatTapScrollDirection: repeatTapScrollDirection ?? 'topToBottom',
  }
}

function parseAscension(value: unknown): GameState['ascension'] {
  if (!value || typeof value !== 'object') {
    return {
      ascensions: 0,
      legacyLevel: '0',
      legacyShards: '0',
      purchasedLegacyUpgrades: LEGACY_UPGRADE_ORDER.reduce((accumulator, key) => {
        accumulator[key] = false
        return accumulator
      }, {} as Record<LegacyUpgradeKey, boolean>),
    }
  }

  const candidate = value as Record<string, unknown>
  const ascensions = parseNonNegativeInt(candidate.ascensions) ?? 0
  const legacyLevel = parseDecimalString(candidate.legacyLevel) ?? '0'
  const legacyShards = parseDecimalString(candidate.legacyShards) ?? '0'
  const purchasedLegacyUpgradesRaw =
    candidate.purchasedLegacyUpgrades as Record<string, unknown> | undefined
  const purchasedLegacyUpgrades = LEGACY_UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = parseBool(purchasedLegacyUpgradesRaw?.[key]) ?? false
    return accumulator
  }, {} as Record<LegacyUpgradeKey, boolean>)

  return {
    ascensions,
    legacyLevel,
    legacyShards,
    purchasedLegacyUpgrades,
  }
}

function normalizeParsedMinerSubsystemGenerators(
  value: unknown,
): GameState['subsystems']['miners']['generators'] {
  const candidate =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : undefined

  return MINER_SUBSYSTEM_GENERATOR_ORDER.reduce((accumulator, key) => {
    accumulator[key] = Math.max(0, Math.floor(parseNonNegativeInt(candidate?.[key]) ?? 0))
    return accumulator
  }, {} as Record<MinerSubsystemGeneratorKey, number>)
}

function normalizeParsedMinerSubsystemPurchasedUpgrades(
  value: unknown,
): GameState['subsystems']['miners']['purchasedUpgrades'] {
  const candidate =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : undefined

  return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = parseBool(candidate?.[key]) ?? false
    return accumulator
  }, {} as Record<MinerSubsystemUpgradeKey, boolean>)
}

function parseSubsystems(
  value: unknown,
  nowMs: number,
): GameState['subsystems'] {
  const initialSubsystems = createInitialGameState(nowMs).subsystems
  if (!value || typeof value !== 'object') {
    return initialSubsystems
  }

  const candidate = value as Record<string, unknown>
  const minerCandidate = candidate.miners as Record<string, unknown> | undefined
  if (!minerCandidate || typeof minerCandidate !== 'object') {
    return initialSubsystems
  }

  const oreData =
    parseDecimalString(minerCandidate.oreData) ??
    parseDecimalString(minerCandidate.surveyData) ??
    initialSubsystems.miners.oreData
  const totalOreData =
    parseDecimalString(minerCandidate.totalOreData) ??
    oreData
  const generators = normalizeParsedMinerSubsystemGenerators(minerCandidate.generators)
  const purchasedUpgrades = normalizeParsedMinerSubsystemPurchasedUpgrades(
    minerCandidate.purchasedUpgrades,
  )

  return {
    miners: {
      oreData,
      totalOreData,
      generators,
      purchasedUpgrades,
    },
  }
}

function parseWorldSeed(value: unknown, fallbackStartedAtMs: number): string {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  return `legacy-${fallbackStartedAtMs.toString(36)}`
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
  const ascension = parseAscension(candidate.ascension)

  if (!credits) {
    return null
  }

  const startedAtMs = parseNonNegativeInt(stats?.startedAtMs) ?? nowMs
  const lastTickAtMs = parseNonNegativeInt(stats?.lastTickAtMs) ?? startedAtMs
  const totalCredits = parseDecimalString(stats?.totalCredits) ?? credits
  const totalCreditsAllResets =
    parseDecimalString(stats?.totalCreditsAllResets) ?? totalCredits

  const normalizedLastTickAtMs = Math.max(startedAtMs, lastTickAtMs)

  const parsedGenerators = {} as Record<GeneratorKey, number>
  for (const key of GENERATOR_ORDER) {
    const parsed = parseNonNegativeInt(generators?.[key])
    parsedGenerators[key] = parsed ?? initial.generators[key]
  }

  const subsystems = parseSubsystems(candidate.subsystems, normalizedLastTickAtMs)

  const parsedUpgrades = {} as Record<RunUpgradeKey, boolean>
  for (const key of UPGRADE_ORDER) {
    const parsed = parseBool(purchasedUpgrades?.[key])
    parsedUpgrades[key] = parsed ?? false
  }

  const parsedAchievements = {} as Record<AchievementKey, boolean>
  const achievements = candidate.achievements as Record<string, unknown> | undefined
  for (const key of ACHIEVEMENT_ORDER) {
    const parsed = parseBool(achievements?.[key])
    parsedAchievements[key] = parsed ?? false
  }

  const normalizedBuyAmount =
    buyAmount !== null &&
    BUY_AMOUNT_OPTIONS.includes(buyAmount as (typeof BUY_AMOUNT_OPTIONS)[number])
      ? buyAmount
      : BUY_AMOUNT_OPTIONS[0]

  const random = candidate.random as Record<string, unknown> | undefined
  const worldSeed = parseWorldSeed(random?.worldSeed, startedAtMs)

  const parsedState: GameState = {
    credits,
    generators: {
      ...parsedGenerators,
    },
    purchasedUpgrades: {
      ...parsedUpgrades,
    },
    achievements: {
      ...parsedAchievements,
    },
    buyAmount: normalizedBuyAmount,
    stats: {
      startedAtMs,
      lastTickAtMs: normalizedLastTickAtMs,
      totalCredits,
      totalCreditsAllResets,
    },
    settings,
    ascension,
    random: {
      worldSeed,
    },
    subsystems,
  }

  return parsedState
}

function parseStateFromEnvelope(envelope: SaveSlotPayload | null): GameState | null {
  if (!envelope) {
    return null
  }

  const saveEnvelope = envelope as Partial<SaveEnvelopeV1>
  if (
    saveEnvelope.format !== SAVE_FORMAT ||
    saveEnvelope.schemaVersion !== SAVE_SCHEMA_VERSION ||
    !Number.isFinite(saveEnvelope.savedAtMs)
  ) {
    return null
  }

  return parseModernState(saveEnvelope.state)
}

function createSaveEnvelope(state: GameState): SaveEnvelopeV1 {
  return {
    format: SAVE_FORMAT,
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAtMs: Date.now(),
    state,
  }
}

async function writeSaveEnvelope(
  payload: SaveEnvelopeV1,
  backupPayload?: SaveEnvelopeV1 | null,
): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (backupPayload !== undefined) {
      if (backupPayload) {
        await writeSaveSlotRecord(BACKUP_SAVE_SLOT, backupPayload)
      } else {
        await removeSaveSlot(BACKUP_SAVE_SLOT)
      }
    } else {
      const current = await readSaveSlotRecord(MAIN_SAVE_SLOT)
      if (current) {
        await writeSaveSlotRecord(BACKUP_SAVE_SLOT, current)
      }
    }

    await writeSaveSlotRecord(MAIN_SAVE_SLOT, payload)
  } catch {
    // Intentionally swallow storage exceptions for MVP stability.
  }
}

export async function loadGameStateWithSummary(): Promise<LoadGameStateResult> {
  if (typeof window === 'undefined') {
    return createFreshLoadResult(Date.now())
  }

  try {
    const mainEnvelope = await readSaveSlotRecord(MAIN_SAVE_SLOT)
    const backupEnvelope = await readSaveSlotRecord(BACKUP_SAVE_SLOT)
    const mainState = parseStateFromEnvelope(mainEnvelope)
    const backupState = parseStateFromEnvelope(backupEnvelope)

    const loadedState = mainState ?? backupState
    const loadedSource = mainState ? 'main' : backupState ? 'backup' : null
    const loadedEnvelope =
      mainState ? mainEnvelope : backupState ? backupEnvelope : null

    if (!loadedState || !loadedSource || !loadedEnvelope) {
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
    const hydratedState = syncAchievements(applyOfflineProgress(loadedState, nowMs))
    const producedCredits = new Decimal(hydratedState.credits).minus(loadedState.credits)

    const didStateChangeFromHydration =
      hydratedState.credits !== loadedState.credits ||
      hydratedState.stats.totalCredits !== loadedState.stats.totalCredits ||
      hydratedState.stats.totalCreditsAllResets !==
        loadedState.stats.totalCreditsAllResets ||
      getUnlockedAchievementCount(hydratedState) !==
        getUnlockedAchievementCount(loadedState) ||
      hydratedState.stats.lastTickAtMs !== loadedState.stats.lastTickAtMs
    const shouldRewriteMain =
      loadedSource === 'backup' || didStateChangeFromHydration

    if (shouldRewriteMain) {
      await writeSaveEnvelope(
        createSaveEnvelope(hydratedState),
        loadedSource === 'backup' ? createSaveEnvelope(loadedState) : undefined,
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

export async function loadGameState(): Promise<GameState> {
  const result = await loadGameStateWithSummary()
  return result.state
}

export async function saveGameState(state: GameState): Promise<void> {
  await writeSaveEnvelope(createSaveEnvelope(state))
}

export async function clearGameSave(): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  try {
    await removeSaveSlot(MAIN_SAVE_SLOT)
    await removeSaveSlot(BACKUP_SAVE_SLOT)
  } catch {
    // Intentionally swallow storage exceptions for MVP stability.
  }
}
