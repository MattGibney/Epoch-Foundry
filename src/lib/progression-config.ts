import Decimal from 'decimal.js'

export type GeneratorConfigEntry = {
  key: string
  label: string
  description: string
  baseCost: string
  growth: string
  baseProduction: string
}

export const SUBSYSTEM_KEYS = ['miners'] as const

export type SubsystemKey = (typeof SUBSYSTEM_KEYS)[number]

export type UpgradeConfigEntry = {
  key: string
  label: string
  description: string
  cost: string
  effectType: 'generator' | 'global' | 'offlineCap' | 'subsystemUnlock'
  target?: string
  subsystem?: SubsystemKey
  multiplier?: string
  offlineCapSeconds?: number
  requiresOwned?: {
    generator: string
    count: number
  }
  requiresUpgrade?: string
}

export type AchievementRequirement =
  | { type: 'allResetCredits'; threshold: string }
  | { type: 'runCredits'; threshold: string }
  | { type: 'owned'; generator: string; count: number }
  | { type: 'ascensions'; count: number }
  | { type: 'legacyLevel'; threshold: string }
  | { type: 'legacyUpgradeCount'; count: number }
  | { type: 'legacyBranchComplete'; branch: LegacyUpgradeBranch }
  | { type: 'purchasedUpgrades'; count: number }
  | { type: 'offlineCapSeconds'; seconds: number }

export type AchievementConfigEntry = {
  key: string
  label: string
  description: string
  requirement: AchievementRequirement
}

export const LEGACY_UPGRADE_BRANCHES = ['foundry', 'calibration', 'archives'] as const

export type LegacyUpgradeBranch = (typeof LEGACY_UPGRADE_BRANCHES)[number]

export type LegacyUpgradeConfigEntry = {
  key: string
  label: string
  description: string
  branch: LegacyUpgradeBranch
  cost: string
  requiresLegacyUpgrade?: string
  effectType:
    | 'productionMultiplier'
    | 'generatorCostDiscount'
    | 'runUpgradeCostDiscount'
    | 'ascensionGainMultiplier'
    | 'startingCredits'
    | 'offlineCap'
  value?: string
  offlineCapSeconds?: number
}

export type MinerSubsystemMilestoneConfigEntry = {
  surveyedCount: number
  label: string
  description: string
  shaftCapacityBonus?: number
  productionMultiplier?: string
}

export type MinerSubsystemGeneratorConfigEntry = {
  key: string
  label: string
  description: string
  baseCost: string
  growth: string
  baseProduction: string
}

export type MinerSubsystemUpgradeConfigEntry = {
  key: string
  label: string
  description: string
  cost: string
  effectType: 'generator' | 'global'
  target?: string
  multiplier: string
  requiresOwned?: {
    generator: string
    count: number
  }
  requiresUpgrade?: string
}

export const ASCENSION_BALANCE = {
  shardDivisor: '5000000',
  passiveProductionPerLegacyLevel: '0.01',
} as const

const COOKIE_MAIN_GENERATOR_GROWTH: Record<string, string> = {
  miners: '1.15',
  drills: '1.15',
  extractors: '1.15',
  refineries: '1.15',
  megaRigs: '1.15',
  orbitalPlatforms: '1.15',
  stellarForges: '1.15',
  dysonArrays: '1.15',
  singularityWells: '1.15',
  continuumEngines: '1.155',
  voidLathes: '1.16',
  entropyReactors: '1.165',
  quantumFoundries: '1.17',
  darkMatterSmelters: '1.175',
  realityKilns: '1.18',
  fractalAssemblers: '1.185',
  causalLooms: '1.19',
  epochMonoliths: '1.195',
  omniversalFoundries: '1.2',
  genesisForges: '1.205',
}

const COOKIE_SUBSYSTEM_GENERATOR_GROWTH: Record<string, string> = {
  scouts: '1.15',
  surveyCamps: '1.15',
  testShafts: '1.15',
  freightTeams: '1.15',
  geologyLabs: '1.15',
  commandCenters: '1.155',
  boreGuilds: '1.16',
  oreArchives: '1.165',
  seismicArrays: '1.17',
  excavationDirectorates: '1.175',
}

const COOKIE_PHASE_ONE_GENERATOR_KEYS = [
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
] as const
const COOKIE_PHASE_ONE_GENERATOR_KEY_SET = new Set<string>(COOKIE_PHASE_ONE_GENERATOR_KEYS)

const COOKIE_PHASE_ONE_UPGRADE_THRESHOLDS = [1, 5, 25, 50, 100, 150] as const
const COOKIE_MIDGAME_UPGRADE_THRESHOLDS = [1, 5, 25, 50, 100] as const
const COOKIE_UPGRADE_MULTIPLIERS = ['2', '2', '2', '2', '2', '2'] as const
const COOKIE_UPGRADE_COST_FACTORS = ['10', '50', '500', '5000', '50000', '500000'] as const
const COOKIE_GLOBAL_UPGRADE_COSTS = [
  '200000',
  '4000000',
  '80000000',
  '1600000000',
  '32000000000',
  '640000000000',
] as const
const COOKIE_GLOBAL_UPGRADE_MULTIPLIERS = ['2', '2', '2', '2', '2', '2'] as const
const COOKIE_SUBSYSTEM_UPGRADE_THRESHOLDS = [1, 5, 25] as const
const COOKIE_SUBSYSTEM_UPGRADE_COST_FACTORS = ['10', '50', '500'] as const
const COOKIE_SUBSYSTEM_GLOBAL_UPGRADE_COSTS = [
  '5000',
  '250000',
  '12500000',
  '625000000',
  '31250000000',
  '1562500000000',
] as const
const COOKIE_CREDIT_LIFETIME_THRESHOLDS = [
  '1e6',
  '1e8',
  '1e10',
  '1e12',
  '1e15',
  '1e18',
  '1e22',
  '1e26',
  '1e31',
  '1e37',
  '1e44',
  '1e52',
  '1e61',
  '1e72',
  '1e84',
  '1e98',
  '1e114',
  '1e132',
  '1e153',
  '1e177',
] as const
const COOKIE_CREDIT_RUN_THRESHOLDS = [
  '1e6',
  '1e8',
  '1e10',
  '1e12',
  '1e15',
  '1e18',
  '1e22',
  '1e26',
  '1e31',
  '1e37',
  '1e44',
  '1e52',
  '1e61',
  '1e72',
  '1e84',
  '1e98',
] as const

function getCookieUpgradeThresholds(generatorKey: string, stageCount: number): readonly number[] {
  const thresholds = COOKIE_PHASE_ONE_GENERATOR_KEY_SET.has(generatorKey)
    ? COOKIE_PHASE_ONE_UPGRADE_THRESHOLDS
    : COOKIE_MIDGAME_UPGRADE_THRESHOLDS
  return thresholds.slice(0, stageCount)
}

function getMultiplierDescription(subject: string, multiplier: string): string {
  return multiplier === '2'
    ? `Double ${subject} production.`
    : `${subject} production x${multiplier}.`
}

function thresholdKeyFragment(threshold: string): string {
  return threshold.replace(/\./g, 'p').replace(/\+/g, '').replace(/-/g, 'm')
}

function applyGeneratorGrowthCurve<T extends { growth: string }>(
  config: Record<string, T>,
  growthByKey: Record<string, string>,
): void {
  for (const [key, growth] of Object.entries(growthByKey)) {
    if (config[key]) {
      config[key].growth = growth
    }
  }
}

function applyCookieMainUpgradeCurves(
  config: Record<string, UpgradeConfigEntry>,
  generators: Record<string, GeneratorConfigEntry>,
): void {
  const generatorUpgradeGroups = new Map<string, string[]>()
  const globalUpgradeKeys: string[] = []

  for (const entry of Object.values(config)) {
    if (entry.effectType === 'generator' && entry.target) {
      const keys = generatorUpgradeGroups.get(entry.target) ?? []
      keys.push(entry.key)
      generatorUpgradeGroups.set(entry.target, keys)
      continue
    }

    if (entry.effectType === 'global') {
      globalUpgradeKeys.push(entry.key)
    }
  }

  for (const [generatorKey, keys] of generatorUpgradeGroups.entries()) {
    const thresholds = getCookieUpgradeThresholds(generatorKey, keys.length)
    const generator = generators[generatorKey]
    for (const [index, key] of keys.entries()) {
      const entry = config[key]
      const multiplier = COOKIE_UPGRADE_MULTIPLIERS[index]
      entry.cost = new Decimal(generator.baseCost)
        .times(COOKIE_UPGRADE_COST_FACTORS[index])
        .ceil()
        .toString()
      entry.multiplier = multiplier
      entry.description = getMultiplierDescription(generator.label, multiplier)
      entry.requiresOwned = {
        generator: generatorKey,
        count: thresholds[index] ?? thresholds[thresholds.length - 1],
      }
    }
  }

  globalUpgradeKeys.forEach((key, index) => {
    const entry = config[key]
    const multiplier =
      COOKIE_GLOBAL_UPGRADE_MULTIPLIERS[index] ??
      COOKIE_GLOBAL_UPGRADE_MULTIPLIERS[COOKIE_GLOBAL_UPGRADE_MULTIPLIERS.length - 1]
    entry.cost =
      COOKIE_GLOBAL_UPGRADE_COSTS[index] ??
      COOKIE_GLOBAL_UPGRADE_COSTS[COOKIE_GLOBAL_UPGRADE_COSTS.length - 1]
    entry.multiplier = multiplier
    entry.description = getMultiplierDescription('all', multiplier)
  })
}

function applyCookieSubsystemUpgradeCurves(
  config: Record<string, MinerSubsystemUpgradeConfigEntry>,
  generators: Record<string, MinerSubsystemGeneratorConfigEntry>,
): void {
  const generatorUpgradeGroups = new Map<string, string[]>()
  const globalUpgradeKeys: string[] = []

  for (const entry of Object.values(config)) {
    if (entry.effectType === 'generator' && entry.target) {
      const keys = generatorUpgradeGroups.get(entry.target) ?? []
      keys.push(entry.key)
      generatorUpgradeGroups.set(entry.target, keys)
      continue
    }

    if (entry.effectType === 'global') {
      globalUpgradeKeys.push(entry.key)
    }
  }

  for (const [generatorKey, keys] of generatorUpgradeGroups.entries()) {
    const generator = generators[generatorKey]
    for (const [index, key] of keys.entries()) {
      const entry = config[key]
      const multiplier = COOKIE_UPGRADE_MULTIPLIERS[index]
      entry.cost = new Decimal(generator.baseCost)
        .times(COOKIE_SUBSYSTEM_UPGRADE_COST_FACTORS[index])
        .ceil()
        .toString()
      entry.multiplier = multiplier
      entry.description = getMultiplierDescription(generator.label, multiplier)
      entry.requiresOwned = {
        generator: generatorKey,
        count:
          COOKIE_SUBSYSTEM_UPGRADE_THRESHOLDS[index] ??
          COOKIE_SUBSYSTEM_UPGRADE_THRESHOLDS[COOKIE_SUBSYSTEM_UPGRADE_THRESHOLDS.length - 1],
      }
    }
  }

  globalUpgradeKeys.forEach((key, index) => {
    const entry = config[key]
    entry.cost =
      COOKIE_SUBSYSTEM_GLOBAL_UPGRADE_COSTS[index] ??
      COOKIE_SUBSYSTEM_GLOBAL_UPGRADE_COSTS[COOKIE_SUBSYSTEM_GLOBAL_UPGRADE_COSTS.length - 1]
    entry.multiplier = '2'
    entry.description = 'Double all Mining Network production.'
  })
}

export const MINER_SUBSYSTEM_CONFIG = {
  label: 'Mining Network',
  description:
    'Run a parallel mining support economy that generates Ore Data and feeds a multiplier back into Miners.',
  currencyLabel: 'Ore Data',
  unlockUpgrade: 'minerConstellation',
  multiplierExponent: '0.14',
} as const

export const MINER_SUBSYSTEM_UPGRADE_CONFIG: Record<
  string,
  MinerSubsystemUpgradeConfigEntry
> = {
  scoutTraining: {
    key: 'scoutTraining',
    label: 'Scout Training',
    description: 'Double Scout output.',
    cost: '80',
    effectType: 'generator',
    target: 'scouts',
    multiplier: '2',
    requiresOwned: { generator: 'scouts', count: 10 },
  },
  scoutRelays: {
    key: 'scoutRelays',
    label: 'Scout Relays',
    description: 'Double Scout output.',
    cost: '450',
    effectType: 'generator',
    target: 'scouts',
    multiplier: '2',
    requiresOwned: { generator: 'scouts', count: 25 },
    requiresUpgrade: 'scoutTraining',
  },
  scoutNetwork: {
    key: 'scoutNetwork',
    label: 'Scout Network',
    description: 'Quadruple Scout output.',
    cost: '3200',
    effectType: 'generator',
    target: 'scouts',
    multiplier: '4',
    requiresOwned: { generator: 'scouts', count: 50 },
    requiresUpgrade: 'scoutRelays',
  },
  campPlanning: {
    key: 'campPlanning',
    label: 'Camp Planning',
    description: 'Double Survey Camp output.',
    cost: '650',
    effectType: 'generator',
    target: 'surveyCamps',
    multiplier: '2',
    requiresOwned: { generator: 'surveyCamps', count: 10 },
  },
  campRouting: {
    key: 'campRouting',
    label: 'Camp Routing',
    description: 'Double Survey Camp output.',
    cost: '3600',
    effectType: 'generator',
    target: 'surveyCamps',
    multiplier: '2',
    requiresOwned: { generator: 'surveyCamps', count: 25 },
    requiresUpgrade: 'campPlanning',
  },
  campAtlas: {
    key: 'campAtlas',
    label: 'Camp Atlas',
    description: 'Quadruple Survey Camp output.',
    cost: '26000',
    effectType: 'generator',
    target: 'surveyCamps',
    multiplier: '4',
    requiresOwned: { generator: 'surveyCamps', count: 50 },
    requiresUpgrade: 'campRouting',
  },
  shaftCalibration: {
    key: 'shaftCalibration',
    label: 'Shaft Calibration',
    description: 'Double Test Shaft output.',
    cost: '5000',
    effectType: 'generator',
    target: 'testShafts',
    multiplier: '2',
    requiresOwned: { generator: 'testShafts', count: 10 },
  },
  shaftServos: {
    key: 'shaftServos',
    label: 'Shaft Servos',
    description: 'Double Test Shaft output.',
    cost: '28000',
    effectType: 'generator',
    target: 'testShafts',
    multiplier: '2',
    requiresOwned: { generator: 'testShafts', count: 25 },
    requiresUpgrade: 'shaftCalibration',
  },
  shaftDominion: {
    key: 'shaftDominion',
    label: 'Shaft Dominion',
    description: 'Quadruple Test Shaft output.',
    cost: '200000',
    effectType: 'generator',
    target: 'testShafts',
    multiplier: '4',
    requiresOwned: { generator: 'testShafts', count: 50 },
    requiresUpgrade: 'shaftServos',
  },
  freightDispatch: {
    key: 'freightDispatch',
    label: 'Freight Dispatch',
    description: 'Double Freight Team output.',
    cost: '38000',
    effectType: 'generator',
    target: 'freightTeams',
    multiplier: '2',
    requiresOwned: { generator: 'freightTeams', count: 10 },
  },
  freightConvoys: {
    key: 'freightConvoys',
    label: 'Freight Convoys',
    description: 'Double Freight Team output.',
    cost: '220000',
    effectType: 'generator',
    target: 'freightTeams',
    multiplier: '2',
    requiresOwned: { generator: 'freightTeams', count: 25 },
    requiresUpgrade: 'freightDispatch',
  },
  freightLattice: {
    key: 'freightLattice',
    label: 'Freight Lattice',
    description: 'Quadruple Freight Team output.',
    cost: '1600000',
    effectType: 'generator',
    target: 'freightTeams',
    multiplier: '4',
    requiresOwned: { generator: 'freightTeams', count: 50 },
    requiresUpgrade: 'freightConvoys',
  },
  labModeling: {
    key: 'labModeling',
    label: 'Lab Modeling',
    description: 'Double Geology Lab output.',
    cost: '250000',
    effectType: 'generator',
    target: 'geologyLabs',
    multiplier: '2',
    requiresOwned: { generator: 'geologyLabs', count: 10 },
  },
  labForecasting: {
    key: 'labForecasting',
    label: 'Lab Forecasting',
    description: 'Double Geology Lab output.',
    cost: '1400000',
    effectType: 'generator',
    target: 'geologyLabs',
    multiplier: '2',
    requiresOwned: { generator: 'geologyLabs', count: 25 },
    requiresUpgrade: 'labModeling',
  },
  labSynthesis: {
    key: 'labSynthesis',
    label: 'Lab Synthesis',
    description: 'Quadruple Geology Lab output.',
    cost: '9800000',
    effectType: 'generator',
    target: 'geologyLabs',
    multiplier: '4',
    requiresOwned: { generator: 'geologyLabs', count: 50 },
    requiresUpgrade: 'labForecasting',
  },
  commandPlanning: {
    key: 'commandPlanning',
    label: 'Command Planning',
    description: 'Double Command Center output.',
    cost: '1800000',
    effectType: 'generator',
    target: 'commandCenters',
    multiplier: '2',
    requiresOwned: { generator: 'commandCenters', count: 10 },
  },
  commandAutomation: {
    key: 'commandAutomation',
    label: 'Command Automation',
    description: 'Double Command Center output.',
    cost: '10000000',
    effectType: 'generator',
    target: 'commandCenters',
    multiplier: '2',
    requiresOwned: { generator: 'commandCenters', count: 25 },
    requiresUpgrade: 'commandPlanning',
  },
  commandSingularity: {
    key: 'commandSingularity',
    label: 'Command Singularity',
    description: 'Quadruple Command Center output.',
    cost: '72000000',
    effectType: 'generator',
    target: 'commandCenters',
    multiplier: '4',
    requiresOwned: { generator: 'commandCenters', count: 50 },
    requiresUpgrade: 'commandAutomation',
  },
  boreLogistics: {
    key: 'boreLogistics',
    label: 'Bore Logistics',
    description: 'Double Bore Guild output.',
    cost: '18000000',
    effectType: 'generator',
    target: 'boreGuilds',
    multiplier: '2',
    requiresOwned: { generator: 'boreGuilds', count: 10 },
  },
  boreMatrices: {
    key: 'boreMatrices',
    label: 'Bore Matrices',
    description: 'Double Bore Guild output.',
    cost: '100000000',
    effectType: 'generator',
    target: 'boreGuilds',
    multiplier: '2',
    requiresOwned: { generator: 'boreGuilds', count: 25 },
    requiresUpgrade: 'boreLogistics',
  },
  boreFrontiers: {
    key: 'boreFrontiers',
    label: 'Bore Frontiers',
    description: 'Quadruple Bore Guild output.',
    cost: '720000000',
    effectType: 'generator',
    target: 'boreGuilds',
    multiplier: '4',
    requiresOwned: { generator: 'boreGuilds', count: 50 },
    requiresUpgrade: 'boreMatrices',
  },
  archiveCatalogs: {
    key: 'archiveCatalogs',
    label: 'Archive Catalogs',
    description: 'Double Ore Archive output.',
    cost: '160000000',
    effectType: 'generator',
    target: 'oreArchives',
    multiplier: '2',
    requiresOwned: { generator: 'oreArchives', count: 10 },
  },
  archiveForecasting: {
    key: 'archiveForecasting',
    label: 'Archive Forecasting',
    description: 'Double Ore Archive output.',
    cost: '900000000',
    effectType: 'generator',
    target: 'oreArchives',
    multiplier: '2',
    requiresOwned: { generator: 'oreArchives', count: 25 },
    requiresUpgrade: 'archiveCatalogs',
  },
  archiveContinuum: {
    key: 'archiveContinuum',
    label: 'Archive Continuum',
    description: 'Quadruple Ore Archive output.',
    cost: '6500000000',
    effectType: 'generator',
    target: 'oreArchives',
    multiplier: '4',
    requiresOwned: { generator: 'oreArchives', count: 50 },
    requiresUpgrade: 'archiveForecasting',
  },
  seismicTuning: {
    key: 'seismicTuning',
    label: 'Seismic Tuning',
    description: 'Double Seismic Array output.',
    cost: '1600000000',
    effectType: 'generator',
    target: 'seismicArrays',
    multiplier: '2',
    requiresOwned: { generator: 'seismicArrays', count: 10 },
  },
  seismicResonance: {
    key: 'seismicResonance',
    label: 'Seismic Resonance',
    description: 'Double Seismic Array output.',
    cost: '9000000000',
    effectType: 'generator',
    target: 'seismicArrays',
    multiplier: '2',
    requiresOwned: { generator: 'seismicArrays', count: 25 },
    requiresUpgrade: 'seismicTuning',
  },
  seismicPanopticon: {
    key: 'seismicPanopticon',
    label: 'Seismic Panopticon',
    description: 'Quadruple Seismic Array output.',
    cost: '65000000000',
    effectType: 'generator',
    target: 'seismicArrays',
    multiplier: '4',
    requiresOwned: { generator: 'seismicArrays', count: 50 },
    requiresUpgrade: 'seismicResonance',
  },
  directorateProtocols: {
    key: 'directorateProtocols',
    label: 'Directorate Protocols',
    description: 'Double Excavation Directorate output.',
    cost: '18000000000',
    effectType: 'generator',
    target: 'excavationDirectorates',
    multiplier: '2',
    requiresOwned: { generator: 'excavationDirectorates', count: 10 },
  },
  directorateForecasting: {
    key: 'directorateForecasting',
    label: 'Directorate Forecasting',
    description: 'Double Excavation Directorate output.',
    cost: '100000000000',
    effectType: 'generator',
    target: 'excavationDirectorates',
    multiplier: '2',
    requiresOwned: { generator: 'excavationDirectorates', count: 25 },
    requiresUpgrade: 'directorateProtocols',
  },
  directorateSummit: {
    key: 'directorateSummit',
    label: 'Directorate Summit',
    description: 'Quadruple Excavation Directorate output.',
    cost: '720000000000',
    effectType: 'generator',
    target: 'excavationDirectorates',
    multiplier: '4',
    requiresOwned: { generator: 'excavationDirectorates', count: 50 },
    requiresUpgrade: 'directorateForecasting',
  },
  fieldProtocols: {
    key: 'fieldProtocols',
    label: 'Field Protocols',
    description: 'Double all Mining Network production.',
    cost: '12000',
    effectType: 'global',
    multiplier: '2',
    requiresOwned: { generator: 'scouts', count: 50 },
  },
  networkFusion: {
    key: 'networkFusion',
    label: 'Network Fusion',
    description: 'Double all Mining Network production.',
    cost: '750000',
    effectType: 'global',
    multiplier: '2',
    requiresOwned: { generator: 'freightTeams', count: 25 },
    requiresUpgrade: 'fieldProtocols',
  },
  oreAlgorithms: {
    key: 'oreAlgorithms',
    label: 'Ore Algorithms',
    description: 'Triple all Mining Network production.',
    cost: '45000000',
    effectType: 'global',
    multiplier: '3',
    requiresOwned: { generator: 'commandCenters', count: 10 },
    requiresUpgrade: 'networkFusion',
  },
  strataSimulations: {
    key: 'strataSimulations',
    label: 'Strata Simulations',
    description: 'Double all Mining Network production.',
    cost: '2500000000',
    effectType: 'global',
    multiplier: '2',
    requiresOwned: { generator: 'boreGuilds', count: 25 },
    requiresUpgrade: 'oreAlgorithms',
  },
  basinForecasts: {
    key: 'basinForecasts',
    label: 'Basin Forecasts',
    description: 'Double all Mining Network production.',
    cost: '180000000000',
    effectType: 'global',
    multiplier: '2',
    requiresOwned: { generator: 'seismicArrays', count: 10 },
    requiresUpgrade: 'strataSimulations',
  },
  mantleConsensus: {
    key: 'mantleConsensus',
    label: 'Mantle Consensus',
    description: 'Triple all Mining Network production.',
    cost: '12000000000000',
    effectType: 'global',
    multiplier: '3',
    requiresOwned: { generator: 'excavationDirectorates', count: 5 },
    requiresUpgrade: 'basinForecasts',
  },
}

export const MINER_SUBSYSTEM_GENERATOR_CONFIG: Record<
  string,
  MinerSubsystemGeneratorConfigEntry
> = {
  scouts: {
    key: 'scouts',
    label: 'Scouts',
    description: 'Field crews collecting the first layers of ore intelligence.',
    baseCost: '10',
    growth: '1.15',
    baseProduction: '1',
  },
  surveyCamps: {
    key: 'surveyCamps',
    label: 'Survey Camps',
    description: 'Forward bases that standardize and expand exploration output.',
    baseCost: '80',
    growth: '1.16',
    baseProduction: '6',
  },
  testShafts: {
    key: 'testShafts',
    label: 'Test Shafts',
    description: 'Small pilot digs that rapidly convert finds into actionable data.',
    baseCost: '650',
    growth: '1.17',
    baseProduction: '35',
  },
  freightTeams: {
    key: 'freightTeams',
    label: 'Freight Teams',
    description: 'Logistics crews moving samples and reports between sites.',
    baseCost: '5200',
    growth: '1.18',
    baseProduction: '190',
  },
  geologyLabs: {
    key: 'geologyLabs',
    label: 'Geology Labs',
    description: 'Analytical centers that turn raw samples into predictive models.',
    baseCost: '42000',
    growth: '1.19',
    baseProduction: '1050',
  },
  commandCenters: {
    key: 'commandCenters',
    label: 'Command Centers',
    description: 'Strategic headquarters coordinating the full mining network.',
    baseCost: '360000',
    growth: '1.2',
    baseProduction: '6200',
  },
  boreGuilds: {
    key: 'boreGuilds',
    label: 'Bore Guilds',
    description: 'Deep-drill crews opening reliable new ore corridors.',
    baseCost: '3200000',
    growth: '1.205',
    baseProduction: '36000',
  },
  oreArchives: {
    key: 'oreArchives',
    label: 'Ore Archives',
    description: 'Central repositories that turn every sample into reusable insight.',
    baseCost: '30000000',
    growth: '1.21',
    baseProduction: '210000',
  },
  seismicArrays: {
    key: 'seismicArrays',
    label: 'Seismic Arrays',
    description: 'Sensor grids mapping whole regions before excavation begins.',
    baseCost: '300000000',
    growth: '1.215',
    baseProduction: '1250000',
  },
  excavationDirectorates: {
    key: 'excavationDirectorates',
    label: 'Excavation Directorates',
    description: 'Continental-scale command layers steering the entire mining network.',
    baseCost: '3200000000',
    growth: '1.22',
    baseProduction: '7500000',
  },
}

applyGeneratorGrowthCurve(MINER_SUBSYSTEM_GENERATOR_CONFIG, COOKIE_SUBSYSTEM_GENERATOR_GROWTH)
applyCookieSubsystemUpgradeCurves(
  MINER_SUBSYSTEM_UPGRADE_CONFIG,
  MINER_SUBSYSTEM_GENERATOR_CONFIG,
)

export const UPGRADE_COST_MULTIPLIER_BY_TYPE = {
  generator: '1',
  global: '1',
  offlineCap: '1',
  subsystemUnlock: '1',
} as const

export const GENERATOR_CONFIG: Record<string, GeneratorConfigEntry> = {
  miners: {
    key: 'miners',
    label: 'Miners',
    description: 'Basic credit extraction units.',
    baseCost: '15',
    growth: '1.145',
    baseProduction: '1.25',
  },
  drills: {
    key: 'drills',
    label: 'Drills',
    description: 'Higher-throughput mining rigs.',
    baseCost: '95',
    growth: '1.15',
    baseProduction: '7.5',
  },
  extractors: {
    key: 'extractors',
    label: 'Extractors',
    description: 'Industrial extraction platforms.',
    baseCost: '650',
    growth: '1.155',
    baseProduction: '40',
  },
  refineries: {
    key: 'refineries',
    label: 'Refineries',
    description: 'Process raw yield into premium credits.',
    baseCost: '4800',
    growth: '1.16',
    baseProduction: '220',
  },
  megaRigs: {
    key: 'megaRigs',
    label: 'Mega Rigs',
    description: 'Heavy automated credit complexes.',
    baseCost: '42000',
    growth: '1.165',
    baseProduction: '1250',
  },
  orbitalPlatforms: {
    key: 'orbitalPlatforms',
    label: 'Orbital Platforms',
    description: 'Massive orbital credit harvesters.',
    baseCost: '380000',
    growth: '1.17',
    baseProduction: '7200',
  },
  stellarForges: {
    key: 'stellarForges',
    label: 'Stellar Forges',
    description: 'Star-fed foundries for massive credit throughput.',
    baseCost: '4200000',
    growth: '1.175',
    baseProduction: '38000',
  },
  dysonArrays: {
    key: 'dysonArrays',
    label: 'Dyson Arrays',
    description: 'System-scale collectors that flood the ledger.',
    baseCost: '52000000',
    growth: '1.18',
    baseProduction: '200000',
  },
  singularityWells: {
    key: 'singularityWells',
    label: 'Singularity Wells',
    description: 'Gravity-compressed extraction beyond conventional limits.',
    baseCost: '750000000',
    growth: '1.185',
    baseProduction: '1100000',
  },
  continuumEngines: {
    key: 'continuumEngines',
    label: 'Continuum Engines',
    description: 'Temporal-scale engines for extreme credit acceleration.',
    baseCost: '190000000000',
    growth: '1.25',
    baseProduction: '8500000',
  },
  voidLathes: {
    key: 'voidLathes',
    label: 'Void Lathes',
    description: 'Abyssal machining arrays that carve value from empty space.',
    baseCost: '3100000000000',
    growth: '1.255',
    baseProduction: '52000000',
  },
  entropyReactors: {
    key: 'entropyReactors',
    label: 'Entropy Reactors',
    description: 'Controlled decay cores that transmute disorder into credits.',
    baseCost: '52000000000000',
    growth: '1.26',
    baseProduction: '310000000',
  },
  quantumFoundries: {
    key: 'quantumFoundries',
    label: 'Quantum Foundries',
    description: 'Superposition forges producing parallel credit streams.',
    baseCost: '900000000000000',
    growth: '1.265',
    baseProduction: '1900000000',
  },
  darkMatterSmelters: {
    key: 'darkMatterSmelters',
    label: 'Dark Matter Smelters',
    description: 'Exotic furnaces that refine invisible mass into ledgers.',
    baseCost: '16000000000000000',
    growth: '1.27',
    baseProduction: '12000000000',
  },
  realityKilns: {
    key: 'realityKilns',
    label: 'Reality Kilns',
    description: 'Reality-bending kilns that bake fresh economic constants.',
    baseCost: '290000000000000000',
    growth: '1.275',
    baseProduction: '76000000000',
  },
  fractalAssemblers: {
    key: 'fractalAssemblers',
    label: 'Fractal Assemblers',
    description: 'Self-repeating assembly lines compounding output forever.',
    baseCost: '5400000000000000000',
    growth: '1.28',
    baseProduction: '470000000000',
  },
  causalLooms: {
    key: 'causalLooms',
    label: 'Causal Looms',
    description: 'Temporal looms weaving profitable timelines together.',
    baseCost: '100000000000000000000',
    growth: '1.285',
    baseProduction: '3000000000000',
  },
  epochMonoliths: {
    key: 'epochMonoliths',
    label: 'Epoch Monoliths',
    description: 'Civilization-scale obelisks imprinting value across eras.',
    baseCost: '1900000000000000000000',
    growth: '1.29',
    baseProduction: '19000000000000',
  },
  omniversalFoundries: {
    key: 'omniversalFoundries',
    label: 'Omniversal Foundries',
    description: 'Foundries linked across universes for synchronized extraction.',
    baseCost: '36000000000000000000000',
    growth: '1.295',
    baseProduction: '120000000000000',
  },
  genesisForges: {
    key: 'genesisForges',
    label: 'Genesis Forges',
    description: 'Prime forges igniting entirely new credit-bearing realities.',
    baseCost: '700000000000000000000000',
    growth: '1.3',
    baseProduction: '750000000000000',
  },
}

applyGeneratorGrowthCurve(GENERATOR_CONFIG, COOKIE_MAIN_GENERATOR_GROWTH)

export const LEGACY_UPGRADE_CONFIG: Record<string, LegacyUpgradeConfigEntry> = {
  foundryAwakening: {
    key: 'foundryAwakening',
    label: 'Foundry Awakening',
    description: 'Increase all production by 25%.',
    branch: 'foundry',
    cost: '1',
    effectType: 'productionMultiplier',
    value: '1.25',
  },
  foundryRefraction: {
    key: 'foundryRefraction',
    label: 'Foundry Refraction',
    description: 'Increase all production by 50%.',
    branch: 'foundry',
    cost: '5',
    requiresLegacyUpgrade: 'foundryAwakening',
    effectType: 'productionMultiplier',
    value: '1.5',
  },
  foundryResonance: {
    key: 'foundryResonance',
    label: 'Foundry Resonance',
    description: 'Double all production.',
    branch: 'foundry',
    cost: '25',
    requiresLegacyUpgrade: 'foundryRefraction',
    effectType: 'productionMultiplier',
    value: '2',
  },
  foundryCrowning: {
    key: 'foundryCrowning',
    label: 'Foundry Crowning',
    description: 'Increase all production by 150%.',
    branch: 'foundry',
    cost: '125',
    requiresLegacyUpgrade: 'foundryResonance',
    effectType: 'productionMultiplier',
    value: '2.5',
  },
  bootstrapKindling: {
    key: 'bootstrapKindling',
    label: 'Bootstrap Kindling',
    description: 'Start each run with 10,000 credits.',
    branch: 'foundry',
    cost: '2',
    effectType: 'startingCredits',
    value: '10000',
  },
  bootstrapCache: {
    key: 'bootstrapCache',
    label: 'Bootstrap Cache',
    description: 'Start each run with 1,000,000 credits.',
    branch: 'foundry',
    cost: '10',
    requiresLegacyUpgrade: 'bootstrapKindling',
    effectType: 'startingCredits',
    value: '1000000',
  },
  bootstrapVault: {
    key: 'bootstrapVault',
    label: 'Bootstrap Vault',
    description: 'Start each run with 100,000,000 credits.',
    branch: 'foundry',
    cost: '50',
    requiresLegacyUpgrade: 'bootstrapCache',
    effectType: 'startingCredits',
    value: '100000000',
  },
  quantumLattice: {
    key: 'quantumLattice',
    label: 'Quantum Lattice',
    description: 'Reduce generator costs by 2%.',
    branch: 'calibration',
    cost: '3',
    effectType: 'generatorCostDiscount',
    value: '0.98',
  },
  latticeCompression: {
    key: 'latticeCompression',
    label: 'Lattice Compression',
    description: 'Reduce generator costs by 5%.',
    branch: 'calibration',
    cost: '15',
    requiresLegacyUpgrade: 'quantumLattice',
    effectType: 'generatorCostDiscount',
    value: '0.95',
  },
  latticeSingularity: {
    key: 'latticeSingularity',
    label: 'Lattice Singularity',
    description: 'Reduce generator costs by 10%.',
    branch: 'calibration',
    cost: '75',
    requiresLegacyUpgrade: 'latticeCompression',
    effectType: 'generatorCostDiscount',
    value: '0.9',
  },
  calibrationMatrix: {
    key: 'calibrationMatrix',
    label: 'Calibration Matrix',
    description: 'Reduce run-upgrade costs by 2%.',
    branch: 'calibration',
    cost: '3',
    effectType: 'runUpgradeCostDiscount',
    value: '0.98',
  },
  matrixOverclock: {
    key: 'matrixOverclock',
    label: 'Matrix Overclock',
    description: 'Reduce run-upgrade costs by 5%.',
    branch: 'calibration',
    cost: '15',
    requiresLegacyUpgrade: 'calibrationMatrix',
    effectType: 'runUpgradeCostDiscount',
    value: '0.95',
  },
  matrixAxiom: {
    key: 'matrixAxiom',
    label: 'Matrix Axiom',
    description: 'Reduce run-upgrade costs by 10%.',
    branch: 'calibration',
    cost: '75',
    requiresLegacyUpgrade: 'matrixOverclock',
    effectType: 'runUpgradeCostDiscount',
    value: '0.9',
  },
  singularityCore: {
    key: 'singularityCore',
    label: 'Singularity Core',
    description: 'Increase Shard gain by 50%.',
    branch: 'archives',
    cost: '5',
    effectType: 'ascensionGainMultiplier',
    value: '1.5',
  },
  chronicleReservoirs: {
    key: 'chronicleReservoirs',
    label: 'Chronicle Reservoirs',
    description: 'Double Shard gain.',
    branch: 'archives',
    cost: '25',
    requiresLegacyUpgrade: 'singularityCore',
    effectType: 'ascensionGainMultiplier',
    value: '2',
  },
  archiveBatteries: {
    key: 'archiveBatteries',
    label: 'Archive Batteries',
    description: 'Increase offline progress cap by +1 hour.',
    branch: 'archives',
    cost: '2',
    effectType: 'offlineCap',
    offlineCapSeconds: 1 * 60 * 60,
  },
  temporalVaults: {
    key: 'temporalVaults',
    label: 'Temporal Vaults',
    description: 'Increase offline progress cap by +2 hours.',
    branch: 'archives',
    cost: '8',
    requiresLegacyUpgrade: 'archiveBatteries',
    effectType: 'offlineCap',
    offlineCapSeconds: 2 * 60 * 60,
  },
  deepArchive: {
    key: 'deepArchive',
    label: 'Deep Archive',
    description: 'Increase offline progress cap by +4 hours.',
    branch: 'archives',
    cost: '30',
    requiresLegacyUpgrade: 'temporalVaults',
    effectType: 'offlineCap',
    offlineCapSeconds: 4 * 60 * 60,
  },
  chronoReserves: {
    key: 'chronoReserves',
    label: 'Chrono Reserves',
    description: 'Increase offline progress cap by +8 hours.',
    branch: 'archives',
    cost: '120',
    requiresLegacyUpgrade: 'deepArchive',
    effectType: 'offlineCap',
    offlineCapSeconds: 8 * 60 * 60,
  },
}

export const UPGRADE_CONFIG: Record<string, UpgradeConfigEntry> = {
  minerTuning: { key: 'minerTuning', label: 'Miner Tuning', description: 'Double Miner output.', cost: '80', effectType: 'generator', target: 'miners', multiplier: '2', requiresOwned: { generator: 'miners', count: 10 } },
  minerCollectives: { key: 'minerCollectives', label: 'Miner Collectives', description: 'Double Miner output.', cost: '450', effectType: 'generator', target: 'miners', multiplier: '2', requiresOwned: { generator: 'miners', count: 25 }, requiresUpgrade: 'minerTuning' },
  minerSwarm: { key: 'minerSwarm', label: 'Miner Swarm Logic', description: 'Double Miner output.', cost: '2500', effectType: 'generator', target: 'miners', multiplier: '2', requiresOwned: { generator: 'miners', count: 50 }, requiresUpgrade: 'minerCollectives' },
  minerFoundries: { key: 'minerFoundries', label: 'Miner Foundries', description: 'Boost Miner output by x2.5.', cost: '15000', effectType: 'generator', target: 'miners', multiplier: '2.5', requiresOwned: { generator: 'miners', count: 100 }, requiresUpgrade: 'minerSwarm' },
  minerOvermind: { key: 'minerOvermind', label: 'Miner Overmind', description: 'Triple Miner output.', cost: '100000', effectType: 'generator', target: 'miners', multiplier: '3', requiresOwned: { generator: 'miners', count: 200 }, requiresUpgrade: 'minerFoundries' },
  minerConstellation: { key: 'minerConstellation', label: 'Miner Constellation', description: 'Quadruple Miner output.', cost: '650000', effectType: 'generator', target: 'miners', multiplier: '4', requiresOwned: { generator: 'miners', count: 350 }, requiresUpgrade: 'minerOvermind' },
  drillGrease: { key: 'drillGrease', label: 'Drill Grease', description: 'Double Drill output.', cost: '650', effectType: 'generator', target: 'drills', multiplier: '2', requiresOwned: { generator: 'drills', count: 10 } },
  drillAssemblies: { key: 'drillAssemblies', label: 'Drill Assemblies', description: 'Double Drill output.', cost: '3600', effectType: 'generator', target: 'drills', multiplier: '2', requiresOwned: { generator: 'drills', count: 25 }, requiresUpgrade: 'drillGrease' },
  drillAI: { key: 'drillAI', label: 'Drill AI Routing', description: 'Double Drill output.', cost: '20000', effectType: 'generator', target: 'drills', multiplier: '2', requiresOwned: { generator: 'drills', count: 50 }, requiresUpgrade: 'drillAssemblies' },
  drillHypercut: { key: 'drillHypercut', label: 'Drill Hypercut', description: 'Boost Drill output by x2.5.', cost: '125000', effectType: 'generator', target: 'drills', multiplier: '2.5', requiresOwned: { generator: 'drills', count: 100 }, requiresUpgrade: 'drillAI' },
  drillSingularity: { key: 'drillSingularity', label: 'Drill Singularity', description: 'Triple Drill output.', cost: '850000', effectType: 'generator', target: 'drills', multiplier: '3', requiresOwned: { generator: 'drills', count: 200 }, requiresUpgrade: 'drillHypercut' },
  drillEventide: { key: 'drillEventide', label: 'Drill Eventide', description: 'Quadruple Drill output.', cost: '6000000', effectType: 'generator', target: 'drills', multiplier: '4', requiresOwned: { generator: 'drills', count: 350 }, requiresUpgrade: 'drillSingularity' },
  extractorCooling: { key: 'extractorCooling', label: 'Extractor Cooling', description: 'Double Extractor output.', cost: '5000', effectType: 'generator', target: 'extractors', multiplier: '2', requiresOwned: { generator: 'extractors', count: 10 } },
  extractorLattices: { key: 'extractorLattices', label: 'Extractor Lattices', description: 'Double Extractor output.', cost: '32000', effectType: 'generator', target: 'extractors', multiplier: '2', requiresOwned: { generator: 'extractors', count: 25 }, requiresUpgrade: 'extractorCooling' },
  extractorClusters: { key: 'extractorClusters', label: 'Extractor Clusters', description: 'Double Extractor output.', cost: '190000', effectType: 'generator', target: 'extractors', multiplier: '2', requiresOwned: { generator: 'extractors', count: 50 }, requiresUpgrade: 'extractorLattices' },
  extractorMatrices: { key: 'extractorMatrices', label: 'Extractor Matrices', description: 'Boost Extractor output by x2.5.', cost: '1150000', effectType: 'generator', target: 'extractors', multiplier: '2.5', requiresOwned: { generator: 'extractors', count: 100 }, requiresUpgrade: 'extractorClusters' },
  extractorHypergrid: { key: 'extractorHypergrid', label: 'Extractor Hypergrid', description: 'Triple Extractor output.', cost: '7800000', effectType: 'generator', target: 'extractors', multiplier: '3', requiresOwned: { generator: 'extractors', count: 200 }, requiresUpgrade: 'extractorMatrices' },
  extractorApogee: { key: 'extractorApogee', label: 'Extractor Apogee', description: 'Quadruple Extractor output.', cost: '55000000', effectType: 'generator', target: 'extractors', multiplier: '4', requiresOwned: { generator: 'extractors', count: 350 }, requiresUpgrade: 'extractorHypergrid' },
  refineryCatalysts: { key: 'refineryCatalysts', label: 'Refinery Catalysts', description: 'Double Refinery output.', cost: '38000', effectType: 'generator', target: 'refineries', multiplier: '2', requiresOwned: { generator: 'refineries', count: 10 } },
  refineryDistillation: { key: 'refineryDistillation', label: 'Refinery Distillation', description: 'Double Refinery output.', cost: '240000', effectType: 'generator', target: 'refineries', multiplier: '2', requiresOwned: { generator: 'refineries', count: 25 }, requiresUpgrade: 'refineryCatalysts' },
  refineryOverdrive: { key: 'refineryOverdrive', label: 'Refinery Overdrive', description: 'Double Refinery output.', cost: '1450000', effectType: 'generator', target: 'refineries', multiplier: '2', requiresOwned: { generator: 'refineries', count: 50 }, requiresUpgrade: 'refineryDistillation' },
  refinerySingularities: { key: 'refinerySingularities', label: 'Refinery Singularities', description: 'Boost Refinery output by x2.5.', cost: '9000000', effectType: 'generator', target: 'refineries', multiplier: '2.5', requiresOwned: { generator: 'refineries', count: 100 }, requiresUpgrade: 'refineryOverdrive' },
  refineryTransmutation: { key: 'refineryTransmutation', label: 'Refinery Transmutation', description: 'Triple Refinery output.', cost: '62000000', effectType: 'generator', target: 'refineries', multiplier: '3', requiresOwned: { generator: 'refineries', count: 200 }, requiresUpgrade: 'refinerySingularities' },
  refineryPerpetuity: { key: 'refineryPerpetuity', label: 'Refinery Perpetuity', description: 'Quadruple Refinery output.', cost: '450000000', effectType: 'generator', target: 'refineries', multiplier: '4', requiresOwned: { generator: 'refineries', count: 350 }, requiresUpgrade: 'refineryTransmutation' },
  megaRigServos: { key: 'megaRigServos', label: 'Mega Rig Servos', description: 'Double Mega Rig output.', cost: '280000', effectType: 'generator', target: 'megaRigs', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 10 } },
  megaRigAssemblers: { key: 'megaRigAssemblers', label: 'Mega Rig Assemblers', description: 'Double Mega Rig output.', cost: '1800000', effectType: 'generator', target: 'megaRigs', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 25 }, requiresUpgrade: 'megaRigServos' },
  megaRigNanites: { key: 'megaRigNanites', label: 'Mega Rig Nanites', description: 'Double Mega Rig output.', cost: '11000000', effectType: 'generator', target: 'megaRigs', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 50 }, requiresUpgrade: 'megaRigAssemblers' },
  megaRigSentience: { key: 'megaRigSentience', label: 'Mega Rig Sentience', description: 'Boost Mega Rig output by x2.5.', cost: '72000000', effectType: 'generator', target: 'megaRigs', multiplier: '2.5', requiresOwned: { generator: 'megaRigs', count: 100 }, requiresUpgrade: 'megaRigNanites' },
  megaRigDominion: { key: 'megaRigDominion', label: 'Mega Rig Dominion', description: 'Triple Mega Rig output.', cost: '500000000', effectType: 'generator', target: 'megaRigs', multiplier: '3', requiresOwned: { generator: 'megaRigs', count: 200 }, requiresUpgrade: 'megaRigSentience' },
  megaRigAscendancy: { key: 'megaRigAscendancy', label: 'Mega Rig Ascendancy', description: 'Quadruple Mega Rig output.', cost: '3600000000', effectType: 'generator', target: 'megaRigs', multiplier: '4', requiresOwned: { generator: 'megaRigs', count: 350 }, requiresUpgrade: 'megaRigDominion' },
  orbitalDrones: { key: 'orbitalDrones', label: 'Orbital Drone Nets', description: 'Double Orbital Platform output.', cost: '2200000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '2', requiresOwned: { generator: 'orbitalPlatforms', count: 8 } },
  orbitalShipyards: { key: 'orbitalShipyards', label: 'Orbital Shipyards', description: 'Double Orbital Platform output.', cost: '14000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '2', requiresOwned: { generator: 'orbitalPlatforms', count: 20 }, requiresUpgrade: 'orbitalDrones' },
  orbitalCommand: { key: 'orbitalCommand', label: 'Orbital Command AI', description: 'Double Orbital Platform output.', cost: '90000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '2', requiresOwned: { generator: 'orbitalPlatforms', count: 40 }, requiresUpgrade: 'orbitalShipyards' },
  orbitalAnchors: { key: 'orbitalAnchors', label: 'Orbital Anchors', description: 'Boost Orbital Platform output by x2.5.', cost: '580000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '2.5', requiresOwned: { generator: 'orbitalPlatforms', count: 80 }, requiresUpgrade: 'orbitalCommand' },
  orbitalEmpyrean: { key: 'orbitalEmpyrean', label: 'Orbital Empyrean Grid', description: 'Triple Orbital Platform output.', cost: '4100000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '3', requiresOwned: { generator: 'orbitalPlatforms', count: 160 }, requiresUpgrade: 'orbitalAnchors' },
  orbitalAureate: { key: 'orbitalAureate', label: 'Orbital Aureate Rings', description: 'Quadruple Orbital Platform output.', cost: '30000000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '4', requiresOwned: { generator: 'orbitalPlatforms', count: 280 }, requiresUpgrade: 'orbitalEmpyrean' },
  stellarFlux: { key: 'stellarFlux', label: 'Stellar Flux Weaves', description: 'Double Stellar Forge output.', cost: '25000000', effectType: 'generator', target: 'stellarForges', multiplier: '2', requiresOwned: { generator: 'stellarForges', count: 8 } },
  stellarMantles: { key: 'stellarMantles', label: 'Stellar Mantles', description: 'Double Stellar Forge output.', cost: '160000000', effectType: 'generator', target: 'stellarForges', multiplier: '2', requiresOwned: { generator: 'stellarForges', count: 20 }, requiresUpgrade: 'stellarFlux' },
  stellarLattices: { key: 'stellarLattices', label: 'Stellar Lattices', description: 'Double Stellar Forge output.', cost: '1050000000', effectType: 'generator', target: 'stellarForges', multiplier: '2', requiresOwned: { generator: 'stellarForges', count: 40 }, requiresUpgrade: 'stellarMantles' },
  stellarAscension: { key: 'stellarAscension', label: 'Stellar Ascension', description: 'Boost Stellar Forge output by x2.5.', cost: '7000000000', effectType: 'generator', target: 'stellarForges', multiplier: '2.5', requiresOwned: { generator: 'stellarForges', count: 80 }, requiresUpgrade: 'stellarLattices' },
  stellarParagon: { key: 'stellarParagon', label: 'Stellar Paragon Cells', description: 'Triple Stellar Forge output.', cost: '50000000000', effectType: 'generator', target: 'stellarForges', multiplier: '3', requiresOwned: { generator: 'stellarForges', count: 160 }, requiresUpgrade: 'stellarAscension' },
  stellarSupercluster: { key: 'stellarSupercluster', label: 'Stellar Supercluster', description: 'Quadruple Stellar Forge output.', cost: '360000000000', effectType: 'generator', target: 'stellarForges', multiplier: '4', requiresOwned: { generator: 'stellarForges', count: 280 }, requiresUpgrade: 'stellarParagon' },
  dysonPhasing: { key: 'dysonPhasing', label: 'Dyson Phasing', description: 'Double Dyson Array output.', cost: '320000000', effectType: 'generator', target: 'dysonArrays', multiplier: '2', requiresOwned: { generator: 'dysonArrays', count: 6 } },
  dysonLenses: { key: 'dysonLenses', label: 'Dyson Lenses', description: 'Double Dyson Array output.', cost: '2200000000', effectType: 'generator', target: 'dysonArrays', multiplier: '2', requiresOwned: { generator: 'dysonArrays', count: 15 }, requiresUpgrade: 'dysonPhasing' },
  dysonHarmonics: { key: 'dysonHarmonics', label: 'Dyson Harmonics', description: 'Double Dyson Array output.', cost: '14500000000', effectType: 'generator', target: 'dysonArrays', multiplier: '2', requiresOwned: { generator: 'dysonArrays', count: 30 }, requiresUpgrade: 'dysonLenses' },
  dysonDominion: { key: 'dysonDominion', label: 'Dyson Dominion', description: 'Boost Dyson Array output by x2.5.', cost: '98000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '2.5', requiresOwned: { generator: 'dysonArrays', count: 60 }, requiresUpgrade: 'dysonHarmonics' },
  dysonZenith: { key: 'dysonZenith', label: 'Dyson Zenith Mesh', description: 'Triple Dyson Array output.', cost: '700000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '3', requiresOwned: { generator: 'dysonArrays', count: 120 }, requiresUpgrade: 'dysonDominion' },
  dysonAphelion: { key: 'dysonAphelion', label: 'Dyson Aphelion', description: 'Quadruple Dyson Array output.', cost: '5000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '4', requiresOwned: { generator: 'dysonArrays', count: 220 }, requiresUpgrade: 'dysonZenith' },
  singularityContainment: { key: 'singularityContainment', label: 'Singularity Containment', description: 'Double Singularity Well output.', cost: '4200000000', effectType: 'generator', target: 'singularityWells', multiplier: '2', requiresOwned: { generator: 'singularityWells', count: 4 } },
  singularityShear: { key: 'singularityShear', label: 'Singularity Shear', description: 'Double Singularity Well output.', cost: '28000000000', effectType: 'generator', target: 'singularityWells', multiplier: '2', requiresOwned: { generator: 'singularityWells', count: 10 }, requiresUpgrade: 'singularityContainment' },
  singularityLensing: { key: 'singularityLensing', label: 'Singularity Lensing', description: 'Double Singularity Well output.', cost: '185000000000', effectType: 'generator', target: 'singularityWells', multiplier: '2', requiresOwned: { generator: 'singularityWells', count: 20 }, requiresUpgrade: 'singularityShear' },
  singularityTranscendence: { key: 'singularityTranscendence', label: 'Singularity Transcendence', description: 'Boost Singularity Well output by x2.5.', cost: '1300000000000', effectType: 'generator', target: 'singularityWells', multiplier: '2.5', requiresOwned: { generator: 'singularityWells', count: 40 }, requiresUpgrade: 'singularityLensing' },
  singularityAxiom: { key: 'singularityAxiom', label: 'Singularity Axiom Lens', description: 'Triple Singularity Well output.', cost: '9500000000000', effectType: 'generator', target: 'singularityWells', multiplier: '3', requiresOwned: { generator: 'singularityWells', count: 80 }, requiresUpgrade: 'singularityTranscendence' },
  singularityEclipse: { key: 'singularityEclipse', label: 'Singularity Eclipse', description: 'Quadruple Singularity Well output.', cost: '70000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '4', requiresOwned: { generator: 'singularityWells', count: 140 }, requiresUpgrade: 'singularityAxiom' },
  continuumStabilizers: { key: 'continuumStabilizers', label: 'Continuum Stabilizers', description: 'Double Continuum Engine output.', cost: '70000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '2', requiresOwned: { generator: 'continuumEngines', count: 5 } },
  continuumRecursion: { key: 'continuumRecursion', label: 'Continuum Recursion', description: 'Double Continuum Engine output.', cost: '350000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '2', requiresOwned: { generator: 'continuumEngines', count: 12 }, requiresUpgrade: 'continuumStabilizers' },
  continuumParadoxCore: { key: 'continuumParadoxCore', label: 'Continuum Paradox Core', description: 'Double Continuum Engine output.', cost: '2100000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '2', requiresOwned: { generator: 'continuumEngines', count: 25 }, requiresUpgrade: 'continuumRecursion' },
  continuumSlipstream: { key: 'continuumSlipstream', label: 'Continuum Slipstream', description: 'Boost Continuum Engine output by x2.5.', cost: '13000000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '2.5', requiresOwned: { generator: 'continuumEngines', count: 50 }, requiresUpgrade: 'continuumParadoxCore' },
  continuumHyperfold: { key: 'continuumHyperfold', label: 'Continuum Hyperfold', description: 'Triple Continuum Engine output.', cost: '85000000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '3', requiresOwned: { generator: 'continuumEngines', count: 100 }, requiresUpgrade: 'continuumSlipstream' },
  continuumEternity: { key: 'continuumEternity', label: 'Continuum Eternity Core', description: 'Quadruple Continuum Engine output.', cost: '600000000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '4', requiresOwned: { generator: 'continuumEngines', count: 140 }, requiresUpgrade: 'continuumHyperfold' },
  voidTuning: { key: 'voidTuning', label: 'Void Tuning', description: 'Double Void Lathe output.', cost: '130000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '2', requiresOwned: { generator: 'voidLathes', count: 3 } },
  voidResonance: { key: 'voidResonance', label: 'Void Resonance', description: 'Double Void Lathe output.', cost: '780000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '2', requiresOwned: { generator: 'voidLathes', count: 8 }, requiresUpgrade: 'voidTuning' },
  voidApotheosis: { key: 'voidApotheosis', label: 'Void Apotheosis', description: 'Boost Void Lathe output by x2.5.', cost: '4800000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '2.5', requiresOwned: { generator: 'voidLathes', count: 16 }, requiresUpgrade: 'voidResonance' },
  voidConfluence: { key: 'voidConfluence', label: 'Void Confluence', description: 'Triple Void Lathe output.', cost: '31000000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '3', requiresOwned: { generator: 'voidLathes', count: 32 }, requiresUpgrade: 'voidApotheosis' },
  voidOblivion: { key: 'voidOblivion', label: 'Void Oblivion', description: 'Quadruple Void Lathe output.', cost: '220000000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '4', requiresOwned: { generator: 'voidLathes', count: 64 }, requiresUpgrade: 'voidConfluence' },
  entropyBaffles: { key: 'entropyBaffles', label: 'Entropy Baffles', description: 'Double Entropy Reactor output.', cost: '2400000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '2', requiresOwned: { generator: 'entropyReactors', count: 2 } },
  entropyRecapture: { key: 'entropyRecapture', label: 'Entropy Recapture', description: 'Double Entropy Reactor output.', cost: '15000000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '2', requiresOwned: { generator: 'entropyReactors', count: 5 }, requiresUpgrade: 'entropyBaffles' },
  entropyHorizon: { key: 'entropyHorizon', label: 'Entropy Horizon', description: 'Boost Entropy Reactor output by x2.5.', cost: '95000000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '2.5', requiresOwned: { generator: 'entropyReactors', count: 12 }, requiresUpgrade: 'entropyRecapture' },
  entropyCascade: { key: 'entropyCascade', label: 'Entropy Cascade', description: 'Triple Entropy Reactor output.', cost: '620000000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '3', requiresOwned: { generator: 'entropyReactors', count: 24 }, requiresUpgrade: 'entropyHorizon' },
  entropyDominion: { key: 'entropyDominion', label: 'Entropy Dominion', description: 'Quadruple Entropy Reactor output.', cost: '4500000000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '4', requiresOwned: { generator: 'entropyReactors', count: 48 }, requiresUpgrade: 'entropyCascade' },
  quantumSpools: { key: 'quantumSpools', label: 'Quantum Spools', description: 'Double Quantum Foundry output.', cost: '36000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '2', requiresOwned: { generator: 'quantumFoundries', count: 1 } },
  quantumEntanglement: { key: 'quantumEntanglement', label: 'Quantum Entanglement', description: 'Double Quantum Foundry output.', cost: '220000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '2', requiresOwned: { generator: 'quantumFoundries', count: 4 }, requiresUpgrade: 'quantumSpools' },
  quantumConfluence: { key: 'quantumConfluence', label: 'Quantum Confluence', description: 'Boost Quantum Foundry output by x2.5.', cost: '1400000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '2.5', requiresOwned: { generator: 'quantumFoundries', count: 10 }, requiresUpgrade: 'quantumEntanglement' },
  quantumCascade: { key: 'quantumCascade', label: 'Quantum Cascade', description: 'Triple Quantum Foundry output.', cost: '9200000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '3', requiresOwned: { generator: 'quantumFoundries', count: 20 }, requiresUpgrade: 'quantumConfluence' },
  quantumSingularity: { key: 'quantumSingularity', label: 'Quantum Singularity', description: 'Quadruple Quantum Foundry output.', cost: '64000000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '4', requiresOwned: { generator: 'quantumFoundries', count: 40 }, requiresUpgrade: 'quantumCascade' },
  darkMatterCompression: { key: 'darkMatterCompression', label: 'Dark Matter Compression', description: 'Double Dark Matter Smelter output.', cost: '650000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '2', requiresOwned: { generator: 'darkMatterSmelters', count: 1 } },
  darkMatterFusion: { key: 'darkMatterFusion', label: 'Dark Matter Fusion', description: 'Double Dark Matter Smelter output.', cost: '4100000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '2', requiresOwned: { generator: 'darkMatterSmelters', count: 3 }, requiresUpgrade: 'darkMatterCompression' },
  darkMatterTranscendence: { key: 'darkMatterTranscendence', label: 'Dark Matter Transcendence', description: 'Boost Dark Matter Smelter output by x2.5.', cost: '26000000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '2.5', requiresOwned: { generator: 'darkMatterSmelters', count: 8 }, requiresUpgrade: 'darkMatterFusion' },
  darkMatterDominion: { key: 'darkMatterDominion', label: 'Dark Matter Dominion', description: 'Triple Dark Matter Smelter output.', cost: '180000000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '3', requiresOwned: { generator: 'darkMatterSmelters', count: 16 }, requiresUpgrade: 'darkMatterTranscendence' },
  darkMatterEventide: { key: 'darkMatterEventide', label: 'Dark Matter Eventide', description: 'Quadruple Dark Matter Smelter output.', cost: '1200000000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '4', requiresOwned: { generator: 'darkMatterSmelters', count: 32 }, requiresUpgrade: 'darkMatterDominion' },
  realityTempering: { key: 'realityTempering', label: 'Reality Tempering', description: 'Double Reality Kiln output.', cost: '12000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '2', requiresOwned: { generator: 'realityKilns', count: 1 } },
  realityRecasting: { key: 'realityRecasting', label: 'Reality Recasting', description: 'Double Reality Kiln output.', cost: '76000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '2', requiresOwned: { generator: 'realityKilns', count: 3 }, requiresUpgrade: 'realityTempering' },
  realityAscendancy: { key: 'realityAscendancy', label: 'Reality Ascendancy', description: 'Boost Reality Kiln output by x2.5.', cost: '480000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '2.5', requiresOwned: { generator: 'realityKilns', count: 7 }, requiresUpgrade: 'realityRecasting' },
  realityCrowning: { key: 'realityCrowning', label: 'Reality Crowning', description: 'Triple Reality Kiln output.', cost: '3200000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '3', requiresOwned: { generator: 'realityKilns', count: 14 }, requiresUpgrade: 'realityAscendancy' },
  realityGenesis: { key: 'realityGenesis', label: 'Reality Genesis', description: 'Quadruple Reality Kiln output.', cost: '23000000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '4', requiresOwned: { generator: 'realityKilns', count: 28 }, requiresUpgrade: 'realityCrowning' },
  fractalRecursion: { key: 'fractalRecursion', label: 'Fractal Recursion', description: 'Double Fractal Assembler output.', cost: '220000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '2', requiresOwned: { generator: 'fractalAssemblers', count: 1 } },
  fractalAmplification: { key: 'fractalAmplification', label: 'Fractal Amplification', description: 'Double Fractal Assembler output.', cost: '1400000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '2', requiresOwned: { generator: 'fractalAssemblers', count: 2 }, requiresUpgrade: 'fractalRecursion' },
  fractalInfinity: { key: 'fractalInfinity', label: 'Fractal Infinity', description: 'Boost Fractal Assembler output by x2.5.', cost: '8800000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '2.5', requiresOwned: { generator: 'fractalAssemblers', count: 6 }, requiresUpgrade: 'fractalAmplification' },
  fractalMultiplicity: { key: 'fractalMultiplicity', label: 'Fractal Multiplicity', description: 'Triple Fractal Assembler output.', cost: '59000000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '3', requiresOwned: { generator: 'fractalAssemblers', count: 12 }, requiresUpgrade: 'fractalInfinity' },
  fractalAscendancy: { key: 'fractalAscendancy', label: 'Fractal Ascendancy', description: 'Quadruple Fractal Assembler output.', cost: '410000000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '4', requiresOwned: { generator: 'fractalAssemblers', count: 24 }, requiresUpgrade: 'fractalMultiplicity' },
  causalThreading: { key: 'causalThreading', label: 'Causal Threading', description: 'Double Causal Loom output.', cost: '4200000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '2', requiresOwned: { generator: 'causalLooms', count: 1 } },
  causalBraiding: { key: 'causalBraiding', label: 'Causal Braiding', description: 'Double Causal Loom output.', cost: '26000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '2', requiresOwned: { generator: 'causalLooms', count: 2 }, requiresUpgrade: 'causalThreading' },
  causalApex: { key: 'causalApex', label: 'Causal Apex', description: 'Boost Causal Loom output by x2.5.', cost: '170000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '2.5', requiresOwned: { generator: 'causalLooms', count: 5 }, requiresUpgrade: 'causalBraiding' },
  causalConcord: { key: 'causalConcord', label: 'Causal Concord', description: 'Triple Causal Loom output.', cost: '1100000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '3', requiresOwned: { generator: 'causalLooms', count: 10 }, requiresUpgrade: 'causalApex' },
  causalDominion: { key: 'causalDominion', label: 'Causal Dominion', description: 'Quadruple Causal Loom output.', cost: '7800000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '4', requiresOwned: { generator: 'causalLooms', count: 20 }, requiresUpgrade: 'causalConcord' },
  epochInscription: { key: 'epochInscription', label: 'Epoch Inscription', description: 'Double Epoch Monolith output.', cost: '85000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '2', requiresOwned: { generator: 'epochMonoliths', count: 1 } },
  epochResonance: { key: 'epochResonance', label: 'Epoch Resonance', description: 'Double Epoch Monolith output.', cost: '540000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '2', requiresOwned: { generator: 'epochMonoliths', count: 2 }, requiresUpgrade: 'epochInscription' },
  epochImperative: { key: 'epochImperative', label: 'Epoch Imperative', description: 'Boost Epoch Monolith output by x2.5.', cost: '3400000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '2.5', requiresOwned: { generator: 'epochMonoliths', count: 4 }, requiresUpgrade: 'epochResonance' },
  epochAscension: { key: 'epochAscension', label: 'Epoch Ascension', description: 'Triple Epoch Monolith output.', cost: '23000000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '3', requiresOwned: { generator: 'epochMonoliths', count: 8 }, requiresUpgrade: 'epochImperative' },
  epochContinuum: { key: 'epochContinuum', label: 'Epoch Continuum', description: 'Quadruple Epoch Monolith output.', cost: '160000000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '4', requiresOwned: { generator: 'epochMonoliths', count: 16 }, requiresUpgrade: 'epochAscension' },
  omniversalBridges: { key: 'omniversalBridges', label: 'Omniversal Bridges', description: 'Double Omniversal Foundry output.', cost: '1800000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '2', requiresOwned: { generator: 'omniversalFoundries', count: 1 } },
  omniversalConcord: { key: 'omniversalConcord', label: 'Omniversal Concord', description: 'Double Omniversal Foundry output.', cost: '11000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '2', requiresOwned: { generator: 'omniversalFoundries', count: 2 }, requiresUpgrade: 'omniversalBridges' },
  omniversalSupremacy: { key: 'omniversalSupremacy', label: 'Omniversal Supremacy', description: 'Boost Omniversal Foundry output by x2.5.', cost: '72000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '2.5', requiresOwned: { generator: 'omniversalFoundries', count: 4 }, requiresUpgrade: 'omniversalConcord' },
  omniversalOverture: { key: 'omniversalOverture', label: 'Omniversal Overture', description: 'Triple Omniversal Foundry output.', cost: '480000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '3', requiresOwned: { generator: 'omniversalFoundries', count: 7 }, requiresUpgrade: 'omniversalSupremacy' },
  omniversalCrown: { key: 'omniversalCrown', label: 'Omniversal Crown', description: 'Quadruple Omniversal Foundry output.', cost: '3400000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '4', requiresOwned: { generator: 'omniversalFoundries', count: 14 }, requiresUpgrade: 'omniversalOverture' },
  genesisKindling: { key: 'genesisKindling', label: 'Genesis Kindling', description: 'Double Genesis Forge output.', cost: '36000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '2', requiresOwned: { generator: 'genesisForges', count: 1 } },
  genesisProliferation: { key: 'genesisProliferation', label: 'Genesis Proliferation', description: 'Double Genesis Forge output.', cost: '230000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '2', requiresOwned: { generator: 'genesisForges', count: 2 }, requiresUpgrade: 'genesisKindling' },
  genesisCrowning: { key: 'genesisCrowning', label: 'Genesis Crowning', description: 'Boost Genesis Forge output by x2.5.', cost: '1500000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '2.5', requiresOwned: { generator: 'genesisForges', count: 3 }, requiresUpgrade: 'genesisProliferation' },
  genesisExaltation: { key: 'genesisExaltation', label: 'Genesis Exaltation', description: 'Triple Genesis Forge output.', cost: '10000000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '3', requiresOwned: { generator: 'genesisForges', count: 6 }, requiresUpgrade: 'genesisCrowning' },
  genesisApotheosis: { key: 'genesisApotheosis', label: 'Genesis Apotheosis', description: 'Quadruple Genesis Forge output.', cost: '75000000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '4', requiresOwned: { generator: 'genesisForges', count: 12 }, requiresUpgrade: 'genesisExaltation' },
  automationLoops: { key: 'automationLoops', label: 'Automation Loops', description: 'Global production x1.5.', cost: '200000', effectType: 'global', multiplier: '1.5', requiresOwned: { generator: 'drills', count: 15 } },
  signalFutures: { key: 'signalFutures', label: 'Signal Futures', description: 'Global production x1.75.', cost: '2500000', effectType: 'global', multiplier: '1.75', requiresOwned: { generator: 'extractors', count: 25 }, requiresUpgrade: 'automationLoops' },
  quantumForecasts: { key: 'quantumForecasts', label: 'Quantum Forecasts', description: 'Global production x2.', cost: '35000000', effectType: 'global', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 15 }, requiresUpgrade: 'signalFutures' },
  orbitalExchange: { key: 'orbitalExchange', label: 'Orbital Exchange', description: 'Global production x2.25.', cost: '900000000', effectType: 'global', multiplier: '2.25', requiresOwned: { generator: 'orbitalPlatforms', count: 18 }, requiresUpgrade: 'quantumForecasts' },
  fractalEconomies: { key: 'fractalEconomies', label: 'Fractal Economies', description: 'Global production x2.5.', cost: '35000000000', effectType: 'global', multiplier: '2.5', requiresOwned: { generator: 'dysonArrays', count: 15 }, requiresUpgrade: 'orbitalExchange' },
  causalOverclock: { key: 'causalOverclock', label: 'Causal Overclock', description: 'Global production x3.', cost: '2500000000000', effectType: 'global', multiplier: '3', requiresOwned: { generator: 'singularityWells', count: 12 }, requiresUpgrade: 'fractalEconomies' },
}

applyCookieMainUpgradeCurves(UPGRADE_CONFIG, GENERATOR_CONFIG)

const LIFETIME_CREDIT_ACHIEVEMENTS = [
  'Foundation',
  'Early Expansion',
  'Flow Established',
  'Scaling Up',
  'Credit Engine',
  'Networked Output',
  'Industrial Flow',
  'Industrial Scale',
  'Mass Production',
  'Macro Throughput',
  'Macro Economy',
  'Planetary Output',
  'Stellar Ledger',
  'Cluster Reserves',
  'Galactic Flow',
  'Interstellar Treasury',
  'Universal Current',
  'Continuum Drive',
  'Reality Furnace',
  'Genesis Horizon',
].map((label, index) => {
  const threshold = COOKIE_CREDIT_LIFETIME_THRESHOLDS[index]
  return {
    key: `allCredits${thresholdKeyFragment(threshold)}`,
    label,
    threshold,
  }
})

const RUN_CREDIT_ACHIEVEMENTS = [
  'Run Warmup',
  'Run Momentum',
  'Run Acceleration',
  'Run Engine',
  'Run Ramp',
  'Run Breakthrough',
  'Run Velocity',
  'Run Hyperflow',
  'Run Infrastructure',
  'Run Megascale',
  'Run Planetary',
  'Run Stellar',
  'Run Interstellar',
  'Run Continuum',
  'Run Genesis',
  'Run Apotheosis',
].map((label, index) => {
  const threshold = COOKIE_CREDIT_RUN_THRESHOLDS[index]
  return {
    key: `runCredits${thresholdKeyFragment(threshold)}`,
    label,
    threshold,
  }
})

function formatAchievementThresholdText(threshold: string): string {
  return threshold.includes('e')
    ? threshold
    : threshold.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const LIFETIME_CREDIT_ACHIEVEMENT_CONFIG = Object.fromEntries(
  LIFETIME_CREDIT_ACHIEVEMENTS.map(({ key, label, threshold }) => [
    key,
    {
      key,
      label,
      description: `Produce ${formatAchievementThresholdText(threshold)} credits across all resets.`,
      requirement: { type: 'allResetCredits', threshold },
    } satisfies AchievementConfigEntry,
  ]),
) as Record<string, AchievementConfigEntry>

const RUN_CREDIT_ACHIEVEMENT_CONFIG = Object.fromEntries(
  RUN_CREDIT_ACHIEVEMENTS.map(({ key, label, threshold }) => [
    key,
    {
      key,
      label,
      description: `Produce ${formatAchievementThresholdText(threshold)} credits in a single run.`,
      requirement: { type: 'runCredits', threshold },
    } satisfies AchievementConfigEntry,
  ]),
) as Record<string, AchievementConfigEntry>

export const ACHIEVEMENT_CONFIG: Record<string, AchievementConfigEntry> = {
  ...LIFETIME_CREDIT_ACHIEVEMENT_CONFIG,
  ...RUN_CREDIT_ACHIEVEMENT_CONFIG,
  miners100: { key: 'miners100', label: 'Miner Team', description: 'Own 10 Miners.', requirement: { type: 'owned', generator: 'miners', count: 10 } },
  miners300: { key: 'miners300', label: 'Miner Crew', description: 'Own 25 Miners.', requirement: { type: 'owned', generator: 'miners', count: 25 } },
  miners600: { key: 'miners600', label: 'Miner Battalion', description: 'Own 50 Miners.', requirement: { type: 'owned', generator: 'miners', count: 50 } },
  miners1000: { key: 'miners1000', label: 'Miner Fleet', description: 'Own 100 Miners.', requirement: { type: 'owned', generator: 'miners', count: 100 } },
  miners2000: { key: 'miners2000', label: 'Miner Armada', description: 'Own 200 Miners.', requirement: { type: 'owned', generator: 'miners', count: 200 } },
  miners3500: { key: 'miners3500', label: 'Miner Citadel', description: 'Own 350 Miners.', requirement: { type: 'owned', generator: 'miners', count: 350 } },
  drills75: { key: 'drills75', label: 'Drill Team', description: 'Own 10 Drills.', requirement: { type: 'owned', generator: 'drills', count: 10 } },
  drills200: { key: 'drills200', label: 'Drill Crew', description: 'Own 25 Drills.', requirement: { type: 'owned', generator: 'drills', count: 25 } },
  drills400: { key: 'drills400', label: 'Drill Battalion', description: 'Own 50 Drills.', requirement: { type: 'owned', generator: 'drills', count: 50 } },
  drills750: { key: 'drills750', label: 'Drill Fleet', description: 'Own 100 Drills.', requirement: { type: 'owned', generator: 'drills', count: 100 } },
  drills1500: { key: 'drills1500', label: 'Drill Armada', description: 'Own 200 Drills.', requirement: { type: 'owned', generator: 'drills', count: 200 } },
  drills2500: { key: 'drills2500', label: 'Drill Citadel', description: 'Own 350 Drills.', requirement: { type: 'owned', generator: 'drills', count: 350 } },
  extractors50: { key: 'extractors50', label: 'Extractor Team', description: 'Own 10 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 10 } },
  extractors120: { key: 'extractors120', label: 'Extractor Crew', description: 'Own 25 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 25 } },
  extractors250: { key: 'extractors250', label: 'Extractor Battalion', description: 'Own 50 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 50 } },
  extractors500: { key: 'extractors500', label: 'Extractor Fleet', description: 'Own 100 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 100 } },
  extractors1000: { key: 'extractors1000', label: 'Extractor Armada', description: 'Own 200 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 200 } },
  extractors1800: { key: 'extractors1800', label: 'Extractor Citadel', description: 'Own 350 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 350 } },
  refineries40: { key: 'refineries40', label: 'Refinery Team', description: 'Own 10 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 10 } },
  refineries90: { key: 'refineries90', label: 'Refinery Crew', description: 'Own 25 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 25 } },
  refineries200: { key: 'refineries200', label: 'Refinery Battalion', description: 'Own 50 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 50 } },
  refineries400: { key: 'refineries400', label: 'Refinery Fleet', description: 'Own 100 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 100 } },
  refineries800: { key: 'refineries800', label: 'Refinery Armada', description: 'Own 200 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 200 } },
  refineries1200: { key: 'refineries1200', label: 'Refinery Citadel', description: 'Own 350 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 350 } },
  megaRigs30: { key: 'megaRigs30', label: 'Mega Rig Team', description: 'Own 10 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 10 } },
  megaRigs75: { key: 'megaRigs75', label: 'Mega Rig Crew', description: 'Own 25 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 25 } },
  megaRigs150: { key: 'megaRigs150', label: 'Mega Rig Battalion', description: 'Own 50 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 50 } },
  megaRigs300: { key: 'megaRigs300', label: 'Mega Rig Fleet', description: 'Own 100 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 100 } },
  megaRigs600: { key: 'megaRigs600', label: 'Mega Rig Armada', description: 'Own 200 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 200 } },
  megaRigs900: { key: 'megaRigs900', label: 'Mega Rig Citadel', description: 'Own 350 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 350 } },
  orbitalPlatforms20: { key: 'orbitalPlatforms20', label: 'Orbital Team', description: 'Own 8 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 8 } },
  orbitalPlatforms50: { key: 'orbitalPlatforms50', label: 'Orbital Crew', description: 'Own 20 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 20 } },
  orbitalPlatforms100: { key: 'orbitalPlatforms100', label: 'Orbital Battalion', description: 'Own 40 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 40 } },
  orbitalPlatforms200: { key: 'orbitalPlatforms200', label: 'Orbital Fleet', description: 'Own 80 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 80 } },
  orbitalPlatforms400: { key: 'orbitalPlatforms400', label: 'Orbital Armada', description: 'Own 160 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 160 } },
  orbitalPlatforms600: { key: 'orbitalPlatforms600', label: 'Orbital Citadel', description: 'Own 280 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 280 } },
  stellarForges15: { key: 'stellarForges15', label: 'Stellar Team', description: 'Own 8 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 8 } },
  stellarForges35: { key: 'stellarForges35', label: 'Stellar Crew', description: 'Own 20 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 20 } },
  stellarForges75: { key: 'stellarForges75', label: 'Stellar Battalion', description: 'Own 40 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 40 } },
  stellarForges150: { key: 'stellarForges150', label: 'Stellar Fleet', description: 'Own 80 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 80 } },
  stellarForges300: { key: 'stellarForges300', label: 'Stellar Armada', description: 'Own 160 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 160 } },
  stellarForges450: { key: 'stellarForges450', label: 'Stellar Citadel', description: 'Own 280 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 280 } },
  dysonArrays10: { key: 'dysonArrays10', label: 'Dyson Team', description: 'Own 6 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 6 } },
  dysonArrays25: { key: 'dysonArrays25', label: 'Dyson Crew', description: 'Own 15 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 15 } },
  dysonArrays50: { key: 'dysonArrays50', label: 'Dyson Battalion', description: 'Own 30 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 30 } },
  dysonArrays100: { key: 'dysonArrays100', label: 'Dyson Fleet', description: 'Own 60 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 60 } },
  dysonArrays200: { key: 'dysonArrays200', label: 'Dyson Armada', description: 'Own 120 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 120 } },
  dysonArrays300: { key: 'dysonArrays300', label: 'Dyson Citadel', description: 'Own 220 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 220 } },
  singularityWells8: { key: 'singularityWells8', label: 'Singularity Team', description: 'Own 4 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 4 } },
  singularityWells20: { key: 'singularityWells20', label: 'Singularity Crew', description: 'Own 10 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 10 } },
  singularityWells40: { key: 'singularityWells40', label: 'Singularity Battalion', description: 'Own 20 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 20 } },
  singularityWells80: { key: 'singularityWells80', label: 'Singularity Fleet', description: 'Own 40 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 40 } },
  singularityWells160: { key: 'singularityWells160', label: 'Singularity Armada', description: 'Own 80 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 80 } },
  singularityWells220: { key: 'singularityWells220', label: 'Singularity Citadel', description: 'Own 140 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 140 } },
  continuumEngines5: { key: 'continuumEngines5', label: 'Continuum Team', description: 'Own 5 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 5 } },
  continuumEngines12: { key: 'continuumEngines12', label: 'Continuum Crew', description: 'Own 12 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 12 } },
  continuumEngines25: { key: 'continuumEngines25', label: 'Continuum Battalion', description: 'Own 25 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 25 } },
  continuumEngines50: { key: 'continuumEngines50', label: 'Continuum Fleet', description: 'Own 50 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 50 } },
  continuumEngines100: { key: 'continuumEngines100', label: 'Continuum Armada', description: 'Own 100 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 100 } },
  continuumEngines140: { key: 'continuumEngines140', label: 'Continuum Citadel', description: 'Own 140 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 140 } },
  voidLathes3: { key: 'voidLathes3', label: 'Void Team', description: 'Own 3 Void Lathes.', requirement: { type: 'owned', generator: 'voidLathes', count: 3 } },
  voidLathes8: { key: 'voidLathes8', label: 'Void Crew', description: 'Own 8 Void Lathes.', requirement: { type: 'owned', generator: 'voidLathes', count: 8 } },
  voidLathes16: { key: 'voidLathes16', label: 'Void Battalion', description: 'Own 16 Void Lathes.', requirement: { type: 'owned', generator: 'voidLathes', count: 16 } },
  voidLathes32: { key: 'voidLathes32', label: 'Void Fleet', description: 'Own 32 Void Lathes.', requirement: { type: 'owned', generator: 'voidLathes', count: 32 } },
  voidLathes64: { key: 'voidLathes64', label: 'Void Armada', description: 'Own 64 Void Lathes.', requirement: { type: 'owned', generator: 'voidLathes', count: 64 } },
  entropyReactors2: { key: 'entropyReactors2', label: 'Entropy Team', description: 'Own 2 Entropy Reactors.', requirement: { type: 'owned', generator: 'entropyReactors', count: 2 } },
  entropyReactors5: { key: 'entropyReactors5', label: 'Entropy Crew', description: 'Own 5 Entropy Reactors.', requirement: { type: 'owned', generator: 'entropyReactors', count: 5 } },
  entropyReactors12: { key: 'entropyReactors12', label: 'Entropy Battalion', description: 'Own 12 Entropy Reactors.', requirement: { type: 'owned', generator: 'entropyReactors', count: 12 } },
  entropyReactors24: { key: 'entropyReactors24', label: 'Entropy Fleet', description: 'Own 24 Entropy Reactors.', requirement: { type: 'owned', generator: 'entropyReactors', count: 24 } },
  entropyReactors48: { key: 'entropyReactors48', label: 'Entropy Armada', description: 'Own 48 Entropy Reactors.', requirement: { type: 'owned', generator: 'entropyReactors', count: 48 } },
  quantumFoundries1: { key: 'quantumFoundries1', label: 'Quantum Team', description: 'Own 1 Quantum Foundry.', requirement: { type: 'owned', generator: 'quantumFoundries', count: 1 } },
  quantumFoundries4: { key: 'quantumFoundries4', label: 'Quantum Crew', description: 'Own 4 Quantum Foundries.', requirement: { type: 'owned', generator: 'quantumFoundries', count: 4 } },
  quantumFoundries10: { key: 'quantumFoundries10', label: 'Quantum Battalion', description: 'Own 10 Quantum Foundries.', requirement: { type: 'owned', generator: 'quantumFoundries', count: 10 } },
  quantumFoundries20: { key: 'quantumFoundries20', label: 'Quantum Fleet', description: 'Own 20 Quantum Foundries.', requirement: { type: 'owned', generator: 'quantumFoundries', count: 20 } },
  quantumFoundries40: { key: 'quantumFoundries40', label: 'Quantum Armada', description: 'Own 40 Quantum Foundries.', requirement: { type: 'owned', generator: 'quantumFoundries', count: 40 } },
  darkMatterSmelters1: { key: 'darkMatterSmelters1', label: 'Dark Matter Team', description: 'Own 1 Dark Matter Smelter.', requirement: { type: 'owned', generator: 'darkMatterSmelters', count: 1 } },
  darkMatterSmelters3: { key: 'darkMatterSmelters3', label: 'Dark Matter Crew', description: 'Own 3 Dark Matter Smelters.', requirement: { type: 'owned', generator: 'darkMatterSmelters', count: 3 } },
  darkMatterSmelters8: { key: 'darkMatterSmelters8', label: 'Dark Matter Battalion', description: 'Own 8 Dark Matter Smelters.', requirement: { type: 'owned', generator: 'darkMatterSmelters', count: 8 } },
  darkMatterSmelters16: { key: 'darkMatterSmelters16', label: 'Dark Matter Fleet', description: 'Own 16 Dark Matter Smelters.', requirement: { type: 'owned', generator: 'darkMatterSmelters', count: 16 } },
  darkMatterSmelters32: { key: 'darkMatterSmelters32', label: 'Dark Matter Armada', description: 'Own 32 Dark Matter Smelters.', requirement: { type: 'owned', generator: 'darkMatterSmelters', count: 32 } },
  realityKilns1: { key: 'realityKilns1', label: 'Reality Team', description: 'Own 1 Reality Kiln.', requirement: { type: 'owned', generator: 'realityKilns', count: 1 } },
  realityKilns3: { key: 'realityKilns3', label: 'Reality Crew', description: 'Own 3 Reality Kilns.', requirement: { type: 'owned', generator: 'realityKilns', count: 3 } },
  realityKilns7: { key: 'realityKilns7', label: 'Reality Battalion', description: 'Own 7 Reality Kilns.', requirement: { type: 'owned', generator: 'realityKilns', count: 7 } },
  realityKilns14: { key: 'realityKilns14', label: 'Reality Fleet', description: 'Own 14 Reality Kilns.', requirement: { type: 'owned', generator: 'realityKilns', count: 14 } },
  realityKilns28: { key: 'realityKilns28', label: 'Reality Armada', description: 'Own 28 Reality Kilns.', requirement: { type: 'owned', generator: 'realityKilns', count: 28 } },
  fractalAssemblers1: { key: 'fractalAssemblers1', label: 'Fractal Team', description: 'Own 1 Fractal Assembler.', requirement: { type: 'owned', generator: 'fractalAssemblers', count: 1 } },
  fractalAssemblers2: { key: 'fractalAssemblers2', label: 'Fractal Crew', description: 'Own 2 Fractal Assemblers.', requirement: { type: 'owned', generator: 'fractalAssemblers', count: 2 } },
  fractalAssemblers6: { key: 'fractalAssemblers6', label: 'Fractal Battalion', description: 'Own 6 Fractal Assemblers.', requirement: { type: 'owned', generator: 'fractalAssemblers', count: 6 } },
  fractalAssemblers12: { key: 'fractalAssemblers12', label: 'Fractal Fleet', description: 'Own 12 Fractal Assemblers.', requirement: { type: 'owned', generator: 'fractalAssemblers', count: 12 } },
  fractalAssemblers24: { key: 'fractalAssemblers24', label: 'Fractal Armada', description: 'Own 24 Fractal Assemblers.', requirement: { type: 'owned', generator: 'fractalAssemblers', count: 24 } },
  causalLooms1: { key: 'causalLooms1', label: 'Causal Team', description: 'Own 1 Causal Loom.', requirement: { type: 'owned', generator: 'causalLooms', count: 1 } },
  causalLooms2: { key: 'causalLooms2', label: 'Causal Crew', description: 'Own 2 Causal Looms.', requirement: { type: 'owned', generator: 'causalLooms', count: 2 } },
  causalLooms5: { key: 'causalLooms5', label: 'Causal Battalion', description: 'Own 5 Causal Looms.', requirement: { type: 'owned', generator: 'causalLooms', count: 5 } },
  causalLooms10: { key: 'causalLooms10', label: 'Causal Fleet', description: 'Own 10 Causal Looms.', requirement: { type: 'owned', generator: 'causalLooms', count: 10 } },
  causalLooms20: { key: 'causalLooms20', label: 'Causal Armada', description: 'Own 20 Causal Looms.', requirement: { type: 'owned', generator: 'causalLooms', count: 20 } },
  epochMonoliths1: { key: 'epochMonoliths1', label: 'Epoch Team', description: 'Own 1 Epoch Monolith.', requirement: { type: 'owned', generator: 'epochMonoliths', count: 1 } },
  epochMonoliths2: { key: 'epochMonoliths2', label: 'Epoch Crew', description: 'Own 2 Epoch Monoliths.', requirement: { type: 'owned', generator: 'epochMonoliths', count: 2 } },
  epochMonoliths4: { key: 'epochMonoliths4', label: 'Epoch Battalion', description: 'Own 4 Epoch Monoliths.', requirement: { type: 'owned', generator: 'epochMonoliths', count: 4 } },
  epochMonoliths8: { key: 'epochMonoliths8', label: 'Epoch Fleet', description: 'Own 8 Epoch Monoliths.', requirement: { type: 'owned', generator: 'epochMonoliths', count: 8 } },
  epochMonoliths16: { key: 'epochMonoliths16', label: 'Epoch Armada', description: 'Own 16 Epoch Monoliths.', requirement: { type: 'owned', generator: 'epochMonoliths', count: 16 } },
  omniversalFoundries1: { key: 'omniversalFoundries1', label: 'Omniversal Team', description: 'Own 1 Omniversal Foundry.', requirement: { type: 'owned', generator: 'omniversalFoundries', count: 1 } },
  omniversalFoundries2: { key: 'omniversalFoundries2', label: 'Omniversal Crew', description: 'Own 2 Omniversal Foundries.', requirement: { type: 'owned', generator: 'omniversalFoundries', count: 2 } },
  omniversalFoundries4: { key: 'omniversalFoundries4', label: 'Omniversal Battalion', description: 'Own 4 Omniversal Foundries.', requirement: { type: 'owned', generator: 'omniversalFoundries', count: 4 } },
  omniversalFoundries7: { key: 'omniversalFoundries7', label: 'Omniversal Fleet', description: 'Own 7 Omniversal Foundries.', requirement: { type: 'owned', generator: 'omniversalFoundries', count: 7 } },
  omniversalFoundries14: { key: 'omniversalFoundries14', label: 'Omniversal Armada', description: 'Own 14 Omniversal Foundries.', requirement: { type: 'owned', generator: 'omniversalFoundries', count: 14 } },
  genesisForges1: { key: 'genesisForges1', label: 'Genesis Team', description: 'Own 1 Genesis Forge.', requirement: { type: 'owned', generator: 'genesisForges', count: 1 } },
  genesisForges2: { key: 'genesisForges2', label: 'Genesis Crew', description: 'Own 2 Genesis Forges.', requirement: { type: 'owned', generator: 'genesisForges', count: 2 } },
  genesisForges3: { key: 'genesisForges3', label: 'Genesis Battalion', description: 'Own 3 Genesis Forges.', requirement: { type: 'owned', generator: 'genesisForges', count: 3 } },
  genesisForges6: { key: 'genesisForges6', label: 'Genesis Fleet', description: 'Own 6 Genesis Forges.', requirement: { type: 'owned', generator: 'genesisForges', count: 6 } },
  genesisForges12: { key: 'genesisForges12', label: 'Genesis Armada', description: 'Own 12 Genesis Forges.', requirement: { type: 'owned', generator: 'genesisForges', count: 12 } },
  firstAscension: { key: 'firstAscension', label: 'Legacy Spark', description: 'Complete your first ascension.', requirement: { type: 'ascensions', count: 1 } },
  ascensions3: { key: 'ascensions3', label: 'Legacy Current', description: 'Complete 3 ascensions.', requirement: { type: 'ascensions', count: 3 } },
  ascensions10: { key: 'ascensions10', label: 'Legacy Engine', description: 'Complete 10 ascensions.', requirement: { type: 'ascensions', count: 10 } },
  ascensions25: { key: 'ascensions25', label: 'Legacy Architect', description: 'Complete 25 ascensions.', requirement: { type: 'ascensions', count: 25 } },
  ascensions50: { key: 'ascensions50', label: 'Legacy Sovereign', description: 'Complete 50 ascensions.', requirement: { type: 'ascensions', count: 50 } },
  legacyLevel1: { key: 'legacyLevel1', label: 'Legacy Mark', description: 'Reach Legacy 1.', requirement: { type: 'legacyLevel', threshold: '1' } },
  legacyLevel5: { key: 'legacyLevel5', label: 'Legacy Engine', description: 'Reach Legacy 5.', requirement: { type: 'legacyLevel', threshold: '5' } },
  legacyLevel25: { key: 'legacyLevel25', label: 'Legacy Forge', description: 'Reach Legacy 25.', requirement: { type: 'legacyLevel', threshold: '25' } },
  legacyLevel100: { key: 'legacyLevel100', label: 'Legacy Works', description: 'Reach Legacy 100.', requirement: { type: 'legacyLevel', threshold: '100' } },
  legacyLevel1000: { key: 'legacyLevel1000', label: 'Legacy Dominion', description: 'Reach Legacy 1,000.', requirement: { type: 'legacyLevel', threshold: '1000' } },
  legacyLevel1000000: { key: 'legacyLevel1000000', label: 'Legacy Horizon', description: 'Reach Legacy 1,000,000.', requirement: { type: 'legacyLevel', threshold: '1000000' } },
  legacyNodes1: { key: 'legacyNodes1', label: 'Legacy Node', description: 'Unlock 1 Legacy upgrade.', requirement: { type: 'legacyUpgradeCount', count: 1 } },
  legacyNodes5: { key: 'legacyNodes5', label: 'Legacy Grid', description: 'Unlock 5 Legacy upgrades.', requirement: { type: 'legacyUpgradeCount', count: 5 } },
  legacyNodes10: { key: 'legacyNodes10', label: 'Legacy Mesh', description: 'Unlock 10 Legacy upgrades.', requirement: { type: 'legacyUpgradeCount', count: 10 } },
  legacyNodes19: { key: 'legacyNodes19', label: 'Legacy Crown', description: 'Unlock all 19 Legacy upgrades.', requirement: { type: 'legacyUpgradeCount', count: 19 } },
  foundryComplete: { key: 'foundryComplete', label: 'Foundry Branch Complete', description: 'Unlock every Foundry Legacy upgrade.', requirement: { type: 'legacyBranchComplete', branch: 'foundry' } },
  calibrationComplete: { key: 'calibrationComplete', label: 'Calibration Branch Complete', description: 'Unlock every Calibration Legacy upgrade.', requirement: { type: 'legacyBranchComplete', branch: 'calibration' } },
  archivesComplete: { key: 'archivesComplete', label: 'Archives Branch Complete', description: 'Unlock every Archives Legacy upgrade.', requirement: { type: 'legacyBranchComplete', branch: 'archives' } },
  upgrades10: { key: 'upgrades10', label: 'Workshop Bootstrapped', description: 'Purchase 12 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 12 } },
  upgrades20: { key: 'upgrades20', label: 'Workshop Online', description: 'Purchase 30 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 30 } },
  upgrades28: { key: 'upgrades28', label: 'Workshop Tuned', description: 'Purchase 60 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 60 } },
  upgrades35: { key: 'upgrades35', label: 'Workshop Expanded', description: 'Purchase 90 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 90 } },
  upgrades38: { key: 'upgrades38', label: 'Workshop Complete', description: 'Purchase all 116 run upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 116 } },
  offlineCap1h: { key: 'offlineCap1h', label: 'Extended Shift', description: 'Increase offline cap to at least 1 hour.', requirement: { type: 'offlineCapSeconds', seconds: 1 * 60 * 60 } },
  offlineCap2h: { key: 'offlineCap2h', label: 'Long Shift', description: 'Increase offline cap to at least 2 hours.', requirement: { type: 'offlineCapSeconds', seconds: 2 * 60 * 60 } },
  offlineCap4h: { key: 'offlineCap4h', label: 'Deep Shift', description: 'Increase offline cap to at least 4 hours.', requirement: { type: 'offlineCapSeconds', seconds: 4 * 60 * 60 } },
  offlineCap6h: { key: 'offlineCap6h', label: 'Night Shift', description: 'Increase offline cap to at least 6 hours.', requirement: { type: 'offlineCapSeconds', seconds: 6 * 60 * 60 } },
}

function assertDecimalString(value: string, context: string): void {
  try {
    const parsed = new Decimal(value)
    if (!parsed.isFinite() || parsed.lessThanOrEqualTo(0)) {
      throw new Error()
    }
  } catch {
    throw new Error(`Invalid decimal value for ${context}: ${value}`)
  }
}

export function validateProgressionConfig(params: {
  generatorOrder: readonly string[]
  upgradeOrder: readonly string[]
  achievementOrder: readonly string[]
  legacyUpgradeOrder: readonly string[]
  minerSubsystemGeneratorOrder: readonly string[]
  minerSubsystemUpgradeOrder: readonly string[]
}): void {
  const {
    generatorOrder,
    upgradeOrder,
    achievementOrder,
    legacyUpgradeOrder,
    minerSubsystemGeneratorOrder,
    minerSubsystemUpgradeOrder,
  } = params

  for (const key of generatorOrder) {
    const entry = GENERATOR_CONFIG[key]
    if (!entry) {
      throw new Error(`Missing generator config for key: ${key}`)
    }

    assertDecimalString(entry.baseCost, `generator ${key}.baseCost`)
    assertDecimalString(entry.growth, `generator ${key}.growth`)
    assertDecimalString(entry.baseProduction, `generator ${key}.baseProduction`)
  }

  for (const key of upgradeOrder) {
    const entry = UPGRADE_CONFIG[key]
    if (!entry) {
      throw new Error(`Missing upgrade config for key: ${key}`)
    }

    assertDecimalString(entry.cost, `upgrade ${key}.cost`)

    if (entry.requiresOwned && !generatorOrder.includes(entry.requiresOwned.generator)) {
      throw new Error(`Invalid requiresOwned generator for upgrade ${key}`)
    }

    if (entry.requiresUpgrade && !upgradeOrder.includes(entry.requiresUpgrade)) {
      throw new Error(`Invalid requiresUpgrade reference for upgrade ${key}`)
    }

    if (entry.effectType === 'generator') {
      if (!entry.target || !generatorOrder.includes(entry.target)) {
        throw new Error(`Generator upgrade missing valid target: ${key}`)
      }
      if (!entry.multiplier) {
        throw new Error(`Generator upgrade missing multiplier: ${key}`)
      }
      assertDecimalString(entry.multiplier, `upgrade ${key}.multiplier`)
    }

    if (entry.effectType === 'global') {
      if (!entry.multiplier) {
        throw new Error(`Global upgrade missing multiplier: ${key}`)
      }
      assertDecimalString(entry.multiplier, `upgrade ${key}.multiplier`)
    }

    if (entry.effectType === 'offlineCap') {
      if (!entry.offlineCapSeconds || entry.offlineCapSeconds <= 0) {
        throw new Error(`Offline cap upgrade missing positive seconds: ${key}`)
      }
    }

    if (entry.effectType === 'subsystemUnlock' && (!entry.subsystem || !SUBSYSTEM_KEYS.includes(entry.subsystem))) {
      throw new Error(`Subsystem unlock missing valid subsystem: ${key}`)
    }
  }

  for (const key of achievementOrder) {
    if (!ACHIEVEMENT_CONFIG[key]) {
      throw new Error(`Missing achievement config for key: ${key}`)
    }
  }

  for (const key of legacyUpgradeOrder) {
    const entry = LEGACY_UPGRADE_CONFIG[key]
    if (!entry) {
      throw new Error(`Missing legacy upgrade config for key: ${key}`)
    }

    assertDecimalString(entry.cost, `legacy upgrade ${key}.cost`)

    if (!LEGACY_UPGRADE_BRANCHES.includes(entry.branch)) {
      throw new Error(`Legacy upgrade ${key} has invalid branch ${entry.branch}`)
    }

    if (entry.requiresLegacyUpgrade && !legacyUpgradeOrder.includes(entry.requiresLegacyUpgrade)) {
      throw new Error(`Invalid requiresLegacyUpgrade reference for legacy upgrade ${key}`)
    }

    if (entry.effectType === 'offlineCap') {
      if (!entry.offlineCapSeconds || entry.offlineCapSeconds <= 0) {
        throw new Error(`Offline cap legacy upgrade missing positive seconds: ${key}`)
      }
      continue
    }

    if (!entry.value) {
      throw new Error(`Legacy upgrade ${key} missing value`)
    }

    assertDecimalString(entry.value, `legacy upgrade ${key}.value`)
  }

  assertDecimalString(ASCENSION_BALANCE.shardDivisor, 'ascension.shardDivisor')
  assertDecimalString(
    ASCENSION_BALANCE.passiveProductionPerLegacyLevel,
    'ascension.passiveProductionPerLegacyLevel',
  )
  assertDecimalString(MINER_SUBSYSTEM_CONFIG.multiplierExponent, 'miner subsystem multiplier exponent')

  if (!upgradeOrder.includes(MINER_SUBSYSTEM_CONFIG.unlockUpgrade)) {
    throw new Error('Miner subsystem unlockUpgrade must reference a valid run upgrade')
  }

  for (const key of minerSubsystemGeneratorOrder) {
    const entry = MINER_SUBSYSTEM_GENERATOR_CONFIG[key]
    if (!entry) {
      throw new Error(`Missing miner subsystem generator config for key: ${key}`)
    }

    assertDecimalString(entry.baseCost, `miner subsystem generator ${key}.baseCost`)
    assertDecimalString(entry.growth, `miner subsystem generator ${key}.growth`)
    assertDecimalString(entry.baseProduction, `miner subsystem generator ${key}.baseProduction`)
  }

  for (const key of minerSubsystemUpgradeOrder) {
    const entry = MINER_SUBSYSTEM_UPGRADE_CONFIG[key]
    if (!entry) {
      throw new Error(`Missing miner subsystem upgrade config for key: ${key}`)
    }

    assertDecimalString(entry.cost, `miner subsystem upgrade ${key}.cost`)
    assertDecimalString(entry.multiplier, `miner subsystem upgrade ${key}.multiplier`)

    if (entry.requiresOwned && !minerSubsystemGeneratorOrder.includes(entry.requiresOwned.generator)) {
      throw new Error(`Invalid miner subsystem requiresOwned generator for upgrade ${key}`)
    }

    if (
      entry.requiresUpgrade &&
      !minerSubsystemUpgradeOrder.includes(entry.requiresUpgrade)
    ) {
      throw new Error(`Invalid miner subsystem requiresUpgrade reference: ${key}`)
    }

    if (entry.effectType === 'generator') {
      if (!entry.target || !minerSubsystemGeneratorOrder.includes(entry.target)) {
        throw new Error(`Miner subsystem generator upgrade missing valid target: ${key}`)
      }
    }
  }

  for (const [effectType, multiplier] of Object.entries(UPGRADE_COST_MULTIPLIER_BY_TYPE)) {
    assertDecimalString(multiplier, `upgrade cost multiplier ${effectType}`)
  }
}
