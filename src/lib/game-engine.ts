import Decimal from 'decimal.js'

export type GeneratorKey =
  | 'miners'
  | 'drills'
  | 'extractors'
  | 'refineries'
  | 'megaRigs'
  | 'orbitalPlatforms'
export type RunUpgradeKey =
  | 'minerTuning'
  | 'minerSwarm'
  | 'drillGrease'
  | 'drillAI'
  | 'extractorCooling'
  | 'extractorClusters'
  | 'refineryCatalysts'
  | 'refineryOverdrive'
  | 'megaRigServos'
  | 'megaRigNanites'
  | 'orbitalDrones'
  | 'orbitalCommand'
  | 'automationLoops'
  | 'quantumForecasts'

export const BUY_AMOUNT_OPTIONS = [1, 10, 100] as const

export interface GeneratorsState {
  miners: number
  drills: number
  extractors: number
  refineries: number
  megaRigs: number
  orbitalPlatforms: number
}

export interface PurchasedUpgradesState {
  minerTuning: boolean
  minerSwarm: boolean
  drillGrease: boolean
  drillAI: boolean
  extractorCooling: boolean
  extractorClusters: boolean
  refineryCatalysts: boolean
  refineryOverdrive: boolean
  megaRigServos: boolean
  megaRigNanites: boolean
  orbitalDrones: boolean
  orbitalCommand: boolean
  automationLoops: boolean
  quantumForecasts: boolean
}

export interface StatsState {
  startedAtMs: number
  lastTickAtMs: number
  totalCredits: string
}

export interface GameSettingsState {
  showPurchasedUpgrades: boolean
}

export interface GameState {
  credits: string
  generators: GeneratorsState
  purchasedUpgrades: PurchasedUpgradesState
  buyAmount: number
  stats: StatsState
  settings: GameSettingsState
}

interface GeneratorDef {
  key: GeneratorKey
  label: string
  description: string
  baseCost: string
  growth: string
  baseProduction: string
}

type UpgradeEffectType = 'global' | 'generator'

interface UpgradeDef {
  key: RunUpgradeKey
  label: string
  description: string
  cost: string
  effectType: UpgradeEffectType
  target?: GeneratorKey
  multiplier: string
  requiresOwned?: {
    generator: GeneratorKey
    count: number
  }
}

const ONE = new Decimal(1)
const ZERO = new Decimal(0)
const MAX_TICK_SECONDS = 5

export const GENERATOR_ORDER: GeneratorKey[] = [
  'miners',
  'drills',
  'extractors',
  'refineries',
  'megaRigs',
  'orbitalPlatforms',
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
}

export const UPGRADE_ORDER: RunUpgradeKey[] = [
  'minerTuning',
  'minerSwarm',
  'drillGrease',
  'drillAI',
  'extractorCooling',
  'extractorClusters',
  'refineryCatalysts',
  'refineryOverdrive',
  'megaRigServos',
  'megaRigNanites',
  'orbitalDrones',
  'orbitalCommand',
  'automationLoops',
  'quantumForecasts',
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
  return {
    minerTuning: false,
    minerSwarm: false,
    drillGrease: false,
    drillAI: false,
    extractorCooling: false,
    extractorClusters: false,
    refineryCatalysts: false,
    refineryOverdrive: false,
    megaRigServos: false,
    megaRigNanites: false,
    orbitalDrones: false,
    orbitalCommand: false,
    automationLoops: false,
    quantumForecasts: false,
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
}

export function getTotalProductionPerSecond(state: GameState): Decimal {
  return GENERATOR_ORDER.reduce(
    (total, key) => total.plus(getGeneratorProductionPerSecond(state, key)),
    ZERO,
  )
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
