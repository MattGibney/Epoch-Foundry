import { useMemo } from 'react'
import Decimal from 'decimal.js'

import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_ORDER,
  GENERATOR_DEFS,
  getAchievementProgressRatio,
  getLegacyUpgradeCountByBranch,
  getOfflineProgressCapSeconds,
  getPurchasedLegacyUpgradeCount,
  LEGACY_UPGRADE_DEFS,
  LEGACY_UPGRADE_ORDER,
  UPGRADE_ORDER,
  type AchievementKey,
  type GameState,
} from '@/lib/game-engine'
import { formatIdleNumber } from '@/lib/number-format'
import { cn } from '@/lib/utils'

interface AchievementsScreenProps {
  game: GameState
  unlockedAchievementCount: number
}

interface AchievementCardEntry {
  key: AchievementKey
  category: string
  label: string
  description: string
  progressRatio: Decimal
  progressText: string
  unlocked: boolean
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

function getPurchasedRunUpgradeCount(game: GameState): number {
  return UPGRADE_ORDER.reduce((count, key) => count + (game.purchasedUpgrades[key] ? 1 : 0), 0)
}

function getLegacyBranchTotal(branch: AchievementCardEntry['category']): number {
  return LEGACY_UPGRADE_ORDER.reduce(
    (count, key) => count + (LEGACY_UPGRADE_DEFS[key].branch === branch ? 1 : 0),
    0,
  )
}

function getAchievementProgressText(game: GameState, key: AchievementKey): string {
  const { requirement } = ACHIEVEMENT_DEFS[key]

  switch (requirement.type) {
    case 'allResetCredits':
      return `${formatIdleNumber(game.stats.totalCreditsAllResets)} / ${formatIdleNumber(
        requirement.threshold,
      )} credits`
    case 'runCredits':
      return `${formatIdleNumber(game.stats.totalCredits)} / ${formatIdleNumber(
        requirement.threshold,
      )} credits`
    case 'owned': {
      const generatorKey = requirement.generator as keyof typeof GENERATOR_DEFS
      return `${game.generators[generatorKey]} / ${requirement.count} ${
        GENERATOR_DEFS[generatorKey].label
      }`
    }
    case 'ascensions':
      return `${game.ascension.ascensions} / ${requirement.count} ascensions`
    case 'legacyLevel':
      return `${formatIdleNumber(game.ascension.legacyLevel)} / ${formatIdleNumber(
        requirement.threshold,
      )} Legacy`
    case 'legacyUpgradeCount':
      return `${getPurchasedLegacyUpgradeCount(game)} / ${requirement.count} Legacy upgrades`
    case 'legacyBranchComplete': {
      const purchased = getLegacyUpgradeCountByBranch(game, requirement.branch)
      const total = getLegacyBranchTotal(requirement.branch)
      return `${purchased} / ${total} ${requirement.branch} upgrades`
    }
    case 'purchasedUpgrades':
      return `${getPurchasedRunUpgradeCount(game)} / ${requirement.count} run upgrades`
    case 'offlineCapSeconds':
      return `${formatDuration(getOfflineProgressCapSeconds(game))} / ${formatDuration(
        requirement.seconds,
      )}`
    default:
      return ''
  }
}

function AchievementCard({ entry, compact = false }: { entry: AchievementCardEntry; compact?: boolean }) {
  const progressPercent = entry.progressRatio.times(100).toDecimalPlaces(0, Decimal.ROUND_FLOOR)

  return (
    <article
      className={cn(
        'rounded-md border p-3',
        entry.unlocked
          ? 'border-foreground/70 bg-foreground/[0.03] opacity-100'
          : 'border-border bg-background opacity-85',
      )}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn('font-semibold leading-tight', compact ? 'text-sm' : 'text-base')}>
            {entry.label}
          </h3>
          <span
            className={cn(
              'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[11px] tabular-nums',
              entry.unlocked
                ? 'border-foreground/30 text-foreground'
                : 'border-border text-muted-foreground',
            )}
          >
            {entry.unlocked ? 'Done' : `${progressPercent.toFixed(0)}%`}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{entry.description}</p>
        <div className="mt-auto space-y-1.5">
          <p className="break-words font-mono text-xs tabular-nums text-muted-foreground">
            {entry.progressText}
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-300',
                entry.unlocked ? 'bg-foreground/70' : 'bg-muted-foreground/60',
              )}
              style={{ width: `${entry.progressRatio.times(100).toFixed(2)}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export function AchievementsScreen({ game, unlockedAchievementCount }: AchievementsScreenProps) {
  const achievementEntries = useMemo<AchievementCardEntry[]>(
    () =>
      ACHIEVEMENT_ORDER.map((key) => {
        const definition = ACHIEVEMENT_DEFS[key]
        return {
          key,
          category: definition.category,
          label: definition.label,
          description: definition.description,
          progressRatio: getAchievementProgressRatio(game, key),
          progressText: getAchievementProgressText(game, key),
          unlocked: game.achievements[key],
        }
      }),
    [game],
  )
  const groupedAchievements = useMemo(
    () =>
      achievementEntries.reduce<Array<{ category: string; entries: AchievementCardEntry[] }>>(
        (groups, entry) => {
          const existingGroup = groups.find((group) => group.category === entry.category)
          if (existingGroup) {
            existingGroup.entries.push(entry)
            return groups
          }

          groups.push({ category: entry.category, entries: [entry] })
          return groups
        },
        [],
      ),
    [achievementEntries],
  )
  const nextGoals = useMemo(() => {
    const selectedCategories = new Set<string>()

    return achievementEntries
      .filter((entry) => !entry.unlocked)
      .sort((a, b) => b.progressRatio.comparedTo(a.progressRatio))
      .reduce<AchievementCardEntry[]>((selected, entry) => {
        if (selected.length >= 3) {
          return selected
        }

        if (selectedCategories.has(entry.category)) {
          return selected
        }

        selectedCategories.add(entry.category)
        selected.push(entry)
        return selected
      }, [])
  }, [achievementEntries])
  const unlockedProgressPercent = ACHIEVEMENT_ORDER.length <= 0
    ? 100
    : (unlockedAchievementCount / ACHIEVEMENT_ORDER.length) * 100

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Progress
        </p>
        <p className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Unlocked</span>
          <span className="font-mono tabular-nums">
            {unlockedAchievementCount}/{ACHIEVEMENT_ORDER.length}
          </span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground/65 transition-[width] duration-300"
            style={{ width: `${unlockedProgressPercent}%` }}
          />
        </div>
      </section>

      {nextGoals.length > 0 ? (
        <section className="border-t border-border/70 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Next Goals
          </h2>
          <div className="mt-3 space-y-2.5">
            {nextGoals.map((entry) => (
              <AchievementCard key={entry.key} entry={entry} compact />
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-border/70 pt-4">
        <div className="space-y-6">
          {groupedAchievements.map((group) => (
            <section key={group.category} className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.category}
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.entries.map((entry) => (
                  <AchievementCard key={entry.key} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
