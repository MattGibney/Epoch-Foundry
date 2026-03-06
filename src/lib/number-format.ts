import Decimal from 'decimal.js'

const NOTATION_THRESHOLD = new Decimal(100_000_000)
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

const smallNumberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$|(\.\d*?)0+$/, '$1')
}

function formatMantissa(value: Decimal): string {
  const absValue = value.abs()

  if (absValue.greaterThanOrEqualTo(100)) {
    return value.toFixed(0)
  }

  if (absValue.greaterThanOrEqualTo(10)) {
    return trimTrailingZeros(value.toFixed(1))
  }

  return trimTrailingZeros(value.toFixed(2))
}

function toScientific(value: Decimal): string {
  return value.toExponential(1).replace('e+', 'e')
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
  if (absValue.lessThanOrEqualTo(NOTATION_THRESHOLD)) {
    return smallNumberFormatter.format(decimalValue.toNumber())
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
