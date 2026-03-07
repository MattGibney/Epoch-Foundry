import Decimal from 'decimal.js'
import {
  ACHIEVEMENT_CONFIG,
  GENERATOR_CONFIG,
  PRESTIGE_BALANCE,
  UPGRADE_CONFIG,
  UPGRADE_COST_MULTIPLIER_BY_TYPE,
  validateProgressionConfig,
  type AchievementConfigEntry,
  type UpgradeConfigEntry,
} from '@/lib/progression-config'

export type GeneratorKey =
  | 'miners'
  | 'drills'
  | 'extractors'
  | 'refineries'
  | 'megaRigs'
  | 'orbitalPlatforms'
  | 'stellarForges'
  | 'dysonArrays'
  | 'singularityWells'
  | 'continuumEngines'
export type RunUpgradeKey =
  | 'minerTuning'
  | 'minerSwarm'
  | 'minerFoundries'
  | 'drillGrease'
  | 'drillAI'
  | 'drillHypercut'
  | 'extractorCooling'
  | 'extractorClusters'
  | 'extractorMatrices'
  | 'refineryCatalysts'
  | 'refineryOverdrive'
  | 'refinerySingularities'
  | 'megaRigServos'
  | 'megaRigNanites'
  | 'megaRigSentience'
  | 'orbitalDrones'
  | 'orbitalCommand'
  | 'orbitalAnchors'
  | 'stellarFlux'
  | 'stellarLattices'
  | 'stellarAscension'
  | 'dysonPhasing'
  | 'dysonHarmonics'
  | 'dysonDominion'
  | 'singularityContainment'
  | 'singularityLensing'
  | 'singularityTranscendence'
  | 'continuumStabilizers'
  | 'continuumRecursion'
  | 'continuumParadoxCore'
  | 'automationLoops'
  | 'quantumForecasts'
  | 'fractalEconomies'
  | 'causalOverclock'
  | 'archiveBatteries'
  | 'temporalVaults'
  | 'deepArchive'
  | 'chronoReserves'

export const ACHIEVEMENT_ORDER = [
  'allCredits5m',
  'allCredits25m',
  'allCredits100m',
  'allCredits500m',
  'allCredits2b',
  'allCredits10b',
  'allCredits50b',
  'allCredits250b',
  'allCredits1t',
  'allCredits10t',
  'allCredits100t',
  'allCredits1qa',
  'runCredits1m',
  'runCredits5m',
  'runCredits25m',
  'runCredits100m',
  'runCredits500m',
  'runCredits2b',
  'runCredits10b',
  'runCredits50b',
  'miners100',
  'miners1000',
  'drills75',
  'drills750',
  'extractors50',
  'extractors500',
  'refineries40',
  'refineries400',
  'megaRigs30',
  'megaRigs300',
  'orbitalPlatforms20',
  'orbitalPlatforms200',
  'stellarForges15',
  'stellarForges150',
  'dysonArrays10',
  'dysonArrays100',
  'singularityWells8',
  'singularityWells80',
  'continuumEngines5',
  'continuumEngines50',
  'firstPrestige',
  'prestige10',
  'prestige50',
  'essence50',
  'essence500',
  'essence5000',
  'upgrades20',
  'upgrades35',
  'offlineCap4h',
  'offlineCap24h',
] as const

export type AchievementKey = (typeof ACHIEVEMENT_ORDER)[number]

export const BUY_AMOUNT_OPTIONS = [1, 10, 100] as const

export interface GeneratorsState {
  miners: number
  drills: number
  extractors: number
  refineries: number
  megaRigs: number
  orbitalPlatforms: number
  stellarForges: number
  dysonArrays: number
  singularityWells: number
  continuumEngines: number
}

export type PurchasedUpgradesState = Record<RunUpgradeKey, boolean>
export type AchievementsState = Record<AchievementKey, boolean>

export interface StatsState {
  startedAtMs: number
  lastTickAtMs: number
  totalCredits: string
  totalCreditsAllResets: string
}

export interface GameSettingsState {
  showPurchasedUpgrades: boolean
  updateFrequency: 'slow' | 'medium' | 'fast'
}

export interface PrestigeState {
  resets: number
  essence: string
}

export interface GameState {
  credits: string
  generators: GeneratorsState
  purchasedUpgrades: PurchasedUpgradesState
  achievements: AchievementsState
  buyAmount: number
  stats: StatsState
  settings: GameSettingsState
  prestige: PrestigeState
}

interface GeneratorDef {
  key: GeneratorKey
  label: string
  description: string
  baseCost: string
  growth: string
  baseProduction: string
}

interface UpgradeBaseDef {
  key: RunUpgradeKey
  label: string
  description: string
  cost: string
  requiresOwned?: {
    generator: GeneratorKey
    count: number
  }
  requiresUpgrade?: RunUpgradeKey
}

interface AchievementDef {
  key: AchievementKey
  label: string
  description: string
  isUnlocked: (state: GameState) => boolean
}

type GlobalUpgradeDef = UpgradeBaseDef & {
  effectType: 'global'
  multiplier: string
}

type GeneratorUpgradeDef = UpgradeBaseDef & {
  effectType: 'generator'
  target: GeneratorKey
  multiplier: string
}

type OfflineCapUpgradeDef = UpgradeBaseDef & {
  effectType: 'offlineCap'
  offlineCapSeconds: number
}

type UpgradeDef = GlobalUpgradeDef | GeneratorUpgradeDef | OfflineCapUpgradeDef

const ONE = new Decimal(1)
const ZERO = new Decimal(0)
const MAX_TICK_SECONDS = 5
const BASE_OFFLINE_PROGRESS_CAP_SECONDS = 30 * 60
const PRESTIGE_UNLOCK_CREDITS = new Decimal(PRESTIGE_BALANCE.unlockCredits)
const PRESTIGE_GAIN_EXPONENT = new Decimal(PRESTIGE_BALANCE.gainExponent)
const PRESTIGE_ESSENCE_MULTIPLIER_STEP = new Decimal(PRESTIGE_BALANCE.essenceMultiplierStep)

export const GENERATOR_ORDER: GeneratorKey[] = [
  'miners',
  'drills',
  'extractors',
  'refineries',
  'megaRigs',
  'orbitalPlatforms',
  'stellarForges',
  'dysonArrays',
  'singularityWells',
  'continuumEngines',
]

export const UPGRADE_ORDER: RunUpgradeKey[] = [
  'minerTuning',
  'minerSwarm',
  'minerFoundries',
  'drillGrease',
  'drillAI',
  'drillHypercut',
  'extractorCooling',
  'extractorClusters',
  'extractorMatrices',
  'refineryCatalysts',
  'refineryOverdrive',
  'refinerySingularities',
  'megaRigServos',
  'megaRigNanites',
  'megaRigSentience',
  'orbitalDrones',
  'orbitalCommand',
  'orbitalAnchors',
  'stellarFlux',
  'stellarLattices',
  'stellarAscension',
  'dysonPhasing',
  'dysonHarmonics',
  'dysonDominion',
  'singularityContainment',
  'singularityLensing',
  'singularityTranscendence',
  'continuumStabilizers',
  'continuumRecursion',
  'continuumParadoxCore',
  'automationLoops',
  'quantumForecasts',
  'fractalEconomies',
  'causalOverclock',
  'archiveBatteries',
  'temporalVaults',
  'deepArchive',
  'chronoReserves',
]

validateProgressionConfig({
  generatorOrder: GENERATOR_ORDER,
  upgradeOrder: UPGRADE_ORDER,
  achievementOrder: ACHIEVEMENT_ORDER,
})

function getRequiredGenerator(entry: UpgradeConfigEntry): GeneratorKey | undefined {
  if (!entry.requiresOwned) {
    return undefined
  }
  return entry.requiresOwned.generator as GeneratorKey
}

function getUpgradeCost(entry: UpgradeConfigEntry): string {
  const multiplier = UPGRADE_COST_MULTIPLIER_BY_TYPE[entry.effectType]
  return new Decimal(entry.cost).times(multiplier).ceil().toString()
}

export const GENERATOR_DEFS: Record<GeneratorKey, GeneratorDef> = GENERATOR_ORDER.reduce(
  (accumulator, key) => {
    const entry = GENERATOR_CONFIG[key]
    accumulator[key] = {
      key,
      label: entry.label,
      description: entry.description,
      baseCost: entry.baseCost,
      growth: entry.growth,
      baseProduction: entry.baseProduction,
    }
    return accumulator
  },
  {} as Record<GeneratorKey, GeneratorDef>,
)

export const UPGRADE_DEFS: Record<RunUpgradeKey, UpgradeDef> = UPGRADE_ORDER.reduce(
  (accumulator, key) => {
    const entry = UPGRADE_CONFIG[key]
    const requiresOwned = entry.requiresOwned
      ? {
          generator: getRequiredGenerator(entry)!,
          count: entry.requiresOwned.count,
        }
      : undefined

    if (entry.effectType === 'generator') {
      accumulator[key] = {
        key,
        label: entry.label,
        description: entry.description,
        cost: getUpgradeCost(entry),
        effectType: 'generator',
        target: entry.target as GeneratorKey,
        multiplier: entry.multiplier!,
        requiresOwned,
        requiresUpgrade: entry.requiresUpgrade as RunUpgradeKey | undefined,
      }
      return accumulator
    }

    if (entry.effectType === 'global') {
      accumulator[key] = {
        key,
        label: entry.label,
        description: entry.description,
        cost: getUpgradeCost(entry),
        effectType: 'global',
        multiplier: entry.multiplier!,
        requiresOwned,
        requiresUpgrade: entry.requiresUpgrade as RunUpgradeKey | undefined,
      }
      return accumulator
    }

    accumulator[key] = {
      key,
      label: entry.label,
      description: entry.description,
      cost: getUpgradeCost(entry),
      effectType: 'offlineCap',
      offlineCapSeconds: entry.offlineCapSeconds!,
      requiresOwned,
      requiresUpgrade: entry.requiresUpgrade as RunUpgradeKey | undefined,
    }
    return accumulator
  },
  {} as Record<RunUpgradeKey, UpgradeDef>,
)

function isAchievementUnlockedFromRequirement(
  state: GameState,
  requirement: AchievementConfigEntry['requirement'],
): boolean {
  switch (requirement.type) {
    case 'allResetCredits':
      return toDecimal(state.stats.totalCreditsAllResets).greaterThanOrEqualTo(requirement.threshold)
    case 'runCredits':
      return toDecimal(state.stats.totalCredits).greaterThanOrEqualTo(requirement.threshold)
    case 'owned':
      return state.generators[requirement.generator as GeneratorKey] >= requirement.count
    case 'prestigeResets':
      return state.prestige.resets >= requirement.count
    case 'essence':
      return toDecimal(state.prestige.essence).greaterThanOrEqualTo(requirement.threshold)
    case 'purchasedUpgrades':
      return getPurchasedUpgradeCount(state) >= requirement.count
    case 'offlineCapSeconds':
      return getOfflineProgressCapSeconds(state) >= requirement.seconds
    default:
      return false
  }
}

export const ACHIEVEMENT_DEFS: Record<AchievementKey, AchievementDef> = ACHIEVEMENT_ORDER.reduce(
  (accumulator, key) => {
    const entry = ACHIEVEMENT_CONFIG[key]
    accumulator[key] = {
      key,
      label: entry.label,
      description: entry.description,
      isUnlocked: (state) => isAchievementUnlockedFromRequirement(state, entry.requirement),
    }
    return accumulator
  },
  {} as Record<AchievementKey, AchievementDef>,
)

function getPurchasedUpgradeCount(state: GameState): number {
  return UPGRADE_ORDER.reduce(
    (count, key) => count + (state.purchasedUpgrades[key] ? 1 : 0),
    0,
  )
}

function toDecimal(value: Decimal.Value): Decimal {
  return new Decimal(value)
}

function calculateBulkCost(
  baseCost: Decimal,
  growth: Decimal,
  owned: number,
  amount: number,
): Decimal {
  if (amount <= 0) {
    return ZERO
  }

  if (growth.equals(ONE)) {
    return baseCost.times(amount)
  }

  const ownedScale = growth.pow(owned)
  const geometricSeries = growth.pow(amount).minus(ONE).div(growth.minus(ONE))
  return baseCost.times(ownedScale).times(geometricSeries)
}

function createInitialPurchasedUpgrades(): PurchasedUpgradesState {
  return UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = false
    return accumulator
  }, {} as PurchasedUpgradesState)
}

function createInitialAchievementsState(): AchievementsState {
  return ACHIEVEMENT_ORDER.reduce((accumulator, key) => {
    accumulator[key] = false
    return accumulator
  }, {} as AchievementsState)
}

export function syncAchievements(state: GameState): GameState {
  let didChange = false
  const nextAchievements = { ...state.achievements }

  for (const key of ACHIEVEMENT_ORDER) {
    if (nextAchievements[key]) {
      continue
    }

    if (!ACHIEVEMENT_DEFS[key].isUnlocked(state)) {
      continue
    }

    nextAchievements[key] = true
    didChange = true
  }

  if (!didChange) {
    return state
  }

  return {
    ...state,
    achievements: nextAchievements,
  }
}

export function getUnlockedAchievementCount(state: GameState): number {
  return ACHIEVEMENT_ORDER.reduce(
    (count, key) => count + (state.achievements[key] ? 1 : 0),
    0,
  )
}

function createInitialPrestigeState(): PrestigeState {
  return {
    resets: 0,
    essence: '0',
  }
}

export function createInitialGameState(nowMs = Date.now()): GameState {
  return {
    credits: '0',
    generators: {
      miners: 1,
      drills: 0,
      extractors: 0,
      refineries: 0,
      megaRigs: 0,
      orbitalPlatforms: 0,
      stellarForges: 0,
      dysonArrays: 0,
      singularityWells: 0,
      continuumEngines: 0,
    },
    purchasedUpgrades: createInitialPurchasedUpgrades(),
    achievements: createInitialAchievementsState(),
    buyAmount: BUY_AMOUNT_OPTIONS[0],
    stats: {
      startedAtMs: nowMs,
      lastTickAtMs: nowMs,
      totalCredits: '0',
      totalCreditsAllResets: '0',
    },
    settings: {
      showPurchasedUpgrades: false,
      updateFrequency: 'slow',
    },
    prestige: createInitialPrestigeState(),
  }
}

export function getPrestigeGainForReset(state: GameState): Decimal {
  const runTotalCredits = toDecimal(state.stats.totalCredits)
  if (runTotalCredits.lessThan(PRESTIGE_UNLOCK_CREDITS)) {
    return ZERO
  }

  return runTotalCredits.div(PRESTIGE_UNLOCK_CREDITS).pow(PRESTIGE_GAIN_EXPONENT).floor()
}

export function canPrestige(state: GameState): boolean {
  return getPrestigeGainForReset(state).greaterThan(0)
}

export function getPrestigeMultiplier(state: GameState): Decimal {
  return ONE.plus(toDecimal(state.prestige.essence).times(PRESTIGE_ESSENCE_MULTIPLIER_STEP))
}

export function applyPrestigeReset(state: GameState, nowMs = Date.now()): GameState {
  const gainedEssence = getPrestigeGainForReset(state)
  if (gainedEssence.lessThanOrEqualTo(0)) {
    return state
  }

  const initialState = createInitialGameState(nowMs)

  return syncAchievements({
    ...initialState,
    settings: state.settings,
    stats: {
      ...initialState.stats,
      totalCreditsAllResets: state.stats.totalCreditsAllResets,
    },
    prestige: {
      resets: state.prestige.resets + 1,
      essence: toDecimal(state.prestige.essence).plus(gainedEssence).toString(),
    },
    achievements: state.achievements,
  })
}

export function setBuyAmount(state: GameState, amount: number): GameState {
  if (!BUY_AMOUNT_OPTIONS.includes(amount as (typeof BUY_AMOUNT_OPTIONS)[number])) {
    return state
  }

  return {
    ...state,
    buyAmount: amount,
  }
}

export function setShowPurchasedUpgrades(
  state: GameState,
  showPurchasedUpgrades: boolean,
): GameState {
  return {
    ...state,
    settings: {
      ...state.settings,
      showPurchasedUpgrades,
    },
  }
}

export function setUpdateFrequency(
  state: GameState,
  updateFrequency: GameSettingsState['updateFrequency'],
): GameState {
  return {
    ...state,
    settings: {
      ...state.settings,
      updateFrequency,
    },
  }
}

export function getGeneratorCost(
  state: GameState,
  key: GeneratorKey,
  amount = state.buyAmount,
): Decimal {
  const definition = GENERATOR_DEFS[key]
  return calculateBulkCost(
    toDecimal(definition.baseCost),
    toDecimal(definition.growth),
    state.generators[key],
    amount,
  )
}

function applyProducedCredits(
  state: GameState,
  produced: Decimal,
  nextLastTickAtMs: number,
): GameState {
  return syncAchievements({
    ...state,
    credits: toDecimal(state.credits).plus(produced).toString(),
    stats: {
      ...state.stats,
      lastTickAtMs: nextLastTickAtMs,
      totalCredits: toDecimal(state.stats.totalCredits).plus(produced).toString(),
      totalCreditsAllResets: toDecimal(state.stats.totalCreditsAllResets)
        .plus(produced)
        .toString(),
    },
  })
}

export function getGlobalProductionMultiplier(state: GameState): Decimal {
  let multiplier = ONE

  for (const key of UPGRADE_ORDER) {
    const upgrade = UPGRADE_DEFS[key]
    if (!upgrade || !state.purchasedUpgrades[key]) {
      continue
    }

    if (upgrade.effectType === 'global') {
      multiplier = multiplier.times(upgrade.multiplier)
    }
  }

  return multiplier
}

function getGeneratorProductionMultiplier(
  state: GameState,
  generatorKey: GeneratorKey,
): Decimal {
  let multiplier = ONE

  for (const key of UPGRADE_ORDER) {
    const upgrade = UPGRADE_DEFS[key]
    if (!upgrade || !state.purchasedUpgrades[key]) {
      continue
    }

    if (upgrade.effectType === 'generator' && upgrade.target === generatorKey) {
      multiplier = multiplier.times(upgrade.multiplier)
    }
  }

  return multiplier
}

export function getGeneratorProductionPerSecond(
  state: GameState,
  generatorKey: GeneratorKey,
): Decimal {
  const definition = GENERATOR_DEFS[generatorKey]
  const owned = state.generators[generatorKey]

  if (owned <= 0) {
    return ZERO
  }

  return toDecimal(definition.baseProduction)
    .times(owned)
    .times(getGeneratorProductionMultiplier(state, generatorKey))
    .times(getGlobalProductionMultiplier(state))
    .times(getPrestigeMultiplier(state))
}

export function getTotalProductionPerSecond(state: GameState): Decimal {
  return GENERATOR_ORDER.reduce(
    (total, key) => total.plus(getGeneratorProductionPerSecond(state, key)),
    ZERO,
  )
}

export function getOfflineProgressCapSeconds(state: GameState): number {
  let capSeconds = BASE_OFFLINE_PROGRESS_CAP_SECONDS

  for (const key of UPGRADE_ORDER) {
    const upgrade = UPGRADE_DEFS[key]
    if (!upgrade || !state.purchasedUpgrades[key]) {
      continue
    }

    if (upgrade.effectType === 'offlineCap') {
      capSeconds += upgrade.offlineCapSeconds
    }
  }

  return capSeconds
}

export function applyOfflineProgress(state: GameState, nowMs = Date.now()): GameState {
  const effectiveNowMs = Math.max(nowMs, state.stats.lastTickAtMs)
  const elapsedSeconds = Math.max(0, (effectiveNowMs - state.stats.lastTickAtMs) / 1_000)
  const cappedSeconds = Math.min(elapsedSeconds, getOfflineProgressCapSeconds(state))

  if (cappedSeconds <= 0) {
    if (effectiveNowMs === state.stats.lastTickAtMs) {
      return state
    }

    return {
      ...state,
      stats: {
        ...state.stats,
        lastTickAtMs: effectiveNowMs,
      },
    }
  }

  const produced = getTotalProductionPerSecond(state).times(cappedSeconds)
  return applyProducedCredits(state, produced, effectiveNowMs)
}

export function tickGame(state: GameState, nowMs: number): GameState {
  const elapsedSeconds = Math.min(
    MAX_TICK_SECONDS,
    Math.max(0, (nowMs - state.stats.lastTickAtMs) / 1_000),
  )

  if (elapsedSeconds <= 0) {
    return state
  }

  const produced = getTotalProductionPerSecond(state).times(elapsedSeconds)
  return applyProducedCredits(state, produced, nowMs)
}

export function buyGenerator(state: GameState, key: GeneratorKey): GameState {
  const cost = getGeneratorCost(state, key, state.buyAmount)
  const credits = toDecimal(state.credits)

  if (credits.lessThan(cost)) {
    return state
  }

  return syncAchievements({
    ...state,
    credits: credits.minus(cost).toString(),
    generators: {
      ...state.generators,
      [key]: state.generators[key] + state.buyAmount,
    },
  })
}

export function isUpgradeUnlocked(state: GameState, key: RunUpgradeKey): boolean {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade) {
    return true
  }

  const meetsGeneratorRequirement =
    !upgrade.requiresOwned ||
    state.generators[upgrade.requiresOwned.generator] >= upgrade.requiresOwned.count
  const meetsUpgradeRequirement =
    !upgrade.requiresUpgrade || state.purchasedUpgrades[upgrade.requiresUpgrade]

  return meetsGeneratorRequirement && meetsUpgradeRequirement
}

export function getUpgradeUnlockProgress(state: GameState, key: RunUpgradeKey) {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade) {
    return null
  }

  if (upgrade.requiresOwned) {
    const currentOwned = state.generators[upgrade.requiresOwned.generator]
    if (currentOwned < upgrade.requiresOwned.count) {
      return {
        current: currentOwned,
        required: upgrade.requiresOwned.count,
        label: GENERATOR_DEFS[upgrade.requiresOwned.generator].label,
      }
    }
  }

  if (upgrade.requiresUpgrade) {
    const isPurchased = state.purchasedUpgrades[upgrade.requiresUpgrade]
    if (!isPurchased) {
      return {
        current: 0,
        required: 1,
        label: UPGRADE_DEFS[upgrade.requiresUpgrade].label,
      }
    }
  }

  return null
}

export function canBuyUpgrade(state: GameState, key: RunUpgradeKey): boolean {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade || state.purchasedUpgrades[key] || !isUpgradeUnlocked(state, key)) {
    return false
  }

  return toDecimal(state.credits).greaterThanOrEqualTo(upgrade.cost)
}

export function buyUpgrade(state: GameState, key: RunUpgradeKey): GameState {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade || !canBuyUpgrade(state, key)) {
    return state
  }

  return syncAchievements({
    ...state,
    credits: toDecimal(state.credits).minus(upgrade.cost).toString(),
    purchasedUpgrades: {
      ...state.purchasedUpgrades,
      [key]: true,
    },
  })
}
