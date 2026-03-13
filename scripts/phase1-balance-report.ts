import Decimal from 'decimal.js'

import {
  ACHIEVEMENT_CONFIG,
  ASCENSION_BALANCE,
  GENERATOR_CONFIG,
  LEGACY_UPGRADE_CONFIG,
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

const ASCENSION_PROGRESS_TARGETS = {
  tooEarlyCredits: new Decimal('750000'),
  firstMeaningfulAscensionCredits: new Decimal('50000000'),
  phaseOneAscensionCredits: new Decimal('6500000000'),
  lateAscensionCredits: new Decimal('1.1e80'),
}

function getLegacyLevelForLifetimeCredits(totalCredits: Decimal.Value): Decimal {
  const credits = new Decimal(totalCredits)
  const shardDivisor = new Decimal(ASCENSION_BALANCE.shardDivisor)

  if (credits.lessThan(shardDivisor)) {
    return new Decimal(0)
  }

  return Decimal.max(0, credits.div(shardDivisor).pow(new Decimal(1).div(3)).floor())
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

console.log('\nAscension targets')
const tooEarlyLegacy = getLegacyLevelForLifetimeCredits(ASCENSION_PROGRESS_TARGETS.tooEarlyCredits)
const firstAscensionLegacy = getLegacyLevelForLifetimeCredits(
  ASCENSION_PROGRESS_TARGETS.firstMeaningfulAscensionCredits,
)
const phaseOneAscensionLegacy = getLegacyLevelForLifetimeCredits(
  ASCENSION_PROGRESS_TARGETS.phaseOneAscensionCredits,
)
const lateAscensionLegacy = getLegacyLevelForLifetimeCredits(
  ASCENSION_PROGRESS_TARGETS.lateAscensionCredits,
)

console.log(
  `tooEarly=${tooEarlyLegacy.toFixed(0)} at ${ASCENSION_PROGRESS_TARGETS.tooEarlyCredits.toFixed(0)} credits`,
)
console.log(
  `firstWindow=${firstAscensionLegacy.toFixed(0)} at ${ASCENSION_PROGRESS_TARGETS.firstMeaningfulAscensionCredits.toFixed(0)} credits`,
)
console.log(
  `phaseOne=${phaseOneAscensionLegacy.toFixed(0)} at ${ASCENSION_PROGRESS_TARGETS.phaseOneAscensionCredits.toFixed(0)} credits`,
)
console.log(
  `late=${lateAscensionLegacy.toFixed(0)} at ${ASCENSION_PROGRESS_TARGETS.lateAscensionCredits.toExponential()} credits`,
)

if (tooEarlyLegacy.greaterThan(0)) {
  failures.push('Ascension starts too early below the intended pre-ascension opening run.')
}

if (firstAscensionLegacy.lessThan(1) || firstAscensionLegacy.greaterThan(3)) {
  failures.push(
    `First meaningful ascension should grant 1-3 Legacy, currently ${firstAscensionLegacy.toFixed(0)}`,
  )
}

if (phaseOneAscensionLegacy.lessThan(4) || phaseOneAscensionLegacy.greaterThan(12)) {
  failures.push(
    `Phase 1 ascension pacing should land in a readable single-digit/low-double-digit Legacy range, currently ${phaseOneAscensionLegacy.toFixed(0)}`,
  )
}

if (lateAscensionLegacy.lessThan(new Decimal('1e12'))) {
  failures.push(
    `Late bootstrap Legacy level ${lateAscensionLegacy.toFixed(0)} is too flat for the intended Cookie-style ascension ramp.`,
  )
}

console.log('\nLegacy upgrades')
for (const upgrade of Object.values(LEGACY_UPGRADE_CONFIG)) {
  console.log(
    `${upgrade.label.padEnd(24)} cost=${upgrade.cost.padStart(3)} branch=${upgrade.branch.padEnd(11)} effect=${upgrade.effectType}`,
  )
}

for (const requiredKey of ['bootstrapCache', 'calibrationMatrix', 'singularityCore'] as const) {
  if (!LEGACY_UPGRADE_CONFIG[requiredKey]) {
    failures.push(`Missing required legacy upgrade ${requiredKey}`)
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
const legacyThresholds = Object.values(ACHIEVEMENT_CONFIG)
  .filter((achievement) => achievement.requirement.type === 'legacyLevel')
  .map((achievement) => new Decimal(achievement.requirement.threshold))
  .sort((a, b) => a.comparedTo(b))

if (runCreditThresholds[0]?.greaterThan(new Decimal('1000000'))) {
  failures.push(`Earliest run-credit achievement starts too late at ${runCreditThresholds[0].toFixed(0)}`)
}

if (lifetimeCreditThresholds[0]?.greaterThan(new Decimal('1000000'))) {
  failures.push(`Earliest lifetime-credit achievement starts too late at ${lifetimeCreditThresholds[0].toFixed(0)}`)
}

if (legacyThresholds[0]?.greaterThan(new Decimal('1'))) {
  failures.push(`Earliest legacy achievement starts too late at ${legacyThresholds[0].toFixed(0)}`)
}

for (const requiredKey of ['legacyNodes1', 'archivesComplete'] as const) {
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
