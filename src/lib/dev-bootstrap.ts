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
    label: 'Scaled',
    description: 'Mid-run state with several generators and upgrades.',
  },
  {
    key: 'late',
    label: 'Late',
    description: 'Late-run state with deep progression unlocked.',
  },
  {
    key: 'prestige',
    label: 'Prestige',
    description: 'High-essence state for prestige upgrade testing.',
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
    state.credits = '25000000000'
    state.generators = {
      miners: 450,
      drills: 320,
      extractors: 200,
      refineries: 120,
      megaRigs: 80,
      orbitalPlatforms: 30,
      stellarForges: 10,
      dysonArrays: 0,
      singularityWells: 0,
      continuumEngines: 0,
    }
    markRunUpgrades(state, 18)
    state.buyAmount = 100
    state.stats.totalCredits = '950000000000'
    state.stats.totalCreditsAllResets = '2200000000000'
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
    }
    markRunUpgrades(state, UPGRADE_ORDER.length)
    state.buyAmount = 100
    state.stats.totalCredits = '4.2e74'
    state.stats.totalCreditsAllResets = '1.1e80'
    state.prestige.resets = 40
    state.prestige.essence = '650'
    markPermanentUpgrades(state, {
      essenceInfusion: 12,
      quantumLattice: 7,
      singularityCore: 3,
    })
    return state
  }

  state.credits = '3e20'
  state.generators = {
    miners: 1100,
    drills: 900,
    extractors: 700,
    refineries: 500,
    megaRigs: 300,
    orbitalPlatforms: 180,
    stellarForges: 80,
    dysonArrays: 25,
    singularityWells: 8,
    continuumEngines: 1,
  }
  markRunUpgrades(state, 30)
  state.buyAmount = 100
  state.stats.totalCredits = '2.4e32'
  state.stats.totalCreditsAllResets = '8.8e38'
  state.prestige.resets = 120
  state.prestige.essence = '5000'
  markPermanentUpgrades(state, {
    essenceInfusion: 45,
    quantumLattice: 30,
    singularityCore: 12,
  })
  return state
}
