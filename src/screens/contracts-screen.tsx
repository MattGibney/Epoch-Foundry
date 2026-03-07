import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  claimContract,
  GENERATOR_DEFS,
  getContractProgress,
  type ContractState,
  type GameState,
} from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface ContractsScreenProps {
  game: GameState
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedCredits: (value: Decimal.Value) => string
}

const CONTRACT_SUFFIXES = [
  { value: new Decimal('1e30'), label: 'No' },
  { value: new Decimal('1e27'), label: 'Oc' },
  { value: new Decimal('1e24'), label: 'Sp' },
  { value: new Decimal('1e21'), label: 'Sx' },
  { value: new Decimal('1e18'), label: 'Qi' },
  { value: new Decimal('1e15'), label: 'Qa' },
  { value: new Decimal('1e12'), label: 'T' },
  { value: new Decimal('1e9'), label: 'B' },
  { value: new Decimal('1e6'), label: 'M' },
] as const

function formatContractProgressValue(value: Decimal.Value, decimals = 2): string {
  const decimalValue = new Decimal(value)
  if (!decimalValue.isFinite()) {
    return decimalValue.toString()
  }

  const absolute = decimalValue.abs()
  for (const suffix of CONTRACT_SUFFIXES) {
    if (absolute.greaterThanOrEqualTo(suffix.value)) {
      const scaled = decimalValue.div(suffix.value).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP)
      return `${scaled.toFixed(decimals)}${suffix.label}`
    }
  }

  const fixed = decimalValue.toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toFixed(decimals)
  const [integerPart, fractionalPart] = fixed.split('.')
  const sign = integerPart.startsWith('-') ? '-' : ''
  const integerDigits = sign ? integerPart.slice(1) : integerPart
  const groupedInteger = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${sign}${groupedInteger}.${fractionalPart ?? '00'}`
}

function getBandLabel(contract: ContractState): string {
  if (contract.band === 'short') {
    return 'Short'
  }
  if (contract.band === 'medium') {
    return 'Medium'
  }
  return 'Long'
}

function getObjectiveLabel(contract: ContractState): string {
  if (contract.objective.type === 'runCredits') {
    return 'Produce Run Credits'
  }
  if (contract.objective.type === 'owned') {
    return `Own ${GENERATOR_DEFS[contract.objective.generator].label}`
  }
  return 'Purchase Upgrades'
}

export function ContractsScreen({
  game,
  onGameChange,
  formatRenderedCredits,
}: ContractsScreenProps) {
  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Contracts</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Deterministic objectives with credits rewards.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        {game.contracts.active.map((contract) => {
          const progress = getContractProgress(game, contract)
          const current = Decimal.min(new Decimal(progress.current), new Decimal(progress.target))
          const target = new Decimal(progress.target)
          const remaining = Decimal.max(new Decimal(0), target.minus(current))
          const progressPercent = target.greaterThan(0)
            ? Decimal.min(new Decimal(100), current.div(target).times(100))
                .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
                .toNumber()
            : 100

          return (
            <article key={contract.id} className="rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{getBandLabel(contract)}</p>
                <p className="text-xs text-muted-foreground">{getObjectiveLabel(contract)}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {progress.isComplete ? (
                  <span className="font-medium text-foreground">Complete</span>
                ) : (
                  <>
                    <span className="font-mono tabular-nums">
                      {formatContractProgressValue(current, 2)}
                    </span>
                    {' / '}
                    <span className="font-mono tabular-nums">
                      {formatContractProgressValue(progress.target, 2)}
                    </span>{' '}
                    {progress.label}
                  </>
                )}
              </p>
              {!progress.isComplete && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Remaining:{' '}
                  <span className="font-mono tabular-nums">
                    {formatContractProgressValue(remaining, 2)}
                  </span>
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-150',
                    progress.isComplete ? 'bg-foreground/80' : 'bg-muted-foreground/60',
                  )}
                  style={{ width: `${Math.max(0, progressPercent)}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Reward:{' '}
                  <span className="font-mono tabular-nums">
                    {formatRenderedCredits(contract.rewardCredits)}
                  </span>{' '}
                  credits
                </p>
                <Button
                  size="sm"
                  disabled={!progress.isComplete}
                  onClick={() =>
                    onGameChange((current) => claimContract(current, contract.id, Date.now()))
                  }
                >
                  Claim
                </Button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
