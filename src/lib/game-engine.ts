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
  | 'voidLathes'
  | 'entropyReactors'
  | 'quantumFoundries'
  | 'darkMatterSmelters'
  | 'realityKilns'
  | 'fractalAssemblers'
  | 'causalLooms'
  | 'epochMonoliths'
  | 'omniversalFoundries'
  | 'genesisForges'

export const UPGRADE_ORDER = [
  'minerTuning',
  'minerSwarm',
  'minerFoundries',
  'minerOvermind',
  'drillGrease',
  'drillAI',
  'drillHypercut',
  'drillSingularity',
  'extractorCooling',
  'extractorClusters',
  'extractorMatrices',
  'extractorHypergrid',
  'refineryCatalysts',
  'refineryOverdrive',
  'refinerySingularities',
  'refineryTransmutation',
  'megaRigServos',
  'megaRigNanites',
  'megaRigSentience',
  'megaRigDominion',
  'orbitalDrones',
  'orbitalCommand',
  'orbitalAnchors',
  'orbitalEmpyrean',
  'stellarFlux',
  'stellarLattices',
  'stellarAscension',
  'stellarParagon',
  'dysonPhasing',
  'dysonHarmonics',
  'dysonDominion',
  'dysonZenith',
  'singularityContainment',
  'singularityLensing',
  'singularityTranscendence',
  'singularityAxiom',
  'continuumStabilizers',
  'continuumRecursion',
  'continuumParadoxCore',
  'continuumEternity',
  'voidTuning',
  'voidResonance',
  'voidApotheosis',
  'entropyBaffles',
  'entropyRecapture',
  'entropyHorizon',
  'quantumSpools',
  'quantumEntanglement',
  'quantumConfluence',
  'darkMatterCompression',
  'darkMatterFusion',
  'darkMatterTranscendence',
  'realityTempering',
  'realityRecasting',
  'realityAscendancy',
  'fractalRecursion',
  'fractalAmplification',
  'fractalInfinity',
  'causalThreading',
  'causalBraiding',
  'causalApex',
  'epochInscription',
  'epochResonance',
  'epochImperative',
  'omniversalBridges',
  'omniversalConcord',
  'omniversalSupremacy',
  'genesisKindling',
  'genesisProliferation',
  'genesisCrowning',
  'automationLoops',
  'quantumForecasts',
  'fractalEconomies',
  'causalOverclock',
  'archiveBatteries',
  'temporalVaults',
  'deepArchive',
  'chronoReserves',
] as const

export type RunUpgradeKey = (typeof UPGRADE_ORDER)[number]

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
  'miners3500',
  'drills75',
  'drills200',
  'drills400',
  'drills750',
  'drills1500',
  'drills2500',
  'extractors50',
  'extractors120',
  'extractors250',
  'extractors500',
  'extractors1000',
  'extractors1800',
  'refineries40',
  'refineries90',
  'refineries200',
  'refineries400',
  'refineries800',
  'refineries1200',
  'megaRigs30',
  'megaRigs75',
  'megaRigs150',
  'megaRigs300',
  'megaRigs600',
  'megaRigs900',
  'orbitalPlatforms20',
  'orbitalPlatforms50',
  'orbitalPlatforms100',
  'orbitalPlatforms200',
  'orbitalPlatforms400',
  'orbitalPlatforms600',
  'stellarForges15',
  'stellarForges35',
  'stellarForges75',
  'stellarForges150',
  'stellarForges300',
  'stellarForges450',
  'dysonArrays10',
  'dysonArrays25',
  'dysonArrays50',
  'dysonArrays100',
  'dysonArrays200',
  'dysonArrays300',
  'singularityWells8',
  'singularityWells20',
  'singularityWells40',
  'singularityWells80',
  'singularityWells160',
  'singularityWells220',
  'continuumEngines5',
  'continuumEngines12',
  'continuumEngines25',
  'continuumEngines50',
  'continuumEngines100',
  'continuumEngines140',
  'voidLathes3',
  'voidLathes8',
  'voidLathes16',
  'voidLathes32',
  'voidLathes64',
  'entropyReactors2',
  'entropyReactors5',
  'entropyReactors12',
  'entropyReactors24',
  'entropyReactors48',
  'quantumFoundries1',
  'quantumFoundries4',
  'quantumFoundries10',
  'quantumFoundries20',
  'quantumFoundries40',
  'darkMatterSmelters1',
  'darkMatterSmelters3',
  'darkMatterSmelters8',
  'darkMatterSmelters16',
  'darkMatterSmelters32',
  'realityKilns1',
  'realityKilns3',
  'realityKilns7',
  'realityKilns14',
  'realityKilns28',
  'fractalAssemblers1',
  'fractalAssemblers2',
  'fractalAssemblers6',
  'fractalAssemblers12',
  'fractalAssemblers24',
  'causalLooms1',
  'causalLooms2',
  'causalLooms5',
  'causalLooms10',
  'causalLooms20',
  'epochMonoliths1',
  'epochMonoliths2',
  'epochMonoliths4',
  'epochMonoliths8',
  'epochMonoliths16',
  'omniversalFoundries1',
  'omniversalFoundries2',
  'omniversalFoundries4',
  'omniversalFoundries7',
  'omniversalFoundries14',
  'genesisForges1',
  'genesisForges2',
  'genesisForges3',
  'genesisForges6',
  'genesisForges12',
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
  voidLathes: number
  entropyReactors: number
  quantumFoundries: number
  darkMatterSmelters: number
  realityKilns: number
  fractalAssemblers: number
  causalLooms: number
  epochMonoliths: number
  omniversalFoundries: number
  genesisForges: number
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
  permanentUpgrades: PermanentUpgradesState
}

export interface RandomState {
  worldSeed: string
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

export type PermanentUpgradeKey =
  | 'essenceInfusion'
  | 'quantumLattice'
  | 'singularityCore'

export type PermanentUpgradesState = Record<PermanentUpgradeKey, number>

type PermanentUpgradeDef = {
  key: PermanentUpgradeKey
  label: string
  description: string
  baseCost: string
  growth: string
  effectType: 'productionAdditive' | 'generatorCostDiscount' | 'prestigeGainMultiplier'
  value: string
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
const PRESTIGE_UNLOCK_CREDITS = new Decimal(PRESTIGE_BALANCE.unlockCredits)
const PRESTIGE_GAIN_EXPONENT = new Decimal(PRESTIGE_BALANCE.gainExponent)

export const PERMANENT_UPGRADE_ORDER: PermanentUpgradeKey[] = [
  'essenceInfusion',
  'quantumLattice',
  'singularityCore',
]

export const PERMANENT_UPGRADE_DEFS: Record<PermanentUpgradeKey, PermanentUpgradeDef> = {
  essenceInfusion: {
    key: 'essenceInfusion',
    label: 'Essence Infusion',
    description: 'Boost production multiplier by +0.25 per level.',
    baseCost: '5',
    growth: '1.7',
    effectType: 'productionAdditive',
    value: '0.25',
  },
  quantumLattice: {
    key: 'quantumLattice',
    label: 'Quantum Lattice',
    description: 'Reduce generator costs by 4% per level.',
    baseCost: '18',
    growth: '1.9',
    effectType: 'generatorCostDiscount',
    value: '0.96',
  },
  singularityCore: {
    key: 'singularityCore',
    label: 'Singularity Core',
    description: 'Increase prestige essence gain by 15% per level.',
    baseCost: '60',
    growth: '2.15',
    effectType: 'prestigeGainMultiplier',
    value: '1.15',
  },
}

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
  'voidLathes',
  'entropyReactors',
  'quantumFoundries',
  'darkMatterSmelters',
  'realityKilns',
  'fractalAssemblers',
  'causalLooms',
  'epochMonoliths',
  'omniversalFoundries',
  'genesisForges',
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

function generateWorldSeed(nowMs = Date.now()): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint32Array(2)
    crypto.getRandomValues(bytes)
    return `${nowMs.toString(36)}-${bytes[0].toString(36)}${bytes[1].toString(36)}`
  }

  return `${nowMs.toString(36)}-${Math.floor(Math.random() * 1e12).toString(36)}`
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
    permanentUpgrades: createInitialPermanentUpgradesState(),
  }
}

function createInitialPermanentUpgradesState(): PermanentUpgradesState {
  return PERMANENT_UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = 0
    return accumulator
  }, {} as PermanentUpgradesState)
}

function createInitialRandomState(nowMs = Date.now()): RandomState {
  return {
    worldSeed: generateWorldSeed(nowMs),
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
      voidLathes: 0,
      entropyReactors: 0,
      quantumFoundries: 0,
      darkMatterSmelters: 0,
      realityKilns: 0,
      fractalAssemblers: 0,
      causalLooms: 0,
      epochMonoliths: 0,
      omniversalFoundries: 0,
      genesisForges: 0,
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
  }
  return initial
}

export function getPrestigeGainForReset(state: GameState): Decimal {
  const runTotalCredits = toDecimal(state.stats.totalCredits)
  if (runTotalCredits.lessThan(PRESTIGE_UNLOCK_CREDITS)) {
    return ZERO
  }

  const baseGain = runTotalCredits.div(PRESTIGE_UNLOCK_CREDITS).pow(PRESTIGE_GAIN_EXPONENT)
  return baseGain.times(getPrestigeGainMultiplierFromPermanentUpgrades(state.prestige.permanentUpgrades)).floor()
}

export function canPrestige(state: GameState): boolean {
  return getPrestigeGainForReset(state).greaterThan(0)
}

export function getPrestigeMultiplier(state: GameState): Decimal {
  return getPrestigeMultiplierFromPermanentUpgrades(state.prestige.permanentUpgrades)
}

export function getPrestigeMultiplierFromPermanentUpgrades(
  permanentUpgrades: PermanentUpgradesState,
): Decimal {
  let multiplier = ONE

  for (const key of PERMANENT_UPGRADE_ORDER) {
    const upgrade = PERMANENT_UPGRADE_DEFS[key]
    const level = Math.max(0, Math.floor(permanentUpgrades[key] ?? 0))
    if (level <= 0) {
      continue
    }

    if (upgrade.effectType === 'productionAdditive') {
      multiplier = multiplier.plus(toDecimal(upgrade.value).times(level))
    }
  }

  return multiplier
}

function getGeneratorCostMultiplierFromPermanentUpgrades(
  permanentUpgrades: PermanentUpgradesState,
): Decimal {
  let costMultiplier = ONE

  for (const key of PERMANENT_UPGRADE_ORDER) {
    const upgrade = PERMANENT_UPGRADE_DEFS[key]
    if (upgrade.effectType !== 'generatorCostDiscount') {
      continue
    }

    const level = Math.max(0, Math.floor(permanentUpgrades[key] ?? 0))
    if (level <= 0) {
      continue
    }

    costMultiplier = costMultiplier.times(toDecimal(upgrade.value).pow(level))
  }

  return Decimal.max(new Decimal('0.1'), costMultiplier)
}

function getPrestigeGainMultiplierFromPermanentUpgrades(
  permanentUpgrades: PermanentUpgradesState,
): Decimal {
  let multiplier = ONE

  for (const key of PERMANENT_UPGRADE_ORDER) {
    const upgrade = PERMANENT_UPGRADE_DEFS[key]
    if (upgrade.effectType !== 'prestigeGainMultiplier') {
      continue
    }

    const level = Math.max(0, Math.floor(permanentUpgrades[key] ?? 0))
    if (level <= 0) {
      continue
    }

    multiplier = multiplier.times(toDecimal(upgrade.value).pow(level))
  }

  return multiplier
}

export function getPermanentUpgradeCost(
  permanentUpgrades: PermanentUpgradesState,
  key: PermanentUpgradeKey,
): Decimal {
  const level = Math.max(0, Math.floor(permanentUpgrades[key] ?? 0))
  const upgrade = PERMANENT_UPGRADE_DEFS[key]
  return toDecimal(upgrade.baseCost).times(toDecimal(upgrade.growth).pow(level)).ceil()
}

export function applyPrestigeReset(
  state: GameState,
  nowMs = Date.now(),
  options?: {
    remainingEssence?: string
    permanentUpgrades?: PermanentUpgradesState
  },
): GameState {
  const gainedEssence = getPrestigeGainForReset(state)
  if (gainedEssence.lessThanOrEqualTo(0)) {
    return state
  }

  const totalAvailableEssence = toDecimal(state.prestige.essence).plus(gainedEssence)
  let remainingEssence = totalAvailableEssence
  if (options?.remainingEssence !== undefined) {
    try {
      const parsedRemaining = toDecimal(options.remainingEssence)
      if (parsedRemaining.greaterThanOrEqualTo(0) && parsedRemaining.lessThanOrEqualTo(totalAvailableEssence)) {
        remainingEssence = parsedRemaining
      }
    } catch {
      remainingEssence = totalAvailableEssence
    }
  }

  const normalizedPermanentUpgrades = createInitialPermanentUpgradesState()
  const sourcePermanentUpgrades = options?.permanentUpgrades ?? state.prestige.permanentUpgrades
  for (const key of PERMANENT_UPGRADE_ORDER) {
    normalizedPermanentUpgrades[key] = Math.max(0, Math.floor(sourcePermanentUpgrades[key] ?? 0))
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
      essence: remainingEssence.toString(),
      permanentUpgrades: normalizedPermanentUpgrades,
    },
    achievements: state.achievements,
  }
  return syncAchievements(resetBase)
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
  return baseCost.times(getGeneratorCostMultiplierFromPermanentUpgrades(state.prestige.permanentUpgrades))
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
  const elapsedSeconds = Math.max(
    0,
    (effectiveNowMs - state.stats.lastTickAtMs) / 1_000,
  )
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
  if (
    !upgrade ||
    state.purchasedUpgrades[key] ||
    !isUpgradeUnlocked(state, key)
  ) {
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
