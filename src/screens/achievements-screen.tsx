import { ACHIEVEMENT_DEFS, ACHIEVEMENT_ORDER, type GameState } from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface AchievementsScreenProps {
  game: GameState
  unlockedAchievementCount: number
}

export function AchievementsScreen({ game, unlockedAchievementCount }: AchievementsScreenProps) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Progress</p>
        <p className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Unlocked</span>
          <span className="font-mono tabular-nums">
            {unlockedAchievementCount}/{ACHIEVEMENT_ORDER.length}
          </span>
        </p>
      </section>
      <section className="border-t border-border/70 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENT_ORDER.map((key) => {
            const definition = ACHIEVEMENT_DEFS[key]
            const unlocked = game.achievements[key]

            return (
              <article
                key={key}
                className={cn(
                  'rounded-lg p-3',
                  unlocked ? 'border border-black opacity-100' : 'border border-border opacity-55',
                )}
              >
                <div className="flex h-full flex-col gap-1.5">
                  <h3 className="text-sm font-semibold leading-tight">{definition.label}</h3>
                  <p className="text-xs text-muted-foreground">{definition.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
