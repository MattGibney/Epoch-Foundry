import Decimal from 'decimal.js'

import {
  ACHIEVEMENT_ORDER,
  applyOfflineProgress,
  BUY_AMOUNT_OPTIONS,
  createInitialGameState,
  ensureContractsState,
  GENERATOR_ORDER,
  getOfflineProgressCapSeconds,
  getUnlockedAchievementCount,
  type GameState,
  type GeneratorKey,
  type ContractBand,
  type ContractState,
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

function parseUpdateFrequency(value: unknown): UpdateFrequencyMode | null {
  if (value === 'slow' || value === 'medium' || value === 'fast') {
    return value
  }

  return null
}

function parseSettings(value: unknown): GameState['settings'] {
  if (!value || typeof value !== 'object') {
    return {
      showPurchasedUpgrades: false,
      updateFrequency: 'slow',
    }
  }

  const candidate = value as Record<string, unknown>
  const showPurchasedUpgrades = parseBool(candidate.showPurchasedUpgrades)
  const updateFrequency = parseUpdateFrequency(candidate.updateFrequency)

  return {
    showPurchasedUpgrades: showPurchasedUpgrades ?? false,
    updateFrequency: updateFrequency ?? 'slow',
  }
}

function parsePrestige(value: unknown): GameState['prestige'] {
  if (!value || typeof value !== 'object') {
    return {
      resets: 0,
      essence: '0',
    }
  }

  const candidate = value as Record<string, unknown>
  const resets = parseNonNegativeInt(candidate.resets) ?? 0
  const essence = parseDecimalString(candidate.essence) ?? '0'

  return {
    resets,
    essence,
  }
}

function parseWorldSeed(value: unknown, fallbackStartedAtMs: number): string {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  return `legacy-${fallbackStartedAtMs.toString(36)}`
}

function parseContractBand(value: unknown): ContractBand | null {
  if (value === 'short' || value === 'medium' || value === 'long') {
    return value
  }
  return null
}

function getDefaultOfferDurationMs(): number {
  return 15 * 60 * 1000
}

function parseContractState(value: unknown): ContractState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  if (typeof candidate.id !== 'string' || candidate.id.length === 0) {
    return null
  }

  const kind =
    candidate.kind === 'challenge' || candidate.kind === 'objective'
      ? candidate.kind
      : 'objective'
  const progressMode =
    candidate.progressMode === 'incremental' ? 'incremental' : 'absolute'
  const isParticipating = candidate.isParticipating === true
  const band = parseContractBand(candidate.band)
  const quality =
    candidate.quality === 'elite' || candidate.quality === 'rare' || candidate.quality === 'common'
      ? candidate.quality
      : 'common'
  const createdAtMs = parseNonNegativeInt(candidate.createdAtMs)
  const objective = candidate.objective as Record<string, unknown> | undefined
  if (!band || createdAtMs === null || !objective) {
    return null
  }
  const expiresAtMsRaw = parseNonNegativeInt(candidate.expiresAtMs)
  const expiresAtMs =
    expiresAtMsRaw !== null ? expiresAtMsRaw : candidate.expiresAtMs === null ? null : null
  const offerExpiresAtMs =
    parseNonNegativeInt(candidate.offerExpiresAtMs) ?? createdAtMs + getDefaultOfferDurationMs()
  const progressStartRunCredits = parseDecimalString(candidate.progressStartRunCredits)
  const progressStartOwnedCount = parseNonNegativeInt(candidate.progressStartOwnedCount)
  const progressStartPurchasedUpgrades = parseNonNegativeInt(candidate.progressStartPurchasedUpgrades)
  const challengeDurationMsRaw = parseNonNegativeInt(candidate.challengeDurationMs)
  const challengeDurationMs =
    challengeDurationMsRaw !== null
      ? challengeDurationMsRaw
      : expiresAtMs !== null
        ? Math.max(0, expiresAtMs - createdAtMs)
        : null

  const rewardsRaw = Array.isArray(candidate.rewards) ? candidate.rewards : []
  const parsedRewards = rewardsRaw
    .map((reward): ContractState['rewards'][number] | null => {
      if (!reward || typeof reward !== 'object') {
        return null
      }
      const entry = reward as Record<string, unknown>
      if (entry.type === 'credits') {
        const amount = parseDecimalString(entry.amount)
        return amount ? { type: 'credits', amount } : null
      }
      if (entry.type === 'essence') {
        const amount = parseDecimalString(entry.amount)
        return amount ? { type: 'essence', amount } : null
      }
      if (entry.type === 'productionBoost') {
        const multiplier = parseDecimalString(entry.multiplier)
        const durationSeconds = parseNonNegativeInt(entry.durationSeconds)
        if (!multiplier || durationSeconds === null) {
          return null
        }
        return { type: 'productionBoost', multiplier, durationSeconds }
      }
      if (entry.type === 'costDiscountCharges') {
        const multiplier = parseDecimalString(entry.multiplier)
        const charges = parseNonNegativeInt(entry.charges)
        if (!multiplier || charges === null) {
          return null
        }
        return { type: 'costDiscountCharges', multiplier, charges }
      }
      if (entry.type === 'nextRewardMultiplier') {
        const multiplier = parseDecimalString(entry.multiplier)
        return multiplier ? { type: 'nextRewardMultiplier', multiplier } : null
      }
      return null
    })
    .filter((reward): reward is ContractState['rewards'][number] => reward !== null)

  const rewards =
    parsedRewards.length > 0
      ? parsedRewards
      : (() => {
          const legacyCredits = parseDecimalString(candidate.rewardCredits) ?? '0'
          return [{ type: 'credits' as const, amount: legacyCredits }]
        })()

  const modifierRaw = candidate.modifier as Record<string, unknown> | null | undefined
  const modifier: ContractState['modifier'] = (() => {
    if (!modifierRaw || typeof modifierRaw !== 'object' || typeof modifierRaw.type !== 'string') {
      return null
    }

    if (modifierRaw.type === 'blockGenerator' || modifierRaw.type === 'onlyGenerator') {
      if (
        typeof modifierRaw.generator === 'string' &&
        GENERATOR_ORDER.includes(modifierRaw.generator as GeneratorKey)
      ) {
        return {
          type: modifierRaw.type,
          generator: modifierRaw.generator as GeneratorKey,
        }
      }
      return null
    }

    if (modifierRaw.type === 'upgradesDisabled' || modifierRaw.type === 'noPrestige') {
      return { type: modifierRaw.type }
    }

    if (modifierRaw.type === 'minTier') {
      const minimumTierIndex = parseNonNegativeInt(modifierRaw.minimumTierIndex)
      if (minimumTierIndex === null) {
        return null
      }
      return { type: 'minTier', minimumTierIndex }
    }

    if (modifierRaw.type === 'buyAmountLocked') {
      const amount = parseNonNegativeInt(modifierRaw.amount)
      if (amount === null || !BUY_AMOUNT_OPTIONS.includes(amount as (typeof BUY_AMOUNT_OPTIONS)[number])) {
        return null
      }
      return { type: 'buyAmountLocked', amount }
    }

    return null
  })()

  if (objective.type === 'runCredits') {
    const target = parseDecimalString(objective.target)
    if (!target) {
      return null
    }
    return {
      id: candidate.id,
      kind,
      band,
      quality,
      progressMode,
      isParticipating,
      progressStartRunCredits,
      progressStartOwnedCount,
      progressStartPurchasedUpgrades,
      objective: { type: 'runCredits', target },
      rewards,
      modifier,
      offerExpiresAtMs,
      challengeDurationMs,
      createdAtMs,
      expiresAtMs,
    }
  }

  if (objective.type === 'owned') {
    if (typeof objective.generator !== 'string' || !GENERATOR_ORDER.includes(objective.generator as GeneratorKey)) {
      return null
    }
    const target = parseNonNegativeInt(objective.target)
    if (target === null) {
      return null
    }
    return {
      id: candidate.id,
      kind,
      band,
      quality,
      progressMode,
      isParticipating,
      progressStartRunCredits,
      progressStartOwnedCount,
      progressStartPurchasedUpgrades,
      objective: {
        type: 'owned',
        generator: objective.generator as GeneratorKey,
        target,
      },
      rewards,
      modifier,
      offerExpiresAtMs,
      challengeDurationMs,
      createdAtMs,
      expiresAtMs,
    }
  }

  if (objective.type === 'creditsPerSecond') {
    const target = parseDecimalString(objective.target)
    if (!target) {
      return null
    }
    return {
      id: candidate.id,
      kind,
      band,
      quality,
      progressMode,
      isParticipating,
      progressStartRunCredits,
      progressStartOwnedCount,
      progressStartPurchasedUpgrades,
      objective: { type: 'creditsPerSecond', target },
      rewards,
      modifier,
      offerExpiresAtMs,
      challengeDurationMs,
      createdAtMs,
      expiresAtMs,
    }
  }

  if (objective.type === 'purchasedUpgrades') {
    const target = parseNonNegativeInt(objective.target)
    if (target === null) {
      return null
    }
    return {
      id: candidate.id,
      kind,
      band,
      quality,
      progressMode,
      isParticipating,
      progressStartRunCredits,
      progressStartOwnedCount,
      progressStartPurchasedUpgrades,
      objective: { type: 'purchasedUpgrades', target },
      rewards,
      modifier,
      offerExpiresAtMs,
      challengeDurationMs,
      createdAtMs,
      expiresAtMs,
    }
  }

  return null
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
  const prestige = parsePrestige(candidate.prestige)

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
  const contracts = candidate.contracts as Record<string, unknown> | undefined
  const worldSeed = parseWorldSeed(random?.worldSeed, startedAtMs)
  const generationCounter = parseNonNegativeInt(contracts?.generationCounter) ?? 0
  const activeContractsRaw = Array.isArray(contracts?.active) ? contracts.active : []
  const parsedContracts = activeContractsRaw
    .map((entry) => parseContractState(entry))
    .filter((entry): entry is ContractState => entry !== null)
  const effects = contracts?.effects as Record<string, unknown> | undefined
  const productionBoostMultiplier = parseDecimalString(effects?.productionBoostMultiplier) ?? '1'
  const productionBoostRemainingSeconds =
    parseNonNegativeInt(effects?.productionBoostRemainingSeconds) ?? 0
  const costDiscountMultiplier = parseDecimalString(effects?.costDiscountMultiplier) ?? '1'
  const costDiscountRemainingPurchases =
    parseNonNegativeInt(effects?.costDiscountRemainingPurchases) ?? 0
  const nextRewardMultiplier = parseDecimalString(effects?.nextRewardMultiplier) ?? '1'

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
    prestige,
    random: {
      worldSeed,
    },
    contracts: {
      active: parsedContracts.slice(0, 1),
      generationCounter,
      effects: {
        productionBoostMultiplier,
        productionBoostRemainingSeconds,
        costDiscountMultiplier,
        costDiscountRemainingPurchases,
        nextRewardMultiplier,
      },
    },
  }

  return ensureContractsState(parsedState, nowMs)
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
  initial.stats.totalCreditsAllResets = recoveredCredits

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

function parseStateFromEnvelope(envelope: SaveSlotPayload | null): GameState | null {
  if (!envelope) {
    return null
  }

  const saveEnvelope = envelope as Partial<SaveEnvelopeV1>
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
