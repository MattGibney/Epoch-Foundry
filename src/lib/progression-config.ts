import Decimal from 'decimal.js'

export type GeneratorConfigEntry = {
  key: string
  label: string
  description: string
  baseCost: string
  growth: string
  baseProduction: string
}

export type UpgradeConfigEntry = {
  key: string
  label: string
  description: string
  cost: string
  effectType: 'generator' | 'global' | 'offlineCap'
  target?: string
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
  | { type: 'prestigeResets'; count: number }
  | { type: 'essence'; threshold: string }
  | { type: 'purchasedUpgrades'; count: number }
  | { type: 'offlineCapSeconds'; seconds: number }

export type AchievementConfigEntry = {
  key: string
  label: string
  description: string
  requirement: AchievementRequirement
}

export const PRESTIGE_BALANCE = {
  unlockCredits: '2500000',
  gainExponent: '0.45',
} as const

export const UPGRADE_COST_MULTIPLIER_BY_TYPE = {
  generator: '1.2',
  global: '1.35',
  offlineCap: '1.45',
} as const

export const GENERATOR_CONFIG: Record<string, GeneratorConfigEntry> = {
  miners: {
    key: 'miners',
    label: 'Miners',
    description: 'Basic credit extraction units.',
    baseCost: '20',
    growth: '1.16',
    baseProduction: '1',
  },
  drills: {
    key: 'drills',
    label: 'Drills',
    description: 'Higher-throughput mining rigs.',
    baseCost: '160',
    growth: '1.17',
    baseProduction: '6',
  },
  extractors: {
    key: 'extractors',
    label: 'Extractors',
    description: 'Industrial extraction platforms.',
    baseCost: '1450',
    growth: '1.18',
    baseProduction: '36',
  },
  refineries: {
    key: 'refineries',
    label: 'Refineries',
    description: 'Process raw yield into premium credits.',
    baseCost: '17000',
    growth: '1.19',
    baseProduction: '220',
  },
  megaRigs: {
    key: 'megaRigs',
    label: 'Mega Rigs',
    description: 'Heavy automated credit complexes.',
    baseCost: '220000',
    growth: '1.2',
    baseProduction: '1300',
  },
  orbitalPlatforms: {
    key: 'orbitalPlatforms',
    label: 'Orbital Platforms',
    description: 'Massive orbital credit harvesters.',
    baseCost: '3200000',
    growth: '1.21',
    baseProduction: '7600',
  },
  stellarForges: {
    key: 'stellarForges',
    label: 'Stellar Forges',
    description: 'Star-fed foundries for massive credit throughput.',
    baseCost: '48000000',
    growth: '1.22',
    baseProduction: '45000',
  },
  dysonArrays: {
    key: 'dysonArrays',
    label: 'Dyson Arrays',
    description: 'System-scale collectors that flood the ledger.',
    baseCost: '760000000',
    growth: '1.23',
    baseProduction: '260000',
  },
  singularityWells: {
    key: 'singularityWells',
    label: 'Singularity Wells',
    description: 'Gravity-compressed extraction beyond conventional limits.',
    baseCost: '12000000000',
    growth: '1.24',
    baseProduction: '1500000',
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

export const UPGRADE_CONFIG: Record<string, UpgradeConfigEntry> = {
  minerTuning: { key: 'minerTuning', label: 'Miner Tuning', description: 'Double Miner output.', cost: '120', effectType: 'generator', target: 'miners', multiplier: '2', requiresOwned: { generator: 'miners', count: 10 } },
  minerSwarm: { key: 'minerSwarm', label: 'Miner Swarm Logic', description: 'Triple Miner output.', cost: '1800', effectType: 'generator', target: 'miners', multiplier: '3', requiresOwned: { generator: 'miners', count: 50 }, requiresUpgrade: 'minerTuning' },
  minerFoundries: { key: 'minerFoundries', label: 'Miner Foundries', description: 'Quadruple Miner output.', cost: '25000', effectType: 'generator', target: 'miners', multiplier: '4', requiresOwned: { generator: 'miners', count: 120 }, requiresUpgrade: 'minerSwarm' },
  drillGrease: { key: 'drillGrease', label: 'Drill Grease', description: 'Double Drill output.', cost: '4500', effectType: 'generator', target: 'drills', multiplier: '2', requiresOwned: { generator: 'drills', count: 15 } },
  drillAI: { key: 'drillAI', label: 'Drill AI Routing', description: 'Triple Drill output.', cost: '36000', effectType: 'generator', target: 'drills', multiplier: '3', requiresOwned: { generator: 'drills', count: 60 }, requiresUpgrade: 'drillGrease' },
  drillHypercut: { key: 'drillHypercut', label: 'Drill Hypercut', description: 'Quadruple Drill output.', cost: '450000', effectType: 'generator', target: 'drills', multiplier: '4', requiresOwned: { generator: 'drills', count: 120 }, requiresUpgrade: 'drillAI' },
  extractorCooling: { key: 'extractorCooling', label: 'Extractor Cooling', description: 'Double Extractor output.', cost: '80000', effectType: 'generator', target: 'extractors', multiplier: '2', requiresOwned: { generator: 'extractors', count: 15 } },
  extractorClusters: { key: 'extractorClusters', label: 'Extractor Clusters', description: 'Triple Extractor output.', cost: '650000', effectType: 'generator', target: 'extractors', multiplier: '3', requiresOwned: { generator: 'extractors', count: 60 }, requiresUpgrade: 'extractorCooling' },
  extractorMatrices: { key: 'extractorMatrices', label: 'Extractor Matrices', description: 'Quadruple Extractor output.', cost: '9000000', effectType: 'generator', target: 'extractors', multiplier: '4', requiresOwned: { generator: 'extractors', count: 120 }, requiresUpgrade: 'extractorClusters' },
  refineryCatalysts: { key: 'refineryCatalysts', label: 'Refinery Catalysts', description: 'Double Refinery output.', cost: '1400000', effectType: 'generator', target: 'refineries', multiplier: '2', requiresOwned: { generator: 'refineries', count: 15 } },
  refineryOverdrive: { key: 'refineryOverdrive', label: 'Refinery Overdrive', description: 'Triple Refinery output.', cost: '11000000', effectType: 'generator', target: 'refineries', multiplier: '3', requiresOwned: { generator: 'refineries', count: 60 }, requiresUpgrade: 'refineryCatalysts' },
  refinerySingularities: { key: 'refinerySingularities', label: 'Refinery Singularities', description: 'Quadruple Refinery output.', cost: '180000000', effectType: 'generator', target: 'refineries', multiplier: '4', requiresOwned: { generator: 'refineries', count: 120 }, requiresUpgrade: 'refineryOverdrive' },
  megaRigServos: { key: 'megaRigServos', label: 'Mega Rig Servos', description: 'Double Mega Rig output.', cost: '22000000', effectType: 'generator', target: 'megaRigs', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 15 } },
  megaRigNanites: { key: 'megaRigNanites', label: 'Mega Rig Nanites', description: 'Triple Mega Rig output.', cost: '165000000', effectType: 'generator', target: 'megaRigs', multiplier: '3', requiresOwned: { generator: 'megaRigs', count: 60 }, requiresUpgrade: 'megaRigServos' },
  megaRigSentience: { key: 'megaRigSentience', label: 'Mega Rig Sentience', description: 'Quadruple Mega Rig output.', cost: '2700000000', effectType: 'generator', target: 'megaRigs', multiplier: '4', requiresOwned: { generator: 'megaRigs', count: 120 }, requiresUpgrade: 'megaRigNanites' },
  orbitalDrones: { key: 'orbitalDrones', label: 'Orbital Drone Nets', description: 'Double Orbital Platform output.', cost: '320000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '2', requiresOwned: { generator: 'orbitalPlatforms', count: 12 } },
  orbitalCommand: { key: 'orbitalCommand', label: 'Orbital Command AI', description: 'Triple Orbital Platform output.', cost: '2500000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '3', requiresOwned: { generator: 'orbitalPlatforms', count: 40 }, requiresUpgrade: 'orbitalDrones' },
  orbitalAnchors: { key: 'orbitalAnchors', label: 'Orbital Anchors', description: 'Quadruple Orbital Platform output.', cost: '42000000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '4', requiresOwned: { generator: 'orbitalPlatforms', count: 100 }, requiresUpgrade: 'orbitalCommand' },
  stellarFlux: { key: 'stellarFlux', label: 'Stellar Flux Weaves', description: 'Double Stellar Forge output.', cost: '80000000000', effectType: 'generator', target: 'stellarForges', multiplier: '2', requiresOwned: { generator: 'stellarForges', count: 12 } },
  stellarLattices: { key: 'stellarLattices', label: 'Stellar Lattices', description: 'Triple Stellar Forge output.', cost: '620000000000', effectType: 'generator', target: 'stellarForges', multiplier: '3', requiresOwned: { generator: 'stellarForges', count: 45 }, requiresUpgrade: 'stellarFlux' },
  stellarAscension: { key: 'stellarAscension', label: 'Stellar Ascension', description: 'Quadruple Stellar Forge output.', cost: '4300000000000', effectType: 'generator', target: 'stellarForges', multiplier: '4', requiresOwned: { generator: 'stellarForges', count: 110 }, requiresUpgrade: 'stellarLattices' },
  dysonPhasing: { key: 'dysonPhasing', label: 'Dyson Phasing', description: 'Double Dyson Array output.', cost: '11000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '2', requiresOwned: { generator: 'dysonArrays', count: 12 } },
  dysonHarmonics: { key: 'dysonHarmonics', label: 'Dyson Harmonics', description: 'Triple Dyson Array output.', cost: '78000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '3', requiresOwned: { generator: 'dysonArrays', count: 45 }, requiresUpgrade: 'dysonPhasing' },
  dysonDominion: { key: 'dysonDominion', label: 'Dyson Dominion', description: 'Quadruple Dyson Array output.', cost: '520000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '4', requiresOwned: { generator: 'dysonArrays', count: 110 }, requiresUpgrade: 'dysonHarmonics' },
  singularityContainment: { key: 'singularityContainment', label: 'Singularity Containment', description: 'Double Singularity Well output.', cost: '1400000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '2', requiresOwned: { generator: 'singularityWells', count: 12 } },
  singularityLensing: { key: 'singularityLensing', label: 'Singularity Lensing', description: 'Triple Singularity Well output.', cost: '9500000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '3', requiresOwned: { generator: 'singularityWells', count: 45 }, requiresUpgrade: 'singularityContainment' },
  singularityTranscendence: { key: 'singularityTranscendence', label: 'Singularity Transcendence', description: 'Quadruple Singularity Well output.', cost: '70000000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '4', requiresOwned: { generator: 'singularityWells', count: 110 }, requiresUpgrade: 'singularityLensing' },
  continuumStabilizers: { key: 'continuumStabilizers', label: 'Continuum Stabilizers', description: 'Double Continuum Engine output.', cost: '190000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '2', requiresOwned: { generator: 'continuumEngines', count: 12 } },
  continuumRecursion: { key: 'continuumRecursion', label: 'Continuum Recursion', description: 'Triple Continuum Engine output.', cost: '1250000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '3', requiresOwned: { generator: 'continuumEngines', count: 45 }, requiresUpgrade: 'continuumStabilizers' },
  continuumParadoxCore: { key: 'continuumParadoxCore', label: 'Continuum Paradox Core', description: 'Quadruple Continuum Engine output.', cost: '9000000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '4', requiresOwned: { generator: 'continuumEngines', count: 110 }, requiresUpgrade: 'continuumRecursion' },
  automationLoops: { key: 'automationLoops', label: 'Automation Loops', description: 'Global production x1.5.', cost: '500000', effectType: 'global', multiplier: '1.5', requiresOwned: { generator: 'drills', count: 25 } },
  quantumForecasts: { key: 'quantumForecasts', label: 'Quantum Forecasts', description: 'Global production x2.', cost: '90000000', effectType: 'global', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 25 }, requiresUpgrade: 'automationLoops' },
  fractalEconomies: { key: 'fractalEconomies', label: 'Fractal Economies', description: 'Global production x2.5.', cost: '5000000000000', effectType: 'global', multiplier: '2.5', requiresOwned: { generator: 'stellarForges', count: 30 }, requiresUpgrade: 'quantumForecasts' },
  causalOverclock: { key: 'causalOverclock', label: 'Causal Overclock', description: 'Global production x3.', cost: '150000000000000000', effectType: 'global', multiplier: '3', requiresOwned: { generator: 'singularityWells', count: 30 }, requiresUpgrade: 'fractalEconomies' },
  archiveBatteries: { key: 'archiveBatteries', label: 'Archive Batteries', description: 'Increase offline progress cap by +45 minutes.', cost: '500000000000', effectType: 'offlineCap', offlineCapSeconds: 45 * 60, requiresOwned: { generator: 'orbitalPlatforms', count: 75 } },
  temporalVaults: { key: 'temporalVaults', label: 'Temporal Vaults', description: 'Increase offline progress cap by +1 hour.', cost: '25000000000000', effectType: 'offlineCap', offlineCapSeconds: 1 * 60 * 60, requiresOwned: { generator: 'orbitalPlatforms', count: 180 }, requiresUpgrade: 'archiveBatteries' },
  deepArchive: { key: 'deepArchive', label: 'Deep Archive Vaults', description: 'Increase offline progress cap by +1.5 hours.', cost: '600000000000000', effectType: 'offlineCap', offlineCapSeconds: 90 * 60, requiresOwned: { generator: 'dysonArrays', count: 80 }, requiresUpgrade: 'temporalVaults' },
  chronoReserves: { key: 'chronoReserves', label: 'Chrono Reserves', description: 'Increase offline progress cap by +2.5 hours.', cost: '15000000000000000', effectType: 'offlineCap', offlineCapSeconds: 150 * 60, requiresOwned: { generator: 'continuumEngines', count: 60 }, requiresUpgrade: 'deepArchive' },
}

export const ACHIEVEMENT_CONFIG: Record<string, AchievementConfigEntry> = {
  allCredits5m: { key: 'allCredits5m', label: 'Foundation', description: 'Produce 5 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '5000000' } },
  allCredits10m: { key: 'allCredits10m', label: 'Early Expansion', description: 'Produce 10 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '10000000' } },
  allCredits25m: { key: 'allCredits25m', label: 'Flow Established', description: 'Produce 25 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '25000000' } },
  allCredits50m: { key: 'allCredits50m', label: 'Scaling Up', description: 'Produce 50 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '50000000' } },
  allCredits100m: { key: 'allCredits100m', label: 'Credit Engine', description: 'Produce 100 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '100000000' } },
  allCredits250m: { key: 'allCredits250m', label: 'Networked Output', description: 'Produce 250 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '250000000' } },
  allCredits500m: { key: 'allCredits500m', label: 'Large Throughput', description: 'Produce 500 million credits across all resets.', requirement: { type: 'allResetCredits', threshold: '500000000' } },
  allCredits1b: { key: 'allCredits1b', label: 'First Billion', description: 'Produce 1 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '1000000000' } },
  allCredits2b: { key: 'allCredits2b', label: 'Industrial Flow', description: 'Produce 2 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '2000000000' } },
  allCredits5b: { key: 'allCredits5b', label: 'Industrial Scale', description: 'Produce 5 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '5000000000' } },
  allCredits10b: { key: 'allCredits10b', label: 'Mass Production', description: 'Produce 10 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '10000000000' } },
  allCredits25b: { key: 'allCredits25b', label: 'Macro Throughput', description: 'Produce 25 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '25000000000' } },
  allCredits50b: { key: 'allCredits50b', label: 'Billion Builder', description: 'Produce 50 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '50000000000' } },
  allCredits100b: { key: 'allCredits100b', label: 'Century Billion', description: 'Produce 100 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '100000000000' } },
  allCredits250b: { key: 'allCredits250b', label: 'Macro Economy', description: 'Produce 250 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '250000000000' } },
  allCredits500b: { key: 'allCredits500b', label: 'Half Trillion Runway', description: 'Produce 500 billion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '500000000000' } },
  allCredits1t: { key: 'allCredits1t', label: 'Titan Ledger', description: 'Produce 1 trillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '1000000000000' } },
  allCredits2p5t: { key: 'allCredits2p5t', label: 'Titanic Flow', description: 'Produce 2.5 trillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '2500000000000' } },
  allCredits10t: { key: 'allCredits10t', label: 'Trillion Track', description: 'Produce 10 trillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '10000000000000' } },
  allCredits25t: { key: 'allCredits25t', label: 'Trillion Forge', description: 'Produce 25 trillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '25000000000000' } },
  allCredits100t: { key: 'allCredits100t', label: 'Quadrillion Lift', description: 'Produce 100 trillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '100000000000000' } },
  allCredits250t: { key: 'allCredits250t', label: 'Quarter Quadrillion', description: 'Produce 250 trillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '250000000000000' } },
  allCredits1qa: { key: 'allCredits1qa', label: 'Quintillion Lift', description: 'Produce 1 quadrillion credits across all resets.', requirement: { type: 'allResetCredits', threshold: '1000000000000000' } },
  runCredits1m: { key: 'runCredits1m', label: 'Run Warmup', description: 'Produce 1 million credits in a single run.', requirement: { type: 'runCredits', threshold: '1000000' } },
  runCredits2p5m: { key: 'runCredits2p5m', label: 'Run Warmth', description: 'Produce 2.5 million credits in a single run.', requirement: { type: 'runCredits', threshold: '2500000' } },
  runCredits5m: { key: 'runCredits5m', label: 'Run Momentum', description: 'Produce 5 million credits in a single run.', requirement: { type: 'runCredits', threshold: '5000000' } },
  runCredits10m: { key: 'runCredits10m', label: 'Run Acceleration', description: 'Produce 10 million credits in a single run.', requirement: { type: 'runCredits', threshold: '10000000' } },
  runCredits25m: { key: 'runCredits25m', label: 'Run Engine', description: 'Produce 25 million credits in a single run.', requirement: { type: 'runCredits', threshold: '25000000' } },
  runCredits50m: { key: 'runCredits50m', label: 'Run Ramp', description: 'Produce 50 million credits in a single run.', requirement: { type: 'runCredits', threshold: '50000000' } },
  runCredits100m: { key: 'runCredits100m', label: 'Run Breakthrough', description: 'Produce 100 million credits in a single run.', requirement: { type: 'runCredits', threshold: '100000000' } },
  runCredits250m: { key: 'runCredits250m', label: 'Run Velocity', description: 'Produce 250 million credits in a single run.', requirement: { type: 'runCredits', threshold: '250000000' } },
  runCredits500m: { key: 'runCredits500m', label: 'Run Hyperflow', description: 'Produce 500 million credits in a single run.', requirement: { type: 'runCredits', threshold: '500000000' } },
  runCredits1b: { key: 'runCredits1b', label: 'Run Billionaire', description: 'Produce 1 billion credits in a single run.', requirement: { type: 'runCredits', threshold: '1000000000' } },
  runCredits2b: { key: 'runCredits2b', label: 'Run Industrialized', description: 'Produce 2 billion credits in a single run.', requirement: { type: 'runCredits', threshold: '2000000000' } },
  runCredits5b: { key: 'runCredits5b', label: 'Run Macroflow', description: 'Produce 5 billion credits in a single run.', requirement: { type: 'runCredits', threshold: '5000000000' } },
  runCredits10b: { key: 'runCredits10b', label: 'Run at Scale', description: 'Produce 10 billion credits in a single run.', requirement: { type: 'runCredits', threshold: '10000000000' } },
  runCredits25b: { key: 'runCredits25b', label: 'Run Infrastructure', description: 'Produce 25 billion credits in a single run.', requirement: { type: 'runCredits', threshold: '25000000000' } },
  runCredits50b: { key: 'runCredits50b', label: 'Run Megascale', description: 'Produce 50 billion credits in a single run.', requirement: { type: 'runCredits', threshold: '50000000000' } },
  miners100: { key: 'miners100', label: 'Miner Team', description: 'Own 100 Miners.', requirement: { type: 'owned', generator: 'miners', count: 100 } },
  miners300: { key: 'miners300', label: 'Miner Crew', description: 'Own 300 Miners.', requirement: { type: 'owned', generator: 'miners', count: 300 } },
  miners600: { key: 'miners600', label: 'Miner Battalion', description: 'Own 600 Miners.', requirement: { type: 'owned', generator: 'miners', count: 600 } },
  miners1000: { key: 'miners1000', label: 'Miner Fleet', description: 'Own 1,000 Miners.', requirement: { type: 'owned', generator: 'miners', count: 1000 } },
  miners2000: { key: 'miners2000', label: 'Miner Armada', description: 'Own 2,000 Miners.', requirement: { type: 'owned', generator: 'miners', count: 2000 } },
  drills75: { key: 'drills75', label: 'Drill Team', description: 'Own 75 Drills.', requirement: { type: 'owned', generator: 'drills', count: 75 } },
  drills200: { key: 'drills200', label: 'Drill Crew', description: 'Own 200 Drills.', requirement: { type: 'owned', generator: 'drills', count: 200 } },
  drills400: { key: 'drills400', label: 'Drill Battalion', description: 'Own 400 Drills.', requirement: { type: 'owned', generator: 'drills', count: 400 } },
  drills750: { key: 'drills750', label: 'Drill Fleet', description: 'Own 750 Drills.', requirement: { type: 'owned', generator: 'drills', count: 750 } },
  drills1500: { key: 'drills1500', label: 'Drill Armada', description: 'Own 1,500 Drills.', requirement: { type: 'owned', generator: 'drills', count: 1500 } },
  extractors50: { key: 'extractors50', label: 'Extractor Team', description: 'Own 50 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 50 } },
  extractors120: { key: 'extractors120', label: 'Extractor Crew', description: 'Own 120 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 120 } },
  extractors250: { key: 'extractors250', label: 'Extractor Battalion', description: 'Own 250 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 250 } },
  extractors500: { key: 'extractors500', label: 'Extractor Fleet', description: 'Own 500 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 500 } },
  extractors1000: { key: 'extractors1000', label: 'Extractor Armada', description: 'Own 1,000 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 1000 } },
  refineries40: { key: 'refineries40', label: 'Refinery Team', description: 'Own 40 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 40 } },
  refineries90: { key: 'refineries90', label: 'Refinery Crew', description: 'Own 90 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 90 } },
  refineries200: { key: 'refineries200', label: 'Refinery Battalion', description: 'Own 200 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 200 } },
  refineries400: { key: 'refineries400', label: 'Refinery Fleet', description: 'Own 400 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 400 } },
  refineries800: { key: 'refineries800', label: 'Refinery Armada', description: 'Own 800 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 800 } },
  megaRigs30: { key: 'megaRigs30', label: 'Mega Rig Team', description: 'Own 30 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 30 } },
  megaRigs75: { key: 'megaRigs75', label: 'Mega Rig Crew', description: 'Own 75 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 75 } },
  megaRigs150: { key: 'megaRigs150', label: 'Mega Rig Battalion', description: 'Own 150 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 150 } },
  megaRigs300: { key: 'megaRigs300', label: 'Mega Rig Fleet', description: 'Own 300 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 300 } },
  megaRigs600: { key: 'megaRigs600', label: 'Mega Rig Armada', description: 'Own 600 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 600 } },
  orbitalPlatforms20: { key: 'orbitalPlatforms20', label: 'Orbital Team', description: 'Own 20 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 20 } },
  orbitalPlatforms50: { key: 'orbitalPlatforms50', label: 'Orbital Crew', description: 'Own 50 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 50 } },
  orbitalPlatforms100: { key: 'orbitalPlatforms100', label: 'Orbital Battalion', description: 'Own 100 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 100 } },
  orbitalPlatforms200: { key: 'orbitalPlatforms200', label: 'Orbital Fleet', description: 'Own 200 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 200 } },
  orbitalPlatforms400: { key: 'orbitalPlatforms400', label: 'Orbital Armada', description: 'Own 400 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 400 } },
  stellarForges15: { key: 'stellarForges15', label: 'Stellar Team', description: 'Own 15 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 15 } },
  stellarForges35: { key: 'stellarForges35', label: 'Stellar Crew', description: 'Own 35 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 35 } },
  stellarForges75: { key: 'stellarForges75', label: 'Stellar Battalion', description: 'Own 75 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 75 } },
  stellarForges150: { key: 'stellarForges150', label: 'Stellar Fleet', description: 'Own 150 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 150 } },
  stellarForges300: { key: 'stellarForges300', label: 'Stellar Armada', description: 'Own 300 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 300 } },
  dysonArrays10: { key: 'dysonArrays10', label: 'Dyson Team', description: 'Own 10 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 10 } },
  dysonArrays25: { key: 'dysonArrays25', label: 'Dyson Crew', description: 'Own 25 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 25 } },
  dysonArrays50: { key: 'dysonArrays50', label: 'Dyson Battalion', description: 'Own 50 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 50 } },
  dysonArrays100: { key: 'dysonArrays100', label: 'Dyson Fleet', description: 'Own 100 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 100 } },
  dysonArrays200: { key: 'dysonArrays200', label: 'Dyson Armada', description: 'Own 200 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 200 } },
  singularityWells8: { key: 'singularityWells8', label: 'Singularity Team', description: 'Own 8 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 8 } },
  singularityWells20: { key: 'singularityWells20', label: 'Singularity Crew', description: 'Own 20 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 20 } },
  singularityWells40: { key: 'singularityWells40', label: 'Singularity Battalion', description: 'Own 40 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 40 } },
  singularityWells80: { key: 'singularityWells80', label: 'Singularity Fleet', description: 'Own 80 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 80 } },
  singularityWells160: { key: 'singularityWells160', label: 'Singularity Armada', description: 'Own 160 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 160 } },
  continuumEngines5: { key: 'continuumEngines5', label: 'Continuum Team', description: 'Own 5 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 5 } },
  continuumEngines12: { key: 'continuumEngines12', label: 'Continuum Crew', description: 'Own 12 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 12 } },
  continuumEngines25: { key: 'continuumEngines25', label: 'Continuum Battalion', description: 'Own 25 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 25 } },
  continuumEngines50: { key: 'continuumEngines50', label: 'Continuum Fleet', description: 'Own 50 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 50 } },
  continuumEngines100: { key: 'continuumEngines100', label: 'Continuum Armada', description: 'Own 100 Continuum Engines.', requirement: { type: 'owned', generator: 'continuumEngines', count: 100 } },
  firstPrestige: { key: 'firstPrestige', label: 'Reforged', description: 'Complete your first prestige reset.', requirement: { type: 'prestigeResets', count: 1 } },
  prestige3: { key: 'prestige3', label: 'Cycle Initiate', description: 'Complete 3 prestige resets.', requirement: { type: 'prestigeResets', count: 3 } },
  prestige10: { key: 'prestige10', label: 'Cycle Architect', description: 'Complete 10 prestige resets.', requirement: { type: 'prestigeResets', count: 10 } },
  prestige25: { key: 'prestige25', label: 'Cycle Director', description: 'Complete 25 prestige resets.', requirement: { type: 'prestigeResets', count: 25 } },
  prestige50: { key: 'prestige50', label: 'Epoch Master', description: 'Complete 50 prestige resets.', requirement: { type: 'prestigeResets', count: 50 } },
  prestige100: { key: 'prestige100', label: 'Epoch Sovereign', description: 'Complete 100 prestige resets.', requirement: { type: 'prestigeResets', count: 100 } },
  essence50: { key: 'essence50', label: 'Essence Spark', description: 'Reach 50 essence.', requirement: { type: 'essence', threshold: '50' } },
  essence200: { key: 'essence200', label: 'Essence Current', description: 'Reach 200 essence.', requirement: { type: 'essence', threshold: '200' } },
  essence500: { key: 'essence500', label: 'Essence Stream', description: 'Reach 500 essence.', requirement: { type: 'essence', threshold: '500' } },
  essence2000: { key: 'essence2000', label: 'Essence Surge', description: 'Reach 2,000 essence.', requirement: { type: 'essence', threshold: '2000' } },
  essence5000: { key: 'essence5000', label: 'Essence Storm', description: 'Reach 5,000 essence.', requirement: { type: 'essence', threshold: '5000' } },
  essence20000: { key: 'essence20000', label: 'Essence Tempest', description: 'Reach 20,000 essence.', requirement: { type: 'essence', threshold: '20000' } },
  upgrades10: { key: 'upgrades10', label: 'Workshop Bootstrapped', description: 'Purchase 10 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 10 } },
  upgrades20: { key: 'upgrades20', label: 'Workshop Online', description: 'Purchase 20 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 20 } },
  upgrades28: { key: 'upgrades28', label: 'Workshop Tuned', description: 'Purchase 28 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 28 } },
  upgrades35: { key: 'upgrades35', label: 'Workshop Expanded', description: 'Purchase 35 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 35 } },
  upgrades38: { key: 'upgrades38', label: 'Workshop Complete', description: 'Purchase all 39 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 39 } },
  offlineCap1h: { key: 'offlineCap1h', label: 'Extended Shift', description: 'Increase offline cap to at least 1 hour.', requirement: { type: 'offlineCapSeconds', seconds: 1 * 60 * 60 } },
  offlineCap4h: { key: 'offlineCap4h', label: 'Deep Shift', description: 'Increase offline cap to at least 4 hours.', requirement: { type: 'offlineCapSeconds', seconds: 4 * 60 * 60 } },
  offlineCap12h: { key: 'offlineCap12h', label: 'Long Shift', description: 'Increase offline cap to at least 2 hours.', requirement: { type: 'offlineCapSeconds', seconds: 2 * 60 * 60 } },
  offlineCap24h: { key: 'offlineCap24h', label: 'Night Shift', description: 'Increase offline cap to at least 6 hours.', requirement: { type: 'offlineCapSeconds', seconds: 6 * 60 * 60 } },
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
}): void {
  const { generatorOrder, upgradeOrder, achievementOrder } = params

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
  }

  for (const key of achievementOrder) {
    if (!ACHIEVEMENT_CONFIG[key]) {
      throw new Error(`Missing achievement config for key: ${key}`)
    }
  }

  assertDecimalString(PRESTIGE_BALANCE.unlockCredits, 'prestige.unlockCredits')
  assertDecimalString(PRESTIGE_BALANCE.gainExponent, 'prestige.gainExponent')

  for (const [effectType, multiplier] of Object.entries(UPGRADE_COST_MULTIPLIER_BY_TYPE)) {
    assertDecimalString(multiplier, `upgrade cost multiplier ${effectType}`)
  }
}
