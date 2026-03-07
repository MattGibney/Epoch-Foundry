import type Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import { type GameState } from '@/lib/game-engine'

interface StatsScreenProps {
  game: GameState
  runDuration: number
  offlineProgressCapSeconds: number
  creditsPerSecond: Decimal.Value
  prestigeMultiplier: Decimal.Value
  prestigeGain: Decimal.Value
  canPrestigeNow: boolean
  onOpenPrestige: () => void
  formatDuration: (seconds: number) => string
  formatRenderedCredits: (value: Decimal.Value) => string
  formatIdleNumber: (value: Decimal.Value) => string
}

export function StatsScreen({
  game,
  runDuration,
  offlineProgressCapSeconds,
  creditsPerSecond,
  prestigeMultiplier,
  prestigeGain,
  canPrestigeNow,
  onOpenPrestige,
  formatDuration,
  formatRenderedCredits,
  formatIdleNumber,
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
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Prestige</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Essence</span>
            <span className="font-mono tabular-nums">{formatIdleNumber(game.prestige.essence)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Permanent Multiplier</span>
            <span className="font-mono tabular-nums">x{formatIdleNumber(prestigeMultiplier)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Reset Gain</span>
            <span className="font-mono tabular-nums">+{formatIdleNumber(prestigeGain)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Resets</span>
            <span className="font-mono tabular-nums">{game.prestige.resets}</span>
          </p>
        </div>
        <Button className="mt-4" disabled={!canPrestigeNow} onClick={onOpenPrestige}>
          Prestige Reset
        </Button>
      </section>
    </div>
  )
}
