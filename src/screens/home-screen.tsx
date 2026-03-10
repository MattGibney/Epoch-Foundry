import type Decimal from 'decimal.js'

// import { ProducerFlowField } from '@/components/game/producer-flow-field'
// import { SAFE_AREA_INSETS } from '@/lib/game-config'
import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_ORDER,
  // GENERATOR_DEFS,
  // GENERATOR_ORDER,
  getAchievementProgressRatio,
  // getGeneratorProductionPerSecond,
  type GameState,
} from '@/lib/game-engine'

interface HomeScreenProps {
  game: GameState
}

const LONG_TERM_GOAL_CATEGORIES = new Set([
  'Lifetime Credits',
  'Prestige',
  'Essence',
  'Permanent Upgrades',
  'Upgrades',
  'Offline',
])

export function HomeScreen({ game }: HomeScreenProps) {
  // const producerMetrics = GENERATOR_ORDER.map((key) => ({
  //   key,
  //   label: GENERATOR_DEFS[key].label,
  //   productionPerSecond: getGeneratorProductionPerSecond(game, key),
  // }))

  const unachievedGoals = ACHIEVEMENT_ORDER
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
  const nextAchievementGoals = unachievedGoals.reduce<
      Array<{
        definition: (typeof ACHIEVEMENT_DEFS)[typeof ACHIEVEMENT_ORDER[number]]
        progressRatio: Decimal
      }>
    >((selected, candidate) => {
      if (selected.length >= 2) {
        return selected
      }
      if (
        selected.some((entry) =>
          entry.definition.category === candidate.definition.category)
      ) {
        return selected
      }
      selected.push({
        definition: candidate.definition,
        progressRatio: candidate.progressRatio,
      })
      return selected
    }, [])

  const selectedGoalKeys = new Set(nextAchievementGoals.map((goal) => goal.definition.key))
  const longTermGoal =
    unachievedGoals.find(
      (candidate) =>
        LONG_TERM_GOAL_CATEGORIES.has(candidate.definition.category) &&
        !selectedGoalKeys.has(candidate.definition.key) &&
        candidate.progressRatio.lessThan(0.95),
    ) ?? null

  if (longTermGoal) {
    nextAchievementGoals.push({
      definition: longTermGoal.definition,
      progressRatio: longTermGoal.progressRatio,
    })
  }

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
      {/* <section
        className="overflow-hidden"
        style={{
          marginLeft: `calc(-1 * (${SAFE_AREA_INSETS.left} + 1rem))`,
          marginRight: `calc(-1 * (${SAFE_AREA_INSETS.right} + 1rem))`,
          width: `calc(100% + ${SAFE_AREA_INSETS.left} + ${SAFE_AREA_INSETS.right} + 2rem)`,
        }}
      >
        <ProducerFlowField producers={producerMetrics} className="block" />
      </section> */}
    </div>
  )
}
