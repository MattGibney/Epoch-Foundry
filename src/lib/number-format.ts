import Decimal from 'decimal.js'

const NOTATION_THRESHOLD = new Decimal(100_000_000)
const DECIMAL_DISABLED_THRESHOLD = new Decimal(1_000_000)
const TEN = new Decimal(10)

const SHORT_SUFFIXES = [
  '',
  'K',
  'M',
  'B',
  'T',
  'Qa',
  'Qi',
  'Sx',
  'Sp',
  'Oc',
  'No',
  'Dc',
  'Ud',
  'Dd',
  'Td',
  'Qad',
  'Qid',
  'Sxd',
  'Spd',
  'Ocd',
  'Nod',
  'Vg',
  'UvT',
  'DvT',
  'TvT',
  'QaT',
  'QiT',
  'SxT',
  'SpT',
  'OcT',
  'NoT',
] as const

const integerNumberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const fixedTwoDecimalFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatMantissa(value: Decimal): string {
  return value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toFixed(0)
}

function toScientific(value: Decimal): string {
  return value.toExponential(0).replace('e+', 'e')
}

function parseExponent(value: Decimal): number {
  const [, exponent = '0'] = value.toExponential(1).split('e')
  const parsedExponent = Number(exponent)
  return Number.isFinite(parsedExponent) ? parsedExponent : 0
}

function toDecimal(value: Decimal.Value): Decimal | null {
  try {
    return new Decimal(value)
  } catch {
    return null
  }
}

export function formatIdleNumber(value: Decimal.Value): string {
  const decimalValue = toDecimal(value)
  if (!decimalValue) {
    return 'NaN'
  }

  if (!decimalValue.isFinite()) {
    if (decimalValue.isNaN()) {
      return 'NaN'
    }

    return decimalValue.isNegative() ? '-Infinity' : 'Infinity'
  }

  const absValue = decimalValue.abs()
  if (absValue.lessThanOrEqualTo(DECIMAL_DISABLED_THRESHOLD)) {
    if (decimalValue.isInteger()) {
      return integerNumberFormatter.format(decimalValue.toNumber())
    }

    return fixedTwoDecimalFormatter.format(decimalValue.toNumber())
  }

  if (absValue.lessThanOrEqualTo(NOTATION_THRESHOLD)) {
    return integerNumberFormatter.format(
      decimalValue.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber(),
    )
  }

  const exponent = parseExponent(absValue)
  const tier = Math.floor(exponent / 3)

  if (tier >= SHORT_SUFFIXES.length) {
    return toScientific(decimalValue)
  }

  const suffix = SHORT_SUFFIXES[tier]
  const scaled = decimalValue.div(TEN.pow(tier * 3))
  return `${formatMantissa(scaled)}${suffix}`
}
