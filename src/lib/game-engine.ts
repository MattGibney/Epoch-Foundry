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
  'allCredits10m',
  'allCredits25m',
  'allCredits50m',
  'allCredits100m',
  'allCredits250m',
  'allCredits500m',
  'allCredits1b',
  'allCredits2b',
  'allCredits5b',
  'allCredits10b',
  'allCredits25b',
  'allCredits50b',
  'allCredits100b',
  'allCredits250b',
  'allCredits500b',
  'allCredits1t',
  'allCredits2p5t',
  'allCredits10t',
  'allCredits25t',
  'allCredits100t',
  'allCredits250t',
  'allCredits1qa',
  'runCredits1m',
  'runCredits2p5m',
  'runCredits5m',
  'runCredits10m',
  'runCredits25m',
  'runCredits50m',
  'runCredits100m',
  'runCredits250m',
  'runCredits500m',
  'runCredits1b',
  'runCredits2b',
  'runCredits5b',
  'runCredits10b',
  'runCredits25b',
  'runCredits50b',
  'miners100',
  'miners300',
  'miners600',
  'miners1000',
  'miners2000',
  'drills75',
  'drills200',
  'drills400',
  'drills750',
  'drills1500',
  'extractors50',
  'extractors120',
  'extractors250',
  'extractors500',
  'extractors1000',
  'refineries40',
  'refineries90',
  'refineries200',
  'refineries400',
  'refineries800',
  'megaRigs30',
  'megaRigs75',
  'megaRigs150',
  'megaRigs300',
  'megaRigs600',
  'orbitalPlatforms20',
  'orbitalPlatforms50',
  'orbitalPlatforms100',
  'orbitalPlatforms200',
  'orbitalPlatforms400',
  'stellarForges15',
  'stellarForges35',
  'stellarForges75',
  'stellarForges150',
  'stellarForges300',
  'dysonArrays10',
  'dysonArrays25',
  'dysonArrays50',
  'dysonArrays100',
  'dysonArrays200',
  'singularityWells8',
  'singularityWells20',
  'singularityWells40',
  'singularityWells80',
  'singularityWells160',
  'continuumEngines5',
  'continuumEngines12',
  'continuumEngines25',
  'continuumEngines50',
  'continuumEngines100',
  'firstPrestige',
  'prestige3',
  'prestige10',
  'prestige25',
  'prestige50',
  'prestige100',
  'essence50',
  'essence200',
  'essence500',
  'essence2000',
  'essence5000',
  'essence20000',
  'upgrades10',
  'upgrades20',
  'upgrades28',
  'upgrades35',
  'upgrades38',
  'offlineCap1h',
  'offlineCap12h',
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

export interface RandomState {
  worldSeed: string
}

export type ContractBand = 'short' | 'medium' | 'long'
export type ContractQuality = 'common' | 'rare' | 'elite'

export type ContractObjective =
  | { type: 'runCredits'; target: string }
  | { type: 'owned'; generator: GeneratorKey; target: number }
  | { type: 'purchasedUpgrades'; target: number }
  | { type: 'creditsPerSecond'; target: string }

export type ContractModifier =
  | { type: 'blockGenerator'; generator: GeneratorKey }
  | { type: 'onlyGenerator'; generator: GeneratorKey }
  | { type: 'upgradesDisabled' }
  | { type: 'minTier'; minimumTierIndex: number }
  | { type: 'buyAmountLocked'; amount: number }
  | { type: 'noPrestige' }

export type ContractReward =
  | { type: 'credits'; amount: string }
  | { type: 'essence'; amount: string }
  | { type: 'productionBoost'; multiplier: string; durationSeconds: number }
  | { type: 'costDiscountCharges'; multiplier: string; charges: number }
  | { type: 'nextRewardMultiplier'; multiplier: string }

export interface ContractState {
  id: string
  kind: 'objective' | 'challenge'
  band: ContractBand
  quality: ContractQuality
  isParticipating: boolean
  objective: ContractObjective
  rewards: ContractReward[]
  modifier: ContractModifier | null
  offerExpiresAtMs: number
  challengeDurationMs: number | null
  createdAtMs: number
  expiresAtMs: number | null
}

export interface ContractEffectsState {
  productionBoostMultiplier: string
  productionBoostRemainingSeconds: number
  costDiscountMultiplier: string
  costDiscountRemainingPurchases: number
  nextRewardMultiplier: string
}

export interface ContractsState {
  active: ContractState[]
  generationCounter: number
  effects: ContractEffectsState
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
  random: RandomState
  contracts: ContractsState
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
  category: string
  label: string
  description: string
  requirement: AchievementConfigEntry['requirement']
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
const BASE_OFFLINE_PROGRESS_CAP_SECONDS = 15 * 60
const CONTRACT_SLOT_COUNT = 3
const CONTRACT_CHALLENGE_DURATION_MULTIPLIER = 1.75
const CONTRACT_QUALITY_WEIGHTS: Array<{ quality: ContractQuality; weight: number }> = [
  { quality: 'common', weight: 0.62 },
  { quality: 'rare', weight: 0.28 },
  { quality: 'elite', weight: 0.1 },
]
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

function getAchievementCategoryFromRequirement(
  requirement: AchievementConfigEntry['requirement'],
): string {
  switch (requirement.type) {
    case 'allResetCredits':
      return 'Lifetime Credits'
    case 'runCredits':
      return 'Run Credits'
    case 'owned':
      return GENERATOR_DEFS[requirement.generator as GeneratorKey].label
    case 'prestigeResets':
      return 'Prestige'
    case 'essence':
      return 'Essence'
    case 'purchasedUpgrades':
      return 'Upgrades'
    case 'offlineCapSeconds':
      return 'Offline'
    default:
      return 'General'
  }
}

function getAchievementProgressRatioForRequirement(
  state: GameState,
  requirement: AchievementConfigEntry['requirement'],
): Decimal {
  switch (requirement.type) {
    case 'allResetCredits': {
      const threshold = toDecimal(requirement.threshold)
      if (threshold.lessThanOrEqualTo(0)) {
        return ONE
      }
      return toDecimal(state.stats.totalCreditsAllResets).div(threshold)
    }
    case 'runCredits': {
      const threshold = toDecimal(requirement.threshold)
      if (threshold.lessThanOrEqualTo(0)) {
        return ONE
      }
      return toDecimal(state.stats.totalCredits).div(threshold)
    }
    case 'owned':
      return new Decimal(state.generators[requirement.generator as GeneratorKey]).div(
        requirement.count,
      )
    case 'prestigeResets':
      return new Decimal(state.prestige.resets).div(requirement.count)
    case 'essence': {
      const threshold = toDecimal(requirement.threshold)
      if (threshold.lessThanOrEqualTo(0)) {
        return ONE
      }
      return toDecimal(state.prestige.essence).div(threshold)
    }
    case 'purchasedUpgrades':
      return new Decimal(getPurchasedUpgradeCount(state)).div(requirement.count)
    case 'offlineCapSeconds':
      return new Decimal(getOfflineProgressCapSeconds(state)).div(requirement.seconds)
    default:
      return ZERO
  }
}

export const ACHIEVEMENT_DEFS: Record<AchievementKey, AchievementDef> = ACHIEVEMENT_ORDER.reduce(
  (accumulator, key) => {
    const entry = ACHIEVEMENT_CONFIG[key]
    accumulator[key] = {
      key,
      category: getAchievementCategoryFromRequirement(entry.requirement),
      label: entry.label,
      description: entry.description,
      requirement: entry.requirement,
      isUnlocked: (state) => isAchievementUnlockedFromRequirement(state, entry.requirement),
    }
    return accumulator
  },
  {} as Record<AchievementKey, AchievementDef>,
)

export function getAchievementProgressRatio(state: GameState, key: AchievementKey): Decimal {
  if (state.achievements[key]) {
    return ONE
  }

  const rawRatio = getAchievementProgressRatioForRequirement(state, ACHIEVEMENT_DEFS[key].requirement)
  if (!rawRatio.isFinite() || rawRatio.lessThan(0)) {
    return ZERO
  }
  if (rawRatio.greaterThan(1)) {
    return ONE
  }
  return rawRatio
}

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

function hashString32(input: string): number {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function randomFromSeed(seed: string, index: number): number {
  const hashed = hashString32(`${seed}:${index}`)
  return hashed / 4294967296
}

function randomIntFromSeed(seed: string, index: number, min: number, max: number): number {
  const clampedMin = Math.ceil(min)
  const clampedMax = Math.floor(max)
  if (clampedMax <= clampedMin) {
    return clampedMin
  }
  const value = randomFromSeed(seed, index)
  return clampedMin + Math.floor(value * (clampedMax - clampedMin + 1))
}

function randomChoiceFromSeed<T>(seed: string, index: number, items: readonly T[]): T {
  const selectedIndex = randomIntFromSeed(seed, index, 0, items.length - 1)
  return items[selectedIndex]
}

function generateWorldSeed(nowMs = Date.now()): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint32Array(2)
    crypto.getRandomValues(bytes)
    return `${nowMs.toString(36)}-${bytes[0].toString(36)}${bytes[1].toString(36)}`
  }

  return `${nowMs.toString(36)}-${Math.floor(Math.random() * 1e12).toString(36)}`
}

function getContractBandRangeSeconds(
  band: ContractBand,
): { min: number; max: number } {
  switch (band) {
    case 'short':
      return { min: 5 * 60, max: 15 * 60 }
    case 'medium':
      return { min: 30 * 60, max: 90 * 60 }
    case 'long':
      return { min: 2 * 60 * 60, max: 8 * 60 * 60 }
    default:
      return { min: 10 * 60, max: 20 * 60 }
  }
}

function getContractBandBySlot(slot: number): ContractBand {
  if (slot === 0) {
    return 'short'
  }
  if (slot === 1) {
    return 'medium'
  }
  return 'long'
}

function getContractOfferDurationMs(band: ContractBand): number {
  if (band === 'short') {
    return 15 * 60 * 1000
  }
  if (band === 'medium') {
    return 20 * 60 * 1000
  }
  return 25 * 60 * 1000
}

function getContractActiveDurationMs(
  band: ContractBand,
  quality: ContractQuality,
  kind: ContractState['kind'],
): number {
  const baseHours =
    quality === 'elite'
      ? band === 'short'
        ? 1.5
        : band === 'medium'
          ? 2.5
          : 4
      : quality === 'rare'
        ? band === 'short'
          ? 3
          : band === 'medium'
            ? 5
            : 8
        : band === 'short'
          ? 6
          : band === 'medium'
            ? 10
            : 16

  const kindMultiplier = kind === 'challenge' ? 0.9 : 1
  return Math.floor(baseHours * kindMultiplier * 60 * 60 * 1000)
}

function getContractQuality(seed: string): ContractQuality {
  const roll = randomFromSeed(seed, 10)
  let cursor = 0

  for (const entry of CONTRACT_QUALITY_WEIGHTS) {
    cursor += entry.weight
    if (roll <= cursor) {
      return entry.quality
    }
  }

  return 'common'
}

function getQualityMultiplier(quality: ContractQuality): Decimal {
  if (quality === 'elite') {
    return new Decimal(2.8)
  }
  if (quality === 'rare') {
    return new Decimal(1.8)
  }
  return ONE
}

function getContractModifier(
  seed: string,
  band: ContractBand,
): ContractModifier {
  const minimumTier = band === 'short' ? 1 : band === 'medium' ? 2 : 4
  const lockAmount =
    randomChoiceFromSeed(seed, 22, BUY_AMOUNT_OPTIONS) as (typeof BUY_AMOUNT_OPTIONS)[number]

  const candidates: ContractModifier[] = [
    {
      type: 'blockGenerator',
      generator: randomChoiceFromSeed(seed, 20, GENERATOR_ORDER),
    },
    {
      type: 'onlyGenerator',
      generator: randomChoiceFromSeed(seed, 21, GENERATOR_ORDER),
    },
    { type: 'upgradesDisabled' },
    { type: 'minTier', minimumTierIndex: minimumTier },
    { type: 'buyAmountLocked', amount: lockAmount },
    { type: 'noPrestige' },
  ]

  return randomChoiceFromSeed(seed, 23, candidates)
}

function isGeneratorAllowedByModifier(
  key: GeneratorKey,
  modifier: ContractModifier | null,
): boolean {
  if (!modifier) {
    return true
  }

  if (modifier.type === 'blockGenerator') {
    return key !== modifier.generator
  }

  if (modifier.type === 'onlyGenerator') {
    return key === modifier.generator
  }

  if (modifier.type === 'minTier') {
    return GENERATOR_ORDER.indexOf(key) >= modifier.minimumTierIndex
  }

  return true
}

function isObjectiveCompatibleWithModifier(
  objective: ContractObjective,
  modifier: ContractModifier | null,
): boolean {
  if (!modifier) {
    return true
  }

  if (modifier.type === 'upgradesDisabled' && objective.type === 'purchasedUpgrades') {
    return false
  }

  if (objective.type === 'owned') {
    return isGeneratorAllowedByModifier(objective.generator, modifier)
  }

  return true
}

function estimateSecondsForObjective(
  state: GameState,
  objective: ContractObjective,
): number {
  const credits = toDecimal(state.credits)
  const creditsPerSecond = getTotalProductionPerSecond(state)
  if (creditsPerSecond.lessThanOrEqualTo(0)) {
    return Number.POSITIVE_INFINITY
  }

  if (objective.type === 'runCredits') {
    const remaining = Decimal.max(
      ZERO,
      toDecimal(objective.target).minus(state.stats.totalCredits),
    )
    return remaining.div(creditsPerSecond).toNumber()
  }

  if (objective.type === 'owned') {
    const owned = state.generators[objective.generator]
    const required = Math.max(0, objective.target - owned)
    if (required <= 0) {
      return 0
    }

    const definition = GENERATOR_DEFS[objective.generator]
    const totalCost = calculateBulkCost(
      toDecimal(definition.baseCost),
      toDecimal(definition.growth),
      owned,
      required,
    )
    const remainingCost = Decimal.max(ZERO, totalCost.minus(credits))
    return remainingCost.div(creditsPerSecond).toNumber()
  }

  if (objective.type === 'creditsPerSecond') {
    const current = getTotalProductionPerSecond(state)
    const target = toDecimal(objective.target)
    if (current.greaterThanOrEqualTo(target)) {
      return 0
    }

    const projectedGrowthPerSecond = Decimal.max(current.times(0.12), ONE)
    const remaining = target.minus(current)
    return remaining.div(projectedGrowthPerSecond).toNumber()
  }

  const currentPurchased = getPurchasedUpgradeCount(state)
  const requiredUpgrades = Math.max(0, objective.target - currentPurchased)
  if (requiredUpgrades <= 0) {
    return 0
  }

  const pendingCosts = UPGRADE_ORDER
    .filter((key) => !state.purchasedUpgrades[key])
    .map((key) => toDecimal(UPGRADE_DEFS[key].cost))
    .sort((a, b) => a.comparedTo(b))

  if (pendingCosts.length < requiredUpgrades) {
    return Number.POSITIVE_INFINITY
  }

  const projectedCost = pendingCosts
    .slice(0, requiredUpgrades)
    .reduce((sum, cost) => sum.plus(cost), ZERO)
  const remainingCost = Decimal.max(ZERO, projectedCost.minus(credits))
  return remainingCost.div(creditsPerSecond).toNumber()
}

function buildContractObjectiveCandidate(
  state: GameState,
  seed: string,
  band: ContractBand,
  targetSeconds: number,
  quality: ContractQuality,
  modifier: ContractModifier | null,
  indexOffset: number,
): ContractObjective | null {
  const qualityScalar = quality === 'elite' ? 1.35 : quality === 'rare' ? 1.15 : 1
  const objectiveType = randomChoiceFromSeed(
    seed,
    indexOffset,
    ['runCredits', 'owned', 'purchasedUpgrades', 'creditsPerSecond'] as const,
  )
  const creditsPerSecond = getTotalProductionPerSecond(state)

  if (objectiveType === 'runCredits') {
    if (creditsPerSecond.lessThanOrEqualTo(0)) {
      return null
    }

    const scale = new Decimal(0.8 + randomFromSeed(seed, indexOffset + 1) * 0.45)
    const delta = Decimal.max(
      creditsPerSecond.times(targetSeconds).times(scale).times(qualityScalar).ceil(),
      new Decimal(1000),
    )
    const objective: ContractObjective = {
      type: 'runCredits',
      target: toDecimal(state.stats.totalCredits).plus(delta).toString(),
    }
    return isObjectiveCompatibleWithModifier(objective, modifier) ? objective : null
  }

  if (objectiveType === 'owned') {
    const allowedGenerators = GENERATOR_ORDER.filter((key) => isGeneratorAllowedByModifier(key, modifier))
    if (allowedGenerators.length === 0) {
      return null
    }

    const generator = randomChoiceFromSeed(seed, indexOffset + 1, allowedGenerators)
    const owned = state.generators[generator]
    const definition = GENERATOR_DEFS[generator]
    const budget = toDecimal(state.credits).plus(creditsPerSecond.times(targetSeconds))
    let affordableUnits = 0

    for (let amount = 1; amount <= 500; amount += 1) {
      const cost = calculateBulkCost(
        toDecimal(definition.baseCost),
        toDecimal(definition.growth),
        owned,
        amount,
      )
      if (cost.greaterThan(budget)) {
        break
      }
      affordableUnits = amount
    }

    if (affordableUnits <= 0) {
      return null
    }

    const capByBand = band === 'short' ? 25 : band === 'medium' ? 75 : 180
    const maxIncrement = Math.max(1, Math.min(affordableUnits, capByBand))
    const minIncrement = Math.max(1, Math.floor(maxIncrement * 0.35))
    const increment = randomIntFromSeed(seed, indexOffset + 2, minIncrement, maxIncrement)

    const objective: ContractObjective = {
      type: 'owned',
      generator,
      target: owned + Math.ceil(increment * qualityScalar),
    }
    return isObjectiveCompatibleWithModifier(objective, modifier) ? objective : null
  }

  if (objectiveType === 'creditsPerSecond') {
    const floorTarget = Decimal.max(creditsPerSecond.times(1.1), new Decimal(10))
    const maxTarget = creditsPerSecond.times(
      band === 'short' ? 2.2 : band === 'medium' ? 3.1 : 4.5,
    )
    const span = Decimal.max(maxTarget.minus(floorTarget), ONE)
    const target = floorTarget.plus(span.times(randomFromSeed(seed, indexOffset + 4))).times(qualityScalar).ceil()
    const objective: ContractObjective = {
      type: 'creditsPerSecond',
      target: target.toString(),
    }
    return isObjectiveCompatibleWithModifier(objective, modifier) ? objective : null
  }

  const currentUpgrades = getPurchasedUpgradeCount(state)
  const remainingUpgrades = UPGRADE_ORDER.filter((key) => !state.purchasedUpgrades[key]).length
  if (remainingUpgrades <= 0) {
    return null
  }

  const maxByBand = band === 'short' ? 2 : band === 'medium' ? 4 : 6
  const maxIncrement = Math.max(1, Math.min(remainingUpgrades, maxByBand))
  const increment = randomIntFromSeed(seed, indexOffset + 3, 1, maxIncrement)
  const objective: ContractObjective = {
    type: 'purchasedUpgrades',
    target: currentUpgrades + Math.ceil(increment * qualityScalar),
  }
  return isObjectiveCompatibleWithModifier(objective, modifier) ? objective : null
}

function buildContractRewards(
  state: GameState,
  seed: string,
  band: ContractBand,
  quality: ContractQuality,
  kind: 'objective' | 'challenge',
  targetSeconds: number,
): ContractReward[] {
  const qualityMultiplier = getQualityMultiplier(quality)
  const challengeMultiplier = kind === 'challenge' ? new Decimal(1.45) : ONE
  const rewardSeconds =
    targetSeconds * (band === 'short' ? 0.45 : band === 'medium' ? 0.65 : 0.85)
  const creditsReward = getTotalProductionPerSecond(state)
    .times(rewardSeconds)
    .plus(band === 'short' ? 2500 : band === 'medium' ? 12000 : 50000)
    .times(qualityMultiplier)
    .times(challengeMultiplier)
    .ceil()

  const rewards: ContractReward[] = [{ type: 'credits', amount: creditsReward.toString() }]
  const bonusKinds: ContractReward[] = [
    {
      type: 'productionBoost',
      multiplier: quality === 'elite' ? '1.65' : quality === 'rare' ? '1.4' : '1.25',
      durationSeconds: band === 'short' ? 5 * 60 : band === 'medium' ? 10 * 60 : 20 * 60,
    },
    {
      type: 'costDiscountCharges',
      multiplier: quality === 'elite' ? '0.75' : quality === 'rare' ? '0.82' : '0.88',
      charges: band === 'short' ? 5 : band === 'medium' ? 9 : 14,
    },
    {
      type: 'nextRewardMultiplier',
      multiplier: quality === 'elite' ? '2' : quality === 'rare' ? '1.7' : '1.45',
    },
    {
      type: 'essence',
      amount: quality === 'elite' ? '4' : quality === 'rare' ? '2' : '1',
    },
  ]

  const chosenBonusTypes = new Set<ContractReward['type']>()

  const pickUniqueBonusReward = (index: number): ContractReward | null => {
    const available = bonusKinds.filter((reward) => !chosenBonusTypes.has(reward.type))
    if (available.length === 0) {
      return null
    }
    const selected = randomChoiceFromSeed(seed, index, available)
    chosenBonusTypes.add(selected.type)
    return selected
  }

  if (kind === 'challenge' || quality !== 'common' || randomFromSeed(seed, 40) > 0.55) {
    const selected = pickUniqueBonusReward(41)
    if (selected) {
      rewards.push(selected)
    }
  }

  if (quality === 'elite' && randomFromSeed(seed, 42) > 0.35) {
    const selected = pickUniqueBonusReward(43)
    if (selected) {
      rewards.push(selected)
    }
  }

  return rewards
}

function generateContractForSlot(
  state: GameState,
  generationIndex: number,
  slot: number,
  nowMs: number,
): ContractState {
  const band = getContractBandBySlot(slot)
  const bandRange = getContractBandRangeSeconds(band)
  const slotSeed = `${state.random.worldSeed}:contracts:${generationIndex}:${slot}`
  const quality = getContractQuality(slotSeed)
  const challengeChance = band === 'short' ? 0.3 : band === 'medium' ? 0.55 : 0.75
  const isChallenge = randomFromSeed(slotSeed, 1) < challengeChance
  const kind: ContractState['kind'] = isChallenge ? 'challenge' : 'objective'
  const modifier = isChallenge ? getContractModifier(slotSeed, band) : null
  const targetSeconds = randomIntFromSeed(slotSeed, 0, bandRange.min, bandRange.max)
  const attemptLimit = 24
  const fallbackObjective: ContractObjective = {
    type: 'runCredits',
    target: toDecimal(state.stats.totalCredits)
      .plus(
        Decimal.max(
          getTotalProductionPerSecond(state).times(Math.max(300, targetSeconds)),
          new Decimal(1000),
        ),
      )
      .ceil()
      .toString(),
  }
  let selectedObjective: ContractObjective = fallbackObjective

  for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
    const objective = buildContractObjectiveCandidate(
      state,
      slotSeed,
      band,
      targetSeconds,
      quality,
      modifier,
      100 + attempt * 10,
    )
    if (!objective) {
      continue
    }

    const etaSeconds = estimateSecondsForObjective(state, objective)
    const minBound = bandRange.min * 0.35
    const maxBound = bandRange.max * 1.35
    if (Number.isFinite(etaSeconds) && etaSeconds >= minBound && etaSeconds <= maxBound) {
      selectedObjective = objective
      break
    }
  }

  return {
    id: `contract-${generationIndex}-${slot}`,
    kind,
    band,
    quality,
    isParticipating: false,
    objective: selectedObjective,
    rewards: buildContractRewards(state, slotSeed, band, quality, kind, targetSeconds),
    modifier,
    offerExpiresAtMs: nowMs + getContractOfferDurationMs(band),
    challengeDurationMs: Math.max(
      Math.floor(targetSeconds * CONTRACT_CHALLENGE_DURATION_MULTIPLIER * 1000),
      getContractActiveDurationMs(band, quality, kind),
    ),
    createdAtMs: nowMs,
    expiresAtMs: null,
  }
}

function generateContractSet(
  state: GameState,
  generationCounter: number,
  nowMs: number,
): { active: ContractState[]; nextGenerationCounter: number } {
  const active: ContractState[] = []
  let nextGenerationCounter = generationCounter

  for (let slot = 0; slot < CONTRACT_SLOT_COUNT; slot += 1) {
    active.push(generateContractForSlot(state, nextGenerationCounter, slot, nowMs))
    nextGenerationCounter += 1
  }

  return { active, nextGenerationCounter }
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

function createInitialRandomState(nowMs = Date.now()): RandomState {
  return {
    worldSeed: generateWorldSeed(nowMs),
  }
}

function createInitialContractEffectsState(): ContractEffectsState {
  return {
    productionBoostMultiplier: '1',
    productionBoostRemainingSeconds: 0,
    costDiscountMultiplier: '1',
    costDiscountRemainingPurchases: 0,
    nextRewardMultiplier: '1',
  }
}

function createInitialContractsState(state: GameState, nowMs: number): ContractsState {
  const generated = generateContractSet(state, 0, nowMs)
  return {
    active: generated.active,
    generationCounter: generated.nextGenerationCounter,
    effects: createInitialContractEffectsState(),
  }
}

export function getContractProgress(state: GameState, contract: ContractState) {
  if (contract.objective.type === 'runCredits') {
    const target = toDecimal(contract.objective.target)
    const current = toDecimal(state.stats.totalCredits)
    return {
      isComplete: current.greaterThanOrEqualTo(target),
      current: current.toString(),
      target: target.toString(),
      label: 'Run Credits',
    }
  }

  if (contract.objective.type === 'owned') {
    const current = state.generators[contract.objective.generator]
    return {
      isComplete: current >= contract.objective.target,
      current: current.toString(),
      target: contract.objective.target.toString(),
      label: GENERATOR_DEFS[contract.objective.generator].label,
    }
  }

  if (contract.objective.type === 'creditsPerSecond') {
    const target = toDecimal(contract.objective.target)
    const current = getTotalProductionPerSecond(state)
    return {
      isComplete: current.greaterThanOrEqualTo(target),
      current: current.toString(),
      target: target.toString(),
      label: 'Credits / sec',
    }
  }

  const current = getPurchasedUpgradeCount(state)
  return {
    isComplete: current >= contract.objective.target,
    current: current.toString(),
    target: contract.objective.target.toString(),
    label: 'Upgrades Purchased',
  }
}

function isContractActiveNow(contract: ContractState, nowMs: number): boolean {
  if (!contract.isParticipating) {
    return false
  }

  return contract.expiresAtMs === null || contract.expiresAtMs > nowMs
}

function resolveContractExpiry(state: GameState, nowMs: number): GameState {
  let nextState = state
  let didChange = false

  for (let slot = 0; slot < state.contracts.active.length; slot += 1) {
    const contract = nextState.contracts.active[slot]
    if (!contract) {
      continue
    }

    const isExpiredOffer = !contract.isParticipating && contract.offerExpiresAtMs <= nowMs
    const isExpiredActive =
      contract.isParticipating && contract.expiresAtMs !== null && contract.expiresAtMs <= nowMs
    if (!isExpiredOffer && !isExpiredActive) {
      continue
    }

    const replacement = generateContractForSlot(
      nextState,
      nextState.contracts.generationCounter,
      slot,
      nowMs,
    )
    const nextActive = [...nextState.contracts.active]
    nextActive[slot] = replacement
    nextState = {
      ...nextState,
      contracts: {
        ...nextState.contracts,
        active: nextActive,
        generationCounter: nextState.contracts.generationCounter + 1,
      },
    }
    didChange = true
  }

  return didChange ? nextState : state
}

function getEffectiveContractProductionMultiplier(state: GameState): Decimal {
  if (state.contracts.effects.productionBoostRemainingSeconds <= 0) {
    return ONE
  }
  return toDecimal(state.contracts.effects.productionBoostMultiplier)
}

function getEffectiveContractCostDiscountMultiplier(state: GameState): Decimal {
  if (state.contracts.effects.costDiscountRemainingPurchases <= 0) {
    return ONE
  }
  return toDecimal(state.contracts.effects.costDiscountMultiplier)
}

function decrementContractPurchaseDiscount(state: GameState): GameState {
  if (state.contracts.effects.costDiscountRemainingPurchases <= 0) {
    return state
  }

  const remainingPurchases = state.contracts.effects.costDiscountRemainingPurchases - 1
  return {
    ...state,
    contracts: {
      ...state.contracts,
      effects: {
        ...state.contracts.effects,
        costDiscountRemainingPurchases: remainingPurchases,
        costDiscountMultiplier: remainingPurchases > 0
          ? state.contracts.effects.costDiscountMultiplier
          : '1',
      },
    },
  }
}

function decrementContractTimedEffects(state: GameState, elapsedSeconds: number): GameState {
  if (elapsedSeconds <= 0) {
    return state
  }

  const nextRemainingSeconds = Math.max(
    0,
    state.contracts.effects.productionBoostRemainingSeconds - elapsedSeconds,
  )
  if (nextRemainingSeconds === state.contracts.effects.productionBoostRemainingSeconds) {
    return state
  }

  return {
    ...state,
    contracts: {
      ...state.contracts,
      effects: {
        ...state.contracts.effects,
        productionBoostRemainingSeconds: nextRemainingSeconds,
        productionBoostMultiplier: nextRemainingSeconds > 0
          ? state.contracts.effects.productionBoostMultiplier
          : '1',
      },
    },
  }
}

export function getActiveContractModifiers(state: GameState, nowMs = Date.now()): ContractModifier[] {
  return state.contracts.active
    .filter((contract) => contract.modifier && isContractActiveNow(contract, nowMs))
    .map((contract) => contract.modifier!)
}

export function activateContract(state: GameState, contractId: string, nowMs = Date.now()): GameState {
  const contractIndex = state.contracts.active.findIndex((contract) => contract.id === contractId)
  if (contractIndex < 0) {
    return state
  }

  const contract = state.contracts.active[contractIndex]
  if (contract.isParticipating) {
    return state
  }

  if (contract.offerExpiresAtMs <= nowMs) {
    return skipContract(state, contractId, nowMs)
  }

  const nextContracts = [...state.contracts.active]
  nextContracts[contractIndex] = {
    ...contract,
    isParticipating: true,
    expiresAtMs:
      contract.challengeDurationMs !== null
        ? nowMs + contract.challengeDurationMs
        : nowMs + getContractActiveDurationMs(contract.band, contract.quality, contract.kind),
  }

  return {
    ...state,
    contracts: {
      ...state.contracts,
      active: nextContracts,
    },
  }
}

export function isGeneratorPurchaseAllowedByContracts(
  state: GameState,
  key: GeneratorKey,
  nowMs = Date.now(),
): boolean {
  const modifiers = getActiveContractModifiers(state, nowMs)
  if (modifiers.some((modifier) => modifier.type === 'buyAmountLocked' && state.buyAmount !== modifier.amount)) {
    return false
  }
  return modifiers.every((modifier) => isGeneratorAllowedByModifier(key, modifier))
}

export function isUpgradePurchaseAllowedByContracts(state: GameState, nowMs = Date.now()): boolean {
  const modifiers = getActiveContractModifiers(state, nowMs)
  return !modifiers.some((modifier) => modifier.type === 'upgradesDisabled')
}

export function isPrestigeAllowedByContracts(state: GameState, nowMs = Date.now()): boolean {
  const modifiers = getActiveContractModifiers(state, nowMs)
  return !modifiers.some((modifier) => modifier.type === 'noPrestige')
}

export function claimContract(state: GameState, contractId: string, nowMs = Date.now()): GameState {
  const contractIndex = state.contracts.active.findIndex((contract) => contract.id === contractId)
  if (contractIndex < 0) {
    return state
  }

  const contract = state.contracts.active[contractIndex]
  if (!contract.isParticipating) {
    return state
  }
  if (contract.expiresAtMs !== null && contract.expiresAtMs <= nowMs) {
    return state
  }
  const progress = getContractProgress(state, contract)
  if (!progress.isComplete) {
    return state
  }

  let nextState = state
  const nextRewardMultiplier = toDecimal(nextState.contracts.effects.nextRewardMultiplier)
  const appliedRewardMultiplier = nextRewardMultiplier.greaterThan(0) ? nextRewardMultiplier : ONE

  for (const reward of contract.rewards) {
    switch (reward.type) {
      case 'credits':
        nextState = {
          ...nextState,
          credits: toDecimal(nextState.credits)
            .plus(toDecimal(reward.amount).times(appliedRewardMultiplier))
            .toString(),
        }
        break
      case 'essence':
        nextState = {
          ...nextState,
          prestige: {
            ...nextState.prestige,
            essence: toDecimal(nextState.prestige.essence)
              .plus(toDecimal(reward.amount).times(appliedRewardMultiplier))
              .toString(),
          },
        }
        break
      case 'productionBoost':
        nextState = {
          ...nextState,
          contracts: {
            ...nextState.contracts,
            effects: {
              ...nextState.contracts.effects,
              productionBoostMultiplier: toDecimal(nextState.contracts.effects.productionBoostMultiplier)
                .times(reward.multiplier)
                .toString(),
              productionBoostRemainingSeconds: Math.max(
                nextState.contracts.effects.productionBoostRemainingSeconds,
                reward.durationSeconds,
              ),
            },
          },
        }
        break
      case 'costDiscountCharges':
        nextState = {
          ...nextState,
          contracts: {
            ...nextState.contracts,
            effects: {
              ...nextState.contracts.effects,
              costDiscountMultiplier: toDecimal(nextState.contracts.effects.costDiscountMultiplier)
                .times(reward.multiplier)
                .toString(),
              costDiscountRemainingPurchases:
                nextState.contracts.effects.costDiscountRemainingPurchases + reward.charges,
            },
          },
        }
        break
      case 'nextRewardMultiplier':
        nextState = {
          ...nextState,
          contracts: {
            ...nextState.contracts,
            effects: {
              ...nextState.contracts.effects,
              nextRewardMultiplier: toDecimal(nextState.contracts.effects.nextRewardMultiplier)
                .times(reward.multiplier)
                .toString(),
            },
          },
        }
        break
      default:
        break
    }
  }

  if (!appliedRewardMultiplier.equals(ONE)) {
    nextState = {
      ...nextState,
      contracts: {
        ...nextState.contracts,
        effects: {
          ...nextState.contracts.effects,
          nextRewardMultiplier: '1',
        },
      },
    }
  }

  const generationCounter = state.contracts.generationCounter + 1
  const nextContracts = [...nextState.contracts.active]
  nextContracts[contractIndex] = generateContractForSlot(
    nextState,
    state.contracts.generationCounter,
    contractIndex,
    nowMs,
  )

  return syncAchievements({
    ...nextState,
    contracts: {
      ...nextState.contracts,
      active: nextContracts,
      generationCounter,
    },
  })
}

export function skipContract(state: GameState, contractId: string, nowMs = Date.now()): GameState {
  const contractIndex = state.contracts.active.findIndex((contract) => contract.id === contractId)
  if (contractIndex < 0) {
    return state
  }

  const nextContracts = [...state.contracts.active]
  nextContracts[contractIndex] = generateContractForSlot(
    state,
    state.contracts.generationCounter,
    contractIndex,
    nowMs,
  )

  return {
    ...state,
    contracts: {
      ...state.contracts,
      active: nextContracts,
      generationCounter: state.contracts.generationCounter + 1,
    },
  }
}

export function ensureContractsState(state: GameState, nowMs = Date.now()): GameState {
  const hasValidContracts =
    Array.isArray(state.contracts?.active) &&
    state.contracts.active.length === CONTRACT_SLOT_COUNT
  if (hasValidContracts && state.contracts.effects) {
    return state
  }

  const generated = generateContractSet(state, state.contracts?.generationCounter ?? 0, nowMs)
  return {
    ...state,
    contracts: {
      active: hasValidContracts ? state.contracts.active : generated.active,
      generationCounter: hasValidContracts
        ? state.contracts.generationCounter
        : generated.nextGenerationCounter,
      effects: createInitialContractEffectsState(),
    },
  }
}

export function createInitialGameState(nowMs = Date.now()): GameState {
  const initial: GameState = {
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
    random: createInitialRandomState(nowMs),
    contracts: {
      active: [],
      generationCounter: 0,
      effects: createInitialContractEffectsState(),
    },
  }

  return {
    ...initial,
    contracts: createInitialContractsState(initial, nowMs),
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
  return getPrestigeGainForReset(state).greaterThan(0) && isPrestigeAllowedByContracts(state)
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
  const resetBase: GameState = {
    ...initialState,
    settings: state.settings,
    random: state.random,
    stats: {
      ...initialState.stats,
      totalCreditsAllResets: state.stats.totalCreditsAllResets,
    },
    prestige: {
      resets: state.prestige.resets + 1,
      essence: toDecimal(state.prestige.essence).plus(gainedEssence).toString(),
    },
    achievements: state.achievements,
  }

  return syncAchievements({
    ...resetBase,
    contracts: createInitialContractsState(resetBase, nowMs),
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
  const baseCost = calculateBulkCost(
    toDecimal(definition.baseCost),
    toDecimal(definition.growth),
    state.generators[key],
    amount,
  )
  return baseCost.times(getEffectiveContractCostDiscountMultiplier(state))
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

  return multiplier.times(getEffectiveContractProductionMultiplier(state))
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
  const stateWithContracts = ensureContractsState(state, nowMs)
  const effectiveNowMs = Math.max(nowMs, stateWithContracts.stats.lastTickAtMs)
  const elapsedSeconds = Math.max(
    0,
    (effectiveNowMs - stateWithContracts.stats.lastTickAtMs) / 1_000,
  )
  const cappedSeconds = Math.min(elapsedSeconds, getOfflineProgressCapSeconds(stateWithContracts))

  if (cappedSeconds <= 0) {
    if (effectiveNowMs === stateWithContracts.stats.lastTickAtMs) {
      return resolveContractExpiry(stateWithContracts, effectiveNowMs)
    }

    const updated = {
      ...stateWithContracts,
      stats: {
        ...stateWithContracts.stats,
        lastTickAtMs: effectiveNowMs,
      },
    }
    return resolveContractExpiry(updated, effectiveNowMs)
  }

  const produced = getTotalProductionPerSecond(stateWithContracts).times(cappedSeconds)
  const progressed = applyProducedCredits(stateWithContracts, produced, effectiveNowMs)
  return resolveContractExpiry(
    decrementContractTimedEffects(progressed, cappedSeconds),
    effectiveNowMs,
  )
}

export function tickGame(state: GameState, nowMs: number): GameState {
  const stateWithContracts = ensureContractsState(state, nowMs)
  const elapsedSeconds = Math.min(
    MAX_TICK_SECONDS,
    Math.max(0, (nowMs - stateWithContracts.stats.lastTickAtMs) / 1_000),
  )

  if (elapsedSeconds <= 0) {
    return resolveContractExpiry(stateWithContracts, nowMs)
  }

  const produced = getTotalProductionPerSecond(stateWithContracts).times(elapsedSeconds)
  const progressed = applyProducedCredits(stateWithContracts, produced, nowMs)
  return resolveContractExpiry(
    decrementContractTimedEffects(progressed, elapsedSeconds),
    nowMs,
  )
}

export function buyGenerator(state: GameState, key: GeneratorKey): GameState {
  if (!isGeneratorPurchaseAllowedByContracts(state, key)) {
    return state
  }

  const cost = getGeneratorCost(state, key, state.buyAmount)
  const credits = toDecimal(state.credits)

  if (credits.lessThan(cost)) {
    return state
  }

  return syncAchievements(decrementContractPurchaseDiscount({
    ...state,
    credits: credits.minus(cost).toString(),
    generators: {
      ...state.generators,
      [key]: state.generators[key] + state.buyAmount,
    },
  }))
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
  if (
    !upgrade ||
    state.purchasedUpgrades[key] ||
    !isUpgradeUnlocked(state, key) ||
    !isUpgradePurchaseAllowedByContracts(state)
  ) {
    return false
  }

  const discountedCost = toDecimal(upgrade.cost).times(getEffectiveContractCostDiscountMultiplier(state))
  return toDecimal(state.credits).greaterThanOrEqualTo(discountedCost)
}

export function buyUpgrade(state: GameState, key: RunUpgradeKey): GameState {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade || !canBuyUpgrade(state, key)) {
    return state
  }

  const discountedCost = toDecimal(upgrade.cost).times(getEffectiveContractCostDiscountMultiplier(state))

  return syncAchievements(decrementContractPurchaseDiscount({
    ...state,
    credits: toDecimal(state.credits).minus(discountedCost).toString(),
    purchasedUpgrades: {
      ...state.purchasedUpgrades,
      [key]: true,
    },
  }))
}
