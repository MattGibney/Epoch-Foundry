import Decimal from 'decimal.js'

import {
  canBuyUpgrade,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getGeneratorCost,
  getPrestigeGainForReset,
  getUpgradeUnlockProgress,
  UPGRADE_DEFS,
  UPGRADE_ORDER,
  type GameState,
} from '@/lib/game-engine'

interface HomeScreenProps {
  game: GameState
  creditsPerSecond: Decimal
  formatRenderedCredits: (value: Decimal.Value) => string
  formatIdleNumber: (value: Decimal.Value) => string
  formatAffordabilityEta: (totalSeconds: number) => string
  getSecondsUntilAffordable: (
    credits: Decimal,
    cost: Decimal,
    creditsPerSecond: Decimal,
  ) => number | null
}

export function HomeScreen({
  game,
  creditsPerSecond,
  formatRenderedCredits,
  formatIdleNumber,
  formatAffordabilityEta,
  getSecondsUntilAffordable,
}: HomeScreenProps) {
  const productionIntensity = (() => {
    if (creditsPerSecond.lessThanOrEqualTo(0)) {
      return 0
    }

    const intensity = creditsPerSecond.plus(1).log(10).div(7).toNumber()
    return Math.max(0, Math.min(1, intensity))
  })()

  const nextGeneratorGoal = (() => {
    const credits = new Decimal(game.credits)
    let best:
      | {
          label: string
          cost: Decimal
          etaSeconds: number | null
        }
      | null = null

    for (const key of GENERATOR_ORDER) {
      const cost = getGeneratorCost(game, key, 1)
      if (credits.greaterThanOrEqualTo(cost)) {
        continue
      }

      const etaSeconds = getSecondsUntilAffordable(credits, cost, creditsPerSecond)
      if (!best) {
        best = { label: GENERATOR_DEFS[key].label, cost, etaSeconds }
        continue
      }

      if (best.etaSeconds === null) {
        best = { label: GENERATOR_DEFS[key].label, cost, etaSeconds }
        continue
      }

      if (etaSeconds !== null && etaSeconds < best.etaSeconds) {
        best = { label: GENERATOR_DEFS[key].label, cost, etaSeconds }
      }
    }

    return best
  })()

  const nextUpgradeUnlockGoal = (() => {
    for (const key of UPGRADE_ORDER) {
      if (game.purchasedUpgrades[key] || canBuyUpgrade(game, key)) {
        continue
      }

      const unlockProgress = getUpgradeUnlockProgress(game, key)
      if (!unlockProgress) {
        continue
      }

      return {
        label: UPGRADE_DEFS[key].label,
        current: unlockProgress.current,
        required: unlockProgress.required,
        requirementLabel: unlockProgress.label,
      }
    }

    return null
  })()

  const nextPrestigeGoal = (() => {
    const currentGain = getPrestigeGainForReset(game)
    const targetGain = currentGain.plus(1)
    const currentRunCredits = new Decimal(game.stats.totalCredits)

    const gainAt = (runCredits: Decimal): Decimal =>
      getPrestigeGainForReset({
        ...game,
        stats: {
          ...game.stats,
          totalCredits: runCredits.toString(),
        },
      })

    let low = Decimal.max(currentRunCredits, 0)
    let high = Decimal.max(new Decimal(1), low.plus(1))
    let guard = 0
    while (gainAt(high).lessThan(targetGain) && guard < 256) {
      high = high.times(2)
      guard += 1
    }

    for (let index = 0; index < 256 && high.minus(low).greaterThan(1); index += 1) {
      const mid = low.plus(high).div(2).floor()
      if (gainAt(mid).greaterThanOrEqualTo(targetGain)) {
        high = mid
      } else {
        low = mid
      }
    }

    return {
      currentGain,
      targetGain,
      targetCredits: high,
    }
  })()

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-xl border border-border/70 px-4 py-4">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.25 + productionIntensity * 0.5,
            background:
              'radial-gradient(circle at 20% 30%, oklch(0.75 0.02 250 / 0.4), transparent 45%), radial-gradient(circle at 80% 20%, oklch(0.8 0.015 180 / 0.35), transparent 42%), radial-gradient(circle at 50% 85%, oklch(0.78 0.018 290 / 0.3), transparent 45%)',
          }}
        />
        <div
          className="pointer-events-none absolute -left-10 top-8 h-32 w-32 rounded-full bg-foreground/10 blur-2xl animate-pulse"
          style={{ transform: `scale(${0.8 + productionIntensity * 0.9})` }}
        />
        <div
          className="pointer-events-none absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-foreground/10 blur-2xl animate-pulse"
          style={{
            transform: `scale(${0.7 + productionIntensity * 1.1})`,
            animationDelay: '0.7s',
          }}
        />
        <div className="relative">
          <h3 className="text-sm font-semibold">Next Steps</h3>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start justify-between gap-3">
              <span>Next affordable generator</span>
              <span className="text-right">
                {nextGeneratorGoal ? (
                  <>
                    <span className="font-medium text-foreground">{nextGeneratorGoal.label}</span>{' '}
                    (<span className="font-mono tabular-nums">{formatRenderedCredits(nextGeneratorGoal.cost)}</span>
                    {nextGeneratorGoal.etaSeconds !== null
                      ? `, ${formatAffordabilityEta(nextGeneratorGoal.etaSeconds)}`
                      : ''}
                    )
                  </>
                ) : (
                  'All generators affordable'
                )}
              </span>
            </p>
            <p className="flex items-start justify-between gap-3">
              <span>Next upgrade unlock</span>
              <span className="text-right">
                {nextUpgradeUnlockGoal ? (
                  <>
                    <span className="font-medium text-foreground">{nextUpgradeUnlockGoal.label}</span>{' '}
                    (
                    <span className="font-mono tabular-nums">
                      {nextUpgradeUnlockGoal.current}/{nextUpgradeUnlockGoal.required}
                    </span>{' '}
                    {nextUpgradeUnlockGoal.requirementLabel})
                  </>
                ) : (
                  'No pending unlock requirements'
                )}
              </span>
            </p>
            <p className="flex items-start justify-between gap-3">
              <span>Next prestige breakpoint</span>
              <span className="text-right">
                <span className="font-mono tabular-nums">
                  {formatRenderedCredits(nextPrestigeGoal.targetCredits)}
                </span>{' '}
                run credits
                <span className="ml-1">
                  (+
                  <span className="font-mono tabular-nums">
                    {formatIdleNumber(nextPrestigeGoal.targetGain)}
                  </span>{' '}
                  essence)
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
