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

function getContractName(contract: ContractState): string {
  if (contract.kind === 'challenge') {
    return `${getQualityLabel(contract)} ${getBandLabel(contract)} Challenge`
  }
  return `${getQualityLabel(contract)} ${getBandLabel(contract)} Contract`
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

function getObjectiveDescription(contract: ContractState): string {
  if (contract.objective.type === 'runCredits') {
    return 'Produce run credits during this run.'
  }
  if (contract.objective.type === 'owned') {
    return `Own more ${GENERATOR_DEFS[contract.objective.generator].label}.`
  }
  if (contract.objective.type === 'creditsPerSecond') {
    return 'Increase your credits per second to the target.'
  }
  return 'Purchase additional upgrades this run.'
}

function getRewardDisplay(
  reward: ContractReward,
  formatRenderedCredits: (value: Decimal.Value) => string,
): { label: string; value: string } {
  if (reward.type === 'credits') {
    return {
      label: 'Credits',
      value: `+${formatRenderedCredits(reward.amount)}`,
    }
  }
  if (reward.type === 'essence') {
    return {
      label: 'Essence',
      value: `+${formatCompactValue(reward.amount)}`,
    }
  }
  if (reward.type === 'productionBoost') {
    return {
      label: 'Production Boost',
      value: `x${formatCompactValue(reward.multiplier)} for ${Math.round(reward.durationSeconds / 60)}m`,
    }
  }
  if (reward.type === 'costDiscountCharges') {
    return {
      label: 'Cost Discount',
      value: `x${formatCompactValue(reward.multiplier)} for ${reward.charges} buys`,
    }
  }
  return {
    label: 'Next Reward Multiplier',
    value: `x${formatCompactValue(reward.multiplier)}`,
  }
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
          const progressPercent = target.greaterThan(0)
            ? Decimal.min(new Decimal(100), current.div(target).times(100))
                .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
                .toNumber()
            : 100
          const expiresInSeconds =
            contract.isParticipating && contract.expiresAtMs !== null
              ? Math.max(0, Math.ceil((contract.expiresAtMs - nowMs) / 1000))
              : null
          const offerExpiresInSeconds = !contract.isParticipating
            ? Math.max(0, Math.ceil((contract.offerExpiresAtMs - nowMs) / 1000))
            : null
          const isComplete = contract.isParticipating && progress.isComplete
          const isActive = contract.isParticipating && !progress.isComplete
          const description = getModifierLabel(contract.modifier) ?? getObjectiveDescription(contract)

          return (
            <article key={contract.id} className="rounded-lg border border-border/70 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{getContractName(contract)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                {contract.kind === 'challenge' && (
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    Challenge
                  </span>
                )}
              </div>

              <div className="mt-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Rewards</p>
                <div className="mt-1.5 space-y-1.5">
                  {contract.rewards.map((reward, index) => {
                    const display = getRewardDisplay(reward, formatRenderedCredits)
                    return (
                      <div
                        key={`${contract.id}-reward-${index}`}
                        className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs"
                      >
                        <span className="text-muted-foreground">{display.label}</span>
                        <span className="font-mono tabular-nums text-foreground">{display.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                {contract.isParticipating && (
                  <div className="min-w-0 flex-1">
                    {expiresInSeconds !== null && (
                      <p className="text-xs text-muted-foreground">
                        Time Remaining:{' '}
                        <span className="font-mono tabular-nums">
                          {expiresInSeconds > 0 ? formatDuration(expiresInSeconds) : 'Expired'}
                        </span>
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isComplete ? (
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
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-150',
                          isComplete ? 'bg-foreground/80' : 'bg-muted-foreground/60',
                        )}
                        style={{ width: `${Math.max(0, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                )}
                {!contract.isParticipating && offerExpiresInSeconds !== null && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Offer Expires In:{' '}
                      <span className="font-mono tabular-nums">
                        {offerExpiresInSeconds > 0 ? formatDuration(offerExpiresInSeconds) : 'Expired'}
                      </span>
                    </p>
                  </div>
                )}

                {!contract.isParticipating && (
                  <Button
                    size="sm"
                    onClick={() =>
                      onGameChange((current) => activateContract(current, contract.id, Date.now()))
                    }
                    variant="default"
                    className="ml-auto"
                  >
                    Begin
                  </Button>
                )}
                {isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGameChange((current) => skipContract(current, contract.id, Date.now()))}
                  >
                    Abandon
                  </Button>
                )}
                {isComplete && (
                  <Button
                    size="sm"
                    onClick={() => onGameChange((current) => claimContract(current, contract.id, Date.now()))}
                  >
                    Claim Reward
                  </Button>
                )}
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
