import Decimal from 'decimal.js'

import {
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

if (failures.length > 0) {
  console.error('\nPhase 1 balance check failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exitCode = 1
} else {
  console.log('\nPhase 1 balance check passed.')
}
