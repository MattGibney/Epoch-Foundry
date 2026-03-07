import type Decimal from 'decimal.js'

import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_ORDER,
  getAchievementProgressRatio,
  type GameState,
} from '@/lib/game-engine'

interface HomeScreenProps {
  game: GameState
}

export function HomeScreen({ game }: HomeScreenProps) {
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
      <section className="py-1">
        <div className="px-1">
          <h3 className="text-sm font-semibold">Goals</h3>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            {nextAchievementGoals.length > 0 ? (
              nextAchievementGoals.map((goal) => (
                <article key={goal.definition.key} className="space-y-1.5">
                  <p className="font-medium text-foreground">{goal.definition.label}</p>
                  <p>{goal.definition.description}</p>
                  <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-foreground/35 transition-[width] duration-300"
                      style={{ width: `${goal.progressRatio.times(100).toFixed(2)}%` }}
                    />
                  </div>
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
