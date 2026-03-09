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
  unlockCredits: '1000000',
  gainExponent: '0.6',
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
    baseCost: '15',
    growth: '1.15',
    baseProduction: '1.25',
  },
  drills: {
    key: 'drills',
    label: 'Drills',
    description: 'Higher-throughput mining rigs.',
    baseCost: '120',
    growth: '1.16',
    baseProduction: '8',
  },
  extractors: {
    key: 'extractors',
    label: 'Extractors',
    description: 'Industrial extraction platforms.',
    baseCost: '900',
    growth: '1.17',
    baseProduction: '48',
  },
  refineries: {
    key: 'refineries',
    label: 'Refineries',
    description: 'Process raw yield into premium credits.',
    baseCost: '9000',
    growth: '1.18',
    baseProduction: '280',
  },
  megaRigs: {
    key: 'megaRigs',
    label: 'Mega Rigs',
    description: 'Heavy automated credit complexes.',
    baseCost: '110000',
    growth: '1.19',
    baseProduction: '1700',
  },
  orbitalPlatforms: {
    key: 'orbitalPlatforms',
    label: 'Orbital Platforms',
    description: 'Massive orbital credit harvesters.',
    baseCost: '2100000',
    growth: '1.2',
    baseProduction: '11000',
  },
  stellarForges: {
    key: 'stellarForges',
    label: 'Stellar Forges',
    description: 'Star-fed foundries for massive credit throughput.',
    baseCost: '25000000',
    growth: '1.21',
    baseProduction: '65000',
  },
  dysonArrays: {
    key: 'dysonArrays',
    label: 'Dyson Arrays',
    description: 'System-scale collectors that flood the ledger.',
    baseCost: '300000000',
    growth: '1.22',
    baseProduction: '420000',
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
  minerOvermind: { key: 'minerOvermind', label: 'Miner Overmind', description: 'Quintuple Miner output.', cost: '400000', effectType: 'generator', target: 'miners', multiplier: '5', requiresOwned: { generator: 'miners', count: 240 }, requiresUpgrade: 'minerFoundries' },
  drillGrease: { key: 'drillGrease', label: 'Drill Grease', description: 'Double Drill output.', cost: '4500', effectType: 'generator', target: 'drills', multiplier: '2', requiresOwned: { generator: 'drills', count: 15 } },
  drillAI: { key: 'drillAI', label: 'Drill AI Routing', description: 'Triple Drill output.', cost: '36000', effectType: 'generator', target: 'drills', multiplier: '3', requiresOwned: { generator: 'drills', count: 60 }, requiresUpgrade: 'drillGrease' },
  drillHypercut: { key: 'drillHypercut', label: 'Drill Hypercut', description: 'Quadruple Drill output.', cost: '450000', effectType: 'generator', target: 'drills', multiplier: '4', requiresOwned: { generator: 'drills', count: 120 }, requiresUpgrade: 'drillAI' },
  drillSingularity: { key: 'drillSingularity', label: 'Drill Singularity', description: 'Quintuple Drill output.', cost: '7000000', effectType: 'generator', target: 'drills', multiplier: '5', requiresOwned: { generator: 'drills', count: 240 }, requiresUpgrade: 'drillHypercut' },
  extractorCooling: { key: 'extractorCooling', label: 'Extractor Cooling', description: 'Double Extractor output.', cost: '80000', effectType: 'generator', target: 'extractors', multiplier: '2', requiresOwned: { generator: 'extractors', count: 15 } },
  extractorClusters: { key: 'extractorClusters', label: 'Extractor Clusters', description: 'Triple Extractor output.', cost: '650000', effectType: 'generator', target: 'extractors', multiplier: '3', requiresOwned: { generator: 'extractors', count: 60 }, requiresUpgrade: 'extractorCooling' },
  extractorMatrices: { key: 'extractorMatrices', label: 'Extractor Matrices', description: 'Quadruple Extractor output.', cost: '9000000', effectType: 'generator', target: 'extractors', multiplier: '4', requiresOwned: { generator: 'extractors', count: 120 }, requiresUpgrade: 'extractorClusters' },
  extractorHypergrid: { key: 'extractorHypergrid', label: 'Extractor Hypergrid', description: 'Quintuple Extractor output.', cost: '120000000', effectType: 'generator', target: 'extractors', multiplier: '5', requiresOwned: { generator: 'extractors', count: 240 }, requiresUpgrade: 'extractorMatrices' },
  refineryCatalysts: { key: 'refineryCatalysts', label: 'Refinery Catalysts', description: 'Double Refinery output.', cost: '1400000', effectType: 'generator', target: 'refineries', multiplier: '2', requiresOwned: { generator: 'refineries', count: 15 } },
  refineryOverdrive: { key: 'refineryOverdrive', label: 'Refinery Overdrive', description: 'Triple Refinery output.', cost: '11000000', effectType: 'generator', target: 'refineries', multiplier: '3', requiresOwned: { generator: 'refineries', count: 60 }, requiresUpgrade: 'refineryCatalysts' },
  refinerySingularities: { key: 'refinerySingularities', label: 'Refinery Singularities', description: 'Quadruple Refinery output.', cost: '180000000', effectType: 'generator', target: 'refineries', multiplier: '4', requiresOwned: { generator: 'refineries', count: 120 }, requiresUpgrade: 'refineryOverdrive' },
  refineryTransmutation: { key: 'refineryTransmutation', label: 'Refinery Transmutation', description: 'Quintuple Refinery output.', cost: '2400000000', effectType: 'generator', target: 'refineries', multiplier: '5', requiresOwned: { generator: 'refineries', count: 240 }, requiresUpgrade: 'refinerySingularities' },
  megaRigServos: { key: 'megaRigServos', label: 'Mega Rig Servos', description: 'Double Mega Rig output.', cost: '22000000', effectType: 'generator', target: 'megaRigs', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 15 } },
  megaRigNanites: { key: 'megaRigNanites', label: 'Mega Rig Nanites', description: 'Triple Mega Rig output.', cost: '165000000', effectType: 'generator', target: 'megaRigs', multiplier: '3', requiresOwned: { generator: 'megaRigs', count: 60 }, requiresUpgrade: 'megaRigServos' },
  megaRigSentience: { key: 'megaRigSentience', label: 'Mega Rig Sentience', description: 'Quadruple Mega Rig output.', cost: '2700000000', effectType: 'generator', target: 'megaRigs', multiplier: '4', requiresOwned: { generator: 'megaRigs', count: 120 }, requiresUpgrade: 'megaRigNanites' },
  megaRigDominion: { key: 'megaRigDominion', label: 'Mega Rig Dominion', description: 'Quintuple Mega Rig output.', cost: '36000000000', effectType: 'generator', target: 'megaRigs', multiplier: '5', requiresOwned: { generator: 'megaRigs', count: 240 }, requiresUpgrade: 'megaRigSentience' },
  orbitalDrones: { key: 'orbitalDrones', label: 'Orbital Drone Nets', description: 'Double Orbital Platform output.', cost: '320000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '2', requiresOwned: { generator: 'orbitalPlatforms', count: 12 } },
  orbitalCommand: { key: 'orbitalCommand', label: 'Orbital Command AI', description: 'Triple Orbital Platform output.', cost: '2500000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '3', requiresOwned: { generator: 'orbitalPlatforms', count: 40 }, requiresUpgrade: 'orbitalDrones' },
  orbitalAnchors: { key: 'orbitalAnchors', label: 'Orbital Anchors', description: 'Quadruple Orbital Platform output.', cost: '42000000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '4', requiresOwned: { generator: 'orbitalPlatforms', count: 100 }, requiresUpgrade: 'orbitalCommand' },
  orbitalEmpyrean: { key: 'orbitalEmpyrean', label: 'Orbital Empyrean Grid', description: 'Quintuple Orbital Platform output.', cost: '550000000000', effectType: 'generator', target: 'orbitalPlatforms', multiplier: '5', requiresOwned: { generator: 'orbitalPlatforms', count: 220 }, requiresUpgrade: 'orbitalAnchors' },
  stellarFlux: { key: 'stellarFlux', label: 'Stellar Flux Weaves', description: 'Double Stellar Forge output.', cost: '80000000000', effectType: 'generator', target: 'stellarForges', multiplier: '2', requiresOwned: { generator: 'stellarForges', count: 12 } },
  stellarLattices: { key: 'stellarLattices', label: 'Stellar Lattices', description: 'Triple Stellar Forge output.', cost: '620000000000', effectType: 'generator', target: 'stellarForges', multiplier: '3', requiresOwned: { generator: 'stellarForges', count: 45 }, requiresUpgrade: 'stellarFlux' },
  stellarAscension: { key: 'stellarAscension', label: 'Stellar Ascension', description: 'Quadruple Stellar Forge output.', cost: '4300000000000', effectType: 'generator', target: 'stellarForges', multiplier: '4', requiresOwned: { generator: 'stellarForges', count: 110 }, requiresUpgrade: 'stellarLattices' },
  stellarParagon: { key: 'stellarParagon', label: 'Stellar Paragon Cells', description: 'Quintuple Stellar Forge output.', cost: '80000000000000', effectType: 'generator', target: 'stellarForges', multiplier: '5', requiresOwned: { generator: 'stellarForges', count: 220 }, requiresUpgrade: 'stellarAscension' },
  dysonPhasing: { key: 'dysonPhasing', label: 'Dyson Phasing', description: 'Double Dyson Array output.', cost: '11000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '2', requiresOwned: { generator: 'dysonArrays', count: 12 } },
  dysonHarmonics: { key: 'dysonHarmonics', label: 'Dyson Harmonics', description: 'Triple Dyson Array output.', cost: '78000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '3', requiresOwned: { generator: 'dysonArrays', count: 45 }, requiresUpgrade: 'dysonPhasing' },
  dysonDominion: { key: 'dysonDominion', label: 'Dyson Dominion', description: 'Quadruple Dyson Array output.', cost: '520000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '4', requiresOwned: { generator: 'dysonArrays', count: 110 }, requiresUpgrade: 'dysonHarmonics' },
  dysonZenith: { key: 'dysonZenith', label: 'Dyson Zenith Mesh', description: 'Quintuple Dyson Array output.', cost: '9500000000000000', effectType: 'generator', target: 'dysonArrays', multiplier: '5', requiresOwned: { generator: 'dysonArrays', count: 220 }, requiresUpgrade: 'dysonDominion' },
  singularityContainment: { key: 'singularityContainment', label: 'Singularity Containment', description: 'Double Singularity Well output.', cost: '1400000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '2', requiresOwned: { generator: 'singularityWells', count: 12 } },
  singularityLensing: { key: 'singularityLensing', label: 'Singularity Lensing', description: 'Triple Singularity Well output.', cost: '9500000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '3', requiresOwned: { generator: 'singularityWells', count: 45 }, requiresUpgrade: 'singularityContainment' },
  singularityTranscendence: { key: 'singularityTranscendence', label: 'Singularity Transcendence', description: 'Quadruple Singularity Well output.', cost: '70000000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '4', requiresOwned: { generator: 'singularityWells', count: 110 }, requiresUpgrade: 'singularityLensing' },
  singularityAxiom: { key: 'singularityAxiom', label: 'Singularity Axiom Lens', description: 'Quintuple Singularity Well output.', cost: '1200000000000000000', effectType: 'generator', target: 'singularityWells', multiplier: '5', requiresOwned: { generator: 'singularityWells', count: 220 }, requiresUpgrade: 'singularityTranscendence' },
  continuumStabilizers: { key: 'continuumStabilizers', label: 'Continuum Stabilizers', description: 'Double Continuum Engine output.', cost: '190000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '2', requiresOwned: { generator: 'continuumEngines', count: 12 } },
  continuumRecursion: { key: 'continuumRecursion', label: 'Continuum Recursion', description: 'Triple Continuum Engine output.', cost: '1250000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '3', requiresOwned: { generator: 'continuumEngines', count: 45 }, requiresUpgrade: 'continuumStabilizers' },
  continuumParadoxCore: { key: 'continuumParadoxCore', label: 'Continuum Paradox Core', description: 'Quadruple Continuum Engine output.', cost: '9000000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '4', requiresOwned: { generator: 'continuumEngines', count: 110 }, requiresUpgrade: 'continuumRecursion' },
  continuumEternity: { key: 'continuumEternity', label: 'Continuum Eternity Core', description: 'Quintuple Continuum Engine output.', cost: '170000000000000000000', effectType: 'generator', target: 'continuumEngines', multiplier: '5', requiresOwned: { generator: 'continuumEngines', count: 220 }, requiresUpgrade: 'continuumParadoxCore' },
  voidTuning: { key: 'voidTuning', label: 'Void Tuning', description: 'Double Void Lathe output.', cost: '450000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '2', requiresOwned: { generator: 'voidLathes', count: 8 } },
  voidResonance: { key: 'voidResonance', label: 'Void Resonance', description: 'Triple Void Lathe output.', cost: '2900000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '3', requiresOwned: { generator: 'voidLathes', count: 30 }, requiresUpgrade: 'voidTuning' },
  voidApotheosis: { key: 'voidApotheosis', label: 'Void Apotheosis', description: 'Quadruple Void Lathe output.', cost: '19000000000000000000000', effectType: 'generator', target: 'voidLathes', multiplier: '4', requiresOwned: { generator: 'voidLathes', count: 75 }, requiresUpgrade: 'voidResonance' },
  entropyBaffles: { key: 'entropyBaffles', label: 'Entropy Baffles', description: 'Double Entropy Reactor output.', cost: '7800000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '2', requiresOwned: { generator: 'entropyReactors', count: 6 } },
  entropyRecapture: { key: 'entropyRecapture', label: 'Entropy Recapture', description: 'Triple Entropy Reactor output.', cost: '51000000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '3', requiresOwned: { generator: 'entropyReactors', count: 22 }, requiresUpgrade: 'entropyBaffles' },
  entropyHorizon: { key: 'entropyHorizon', label: 'Entropy Horizon', description: 'Quadruple Entropy Reactor output.', cost: '330000000000000000000000', effectType: 'generator', target: 'entropyReactors', multiplier: '4', requiresOwned: { generator: 'entropyReactors', count: 55 }, requiresUpgrade: 'entropyRecapture' },
  quantumSpools: { key: 'quantumSpools', label: 'Quantum Spools', description: 'Double Quantum Foundry output.', cost: '130000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '2', requiresOwned: { generator: 'quantumFoundries', count: 5 } },
  quantumEntanglement: { key: 'quantumEntanglement', label: 'Quantum Entanglement', description: 'Triple Quantum Foundry output.', cost: '820000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '3', requiresOwned: { generator: 'quantumFoundries', count: 18 }, requiresUpgrade: 'quantumSpools' },
  quantumConfluence: { key: 'quantumConfluence', label: 'Quantum Confluence', description: 'Quadruple Quantum Foundry output.', cost: '5400000000000000000000000', effectType: 'generator', target: 'quantumFoundries', multiplier: '4', requiresOwned: { generator: 'quantumFoundries', count: 45 }, requiresUpgrade: 'quantumEntanglement' },
  darkMatterCompression: { key: 'darkMatterCompression', label: 'Dark Matter Compression', description: 'Double Dark Matter Smelter output.', cost: '2300000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '2', requiresOwned: { generator: 'darkMatterSmelters', count: 4 } },
  darkMatterFusion: { key: 'darkMatterFusion', label: 'Dark Matter Fusion', description: 'Triple Dark Matter Smelter output.', cost: '15000000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '3', requiresOwned: { generator: 'darkMatterSmelters', count: 14 }, requiresUpgrade: 'darkMatterCompression' },
  darkMatterTranscendence: { key: 'darkMatterTranscendence', label: 'Dark Matter Transcendence', description: 'Quadruple Dark Matter Smelter output.', cost: '98000000000000000000000000', effectType: 'generator', target: 'darkMatterSmelters', multiplier: '4', requiresOwned: { generator: 'darkMatterSmelters', count: 36 }, requiresUpgrade: 'darkMatterFusion' },
  realityTempering: { key: 'realityTempering', label: 'Reality Tempering', description: 'Double Reality Kiln output.', cost: '41000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '2', requiresOwned: { generator: 'realityKilns', count: 3 } },
  realityRecasting: { key: 'realityRecasting', label: 'Reality Recasting', description: 'Triple Reality Kiln output.', cost: '260000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '3', requiresOwned: { generator: 'realityKilns', count: 10 }, requiresUpgrade: 'realityTempering' },
  realityAscendancy: { key: 'realityAscendancy', label: 'Reality Ascendancy', description: 'Quadruple Reality Kiln output.', cost: '1700000000000000000000000000', effectType: 'generator', target: 'realityKilns', multiplier: '4', requiresOwned: { generator: 'realityKilns', count: 24 }, requiresUpgrade: 'realityRecasting' },
  fractalRecursion: { key: 'fractalRecursion', label: 'Fractal Recursion', description: 'Double Fractal Assembler output.', cost: '760000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '2', requiresOwned: { generator: 'fractalAssemblers', count: 3 } },
  fractalAmplification: { key: 'fractalAmplification', label: 'Fractal Amplification', description: 'Triple Fractal Assembler output.', cost: '4800000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '3', requiresOwned: { generator: 'fractalAssemblers', count: 9 }, requiresUpgrade: 'fractalRecursion' },
  fractalInfinity: { key: 'fractalInfinity', label: 'Fractal Infinity', description: 'Quadruple Fractal Assembler output.', cost: '31000000000000000000000000000', effectType: 'generator', target: 'fractalAssemblers', multiplier: '4', requiresOwned: { generator: 'fractalAssemblers', count: 22 }, requiresUpgrade: 'fractalAmplification' },
  causalThreading: { key: 'causalThreading', label: 'Causal Threading', description: 'Double Causal Loom output.', cost: '14000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '2', requiresOwned: { generator: 'causalLooms', count: 2 } },
  causalBraiding: { key: 'causalBraiding', label: 'Causal Braiding', description: 'Triple Causal Loom output.', cost: '90000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '3', requiresOwned: { generator: 'causalLooms', count: 7 }, requiresUpgrade: 'causalThreading' },
  causalApex: { key: 'causalApex', label: 'Causal Apex', description: 'Quadruple Causal Loom output.', cost: '580000000000000000000000000000', effectType: 'generator', target: 'causalLooms', multiplier: '4', requiresOwned: { generator: 'causalLooms', count: 18 }, requiresUpgrade: 'causalBraiding' },
  epochInscription: { key: 'epochInscription', label: 'Epoch Inscription', description: 'Double Epoch Monolith output.', cost: '260000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '2', requiresOwned: { generator: 'epochMonoliths', count: 2 } },
  epochResonance: { key: 'epochResonance', label: 'Epoch Resonance', description: 'Triple Epoch Monolith output.', cost: '1700000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '3', requiresOwned: { generator: 'epochMonoliths', count: 6 }, requiresUpgrade: 'epochInscription' },
  epochImperative: { key: 'epochImperative', label: 'Epoch Imperative', description: 'Quadruple Epoch Monolith output.', cost: '11000000000000000000000000000000', effectType: 'generator', target: 'epochMonoliths', multiplier: '4', requiresOwned: { generator: 'epochMonoliths', count: 15 }, requiresUpgrade: 'epochResonance' },
  omniversalBridges: { key: 'omniversalBridges', label: 'Omniversal Bridges', description: 'Double Omniversal Foundry output.', cost: '5000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '2', requiresOwned: { generator: 'omniversalFoundries', count: 2 } },
  omniversalConcord: { key: 'omniversalConcord', label: 'Omniversal Concord', description: 'Triple Omniversal Foundry output.', cost: '32000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '3', requiresOwned: { generator: 'omniversalFoundries', count: 5 }, requiresUpgrade: 'omniversalBridges' },
  omniversalSupremacy: { key: 'omniversalSupremacy', label: 'Omniversal Supremacy', description: 'Quadruple Omniversal Foundry output.', cost: '210000000000000000000000000000000', effectType: 'generator', target: 'omniversalFoundries', multiplier: '4', requiresOwned: { generator: 'omniversalFoundries', count: 12 }, requiresUpgrade: 'omniversalConcord' },
  genesisKindling: { key: 'genesisKindling', label: 'Genesis Kindling', description: 'Double Genesis Forge output.', cost: '90000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '2', requiresOwned: { generator: 'genesisForges', count: 1 } },
  genesisProliferation: { key: 'genesisProliferation', label: 'Genesis Proliferation', description: 'Triple Genesis Forge output.', cost: '580000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '3', requiresOwned: { generator: 'genesisForges', count: 4 }, requiresUpgrade: 'genesisKindling' },
  genesisCrowning: { key: 'genesisCrowning', label: 'Genesis Crowning', description: 'Quadruple Genesis Forge output.', cost: '3700000000000000000000000000000000', effectType: 'generator', target: 'genesisForges', multiplier: '4', requiresOwned: { generator: 'genesisForges', count: 10 }, requiresUpgrade: 'genesisProliferation' },
  automationLoops: { key: 'automationLoops', label: 'Automation Loops', description: 'Global production x1.5.', cost: '350000', effectType: 'global', multiplier: '1.5', requiresOwned: { generator: 'drills', count: 20 } },
  quantumForecasts: { key: 'quantumForecasts', label: 'Quantum Forecasts', description: 'Global production x2.', cost: '45000000', effectType: 'global', multiplier: '2', requiresOwned: { generator: 'megaRigs', count: 18 }, requiresUpgrade: 'automationLoops' },
  fractalEconomies: { key: 'fractalEconomies', label: 'Fractal Economies', description: 'Global production x2.5.', cost: '2500000000000', effectType: 'global', multiplier: '2.5', requiresOwned: { generator: 'stellarForges', count: 20 }, requiresUpgrade: 'quantumForecasts' },
  causalOverclock: { key: 'causalOverclock', label: 'Causal Overclock', description: 'Global production x3.', cost: '60000000000000000', effectType: 'global', multiplier: '3', requiresOwned: { generator: 'singularityWells', count: 18 }, requiresUpgrade: 'fractalEconomies' },
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
  miners3500: { key: 'miners3500', label: 'Miner Citadel', description: 'Own 3,500 Miners.', requirement: { type: 'owned', generator: 'miners', count: 3500 } },
  drills75: { key: 'drills75', label: 'Drill Team', description: 'Own 75 Drills.', requirement: { type: 'owned', generator: 'drills', count: 75 } },
  drills200: { key: 'drills200', label: 'Drill Crew', description: 'Own 200 Drills.', requirement: { type: 'owned', generator: 'drills', count: 200 } },
  drills400: { key: 'drills400', label: 'Drill Battalion', description: 'Own 400 Drills.', requirement: { type: 'owned', generator: 'drills', count: 400 } },
  drills750: { key: 'drills750', label: 'Drill Fleet', description: 'Own 750 Drills.', requirement: { type: 'owned', generator: 'drills', count: 750 } },
  drills1500: { key: 'drills1500', label: 'Drill Armada', description: 'Own 1,500 Drills.', requirement: { type: 'owned', generator: 'drills', count: 1500 } },
  drills2500: { key: 'drills2500', label: 'Drill Citadel', description: 'Own 2,500 Drills.', requirement: { type: 'owned', generator: 'drills', count: 2500 } },
  extractors50: { key: 'extractors50', label: 'Extractor Team', description: 'Own 50 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 50 } },
  extractors120: { key: 'extractors120', label: 'Extractor Crew', description: 'Own 120 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 120 } },
  extractors250: { key: 'extractors250', label: 'Extractor Battalion', description: 'Own 250 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 250 } },
  extractors500: { key: 'extractors500', label: 'Extractor Fleet', description: 'Own 500 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 500 } },
  extractors1000: { key: 'extractors1000', label: 'Extractor Armada', description: 'Own 1,000 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 1000 } },
  extractors1800: { key: 'extractors1800', label: 'Extractor Citadel', description: 'Own 1,800 Extractors.', requirement: { type: 'owned', generator: 'extractors', count: 1800 } },
  refineries40: { key: 'refineries40', label: 'Refinery Team', description: 'Own 40 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 40 } },
  refineries90: { key: 'refineries90', label: 'Refinery Crew', description: 'Own 90 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 90 } },
  refineries200: { key: 'refineries200', label: 'Refinery Battalion', description: 'Own 200 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 200 } },
  refineries400: { key: 'refineries400', label: 'Refinery Fleet', description: 'Own 400 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 400 } },
  refineries800: { key: 'refineries800', label: 'Refinery Armada', description: 'Own 800 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 800 } },
  refineries1200: { key: 'refineries1200', label: 'Refinery Citadel', description: 'Own 1,200 Refineries.', requirement: { type: 'owned', generator: 'refineries', count: 1200 } },
  megaRigs30: { key: 'megaRigs30', label: 'Mega Rig Team', description: 'Own 30 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 30 } },
  megaRigs75: { key: 'megaRigs75', label: 'Mega Rig Crew', description: 'Own 75 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 75 } },
  megaRigs150: { key: 'megaRigs150', label: 'Mega Rig Battalion', description: 'Own 150 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 150 } },
  megaRigs300: { key: 'megaRigs300', label: 'Mega Rig Fleet', description: 'Own 300 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 300 } },
  megaRigs600: { key: 'megaRigs600', label: 'Mega Rig Armada', description: 'Own 600 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 600 } },
  megaRigs900: { key: 'megaRigs900', label: 'Mega Rig Citadel', description: 'Own 900 Mega Rigs.', requirement: { type: 'owned', generator: 'megaRigs', count: 900 } },
  orbitalPlatforms20: { key: 'orbitalPlatforms20', label: 'Orbital Team', description: 'Own 20 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 20 } },
  orbitalPlatforms50: { key: 'orbitalPlatforms50', label: 'Orbital Crew', description: 'Own 50 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 50 } },
  orbitalPlatforms100: { key: 'orbitalPlatforms100', label: 'Orbital Battalion', description: 'Own 100 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 100 } },
  orbitalPlatforms200: { key: 'orbitalPlatforms200', label: 'Orbital Fleet', description: 'Own 200 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 200 } },
  orbitalPlatforms400: { key: 'orbitalPlatforms400', label: 'Orbital Armada', description: 'Own 400 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 400 } },
  orbitalPlatforms600: { key: 'orbitalPlatforms600', label: 'Orbital Citadel', description: 'Own 600 Orbital Platforms.', requirement: { type: 'owned', generator: 'orbitalPlatforms', count: 600 } },
  stellarForges15: { key: 'stellarForges15', label: 'Stellar Team', description: 'Own 15 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 15 } },
  stellarForges35: { key: 'stellarForges35', label: 'Stellar Crew', description: 'Own 35 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 35 } },
  stellarForges75: { key: 'stellarForges75', label: 'Stellar Battalion', description: 'Own 75 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 75 } },
  stellarForges150: { key: 'stellarForges150', label: 'Stellar Fleet', description: 'Own 150 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 150 } },
  stellarForges300: { key: 'stellarForges300', label: 'Stellar Armada', description: 'Own 300 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 300 } },
  stellarForges450: { key: 'stellarForges450', label: 'Stellar Citadel', description: 'Own 450 Stellar Forges.', requirement: { type: 'owned', generator: 'stellarForges', count: 450 } },
  dysonArrays10: { key: 'dysonArrays10', label: 'Dyson Team', description: 'Own 10 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 10 } },
  dysonArrays25: { key: 'dysonArrays25', label: 'Dyson Crew', description: 'Own 25 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 25 } },
  dysonArrays50: { key: 'dysonArrays50', label: 'Dyson Battalion', description: 'Own 50 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 50 } },
  dysonArrays100: { key: 'dysonArrays100', label: 'Dyson Fleet', description: 'Own 100 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 100 } },
  dysonArrays200: { key: 'dysonArrays200', label: 'Dyson Armada', description: 'Own 200 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 200 } },
  dysonArrays300: { key: 'dysonArrays300', label: 'Dyson Citadel', description: 'Own 300 Dyson Arrays.', requirement: { type: 'owned', generator: 'dysonArrays', count: 300 } },
  singularityWells8: { key: 'singularityWells8', label: 'Singularity Team', description: 'Own 8 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 8 } },
  singularityWells20: { key: 'singularityWells20', label: 'Singularity Crew', description: 'Own 20 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 20 } },
  singularityWells40: { key: 'singularityWells40', label: 'Singularity Battalion', description: 'Own 40 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 40 } },
  singularityWells80: { key: 'singularityWells80', label: 'Singularity Fleet', description: 'Own 80 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 80 } },
  singularityWells160: { key: 'singularityWells160', label: 'Singularity Armada', description: 'Own 160 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 160 } },
  singularityWells220: { key: 'singularityWells220', label: 'Singularity Citadel', description: 'Own 220 Singularity Wells.', requirement: { type: 'owned', generator: 'singularityWells', count: 220 } },
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
  upgrades20: { key: 'upgrades20', label: 'Workshop Online', description: 'Purchase 25 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 25 } },
  upgrades28: { key: 'upgrades28', label: 'Workshop Tuned', description: 'Purchase 40 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 40 } },
  upgrades35: { key: 'upgrades35', label: 'Workshop Expanded', description: 'Purchase 60 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 60 } },
  upgrades38: { key: 'upgrades38', label: 'Workshop Complete', description: 'Purchase all 78 upgrades in one run.', requirement: { type: 'purchasedUpgrades', count: 78 } },
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
