import Decimal from 'decimal.js'
import {
  ACHIEVEMENT_CONFIG,
  GENERATOR_CONFIG,
  MINER_SUBSYSTEM_CONFIG,
  MINER_SUBSYSTEM_GENERATOR_CONFIG,
  MINER_SUBSYSTEM_UPGRADE_CONFIG,
  PERMANENT_UPGRADE_CONFIG,
  PRESTIGE_BALANCE,
  UPGRADE_CONFIG,
  UPGRADE_COST_MULTIPLIER_BY_TYPE,
  validateProgressionConfig,
  type AchievementConfigEntry,
  type MinerSubsystemGeneratorConfigEntry,
  type MinerSubsystemUpgradeConfigEntry,
  type PermanentUpgradeConfigEntry,
  type SubsystemKey,
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
  'minerCollectives',
  'minerSwarm',
  'minerFoundries',
  'minerOvermind',
  'minerConstellation',
  'drillGrease',
  'drillAssemblies',
  'drillAI',
  'drillHypercut',
  'drillSingularity',
  'drillEventide',
  'extractorCooling',
  'extractorLattices',
  'extractorClusters',
  'extractorMatrices',
  'extractorHypergrid',
  'extractorApogee',
  'refineryCatalysts',
  'refineryDistillation',
  'refineryOverdrive',
  'refinerySingularities',
  'refineryTransmutation',
  'refineryPerpetuity',
  'megaRigServos',
  'megaRigAssemblers',
  'megaRigNanites',
  'megaRigSentience',
  'megaRigDominion',
  'megaRigAscendancy',
  'orbitalDrones',
  'orbitalShipyards',
  'orbitalCommand',
  'orbitalAnchors',
  'orbitalEmpyrean',
  'orbitalAureate',
  'stellarFlux',
  'stellarMantles',
  'stellarLattices',
  'stellarAscension',
  'stellarParagon',
  'stellarSupercluster',
  'dysonPhasing',
  'dysonLenses',
  'dysonHarmonics',
  'dysonDominion',
  'dysonZenith',
  'dysonAphelion',
  'singularityContainment',
  'singularityShear',
  'singularityLensing',
  'singularityTranscendence',
  'singularityAxiom',
  'singularityEclipse',
  'continuumStabilizers',
  'continuumRecursion',
  'continuumParadoxCore',
  'continuumSlipstream',
  'continuumHyperfold',
  'continuumEternity',
  'voidTuning',
  'voidResonance',
  'voidApotheosis',
  'voidConfluence',
  'voidOblivion',
  'entropyBaffles',
  'entropyRecapture',
  'entropyHorizon',
  'entropyCascade',
  'entropyDominion',
  'quantumSpools',
  'quantumEntanglement',
  'quantumConfluence',
  'quantumCascade',
  'quantumSingularity',
  'darkMatterCompression',
  'darkMatterFusion',
  'darkMatterTranscendence',
  'darkMatterDominion',
  'darkMatterEventide',
  'realityTempering',
  'realityRecasting',
  'realityAscendancy',
  'realityCrowning',
  'realityGenesis',
  'fractalRecursion',
  'fractalAmplification',
  'fractalInfinity',
  'fractalMultiplicity',
  'fractalAscendancy',
  'causalThreading',
  'causalBraiding',
  'causalApex',
  'causalConcord',
  'causalDominion',
  'epochInscription',
  'epochResonance',
  'epochImperative',
  'epochAscension',
  'epochContinuum',
  'omniversalBridges',
  'omniversalConcord',
  'omniversalSupremacy',
  'omniversalOverture',
  'omniversalCrown',
  'genesisKindling',
  'genesisProliferation',
  'genesisCrowning',
  'genesisExaltation',
  'genesisApotheosis',
  'automationLoops',
  'signalFutures',
  'quantumForecasts',
  'orbitalExchange',
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
  'permanentLevels1',
  'permanentLevels5',
  'permanentLevels15',
  'permanentLevels40',
  'permanentTypes3',
  'permanentTypes5',
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

export const MINER_SUBSYSTEM_UPGRADE_ORDER = [
  'scoutTraining',
  'scoutRelays',
  'scoutNetwork',
  'campPlanning',
  'campRouting',
  'campAtlas',
  'shaftCalibration',
  'shaftServos',
  'shaftDominion',
  'freightDispatch',
  'freightConvoys',
  'freightLattice',
  'labModeling',
  'labForecasting',
  'labSynthesis',
  'commandPlanning',
  'commandAutomation',
  'commandSingularity',
  'fieldProtocols',
  'networkFusion',
  'oreAlgorithms',
] as const

export type MinerSubsystemUpgradeKey = (typeof MINER_SUBSYSTEM_UPGRADE_ORDER)[number]

export const MINER_SUBSYSTEM_GENERATOR_ORDER = [
  'scouts',
  'surveyCamps',
  'testShafts',
  'freightTeams',
  'geologyLabs',
  'commandCenters',
] as const

export type MinerSubsystemGeneratorKey = (typeof MINER_SUBSYSTEM_GENERATOR_ORDER)[number]

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

export type MinerSubsystemGeneratorsState = Record<MinerSubsystemGeneratorKey, number>
export type MinerSubsystemPurchasedUpgradesState = Record<MinerSubsystemUpgradeKey, boolean>

export interface MinerSubsystemState {
  oreData: string
  totalOreData: string
  generators: MinerSubsystemGeneratorsState
  purchasedUpgrades: MinerSubsystemPurchasedUpgradesState
}

export interface SubsystemsState {
  miners: MinerSubsystemState
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
  subsystems: SubsystemsState
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

type MinerSubsystemUpgradeDef = MinerSubsystemUpgradeConfigEntry & {
  key: MinerSubsystemUpgradeKey
  cost: string
  multiplier: string
  requiresUpgrade?: MinerSubsystemUpgradeKey
}

type MinerSubsystemGeneratorDef = MinerSubsystemGeneratorConfigEntry & {
  key: MinerSubsystemGeneratorKey
}

export type PermanentUpgradeKey =
  | 'essenceInfusion'
  | 'bootstrapCache'
  | 'quantumLattice'
  | 'calibrationMatrix'
  | 'singularityCore'

export type PermanentUpgradesState = Record<PermanentUpgradeKey, number>

type PermanentUpgradeDef = PermanentUpgradeConfigEntry & {
  key: PermanentUpgradeKey
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

type SubsystemUnlockUpgradeDef = UpgradeBaseDef & {
  effectType: 'subsystemUnlock'
  subsystem: SubsystemKey
}

type UpgradeDef =
  | GlobalUpgradeDef
  | GeneratorUpgradeDef
  | OfflineCapUpgradeDef
  | SubsystemUnlockUpgradeDef

const ONE = new Decimal(1)
const ZERO = new Decimal(0)
const MAX_TICK_SECONDS = 5
const BASE_OFFLINE_PROGRESS_CAP_SECONDS = 15 * 60
const PRESTIGE_UNLOCK_CREDITS = new Decimal(PRESTIGE_BALANCE.unlockCredits)
const PRESTIGE_GAIN_EXPONENT = new Decimal(PRESTIGE_BALANCE.gainExponent)
const PRESTIGE_RESET_PRODUCTION_BONUS = new Decimal(PRESTIGE_BALANCE.productionPerReset)
const PRESTIGE_RESET_GAIN_BONUS = new Decimal(PRESTIGE_BALANCE.gainPerReset)
const MINER_SUBSYSTEM_MULTIPLIER_EXPONENT = new Decimal(MINER_SUBSYSTEM_CONFIG.multiplierExponent)

export const SUBSYSTEM_UNLOCK_UPGRADES: Record<SubsystemKey, RunUpgradeKey> = {
  miners: MINER_SUBSYSTEM_CONFIG.unlockUpgrade as RunUpgradeKey,
}

export const GENERATOR_SUBSYSTEMS: Partial<Record<GeneratorKey, SubsystemKey>> = {
  miners: 'miners',
}

export const PERMANENT_UPGRADE_ORDER: PermanentUpgradeKey[] = [
  'essenceInfusion',
  'bootstrapCache',
  'quantumLattice',
  'calibrationMatrix',
  'singularityCore',
]

export const PERMANENT_UPGRADE_DEFS: Record<PermanentUpgradeKey, PermanentUpgradeDef> =
  PERMANENT_UPGRADE_ORDER.reduce((accumulator, key) => {
    const entry = PERMANENT_UPGRADE_CONFIG[key]
    accumulator[key] = {
      ...entry,
      key,
    }
    return accumulator
  }, {} as Record<PermanentUpgradeKey, PermanentUpgradeDef>)

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
  permanentUpgradeOrder: PERMANENT_UPGRADE_ORDER,
  minerSubsystemGeneratorOrder: MINER_SUBSYSTEM_GENERATOR_ORDER,
  minerSubsystemUpgradeOrder: MINER_SUBSYSTEM_UPGRADE_ORDER,
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

    if (entry.effectType === 'subsystemUnlock') {
      accumulator[key] = {
        key,
        label: entry.label,
        description: entry.description,
        cost: getUpgradeCost(entry),
        effectType: 'subsystemUnlock',
        subsystem: entry.subsystem!,
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

export const MINER_SUBSYSTEM_UPGRADE_DEFS: Record<
  MinerSubsystemUpgradeKey,
  MinerSubsystemUpgradeDef
> = MINER_SUBSYSTEM_UPGRADE_ORDER.reduce((accumulator, key) => {
  const entry = MINER_SUBSYSTEM_UPGRADE_CONFIG[key]
  accumulator[key] = {
    ...entry,
    key,
    cost: entry.cost,
    multiplier: entry.multiplier,
    requiresUpgrade: entry.requiresUpgrade as MinerSubsystemUpgradeKey | undefined,
  }
  return accumulator
}, {} as Record<MinerSubsystemUpgradeKey, MinerSubsystemUpgradeDef>)

export const MINER_SUBSYSTEM_GENERATOR_DEFS: Record<
  MinerSubsystemGeneratorKey,
  MinerSubsystemGeneratorDef
> = MINER_SUBSYSTEM_GENERATOR_ORDER.reduce((accumulator, key) => {
  const entry = MINER_SUBSYSTEM_GENERATOR_CONFIG[key]
  accumulator[key] = {
    ...entry,
    key,
  }
  return accumulator
}, {} as Record<MinerSubsystemGeneratorKey, MinerSubsystemGeneratorDef>)

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
    case 'permanentUpgradeLevels':
      return getPermanentUpgradeLevelCount(state) >= requirement.count
    case 'permanentUpgradeTypes':
      return getPermanentUpgradeTypeCount(state) >= requirement.count
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
    case 'permanentUpgradeLevels':
    case 'permanentUpgradeTypes':
      return 'Permanent Upgrades'
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
    case 'permanentUpgradeLevels':
      return new Decimal(getPermanentUpgradeLevelCount(state)).div(requirement.count)
    case 'permanentUpgradeTypes':
      return new Decimal(getPermanentUpgradeTypeCount(state)).div(requirement.count)
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

function getPermanentUpgradeLevelCount(state: GameState): number {
  return PERMANENT_UPGRADE_ORDER.reduce(
    (count, key) => count + Math.max(0, Math.floor(state.prestige.permanentUpgrades[key] ?? 0)),
    0,
  )
}

function getPermanentUpgradeTypeCount(state: GameState): number {
  return PERMANENT_UPGRADE_ORDER.reduce(
    (count, key) =>
      count + (Math.max(0, Math.floor(state.prestige.permanentUpgrades[key] ?? 0)) > 0 ? 1 : 0),
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

function createInitialMinerSubsystemGeneratorsState(): MinerSubsystemGeneratorsState {
  return MINER_SUBSYSTEM_GENERATOR_ORDER.reduce((accumulator, key) => {
    accumulator[key] = 0
    return accumulator
  }, {} as MinerSubsystemGeneratorsState)
}

function createInitialMinerSubsystemPurchasedUpgradesState(): MinerSubsystemPurchasedUpgradesState {
  return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = false
    return accumulator
  }, {} as MinerSubsystemPurchasedUpgradesState)
}

function createInitialMinerSubsystemState(): MinerSubsystemState {
  return {
    oreData: '0',
    totalOreData: '0',
    generators: createInitialMinerSubsystemGeneratorsState(),
    purchasedUpgrades: createInitialMinerSubsystemPurchasedUpgradesState(),
  }
}

function createInitialSubsystemsState(): SubsystemsState {
  return {
    miners: createInitialMinerSubsystemState(),
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
    subsystems: createInitialSubsystemsState(),
  }
  return initial
}

export function isSubsystemUnlocked(state: GameState, subsystem: SubsystemKey): boolean {
  return state.purchasedUpgrades[SUBSYSTEM_UNLOCK_UPGRADES[subsystem]]
}

export function getSubsystemForGenerator(key: GeneratorKey): SubsystemKey | null {
  return GENERATOR_SUBSYSTEMS[key] ?? null
}

export function isGeneratorManagedBySubsystem(state: GameState, key: GeneratorKey): boolean {
  const subsystem = getSubsystemForGenerator(key)
  return subsystem ? isSubsystemUnlocked(state, subsystem) : false
}

function normalizeMinerSubsystemGeneratorsState(
  generators: Partial<Record<MinerSubsystemGeneratorKey, number>> | undefined,
): MinerSubsystemGeneratorsState {
  return MINER_SUBSYSTEM_GENERATOR_ORDER.reduce((accumulator, key) => {
    accumulator[key] = Math.max(0, Math.floor(generators?.[key] ?? 0))
    return accumulator
  }, {} as MinerSubsystemGeneratorsState)
}

function normalizeMinerSubsystemPurchasedUpgradesState(
  purchasedUpgrades: Partial<Record<MinerSubsystemUpgradeKey, boolean>> | undefined,
): MinerSubsystemPurchasedUpgradesState {
  return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = Boolean(purchasedUpgrades?.[key])
    return accumulator
  }, {} as MinerSubsystemPurchasedUpgradesState)
}

function getNormalizedMinerSubsystemState(state: GameState): MinerSubsystemState {
  return {
    oreData: state.subsystems.miners.oreData ?? '0',
    totalOreData: state.subsystems.miners.totalOreData ?? state.subsystems.miners.oreData ?? '0',
    generators: normalizeMinerSubsystemGeneratorsState(state.subsystems.miners.generators),
    purchasedUpgrades: normalizeMinerSubsystemPurchasedUpgradesState(
      state.subsystems.miners.purchasedUpgrades,
    ),
  }
}

export function getMinerOreData(state: GameState): Decimal {
  return toDecimal(getNormalizedMinerSubsystemState(state).oreData)
}

export function getMinerTotalOreData(state: GameState): Decimal {
  return toDecimal(getNormalizedMinerSubsystemState(state).totalOreData)
}

function getMinerSubsystemGlobalProductionMultiplier(state: GameState): Decimal {
  const subsystem = getNormalizedMinerSubsystemState(state)

  return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce((multiplier, key) => {
    const upgrade = MINER_SUBSYSTEM_UPGRADE_DEFS[key]
    if (!subsystem.purchasedUpgrades[key] || upgrade.effectType !== 'global') {
      return multiplier
    }

    return multiplier.times(upgrade.multiplier)
  }, ONE)
}

function getMinerSubsystemGeneratorProductionMultiplier(
  state: GameState,
  generatorKey: MinerSubsystemGeneratorKey,
): Decimal {
  const subsystem = getNormalizedMinerSubsystemState(state)

  return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce((multiplier, key) => {
    const upgrade = MINER_SUBSYSTEM_UPGRADE_DEFS[key]
    if (
      !subsystem.purchasedUpgrades[key] ||
      upgrade.effectType !== 'generator' ||
      upgrade.target !== generatorKey
    ) {
      return multiplier
    }

    return multiplier.times(upgrade.multiplier)
  }, ONE)
}

export function getMinerSubsystemGeneratorCost(
  state: GameState,
  key: MinerSubsystemGeneratorKey,
  amount = state.buyAmount,
): Decimal {
  const definition = MINER_SUBSYSTEM_GENERATOR_DEFS[key]
  return calculateBulkCost(
    toDecimal(definition.baseCost),
    toDecimal(definition.growth),
    getNormalizedMinerSubsystemState(state).generators[key],
    amount,
  )
}

export function getMinerSubsystemGeneratorProductionPerSecond(
  state: GameState,
  key: MinerSubsystemGeneratorKey,
): Decimal {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return ZERO
  }

  const owned = getNormalizedMinerSubsystemState(state).generators[key]
  if (owned <= 0) {
    return ZERO
  }

  return toDecimal(MINER_SUBSYSTEM_GENERATOR_DEFS[key].baseProduction)
    .times(owned)
    .times(getMinerSubsystemGeneratorProductionMultiplier(state, key))
    .times(getMinerSubsystemGlobalProductionMultiplier(state))
}

export function getMinerSubsystemTotalProductionPerSecond(state: GameState): Decimal {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return ZERO
  }

  return MINER_SUBSYSTEM_GENERATOR_ORDER.reduce(
    (total, key) => total.plus(getMinerSubsystemGeneratorProductionPerSecond(state, key)),
    ZERO,
  )
}

export function getMinerSubsystemMultiplier(state: GameState): Decimal {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return ONE
  }

  const totalProduction = getMinerSubsystemTotalProductionPerSecond(state)
  if (totalProduction.lessThanOrEqualTo(0)) {
    return ONE
  }

  return totalProduction.plus(ONE).pow(MINER_SUBSYSTEM_MULTIPLIER_EXPONENT)
}

function applySubsystemTimeProgress(
  state: GameState,
  elapsedSeconds: number,
): SubsystemsState {
  const normalizedMinerSubsystem = getNormalizedMinerSubsystemState(state)
  if (elapsedSeconds <= 0 || !isSubsystemUnlocked(state, 'miners')) {
    return {
      ...state.subsystems,
      miners: normalizedMinerSubsystem,
    }
  }

  const oreGain = getMinerSubsystemTotalProductionPerSecond(state).times(elapsedSeconds)
  return {
    ...state.subsystems,
    miners: {
      ...normalizedMinerSubsystem,
      oreData: getMinerOreData(state).plus(oreGain).toString(),
      totalOreData: getMinerTotalOreData(state).plus(oreGain).toString(),
    },
  }
}

function getActionReadyMinerState(
  state: GameState,
  nowMs: number,
): GameState {
  const advancedState = nowMs > state.stats.lastTickAtMs ? tickGame(state, nowMs) : state
  const effectiveNowMs = Math.max(nowMs, advancedState.stats.lastTickAtMs)

  return {
    ...advancedState,
    stats: {
      ...advancedState.stats,
      lastTickAtMs: effectiveNowMs,
    },
    subsystems: {
      ...advancedState.subsystems,
      miners: getNormalizedMinerSubsystemState(advancedState),
    },
  }
}

export function buyMinerSubsystemGenerator(
  state: GameState,
  key: MinerSubsystemGeneratorKey,
  nowMs = Date.now(),
): GameState {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return state
  }

  const normalizedState = getActionReadyMinerState(state, nowMs)
  const cost = getMinerSubsystemGeneratorCost(normalizedState, key)
  const oreData = getMinerOreData(normalizedState)
  if (oreData.lessThan(cost)) {
    return state
  }

  return {
    ...normalizedState,
    subsystems: {
      ...normalizedState.subsystems,
      miners: {
        ...normalizedState.subsystems.miners,
        oreData: oreData.minus(cost).toString(),
        generators: {
          ...normalizedState.subsystems.miners.generators,
          [key]: normalizedState.subsystems.miners.generators[key] + normalizedState.buyAmount,
        },
      },
    },
  }
}

export function isMinerSubsystemUpgradeUnlocked(
  state: GameState,
  key: MinerSubsystemUpgradeKey,
): boolean {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return false
  }

  const upgrade = MINER_SUBSYSTEM_UPGRADE_DEFS[key]
  const subsystem = getNormalizedMinerSubsystemState(state)
  const meetsGeneratorRequirement =
    !upgrade.requiresOwned ||
    subsystem.generators[upgrade.requiresOwned.generator as MinerSubsystemGeneratorKey] >=
      upgrade.requiresOwned.count
  const meetsUpgradeRequirement =
    !upgrade.requiresUpgrade || subsystem.purchasedUpgrades[upgrade.requiresUpgrade]

  return meetsGeneratorRequirement && meetsUpgradeRequirement
}

export function getMinerSubsystemUpgradeUnlockProgress(
  state: GameState,
  key: MinerSubsystemUpgradeKey,
) {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return null
  }

  const upgrade = MINER_SUBSYSTEM_UPGRADE_DEFS[key]
  const subsystem = getNormalizedMinerSubsystemState(state)

  if (upgrade.requiresOwned) {
    const currentOwned = subsystem.generators[upgrade.requiresOwned.generator as MinerSubsystemGeneratorKey]
    if (currentOwned < upgrade.requiresOwned.count) {
      return {
        current: currentOwned,
        required: upgrade.requiresOwned.count,
        label: MINER_SUBSYSTEM_GENERATOR_DEFS[
          upgrade.requiresOwned.generator as MinerSubsystemGeneratorKey
        ].label,
      }
    }
  }

  if (upgrade.requiresUpgrade && !subsystem.purchasedUpgrades[upgrade.requiresUpgrade]) {
    return {
      current: 0,
      required: 1,
      label: MINER_SUBSYSTEM_UPGRADE_DEFS[upgrade.requiresUpgrade].label,
    }
  }

  return null
}

export function getMinerSubsystemUpgradeCost(
  _state: GameState,
  key: MinerSubsystemUpgradeKey,
): Decimal {
  return toDecimal(MINER_SUBSYSTEM_UPGRADE_DEFS[key].cost)
}

export function canBuyMinerSubsystemUpgrade(
  state: GameState,
  key: MinerSubsystemUpgradeKey,
): boolean {
  const subsystem = getNormalizedMinerSubsystemState(state)
  if (
    subsystem.purchasedUpgrades[key] ||
    !isMinerSubsystemUpgradeUnlocked(state, key)
  ) {
    return false
  }

  return getMinerOreData(state).greaterThanOrEqualTo(getMinerSubsystemUpgradeCost(state, key))
}

export function buyMinerSubsystemUpgrade(
  state: GameState,
  key: MinerSubsystemUpgradeKey,
  nowMs = Date.now(),
): GameState {
  if (!isSubsystemUnlocked(state, 'miners')) {
    return state
  }

  const normalizedState = getActionReadyMinerState(state, nowMs)
  if (!canBuyMinerSubsystemUpgrade(normalizedState, key)) {
    return state
  }

  const cost = getMinerSubsystemUpgradeCost(normalizedState, key)
  return {
    ...normalizedState,
    subsystems: {
      ...normalizedState.subsystems,
      miners: {
        ...normalizedState.subsystems.miners,
        oreData: getMinerOreData(normalizedState).minus(cost).toString(),
        purchasedUpgrades: {
          ...normalizedState.subsystems.miners.purchasedUpgrades,
          [key]: true,
        },
      },
    },
  }
}

export function getMinerSubsystemPurchasedUpgradeCount(state: GameState): number {
  return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce(
    (count, key) =>
      count + (getNormalizedMinerSubsystemState(state).purchasedUpgrades[key] ? 1 : 0),
    0,
  )
}

export function getPrestigeGainForReset(state: GameState): Decimal {
  const runTotalCredits = toDecimal(state.stats.totalCredits)
  if (runTotalCredits.lessThan(PRESTIGE_UNLOCK_CREDITS)) {
    return ZERO
  }

  const baseGain = runTotalCredits.div(PRESTIGE_UNLOCK_CREDITS).pow(PRESTIGE_GAIN_EXPONENT)
  const resetGainMultiplier = ONE.plus(
    PRESTIGE_RESET_GAIN_BONUS.times(Math.max(0, state.prestige.resets)),
  )
  return baseGain
    .times(resetGainMultiplier)
    .times(getPrestigeGainMultiplierFromPermanentUpgrades(state.prestige.permanentUpgrades))
    .floor()
}

export function canPrestige(state: GameState): boolean {
  return getPrestigeGainForReset(state).greaterThan(0)
}

export function getPrestigeMultiplier(state: GameState): Decimal {
  return getPrestigeMultiplierFromPermanentUpgrades(
    state.prestige.permanentUpgrades,
    state.prestige.resets,
  )
}

export function getPrestigeMultiplierFromPermanentUpgrades(
  permanentUpgrades: PermanentUpgradesState,
  resetCount = 0,
): Decimal {
  let multiplier = ONE.plus(PRESTIGE_RESET_PRODUCTION_BONUS.times(Math.max(0, resetCount)))

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

function getStartingCreditsFromPermanentUpgrades(
  permanentUpgrades: PermanentUpgradesState,
): Decimal {
  let startingCredits = ZERO

  for (const key of PERMANENT_UPGRADE_ORDER) {
    const upgrade = PERMANENT_UPGRADE_DEFS[key]
    if (upgrade.effectType !== 'startingCredits') {
      continue
    }

    const level = Math.max(0, Math.floor(permanentUpgrades[key] ?? 0))
    if (level <= 0) {
      continue
    }

    startingCredits = startingCredits.plus(toDecimal(upgrade.value).times(level))
  }

  return startingCredits
}

function getUpgradeRequirementMultiplierFromPermanentUpgrades(
  permanentUpgrades: PermanentUpgradesState,
): Decimal {
  let requirementMultiplier = ONE

  for (const key of PERMANENT_UPGRADE_ORDER) {
    const upgrade = PERMANENT_UPGRADE_DEFS[key]
    if (upgrade.effectType !== 'upgradeRequirementDiscount') {
      continue
    }

    const level = Math.max(0, Math.floor(permanentUpgrades[key] ?? 0))
    if (level <= 0) {
      continue
    }

    requirementMultiplier = requirementMultiplier.times(toDecimal(upgrade.value).pow(level))
  }

  return Decimal.max(new Decimal('0.4'), requirementMultiplier)
}

function getAdjustedUpgradeOwnedRequirement(
  state: GameState,
  count: number,
): number {
  if (count <= 1) {
    return 1
  }

  return Math.max(
    1,
    new Decimal(count)
      .times(getUpgradeRequirementMultiplierFromPermanentUpgrades(state.prestige.permanentUpgrades))
      .ceil()
      .toNumber(),
  )
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

export function getPermanentUpgradeBulkCost(
  permanentUpgrades: PermanentUpgradesState,
  key: PermanentUpgradeKey,
  amount: number,
): Decimal {
  const normalizedAmount = Math.max(1, Math.floor(amount))
  let totalCost = ZERO
  const draftUpgrades = { ...permanentUpgrades }

  for (let index = 0; index < normalizedAmount; index += 1) {
    const nextCost = getPermanentUpgradeCost(draftUpgrades, key)
    totalCost = totalCost.plus(nextCost)
    draftUpgrades[key] = Math.max(0, Math.floor(draftUpgrades[key] ?? 0)) + 1
  }

  return totalCost
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
    credits: getStartingCreditsFromPermanentUpgrades(normalizedPermanentUpgrades).toString(),
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

export function canBuyGenerator(
  state: GameState,
  key: GeneratorKey,
  amount = state.buyAmount,
): boolean {
  if (isGeneratorManagedBySubsystem(state, key)) {
    return false
  }

  return toDecimal(state.credits).greaterThanOrEqualTo(getGeneratorCost(state, key, amount))
}

function applyProducedCredits(
  state: GameState,
  produced: Decimal,
  nextLastTickAtMs: number,
  elapsedSeconds: number,
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
    subsystems: applySubsystemTimeProgress(state, elapsedSeconds),
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

  const subsystemMultiplier =
    generatorKey === 'miners' ? getMinerSubsystemMultiplier(state) : ONE

  return toDecimal(definition.baseProduction)
    .times(owned)
    .times(getGeneratorProductionMultiplier(state, generatorKey))
    .times(getGlobalProductionMultiplier(state))
    .times(getPrestigeMultiplier(state))
    .times(subsystemMultiplier)
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
  return applyProducedCredits(state, produced, effectiveNowMs, cappedSeconds)
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
  return applyProducedCredits(state, produced, nowMs, elapsedSeconds)
}

export function buyGenerator(state: GameState, key: GeneratorKey): GameState {
  if (!canBuyGenerator(state, key)) {
    return state
  }

  const cost = getGeneratorCost(state, key, state.buyAmount)
  const credits = toDecimal(state.credits)

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
    state.generators[upgrade.requiresOwned.generator] >=
      getAdjustedUpgradeOwnedRequirement(
        state,
        upgrade.requiresOwned.count,
      )
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
    const requiredOwned = getAdjustedUpgradeOwnedRequirement(
      state,
      upgrade.requiresOwned.count,
    )
    if (currentOwned < requiredOwned) {
      return {
        current: currentOwned,
        required: requiredOwned,
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
