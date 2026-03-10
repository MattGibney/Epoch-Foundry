import {
  createInitialGameState,
  PERMANENT_UPGRADE_ORDER,
  UPGRADE_ORDER,
  type GameState,
} from '@/lib/game-engine'

export const DEV_BOOTSTRAP_PRESETS = [
  {
    key: 'fresh',
    label: 'Fresh',
    description: 'New run baseline for early-game checks.',
  },
  {
    key: 'scaled',
    label: 'Phase 1 Mid',
    description: 'Mid-run phase-one state with multiple breakpoint chains active.',
  },
  {
    key: 'late',
    label: 'Late',
    description: 'Late-run state with deep progression unlocked.',
  },
  {
    key: 'prestige',
    label: 'Phase 1 Prestige',
    description: 'Phase-one reset-planning state with several permanent upgrades.',
  },
] as const

export type DevBootstrapPresetKey = (typeof DEV_BOOTSTRAP_PRESETS)[number]['key']

function markRunUpgrades(state: GameState, count: number): void {
  for (const key of UPGRADE_ORDER.slice(0, count)) {
    state.purchasedUpgrades[key] = true
  }
}

function markPermanentUpgrades(state: GameState, levels: Partial<Record<(typeof PERMANENT_UPGRADE_ORDER)[number], number>>): void {
  for (const key of PERMANENT_UPGRADE_ORDER) {
    state.prestige.permanentUpgrades[key] = Math.max(0, Math.floor(levels[key] ?? 0))
  }
}

export function createDevBootstrapState(
  preset: DevBootstrapPresetKey,
  nowMs = Date.now(),
): GameState {
  const state = createInitialGameState(nowMs)

  if (preset === 'fresh') {
    return state
  }

  if (preset === 'scaled') {
    state.credits = '850000000'
    state.generators = {
      miners: 320,
      drills: 210,
      extractors: 120,
      refineries: 70,
      megaRigs: 35,
      orbitalPlatforms: 12,
      stellarForges: 2,
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
    }
    markRunUpgrades(state, 24)
    state.buyAmount = 100
    state.stats.totalCredits = '6800000000'
    state.stats.totalCreditsAllResets = '11000000000'
    return state
  }

  if (preset === 'late') {
    state.credits = '5e60'
    state.generators = {
      miners: 2400,
      drills: 2100,
      extractors: 1800,
      refineries: 1400,
      megaRigs: 1100,
      orbitalPlatforms: 800,
      stellarForges: 520,
      dysonArrays: 340,
      singularityWells: 180,
      continuumEngines: 80,
      voidLathes: 50,
      entropyReactors: 30,
      quantumFoundries: 18,
      darkMatterSmelters: 10,
      realityKilns: 5,
      fractalAssemblers: 2,
      causalLooms: 1,
      epochMonoliths: 0,
      omniversalFoundries: 0,
      genesisForges: 0,
    }
    markRunUpgrades(state, UPGRADE_ORDER.length)
    state.buyAmount = 100
    state.stats.totalCredits = '4.2e74'
    state.stats.totalCreditsAllResets = '1.1e80'
    state.prestige.resets = 40
    state.prestige.essence = '650'
    markPermanentUpgrades(state, {
      essenceInfusion: 10,
      bootstrapCache: 8,
      quantumLattice: 6,
      calibrationMatrix: 5,
      singularityCore: 3,
    })
    state.subsystems.miners = {
      oreData: '3500000',
      totalOreData: '125000000',
      generators: {
        scouts: 220,
        surveyCamps: 160,
        testShafts: 110,
        freightTeams: 70,
        geologyLabs: 35,
        commandCenters: 12,
        boreGuilds: 18,
        oreArchives: 7,
        seismicArrays: 2,
        excavationDirectorates: 0,
      },
      purchasedUpgrades: {
        scoutTraining: true,
        scoutRelays: true,
        scoutNetwork: true,
        campPlanning: true,
        campRouting: true,
        campAtlas: true,
        shaftCalibration: true,
        shaftServos: true,
        shaftDominion: true,
        freightDispatch: true,
        freightConvoys: true,
        freightLattice: true,
        labModeling: true,
        labForecasting: true,
        labSynthesis: false,
        commandPlanning: true,
        commandAutomation: true,
        commandSingularity: false,
        boreLogistics: true,
        boreMatrices: false,
        boreFrontiers: false,
        archiveCatalogs: false,
        archiveForecasting: false,
        archiveContinuum: false,
        seismicTuning: false,
        seismicResonance: false,
        seismicPanopticon: false,
        directorateProtocols: false,
        directorateForecasting: false,
        directorateSummit: false,
        fieldProtocols: true,
        networkFusion: true,
        oreAlgorithms: true,
        strataSimulations: false,
        basinForecasts: false,
        mantleConsensus: false,
      },
    }
    return state
  }

  state.credits = '125000000'
  state.generators = {
    miners: 600,
    drills: 450,
    extractors: 280,
    refineries: 160,
    megaRigs: 80,
    orbitalPlatforms: 30,
    stellarForges: 10,
    dysonArrays: 3,
    singularityWells: 1,
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
  }
  markRunUpgrades(state, 36)
  state.buyAmount = 100
  state.stats.totalCredits = '980000000'
  state.stats.totalCreditsAllResets = '6500000000'
  state.prestige.resets = 4
  state.prestige.essence = '90'
  markPermanentUpgrades(state, {
    essenceInfusion: 6,
    bootstrapCache: 4,
    quantumLattice: 2,
    calibrationMatrix: 1,
    singularityCore: 1,
  })
  return state
}
