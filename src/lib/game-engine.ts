import Decimal from 'decimal.js'

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

export interface StatsState {
  startedAtMs: number
  lastTickAtMs: number
  totalCredits: string
}

export interface GameSettingsState {
  showPurchasedUpgrades: boolean
}

export interface PrestigeState {
  resets: number
  essence: string
}

export interface GameState {
  credits: string
  generators: GeneratorsState
  purchasedUpgrades: PurchasedUpgradesState
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
const PRESTIGE_UNLOCK_CREDITS = new Decimal('1000000')
const PRESTIGE_ESSENCE_MULTIPLIER_STEP = new Decimal('0.1')

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

export const GENERATOR_DEFS: Record<GeneratorKey, GeneratorDef> = {
  miners: {
    key: 'miners',
    label: 'Miners',
    description: 'Basic credit extraction units.',
    baseCost: '15',
    growth: '1.15',
    baseProduction: '1',
  },
  drills: {
    key: 'drills',
    label: 'Drills',
    description: 'Higher-throughput mining rigs.',
    baseCost: '120',
    growth: '1.16',
    baseProduction: '7',
  },
  extractors: {
    key: 'extractors',
    label: 'Extractors',
    description: 'Industrial extraction platforms.',
    baseCost: '1100',
    growth: '1.17',
    baseProduction: '42',
  },
  refineries: {
    key: 'refineries',
    label: 'Refineries',
    description: 'Process raw yield into premium credits.',
    baseCost: '12500',
    growth: '1.18',
    baseProduction: '260',
  },
  megaRigs: {
    key: 'megaRigs',
    label: 'Mega Rigs',
    description: 'Heavy automated credit complexes.',
    baseCost: '140000',
    growth: '1.19',
    baseProduction: '1500',
  },
  orbitalPlatforms: {
    key: 'orbitalPlatforms',
    label: 'Orbital Platforms',
    description: 'Massive orbital credit harvesters.',
    baseCost: '1600000',
    growth: '1.2',
    baseProduction: '9000',
  },
  stellarForges: {
    key: 'stellarForges',
    label: 'Stellar Forges',
    description: 'Star-fed foundries for massive credit throughput.',
    baseCost: '20000000',
    growth: '1.21',
    baseProduction: '55000',
  },
  dysonArrays: {
    key: 'dysonArrays',
    label: 'Dyson Arrays',
    description: 'System-scale collectors that flood the ledger.',
    baseCost: '260000000',
    growth: '1.22',
    baseProduction: '320000',
  },
  singularityWells: {
    key: 'singularityWells',
    label: 'Singularity Wells',
    description: 'Gravity-compressed extraction beyond conventional limits.',
    baseCost: '3300000000',
    growth: '1.23',
    baseProduction: '1900000',
  },
  continuumEngines: {
    key: 'continuumEngines',
    label: 'Continuum Engines',
    description: 'Temporal-scale engines for extreme credit acceleration.',
    baseCost: '42000000000',
    growth: '1.24',
    baseProduction: '11000000',
  },
}

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

export const UPGRADE_DEFS: Record<RunUpgradeKey, UpgradeDef> = {
  minerTuning: {
    key: 'minerTuning',
    label: 'Miner Tuning',
    description: 'Double Miner output.',
    cost: '120',
    effectType: 'generator',
    target: 'miners',
    multiplier: '2',
    requiresOwned: { generator: 'miners', count: 10 },
  },
  minerSwarm: {
    key: 'minerSwarm',
    label: 'Miner Swarm Logic',
    description: 'Triple Miner output.',
    cost: '1800',
    effectType: 'generator',
    target: 'miners',
    multiplier: '3',
    requiresOwned: { generator: 'miners', count: 50 },
  },
  minerFoundries: {
    key: 'minerFoundries',
    label: 'Miner Foundries',
    description: 'Quadruple Miner output.',
    cost: '25000',
    effectType: 'generator',
    target: 'miners',
    multiplier: '4',
    requiresOwned: { generator: 'miners', count: 120 },
  },
  drillGrease: {
    key: 'drillGrease',
    label: 'Drill Grease',
    description: 'Double Drill output.',
    cost: '4500',
    effectType: 'generator',
    target: 'drills',
    multiplier: '2',
    requiresOwned: { generator: 'drills', count: 15 },
  },
  drillAI: {
    key: 'drillAI',
    label: 'Drill AI Routing',
    description: 'Triple Drill output.',
    cost: '36000',
    effectType: 'generator',
    target: 'drills',
    multiplier: '3',
    requiresOwned: { generator: 'drills', count: 60 },
  },
  drillHypercut: {
    key: 'drillHypercut',
    label: 'Drill Hypercut',
    description: 'Quadruple Drill output.',
    cost: '450000',
    effectType: 'generator',
    target: 'drills',
    multiplier: '4',
    requiresOwned: { generator: 'drills', count: 120 },
  },
  extractorCooling: {
    key: 'extractorCooling',
    label: 'Extractor Cooling',
    description: 'Double Extractor output.',
    cost: '80000',
    effectType: 'generator',
    target: 'extractors',
    multiplier: '2',
    requiresOwned: { generator: 'extractors', count: 15 },
  },
  extractorClusters: {
    key: 'extractorClusters',
    label: 'Extractor Clusters',
    description: 'Triple Extractor output.',
    cost: '650000',
    effectType: 'generator',
    target: 'extractors',
    multiplier: '3',
    requiresOwned: { generator: 'extractors', count: 60 },
  },
  extractorMatrices: {
    key: 'extractorMatrices',
    label: 'Extractor Matrices',
    description: 'Quadruple Extractor output.',
    cost: '9000000',
    effectType: 'generator',
    target: 'extractors',
    multiplier: '4',
    requiresOwned: { generator: 'extractors', count: 120 },
  },
  refineryCatalysts: {
    key: 'refineryCatalysts',
    label: 'Refinery Catalysts',
    description: 'Double Refinery output.',
    cost: '1400000',
    effectType: 'generator',
    target: 'refineries',
    multiplier: '2',
    requiresOwned: { generator: 'refineries', count: 15 },
  },
  refineryOverdrive: {
    key: 'refineryOverdrive',
    label: 'Refinery Overdrive',
    description: 'Triple Refinery output.',
    cost: '11000000',
    effectType: 'generator',
    target: 'refineries',
    multiplier: '3',
    requiresOwned: { generator: 'refineries', count: 60 },
  },
  refinerySingularities: {
    key: 'refinerySingularities',
    label: 'Refinery Singularities',
    description: 'Quadruple Refinery output.',
    cost: '180000000',
    effectType: 'generator',
    target: 'refineries',
    multiplier: '4',
    requiresOwned: { generator: 'refineries', count: 120 },
  },
  megaRigServos: {
    key: 'megaRigServos',
    label: 'Mega Rig Servos',
    description: 'Double Mega Rig output.',
    cost: '22000000',
    effectType: 'generator',
    target: 'megaRigs',
    multiplier: '2',
    requiresOwned: { generator: 'megaRigs', count: 15 },
  },
  megaRigNanites: {
    key: 'megaRigNanites',
    label: 'Mega Rig Nanites',
    description: 'Triple Mega Rig output.',
    cost: '165000000',
    effectType: 'generator',
    target: 'megaRigs',
    multiplier: '3',
    requiresOwned: { generator: 'megaRigs', count: 60 },
  },
  megaRigSentience: {
    key: 'megaRigSentience',
    label: 'Mega Rig Sentience',
    description: 'Quadruple Mega Rig output.',
    cost: '2700000000',
    effectType: 'generator',
    target: 'megaRigs',
    multiplier: '4',
    requiresOwned: { generator: 'megaRigs', count: 120 },
  },
  orbitalDrones: {
    key: 'orbitalDrones',
    label: 'Orbital Drone Nets',
    description: 'Double Orbital Platform output.',
    cost: '320000000',
    effectType: 'generator',
    target: 'orbitalPlatforms',
    multiplier: '2',
    requiresOwned: { generator: 'orbitalPlatforms', count: 12 },
  },
  orbitalCommand: {
    key: 'orbitalCommand',
    label: 'Orbital Command AI',
    description: 'Triple Orbital Platform output.',
    cost: '2500000000',
    effectType: 'generator',
    target: 'orbitalPlatforms',
    multiplier: '3',
    requiresOwned: { generator: 'orbitalPlatforms', count: 40 },
  },
  orbitalAnchors: {
    key: 'orbitalAnchors',
    label: 'Orbital Anchors',
    description: 'Quadruple Orbital Platform output.',
    cost: '42000000000',
    effectType: 'generator',
    target: 'orbitalPlatforms',
    multiplier: '4',
    requiresOwned: { generator: 'orbitalPlatforms', count: 100 },
  },
  stellarFlux: {
    key: 'stellarFlux',
    label: 'Stellar Flux Weaves',
    description: 'Double Stellar Forge output.',
    cost: '80000000000',
    effectType: 'generator',
    target: 'stellarForges',
    multiplier: '2',
    requiresOwned: { generator: 'stellarForges', count: 12 },
  },
  stellarLattices: {
    key: 'stellarLattices',
    label: 'Stellar Lattices',
    description: 'Triple Stellar Forge output.',
    cost: '620000000000',
    effectType: 'generator',
    target: 'stellarForges',
    multiplier: '3',
    requiresOwned: { generator: 'stellarForges', count: 45 },
  },
  stellarAscension: {
    key: 'stellarAscension',
    label: 'Stellar Ascension',
    description: 'Quadruple Stellar Forge output.',
    cost: '4300000000000',
    effectType: 'generator',
    target: 'stellarForges',
    multiplier: '4',
    requiresOwned: { generator: 'stellarForges', count: 110 },
  },
  dysonPhasing: {
    key: 'dysonPhasing',
    label: 'Dyson Phasing',
    description: 'Double Dyson Array output.',
    cost: '11000000000000',
    effectType: 'generator',
    target: 'dysonArrays',
    multiplier: '2',
    requiresOwned: { generator: 'dysonArrays', count: 12 },
  },
  dysonHarmonics: {
    key: 'dysonHarmonics',
    label: 'Dyson Harmonics',
    description: 'Triple Dyson Array output.',
    cost: '78000000000000',
    effectType: 'generator',
    target: 'dysonArrays',
    multiplier: '3',
    requiresOwned: { generator: 'dysonArrays', count: 45 },
  },
  dysonDominion: {
    key: 'dysonDominion',
    label: 'Dyson Dominion',
    description: 'Quadruple Dyson Array output.',
    cost: '520000000000000',
    effectType: 'generator',
    target: 'dysonArrays',
    multiplier: '4',
    requiresOwned: { generator: 'dysonArrays', count: 110 },
  },
  singularityContainment: {
    key: 'singularityContainment',
    label: 'Singularity Containment',
    description: 'Double Singularity Well output.',
    cost: '1400000000000000',
    effectType: 'generator',
    target: 'singularityWells',
    multiplier: '2',
    requiresOwned: { generator: 'singularityWells', count: 12 },
  },
  singularityLensing: {
    key: 'singularityLensing',
    label: 'Singularity Lensing',
    description: 'Triple Singularity Well output.',
    cost: '9500000000000000',
    effectType: 'generator',
    target: 'singularityWells',
    multiplier: '3',
    requiresOwned: { generator: 'singularityWells', count: 45 },
  },
  singularityTranscendence: {
    key: 'singularityTranscendence',
    label: 'Singularity Transcendence',
    description: 'Quadruple Singularity Well output.',
    cost: '70000000000000000',
    effectType: 'generator',
    target: 'singularityWells',
    multiplier: '4',
    requiresOwned: { generator: 'singularityWells', count: 110 },
  },
  continuumStabilizers: {
    key: 'continuumStabilizers',
    label: 'Continuum Stabilizers',
    description: 'Double Continuum Engine output.',
    cost: '190000000000000000',
    effectType: 'generator',
    target: 'continuumEngines',
    multiplier: '2',
    requiresOwned: { generator: 'continuumEngines', count: 12 },
  },
  continuumRecursion: {
    key: 'continuumRecursion',
    label: 'Continuum Recursion',
    description: 'Triple Continuum Engine output.',
    cost: '1250000000000000000',
    effectType: 'generator',
    target: 'continuumEngines',
    multiplier: '3',
    requiresOwned: { generator: 'continuumEngines', count: 45 },
  },
  continuumParadoxCore: {
    key: 'continuumParadoxCore',
    label: 'Continuum Paradox Core',
    description: 'Quadruple Continuum Engine output.',
    cost: '9000000000000000000',
    effectType: 'generator',
    target: 'continuumEngines',
    multiplier: '4',
    requiresOwned: { generator: 'continuumEngines', count: 110 },
  },
  automationLoops: {
    key: 'automationLoops',
    label: 'Automation Loops',
    description: 'Global production x1.5.',
    cost: '500000',
    effectType: 'global',
    multiplier: '1.5',
    requiresOwned: { generator: 'drills', count: 25 },
  },
  quantumForecasts: {
    key: 'quantumForecasts',
    label: 'Quantum Forecasts',
    description: 'Global production x2.',
    cost: '90000000',
    effectType: 'global',
    multiplier: '2',
    requiresOwned: { generator: 'megaRigs', count: 25 },
  },
  fractalEconomies: {
    key: 'fractalEconomies',
    label: 'Fractal Economies',
    description: 'Global production x2.5.',
    cost: '5000000000000',
    effectType: 'global',
    multiplier: '2.5',
    requiresOwned: { generator: 'stellarForges', count: 30 },
  },
  causalOverclock: {
    key: 'causalOverclock',
    label: 'Causal Overclock',
    description: 'Global production x3.',
    cost: '150000000000000000',
    effectType: 'global',
    multiplier: '3',
    requiresOwned: { generator: 'singularityWells', count: 30 },
  },
  archiveBatteries: {
    key: 'archiveBatteries',
    label: 'Archive Batteries',
    description: 'Increase offline progress cap by +30 minutes.',
    cost: '7500000000000',
    effectType: 'offlineCap',
    offlineCapSeconds: 30 * 60,
    requiresOwned: { generator: 'orbitalPlatforms', count: 75 },
  },
  temporalVaults: {
    key: 'temporalVaults',
    label: 'Temporal Vaults',
    description: 'Increase offline progress cap by +3 hours.',
    cost: '2500000000000000',
    effectType: 'offlineCap',
    offlineCapSeconds: 3 * 60 * 60,
    requiresOwned: { generator: 'orbitalPlatforms', count: 180 },
  },
  deepArchive: {
    key: 'deepArchive',
    label: 'Deep Archive Vaults',
    description: 'Increase offline progress cap by +8 hours.',
    cost: '4000000000000000000',
    effectType: 'offlineCap',
    offlineCapSeconds: 8 * 60 * 60,
    requiresOwned: { generator: 'dysonArrays', count: 80 },
  },
  chronoReserves: {
    key: 'chronoReserves',
    label: 'Chrono Reserves',
    description: 'Increase offline progress cap by +24 hours.',
    cost: '95000000000000000000',
    effectType: 'offlineCap',
    offlineCapSeconds: 24 * 60 * 60,
    requiresOwned: { generator: 'continuumEngines', count: 60 },
  },
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
    buyAmount: BUY_AMOUNT_OPTIONS[0],
    stats: {
      startedAtMs: nowMs,
      lastTickAtMs: nowMs,
      totalCredits: '0',
    },
    settings: {
      showPurchasedUpgrades: false,
    },
    prestige: createInitialPrestigeState(),
  }
}

export function getPrestigeGainForReset(state: GameState): Decimal {
  const runTotalCredits = toDecimal(state.stats.totalCredits)
  if (runTotalCredits.lessThan(PRESTIGE_UNLOCK_CREDITS)) {
    return ZERO
  }

  return runTotalCredits.div(PRESTIGE_UNLOCK_CREDITS).sqrt().floor()
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

  return {
    ...initialState,
    settings: state.settings,
    prestige: {
      resets: state.prestige.resets + 1,
      essence: toDecimal(state.prestige.essence).plus(gainedEssence).toString(),
    },
  }
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

function getGlobalProductionMultiplier(state: GameState): Decimal {
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

  return {
    ...state,
    credits: toDecimal(state.credits).plus(produced).toString(),
    stats: {
      ...state.stats,
      lastTickAtMs: effectiveNowMs,
      totalCredits: toDecimal(state.stats.totalCredits).plus(produced).toString(),
    },
  }
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

  return {
    ...state,
    credits: toDecimal(state.credits).plus(produced).toString(),
    stats: {
      ...state.stats,
      lastTickAtMs: nowMs,
      totalCredits: toDecimal(state.stats.totalCredits).plus(produced).toString(),
    },
  }
}

export function buyGenerator(state: GameState, key: GeneratorKey): GameState {
  const cost = getGeneratorCost(state, key, state.buyAmount)
  const credits = toDecimal(state.credits)

  if (credits.lessThan(cost)) {
    return state
  }

  return {
    ...state,
    credits: credits.minus(cost).toString(),
    generators: {
      ...state.generators,
      [key]: state.generators[key] + state.buyAmount,
    },
  }
}

export function isUpgradeUnlocked(state: GameState, key: RunUpgradeKey): boolean {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade || !upgrade.requiresOwned) {
    return true
  }

  return state.generators[upgrade.requiresOwned.generator] >= upgrade.requiresOwned.count
}

export function getUpgradeUnlockProgress(state: GameState, key: RunUpgradeKey) {
  const upgrade = UPGRADE_DEFS[key]
  if (!upgrade || !upgrade.requiresOwned) {
    return null
  }

  return {
    generator: upgrade.requiresOwned.generator,
    current: state.generators[upgrade.requiresOwned.generator],
    required: upgrade.requiresOwned.count,
  }
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

  return {
    ...state,
    credits: toDecimal(state.credits).minus(upgrade.cost).toString(),
    purchasedUpgrades: {
      ...state.purchasedUpgrades,
      [key]: true,
    },
  }
}
