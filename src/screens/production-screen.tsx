import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  BUY_AMOUNT_OPTIONS,
  buyGenerator,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getGeneratorCost,
  getGeneratorProductionPerSecond,
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
}

export function ProductionScreen({
  game,
  creditsPerSecond,
  onGameChange,
  formatRenderedCredits,
  formatAffordabilityEta,
  getSecondsUntilAffordable,
}: ProductionScreenProps) {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-end gap-2">
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
      </section>

      <section className="divide-y divide-border/70">
        {GENERATOR_ORDER.map((key) => {
          const definition = GENERATOR_DEFS[key]
          const cost = getGeneratorCost(game, key)
          const owned = game.generators[key]
          const credits = new Decimal(game.credits)
          const canBuy = credits.greaterThanOrEqualTo(cost)
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

          return (
            <article key={definition.key} className="py-4 first:pt-0">
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
                        'h-full rounded-full transition-all',
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
                </div>
                <Button
                  size="sm"
                  className="h-10 min-w-[5.5rem] shrink-0 font-mono tabular-nums"
                  disabled={!canBuy}
                  onClick={() => onGameChange((current) => buyGenerator(current, key))}
                >
                  Buy
                </Button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
