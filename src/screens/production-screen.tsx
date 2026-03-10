import { useState } from 'react'
import Decimal from 'decimal.js'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UNKNOWN_PRODUCER_REVEAL_RATIO } from '@/lib/consts'
import { MINER_SUBSYSTEM_CONFIG, type SubsystemKey } from '@/lib/progression-config'
import {
  BUY_AMOUNT_OPTIONS,
  buyGenerator,
  canBuyGenerator,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getSubsystemForGenerator,
  getGeneratorCost,
  getGeneratorProductionPerSecond,
  isGeneratorManagedBySubsystem,
  setBuyAmount,
  type GameState,
} from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface ProductionScreenProps {
  game: GameState
  creditsPerSecond: Decimal
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedCredits: (value: Decimal.Value) => string
  formatAffordabilityEta: (totalSeconds: number) => string
  getSecondsUntilAffordable: (
    credits: Decimal,
    cost: Decimal,
    creditsPerSecond: Decimal,
  ) => number | null
  onOpenSubsystem: (subsystem: SubsystemKey) => void
}

export function ProductionScreen({
  game,
  creditsPerSecond,
  onGameChange,
  formatRenderedCredits,
  formatAffordabilityEta,
  getSecondsUntilAffordable,
  onOpenSubsystem,
}: ProductionScreenProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const credits = new Decimal(game.credits)
  const highestOwnedIndex = GENERATOR_ORDER.reduce(
    (highest, key, index) => (game.generators[key] > 0 ? index : highest),
    -1,
  )

  let maxRevealedIndex = highestOwnedIndex
  let ghostIndex: number | null = null

  for (let index = highestOwnedIndex + 1; index < GENERATOR_ORDER.length; index += 1) {
    const key = GENERATOR_ORDER[index]
    const revealThreshold = new Decimal(GENERATOR_DEFS[key].baseCost).times(
      UNKNOWN_PRODUCER_REVEAL_RATIO,
    )
    if (credits.greaterThanOrEqualTo(revealThreshold)) {
      maxRevealedIndex = index
      continue
    }

    ghostIndex = index
    break
  }

  return (
    <div className="space-y-4">
      <section className="border-b border-border/70 pb-3">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setIsOptionsOpen((current) => !current)}
          aria-expanded={isOptionsOpen}
          aria-controls="production-options-panel"
        >
          <span className="text-sm font-semibold">Options</span>
          <ChevronDown
            className={cn('size-4 text-muted-foreground transition-transform', isOptionsOpen && 'rotate-180')}
            aria-hidden
          />
        </button>
        <div
          id="production-options-panel"
          className={cn(
            'grid overflow-hidden transition-all duration-200 ease-out',
            isOptionsOpen ? 'grid-rows-[1fr] opacity-100 pt-3' : 'grid-rows-[0fr] opacity-0 pt-0',
          )}
        >
          <div className="min-h-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Buy amount</p>
              <div
                className="inline-flex items-center overflow-hidden rounded-md border border-border"
                role="group"
                aria-label="Buy amount"
              >
                {BUY_AMOUNT_OPTIONS.map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant={game.buyAmount === amount ? 'default' : 'ghost'}
                    className="h-7 rounded-none border-0 border-r border-border px-2 text-xs last:border-r-0"
                    onClick={() => onGameChange((current) => setBuyAmount(current, amount))}
                  >
                    <span className="font-mono text-xs tabular-nums">{amount}x</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="divide-y divide-border/70">
        {GENERATOR_ORDER.map((key, index) => {
          const owned = game.generators[key]
          const isOwned = owned > 0
          const isRevealed = isOwned || index <= maxRevealedIndex
          const isGhost = ghostIndex === index

          if (!isRevealed && !isGhost) {
            return null
          }

          const definition = GENERATOR_DEFS[key]
          const cost = getGeneratorCost(game, key)
          const subsystem = getSubsystemForGenerator(key)
          const isSubsystemEntry = isGeneratorManagedBySubsystem(game, key)
          const canBuy = canBuyGenerator(game, key)
          const contribution = getGeneratorProductionPerSecond(game, key)
          const remainingCredits = canBuy ? new Decimal(0) : cost.minus(credits)
          const secondsUntilAffordable = getSecondsUntilAffordable(
            credits,
            cost,
            creditsPerSecond,
          )
          const affordabilityPercent = Decimal.min(
            new Decimal(100),
            credits.div(cost).times(100),
          )
            .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
            .toNumber()
          const subsystemLabel =
            subsystem === 'miners' ? MINER_SUBSYSTEM_CONFIG.label : 'Subsystem'

          if (isGhost) {
            return (
              <article key={definition.key} className="py-4 first:pt-0">
                <div className="space-y-2 blur-[1px]">
                  <p className="text-base font-semibold text-muted-foreground/70">Unknown Producer</p>
                  <p className="text-sm text-muted-foreground/70">
                    ??? ??? ??? ??? ??? ??? ???.
                  </p>
                </div>
              </article>
            )
          }

          return (
            <article key={definition.key} className="py-4 first:pt-0">
              <div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold">{definition.label}</h3>
                      <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                        {owned}
                      </span>
                    </div>
                    <p className="shrink-0 text-sm text-muted-foreground">
                      +
                      <span className="font-mono tabular-nums">
                        {formatRenderedCredits(contribution)}
                      </span>{' '}
                      / sec
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {definition.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    {isSubsystemEntry ? (
                      <>
                        <div className="text-sm text-muted-foreground">
                          Main producer complete
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Enter <span className="font-medium text-foreground">{subsystemLabel}</span>{' '}
                          to keep scaling {definition.label} output.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground">
                          Cost:{' '}
                          <span className="font-mono tabular-nums">
                            {formatRenderedCredits(cost)}
                          </span>{' '}
                          credits
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-75',
                              canBuy ? 'bg-foreground/70' : 'bg-muted-foreground/60',
                            )}
                            style={{ width: `${Math.max(0, affordabilityPercent)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {canBuy ? (
                            'Ready to purchase'
                          ) : (
                            <>
                              Need{' '}
                              <span className="font-mono tabular-nums">
                                {formatRenderedCredits(remainingCredits)}
                              </span>{' '}
                              more
                              {secondsUntilAffordable !== null && secondsUntilAffordable > 0
                                ? ` (${formatAffordabilityEta(secondsUntilAffordable)})`
                                : ''}
                            </>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="h-10 min-w-[5.5rem] shrink-0 font-mono tabular-nums"
                    disabled={!isSubsystemEntry && !canBuy}
                    onClick={() => {
                      if (isSubsystemEntry && subsystem) {
                        onOpenSubsystem(subsystem)
                        return
                      }

                      onGameChange((current) => buyGenerator(current, key))
                    }}
                  >
                    {isSubsystemEntry ? 'Open' : 'Buy'}
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
