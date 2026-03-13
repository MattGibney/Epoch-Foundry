import type Decimal from 'decimal.js'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { type GameState } from '@/lib/game-engine'

interface SubsystemStatsSection {
  title: string
  currencyLabel: string
  currentCurrency: Decimal.Value
  currencyPerSecond: Decimal.Value
  lifetimeCurrency: Decimal.Value
  parentLabel: string
  parentMultiplier: Decimal.Value
  purchasedUpgrades: number
  totalUpgrades: number
}

interface StatsScreenProps {
  game: GameState
  runDuration: number
  offlineProgressCapSeconds: number
  creditsPerSecond: Decimal.Value
  ascensionPassiveMultiplier: Decimal.Value
  ascensionGain: Decimal.Value
  canAscendNow: boolean
  onOpenAscension: () => void
  formatDuration: (seconds: number) => string
  formatRenderedCredits: (value: Decimal.Value) => string
  formatIdleNumber: (value: Decimal.Value) => string
  subsystemStats?: SubsystemStatsSection
}

export function StatsScreen({
  game,
  runDuration,
  offlineProgressCapSeconds,
  creditsPerSecond,
  ascensionPassiveMultiplier,
  ascensionGain,
  canAscendNow,
  onOpenAscension,
  formatDuration,
  formatRenderedCredits,
  formatIdleNumber,
  subsystemStats,
}: StatsScreenProps) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Session</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Run Time</span>
            <span className="font-mono tabular-nums">{formatDuration(runDuration)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Credits / sec</span>
            <span className="font-mono tabular-nums">{formatRenderedCredits(creditsPerSecond)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Offline Cap</span>
            <span className="font-mono tabular-nums">{formatDuration(offlineProgressCapSeconds)}</span>
          </p>
        </div>
      </section>
      <section className="border-t border-border/70 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Run Credits Produced</span>
            <span className="font-mono tabular-nums">
              {formatRenderedCredits(game.stats.totalCredits)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">All-Reset Credits Produced</span>
            <span className="font-mono tabular-nums">
              {formatRenderedCredits(game.stats.totalCreditsAllResets)}
            </span>
          </p>
        </div>
      </section>
      <section className="border-t border-border/70 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Ascension</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Shards</span>
            <span className="font-mono tabular-nums">
              {formatIdleNumber(game.ascension.legacyShards)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Permanent Boost</span>
            <span className="font-mono tabular-nums">
              x{formatIdleNumber(ascensionPassiveMultiplier)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Shards On Ascend</span>
            <span className="font-mono tabular-nums">+{formatIdleNumber(ascensionGain)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Ascensions</span>
            <span className="font-mono tabular-nums">{game.ascension.ascensions}</span>
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="mt-4" disabled={!canAscendNow}>
              Ascend
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Starting an ascension pauses the run and commits you to the ascension flow.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={onOpenAscension}>Yes, Start Ascension</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
      {subsystemStats ? (
        <section className="border-t border-border/70 pt-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {subsystemStats.title}
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">{subsystemStats.currencyLabel}</span>
              <span className="font-mono tabular-nums">
                {formatRenderedCredits(subsystemStats.currentCurrency)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">{subsystemStats.currencyLabel} / sec</span>
              <span className="font-mono tabular-nums">
                {formatRenderedCredits(subsystemStats.currencyPerSecond)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Lifetime {subsystemStats.currencyLabel}</span>
              <span className="font-mono tabular-nums">
                {formatRenderedCredits(subsystemStats.lifetimeCurrency)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">{subsystemStats.parentLabel} Multiplier</span>
              <span className="font-mono tabular-nums">
                x{formatIdleNumber(subsystemStats.parentMultiplier)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Purchased Upgrades</span>
              <span className="font-mono tabular-nums">
                {subsystemStats.purchasedUpgrades}/{subsystemStats.totalUpgrades}
              </span>
            </p>
          </div>
        </section>
      ) : null}
    </div>
  )
}
