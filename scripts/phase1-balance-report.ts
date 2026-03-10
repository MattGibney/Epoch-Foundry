import Decimal from 'decimal.js'

import {
  ACHIEVEMENT_CONFIG,
  GENERATOR_CONFIG,
  PERMANENT_UPGRADE_CONFIG,
  PRESTIGE_BALANCE,
  UPGRADE_CONFIG,
} from '../src/lib/progression-config.ts'

const PHASE_ONE_GENERATORS = [
  'miners',
  'drills',
  'extractors',
  'refineries',
  'megaRigs',
  'orbitalPlatforms',
  'stellarForges',
  'dysonArrays',
  'singularityWells',
] as const

const LATE_LADDER_GENERATORS = [
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
] as const

const ACHIEVEMENT_ALIGNMENT_THRESHOLDS = {
  miners: [10, 25, 50, 100, 200, 350],
  drills: [10, 25, 50, 100, 200, 350],
  extractors: [10, 25, 50, 100, 200, 350],
  refineries: [10, 25, 50, 100, 200, 350],
  megaRigs: [10, 25, 50, 100, 200, 350],
  orbitalPlatforms: [8, 20, 40, 80, 160, 280],
  stellarForges: [8, 20, 40, 80, 160, 280],
  dysonArrays: [6, 15, 30, 60, 120, 220],
  singularityWells: [4, 10, 20, 40, 80, 140],
} as const

const PAYBACK_TARGETS_SECONDS: Record<(typeof PHASE_ONE_GENERATORS)[number], number> = {
  miners: 15,
  drills: 16,
  extractors: 20,
  refineries: 28,
  megaRigs: 40,
  orbitalPlatforms: 65,
  stellarForges: 130,
  dysonArrays: 320,
  singularityWells: 900,
}

const PRESTIGE_TARGETS: Record<number, number> = {
  5: 10_000_000,
  25: 100_000_000,
  100: 1_000_000_000,
}

function getCreditsForEssence(targetGain: number): Decimal {
  const unlock = new Decimal(PRESTIGE_BALANCE.unlockCredits)
  const exponent = new Decimal(PRESTIGE_BALANCE.gainExponent)
  return unlock.times(new Decimal(targetGain).pow(new Decimal(1).div(exponent)))
}

const failures: string[] = []

console.log('Phase 1 generator payback')
for (const key of PHASE_ONE_GENERATORS) {
  const generator = GENERATOR_CONFIG[key]
  const paybackSeconds = new Decimal(generator.baseCost).div(generator.baseProduction)
  const paybackRounded = paybackSeconds.toDecimalPlaces(2)
  console.log(
    `${generator.label.padEnd(18)} payback=${paybackRounded.toString().padStart(8)}s growth=${generator.growth}`,
  )

  if (paybackSeconds.greaterThan(PAYBACK_TARGETS_SECONDS[key])) {
    failures.push(
      `${generator.label} payback ${paybackRounded.toString()}s exceeds ${PAYBACK_TARGETS_SECONDS[key]}s`,
    )
  }
}

console.log('\nPhase 1 upgrade depth')
for (const key of PHASE_ONE_GENERATORS) {
  const upgrades = Object.values(UPGRADE_CONFIG).filter(
    (upgrade) => upgrade.effectType === 'generator' && upgrade.target === key,
  )
  const thresholds = upgrades.map((upgrade) => upgrade.requiresOwned?.count ?? 0)
  console.log(`${GENERATOR_CONFIG[key].label.padEnd(18)} upgrades=${upgrades.length} thresholds=${thresholds.join(',')}`)

  if (upgrades.length < 6) {
    failures.push(`${GENERATOR_CONFIG[key].label} only has ${upgrades.length} generator upgrades`)
  }
}

console.log('\nPrestige targets')
for (const [gainText, maxCredits] of Object.entries(PRESTIGE_TARGETS)) {
  const gain = Number(gainText)
  const requiredCredits = getCreditsForEssence(gain)
  console.log(`gain=${gain.toString().padStart(3)} requires=${requiredCredits.toFixed(0)} credits`)

  if (requiredCredits.greaterThan(maxCredits)) {
    failures.push(
      `Prestige gain ${gain} requires ${requiredCredits.toFixed(0)} credits, above target ${maxCredits}`,
    )
  }
}

console.log('\nPermanent upgrades')
for (const upgrade of Object.values(PERMANENT_UPGRADE_CONFIG)) {
  console.log(
    `${upgrade.label.padEnd(20)} base=${upgrade.baseCost.padStart(6)} growth=${upgrade.growth.padStart(4)} effect=${upgrade.effectType}`,
  )
}

for (const requiredKey of ['bootstrapCache', 'calibrationMatrix', 'singularityCore'] as const) {
  if (!PERMANENT_UPGRADE_CONFIG[requiredKey]) {
    failures.push(`Missing required permanent upgrade ${requiredKey}`)
  }
}

console.log('\nAchievement alignment')
for (const [generatorKey, expectedThresholds] of Object.entries(ACHIEVEMENT_ALIGNMENT_THRESHOLDS)) {
  const thresholds = Object.values(ACHIEVEMENT_CONFIG)
    .filter(
      (achievement) =>
        achievement.requirement.type === 'owned' &&
        achievement.requirement.generator === generatorKey,
    )
    .map((achievement) => achievement.requirement.count)
    .sort((a, b) => a - b)
    .slice(0, expectedThresholds.length)
  console.log(`${GENERATOR_CONFIG[generatorKey].label.padEnd(18)} achievements=${thresholds.join(',')}`)

  if (thresholds.join(',') !== expectedThresholds.join(',')) {
    failures.push(
      `${GENERATOR_CONFIG[generatorKey].label} achievement thresholds ${thresholds.join(',')} do not match ${expectedThresholds.join(',')}`,
    )
  }
}

const runCreditThresholds = Object.values(ACHIEVEMENT_CONFIG)
  .filter((achievement) => achievement.requirement.type === 'runCredits')
  .map((achievement) => new Decimal(achievement.requirement.threshold))
  .sort((a, b) => a.comparedTo(b))
const lifetimeCreditThresholds = Object.values(ACHIEVEMENT_CONFIG)
  .filter((achievement) => achievement.requirement.type === 'allResetCredits')
  .map((achievement) => new Decimal(achievement.requirement.threshold))
  .sort((a, b) => a.comparedTo(b))
const essenceThresholds = Object.values(ACHIEVEMENT_CONFIG)
  .filter((achievement) => achievement.requirement.type === 'essence')
  .map((achievement) => new Decimal(achievement.requirement.threshold))
  .sort((a, b) => a.comparedTo(b))

if (runCreditThresholds[0]?.greaterThan(new Decimal('250000'))) {
  failures.push(`Earliest run-credit achievement starts too late at ${runCreditThresholds[0].toFixed(0)}`)
}

if (lifetimeCreditThresholds[0]?.greaterThan(new Decimal('250000'))) {
  failures.push(`Earliest lifetime-credit achievement starts too late at ${lifetimeCreditThresholds[0].toFixed(0)}`)
}

if (essenceThresholds[0]?.greaterThan(new Decimal('5'))) {
  failures.push(`Earliest essence achievement starts too late at ${essenceThresholds[0].toFixed(0)}`)
}

for (const requiredKey of ['permanentLevels1', 'permanentTypes5'] as const) {
  if (!ACHIEVEMENT_CONFIG[requiredKey]) {
    failures.push(`Missing required achievement ${requiredKey}`)
  }
}

console.log('\nLate ladder depth')
for (const key of LATE_LADDER_GENERATORS) {
  const upgrades = Object.values(UPGRADE_CONFIG).filter(
    (upgrade) => upgrade.effectType === 'generator' && upgrade.target === key,
  )
  const thresholds = upgrades.map((upgrade) => upgrade.requiresOwned?.count ?? 0)
  console.log(`${GENERATOR_CONFIG[key].label.padEnd(18)} upgrades=${upgrades.length} thresholds=${thresholds.join(',')}`)

  const expectedDepth = key === 'continuumEngines' ? 6 : 5
  if (upgrades.length < expectedDepth) {
    failures.push(
      `${GENERATOR_CONFIG[key].label} only has ${upgrades.length} generator upgrades`,
    )
  }
}

if (failures.length > 0) {
  console.error('\nPhase 1 balance check failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exitCode = 1
} else {
  console.log('\nPhase 1 balance check passed.')
}
