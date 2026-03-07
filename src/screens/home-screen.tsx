import Decimal from 'decimal.js'

import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_ORDER,
  getAchievementProgressRatio,
  type GameState,
} from '@/lib/game-engine'

interface HomeScreenProps {
  game: GameState
  creditsPerSecond: Decimal
}

export function HomeScreen({
  game,
  creditsPerSecond,
}: HomeScreenProps) {
  const productionIntensity = (() => {
    if (creditsPerSecond.lessThanOrEqualTo(0)) {
      return 0
    }

    const intensity = creditsPerSecond.plus(1).log(10).div(7).toNumber()
    return Math.max(0, Math.min(1, intensity))
  })()

  const nextAchievementGoals = ACHIEVEMENT_ORDER
    .filter((key) => !game.achievements[key])
    .map((key, index) => ({
      definition: ACHIEVEMENT_DEFS[key],
      progressRatio: getAchievementProgressRatio(game, key),
      orderIndex: index,
    }))
    .sort((a, b) => {
      if (a.progressRatio.equals(b.progressRatio)) {
        return a.orderIndex - b.orderIndex
      }
      return b.progressRatio.comparedTo(a.progressRatio)
    })
    .reduce<
      Array<{
        definition: (typeof ACHIEVEMENT_DEFS)[typeof ACHIEVEMENT_ORDER[number]]
        progressRatio: Decimal
      }>
    >((selected, candidate) => {
      if (selected.length >= 3) {
        return selected
      }
      if (selected.some((entry) => entry.definition.category === candidate.definition.category)) {
        return selected
      }
      selected.push({
        definition: candidate.definition,
        progressRatio: candidate.progressRatio,
      })
      return selected
    }, [])

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
          <h3 className="text-sm font-semibold">Goals</h3>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            {nextAchievementGoals.length > 0 ? (
              nextAchievementGoals.map((goal) => (
                <article key={goal.definition.key} className="space-y-0.5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {goal.definition.category}
                  </p>
                  <p className="font-medium text-foreground">{goal.definition.label}</p>
                  <p>{goal.definition.description}</p>
                </article>
              ))
            ) : (
              <p>All achievements unlocked.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
