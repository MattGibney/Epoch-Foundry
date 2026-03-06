import Decimal from 'decimal.js'

export type ResourceKey = 'credits' | 'components' | 'research' | 'influence'
export type GeneratorKey = 'miners' | 'refiners' | 'labs'
export type RunUpgradeKey = 'drills' | 'refining' | 'labTech'
export type TreeNodeKey = 'industry' | 'automation' | 'chronotech'

export const BUY_AMOUNT_OPTIONS = [1, 10, 100] as const

export interface ResourcesState {
  credits: string
  components: string
  research: string
  influence: string
}

export interface GeneratorsState {
  miners: number
  refiners: number
  labs: number
}

export interface RunUpgradesState {
  drills: number
  refining: number
  labTech: number
}

export interface TreeNodesState {
  industry: boolean
  automation: boolean
  chronotech: boolean
}

export interface OverclockState {
  activeUntilMs: number
  cooldownUntilMs: number
}

export interface ContractState {
  index: number
  completedCount: number
}

export interface StatsState {
  startedAtMs: number
  lastTickAtMs: number
  reboots: number
  runCredits: string
  totalCredits: string
  totalComponents: string
  totalResearch: string
}

export interface GameState {
  resources: ResourcesState
  generators: GeneratorsState
  runUpgrades: RunUpgradesState
  treeNodes: TreeNodesState
  overclock: OverclockState
  contract: ContractState
  stats: StatsState
  buyAmount: number
}

interface GeneratorDef {
  key: GeneratorKey
  label: string
  description: string
  currency: ResourceKey
  baseCost: string
  growth: string
}

interface RunUpgradeDef {
  key: RunUpgradeKey
  label: string
  description: string
  currency: ResourceKey
  baseCost: string
  growth: string
}

interface TreeNodeDef {
  key: TreeNodeKey
  label: string
  description: string
  costInfluence: string
}

interface ContractDef {
  id: string
  label: string
  metric: keyof Pick<StatsState, 'totalCredits' | 'totalComponents' | 'totalResearch'>
  target: string
  rewardResource: Extract<ResourceKey, 'research' | 'influence'>
  rewardAmount: string
}

const ONE = new Decimal(1)
const ZERO = new Decimal(0)
const FIVE = new Decimal(5)
const FOUR = new Decimal(4)
const OVERCLOCK_MULTIPLIER = new Decimal(3)
const OVERCLOCK_DURATION_MS = 20_000
const OVERCLOCK_COOLDOWN_MS = 180_000
const MAX_TICK_SECONDS = 5

export const GENERATOR_DEFS: Record<GeneratorKey, GeneratorDef> = {
  miners: {
    key: 'miners',
    label: 'Miners',
    description: 'Extract Credits each second.',
    currency: 'credits',
    baseCost: '10',
    growth: '1.15',
  },
  refiners: {
    key: 'refiners',
    label: 'Refiners',
    description: 'Convert Credits into Components.',
    currency: 'credits',
    baseCost: '250',
    growth: '1.18',
  },
  labs: {
    key: 'labs',
    label: 'Labs',
    description: 'Convert Components into Research.',
    currency: 'components',
    baseCost: '60',
    growth: '1.2',
  },
}

export const RUN_UPGRADE_DEFS: Record<RunUpgradeKey, RunUpgradeDef> = {
  drills: {
    key: 'drills',
    label: 'Improved Drills',
    description: '+25% Miner output per level.',
    currency: 'credits',
    baseCost: '150',
    growth: '2',
  },
  refining: {
    key: 'refining',
    label: 'Precision Refining',
    description: '+20% Refiner throughput per level.',
    currency: 'components',
    baseCost: '20',
    growth: '2.1',
  },
  labTech: {
    key: 'labTech',
    label: 'Neural Lab Cores',
    description: '+15% Lab throughput per level.',
    currency: 'research',
    baseCost: '8',
    growth: '2.3',
  },
}

export const TREE_NODE_DEFS: Record<TreeNodeKey, TreeNodeDef> = {
  industry: {
    key: 'industry',
    label: 'Industry Node',
    description: '+25% global production.',
    costInfluence: '1',
  },
  automation: {
    key: 'automation',
    label: 'Automation Node',
    description: '+10% global production.',
    costInfluence: '2',
  },
  chronotech: {
    key: 'chronotech',
    label: 'Chronotech Node',
    description: '+50% Influence gain on reboot.',
    costInfluence: '3',
  },
}

export const CONTRACT_DEFS: ContractDef[] = [
  {
    id: 'credit-surge',
    label: 'Produce 5,000 Credits',
    metric: 'totalCredits',
    target: '5000',
    rewardResource: 'research',
    rewardAmount: '20',
  },
  {
    id: 'component-batch',
    label: 'Produce 750 Components',
    metric: 'totalComponents',
    target: '750',
    rewardResource: 'research',
    rewardAmount: '45',
  },
  {
    id: 'research-cycle',
    label: 'Produce 180 Research',
    metric: 'totalResearch',
    target: '180',
    rewardResource: 'influence',
    rewardAmount: '1',
  },
]

function toDecimal(value: Decimal.Value): Decimal {
  return new Decimal(value)
}

function resourceDecimals(resources: ResourcesState): Record<ResourceKey, Decimal> {
  return {
    credits: toDecimal(resources.credits),
    components: toDecimal(resources.components),
    research: toDecimal(resources.research),
    influence: toDecimal(resources.influence),
  }
}

function decimalResources(resources: Record<ResourceKey, Decimal>): ResourcesState {
  return {
    credits: resources.credits.toString(),
    components: resources.components.toString(),
    research: resources.research.toString(),
    influence: resources.influence.toString(),
  }
}

function addClampedResource(
  resources: Record<ResourceKey, Decimal>,
  key: ResourceKey,
  amount: Decimal,
) {
  resources[key] = Decimal.max(ZERO, resources[key].plus(amount))
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
  const series = growth.pow(amount).minus(ONE).div(growth.minus(ONE))
  return baseCost.times(ownedScale).times(series)
}

export function createInitialGameState(nowMs = Date.now()): GameState {
  return {
    resources: {
      credits: '10',
      components: '0',
      research: '0',
      influence: '0',
    },
    generators: {
      miners: 1,
      refiners: 0,
      labs: 0,
    },
    runUpgrades: {
      drills: 0,
      refining: 0,
      labTech: 0,
    },
    treeNodes: {
      industry: false,
      automation: false,
      chronotech: false,
    },
    overclock: {
      activeUntilMs: 0,
      cooldownUntilMs: 0,
    },
    contract: {
      index: 0,
      completedCount: 0,
    },
    stats: {
      startedAtMs: nowMs,
      lastTickAtMs: nowMs,
      reboots: 0,
      runCredits: '0',
      totalCredits: '0',
      totalComponents: '0',
      totalResearch: '0',
    },
    buyAmount: BUY_AMOUNT_OPTIONS[0],
  }
}

export function isOverclockActive(state: GameState, nowMs: number): boolean {
  return nowMs < state.overclock.activeUntilMs
}

function globalProductionMultiplier(state: GameState, nowMs: number): Decimal {
  let multiplier = ONE

  if (state.treeNodes.industry) {
    multiplier = multiplier.times('1.25')
  }

  if (state.treeNodes.automation) {
    multiplier = multiplier.times('1.1')
  }

  if (isOverclockActive(state, nowMs)) {
    multiplier = multiplier.times(OVERCLOCK_MULTIPLIER)
  }

  return multiplier
}

export function getProductionRates(state: GameState, nowMs: number) {
  const globalMultiplier = globalProductionMultiplier(state, nowMs)

  const minersPerSecond = toDecimal(state.generators.miners)
    .times(ONE.plus(toDecimal(state.runUpgrades.drills).times('0.25')))
    .times(globalMultiplier)

  const refinerCyclesPerSecond = toDecimal(state.generators.refiners)
    .times('0.35')
    .times(ONE.plus(toDecimal(state.runUpgrades.refining).times('0.2')))
    .times(globalMultiplier)

  const labCyclesPerSecond = toDecimal(state.generators.labs)
    .times('0.18')
    .times(ONE.plus(toDecimal(state.runUpgrades.labTech).times('0.15')))
    .times(globalMultiplier)

  return {
    creditsPerSecond: minersPerSecond,
    componentsPerSecond: refinerCyclesPerSecond,
    researchPerSecond: labCyclesPerSecond,
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

  const elapsed = toDecimal(elapsedSeconds)
  const resources = resourceDecimals(state.resources)
  const rates = getProductionRates(state, nowMs)

  const creditsProduced = rates.creditsPerSecond.times(elapsed)
  addClampedResource(resources, 'credits', creditsProduced)

  const desiredRefinerCycles = rates.componentsPerSecond.times(elapsed)
  const affordableRefinerCycles = resources.credits.div(FIVE)
  const refinerCycles = Decimal.min(desiredRefinerCycles, affordableRefinerCycles)

  if (refinerCycles.greaterThan(0)) {
    addClampedResource(resources, 'credits', refinerCycles.times(FIVE).negated())
    addClampedResource(resources, 'components', refinerCycles)
  }

  const desiredLabCycles = rates.researchPerSecond.times(elapsed)
  const affordableLabCycles = resources.components.div(FOUR)
  const labCycles = Decimal.min(desiredLabCycles, affordableLabCycles)

  if (labCycles.greaterThan(0)) {
    addClampedResource(resources, 'components', labCycles.times(FOUR).negated())
    addClampedResource(resources, 'research', labCycles)
  }

  return {
    ...state,
    resources: decimalResources(resources),
    stats: {
      ...state.stats,
      lastTickAtMs: nowMs,
      runCredits: toDecimal(state.stats.runCredits).plus(creditsProduced).toString(),
      totalCredits: toDecimal(state.stats.totalCredits).plus(creditsProduced).toString(),
      totalComponents: toDecimal(state.stats.totalComponents).plus(refinerCycles).toString(),
      totalResearch: toDecimal(state.stats.totalResearch).plus(labCycles).toString(),
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

export function getGeneratorCost(
  state: GameState,
  key: GeneratorKey,
  amount = state.buyAmount,
): Decimal {
  const generator = GENERATOR_DEFS[key]
  return calculateBulkCost(
    toDecimal(generator.baseCost),
    toDecimal(generator.growth),
    state.generators[key],
    amount,
  )
}

export function buyGenerator(state: GameState, key: GeneratorKey): GameState {
  const generator = GENERATOR_DEFS[key]
  const cost = getGeneratorCost(state, key, state.buyAmount)
  const resources = resourceDecimals(state.resources)

  if (resources[generator.currency].lessThan(cost)) {
    return state
  }

  addClampedResource(resources, generator.currency, cost.negated())

  return {
    ...state,
    resources: decimalResources(resources),
    generators: {
      ...state.generators,
      [key]: state.generators[key] + state.buyAmount,
    },
  }
}

export function getRunUpgradeCost(state: GameState, key: RunUpgradeKey): Decimal {
  const upgrade = RUN_UPGRADE_DEFS[key]
  return toDecimal(upgrade.baseCost).times(
    toDecimal(upgrade.growth).pow(state.runUpgrades[key]),
  )
}

export function buyRunUpgrade(state: GameState, key: RunUpgradeKey): GameState {
  const upgrade = RUN_UPGRADE_DEFS[key]
  const cost = getRunUpgradeCost(state, key)
  const resources = resourceDecimals(state.resources)

  if (resources[upgrade.currency].lessThan(cost)) {
    return state
  }

  addClampedResource(resources, upgrade.currency, cost.negated())

  return {
    ...state,
    resources: decimalResources(resources),
    runUpgrades: {
      ...state.runUpgrades,
      [key]: state.runUpgrades[key] + 1,
    },
  }
}

export function unlockTreeNode(state: GameState, key: TreeNodeKey): GameState {
  if (state.treeNodes[key]) {
    return state
  }

  const node = TREE_NODE_DEFS[key]
  const resources = resourceDecimals(state.resources)
  const cost = toDecimal(node.costInfluence)

  if (resources.influence.lessThan(cost)) {
    return state
  }

  addClampedResource(resources, 'influence', cost.negated())

  return {
    ...state,
    resources: decimalResources(resources),
    treeNodes: {
      ...state.treeNodes,
      [key]: true,
    },
  }
}

export function canTriggerOverclock(state: GameState, nowMs: number): boolean {
  return nowMs >= state.overclock.cooldownUntilMs
}

export function triggerOverclock(state: GameState, nowMs: number): GameState {
  if (!canTriggerOverclock(state, nowMs)) {
    return state
  }

  return {
    ...state,
    overclock: {
      activeUntilMs: nowMs + OVERCLOCK_DURATION_MS,
      cooldownUntilMs: nowMs + OVERCLOCK_COOLDOWN_MS,
    },
  }
}

export function getOverclockTime(state: GameState, nowMs: number) {
  return {
    activeSecondsRemaining: Math.max(
      0,
      (state.overclock.activeUntilMs - nowMs) / 1_000,
    ),
    cooldownSecondsRemaining: Math.max(
      0,
      (state.overclock.cooldownUntilMs - nowMs) / 1_000,
    ),
  }
}

export function getActiveContract(state: GameState): ContractDef {
  const index = state.contract.index % CONTRACT_DEFS.length
  return CONTRACT_DEFS[index] ?? CONTRACT_DEFS[0]
}

export function getContractProgress(state: GameState) {
  const contract = getActiveContract(state)
  const current = toDecimal(state.stats[contract.metric])
  const target = toDecimal(contract.target)

  return {
    contract,
    current,
    target,
    isComplete: current.greaterThanOrEqualTo(target),
  }
}

export function claimContract(state: GameState): GameState {
  const progress = getContractProgress(state)
  if (!progress.isComplete) {
    return state
  }

  const resources = resourceDecimals(state.resources)
  addClampedResource(
    resources,
    progress.contract.rewardResource,
    toDecimal(progress.contract.rewardAmount),
  )

  return {
    ...state,
    resources: decimalResources(resources),
    contract: {
      index: state.contract.index + 1,
      completedCount: state.contract.completedCount + 1,
    },
  }
}

export function getPotentialInfluence(state: GameState): Decimal {
  const runCredits = toDecimal(state.stats.runCredits)
  if (runCredits.lessThan('1e6')) {
    return ZERO
  }

  let influence = runCredits.log(10).minus(5).floor()
  if (state.treeNodes.chronotech) {
    influence = influence.times('1.5').floor()
  }

  return Decimal.max(ZERO, influence)
}

export function reboot(state: GameState, nowMs: number): GameState {
  const influenceGain = getPotentialInfluence(state)
  if (influenceGain.lessThanOrEqualTo(0)) {
    return state
  }

  const influenceAfter = toDecimal(state.resources.influence).plus(influenceGain)
  const initial = createInitialGameState(nowMs)

  return {
    ...initial,
    resources: {
      ...initial.resources,
      influence: influenceAfter.toString(),
    },
    treeNodes: { ...state.treeNodes },
    stats: {
      ...initial.stats,
      reboots: state.stats.reboots + 1,
      totalCredits: state.stats.totalCredits,
      totalComponents: state.stats.totalComponents,
      totalResearch: state.stats.totalResearch,
    },
  }
}
