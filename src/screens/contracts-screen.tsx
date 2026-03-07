import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  activateContract,
  claimContract,
  GENERATOR_DEFS,
  getContractProgress,
  skipContract,
  type ContractModifier,
  type ContractReward,
  type ContractState,
  type GameState,
} from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface ContractsScreenProps {
  game: GameState
  nowMs: number
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedCredits: (value: Decimal.Value) => string
  formatDuration: (seconds: number) => string
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

function formatCompactValue(value: Decimal.Value, decimals = 2): string {
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

function getQualityLabel(contract: ContractState): string {
  if (contract.quality === 'elite') {
    return 'Elite'
  }
  if (contract.quality === 'rare') {
    return 'Rare'
  }
  return 'Common'
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
  if (contract.objective.type === 'creditsPerSecond') {
    return 'Reach Credits / sec'
  }
  return 'Purchase Upgrades'
}

function getModifierLabel(modifier: ContractModifier | null): string | null {
  if (!modifier) {
    return null
  }
  if (modifier.type === 'blockGenerator') {
    return `Challenge: Cannot buy ${GENERATOR_DEFS[modifier.generator].label}`
  }
  if (modifier.type === 'onlyGenerator') {
    return `Challenge: Only buy ${GENERATOR_DEFS[modifier.generator].label}`
  }
  if (modifier.type === 'upgradesDisabled') {
    return 'Challenge: Upgrades disabled'
  }
  if (modifier.type === 'minTier') {
    const tier = modifier.minimumTierIndex + 1
    return `Challenge: Only tier ${tier}+ producers`
  }
  if (modifier.type === 'buyAmountLocked') {
    return `Challenge: Must use ${modifier.amount}x buy amount`
  }
  return 'Challenge: Prestige disabled'
}

function getRewardLabel(
  reward: ContractReward,
  formatRenderedCredits: (value: Decimal.Value) => string,
): string {
  if (reward.type === 'credits') {
    return `+${formatRenderedCredits(reward.amount)} credits`
  }
  if (reward.type === 'essence') {
    return `+${formatCompactValue(reward.amount)} essence`
  }
  if (reward.type === 'productionBoost') {
    return `x${formatCompactValue(reward.multiplier)} production for ${Math.round(reward.durationSeconds / 60)}m`
  }
  if (reward.type === 'costDiscountCharges') {
    return `x${formatCompactValue(reward.multiplier)} costs for next ${reward.charges} purchases`
  }
  return `x${formatCompactValue(reward.multiplier)} next contract reward`
}

export function ContractsScreen({
  game,
  nowMs,
  onGameChange,
  formatRenderedCredits,
  formatDuration,
}: ContractsScreenProps) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Contracts</p>
        <p className="mt-1 text-sm text-muted-foreground">
          High-impact objectives with optional constraints and multi-part rewards.
        </p>
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
          const modifierLabel = getModifierLabel(contract.modifier)
          const expiresInSeconds =
            contract.isParticipating && contract.expiresAtMs !== null
              ? Math.max(0, Math.ceil((contract.expiresAtMs - nowMs) / 1000))
              : null

          return (
            <article key={contract.id} className="rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {getBandLabel(contract)}
                  </span>
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {getQualityLabel(contract)}
                  </span>
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {contract.kind}
                  </span>
                </div>
                {expiresInSeconds !== null && (
                  <p className="text-[11px] text-muted-foreground">
                    {expiresInSeconds > 0 ? formatDuration(expiresInSeconds) : 'Expired'}
                  </p>
                )}
              </div>

              <p className="mt-2 text-sm font-medium">{getObjectiveLabel(contract)}</p>
              {modifierLabel && (
                <p className="mt-1 text-xs text-muted-foreground">{modifierLabel}</p>
              )}
              {!contract.isParticipating && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Not active yet. Participate to enable this contract.
                </p>
              )}

              <p className="mt-2 text-sm text-muted-foreground">
                {contract.isParticipating && progress.isComplete ? (
                  <span className="font-medium text-foreground">Complete</span>
                ) : (
                  <>
                    <span className="font-mono tabular-nums">
                      {formatCompactValue(current, 2)}
                    </span>
                    {' / '}
                    <span className="font-mono tabular-nums">
                      {formatCompactValue(progress.target, 2)}
                    </span>{' '}
                    {progress.label}
                  </>
                )}
              </p>
              {contract.isParticipating && !progress.isComplete && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Remaining:{' '}
                  <span className="font-mono tabular-nums">
                    {formatCompactValue(remaining, 2)}
                  </span>
                </p>
              )}

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-150',
                    contract.isParticipating && progress.isComplete
                      ? 'bg-foreground/80'
                      : 'bg-muted-foreground/60',
                  )}
                  style={{
                    width: contract.isParticipating
                      ? `${Math.max(0, progressPercent)}%`
                      : '0%',
                  }}
                />
              </div>

              <div className="mt-3 space-y-1.5">
                {contract.rewards.map((reward, index) => (
                  <p key={`${contract.id}-reward-${index}`} className="text-xs text-muted-foreground">
                    Reward: <span className="font-mono tabular-nums">{getRewardLabel(reward, formatRenderedCredits)}</span>
                  </p>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGameChange((current) => skipContract(current, contract.id, Date.now()))}
                >
                  Skip
                </Button>
                {!contract.isParticipating && (
                  <Button
                    size="sm"
                    onClick={() =>
                      onGameChange((current) => activateContract(current, contract.id, Date.now()))
                    }
                  >
                    Participate
                  </Button>
                )}
                <Button
                  size="sm"
                  disabled={!contract.isParticipating || !progress.isComplete}
                  onClick={() => onGameChange((current) => claimContract(current, contract.id, Date.now()))}
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
