import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  type GameState,
  loadGameState,
  MULTIPLIER_OPTIONS,
  saveGameState,
} from '@/lib/game-save'
import { formatIdleNumber } from '@/lib/number-format'
import { cn } from '@/lib/utils'

const MAX_MULTIPLIER = MULTIPLIER_OPTIONS[MULTIPLIER_OPTIONS.length - 1]!

function formatMultiplierLabel(multiplier: string): string {
  if (multiplier === MAX_MULTIPLIER) {
    return multiplier
  }

  return formatIdleNumber(multiplier)
}

function App() {
  const [game, setGame] = useState<GameState>(() => loadGameState())
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const gameRef = useRef(game)

  useEffect(() => {
    gameRef.current = game
  }, [game])

  const persistGame = useCallback(() => {
    saveGameState(gameRef.current)
    setLastSavedAt(Date.now())
  }, [])

  useEffect(() => {
    let lastTickAt = Date.now()

    const tickId = window.setInterval(() => {
      const now = Date.now()
      const elapsedSeconds = (now - lastTickAt) / 1_000
      lastTickAt = now

      setGame((current) => ({
        ...current,
        total: new Decimal(current.total)
          .plus(new Decimal(current.selectedMultiplier).times(elapsedSeconds))
          .toString(),
      }))
    }, 200)

    return () => {
      window.clearInterval(tickId)
    }
  }, [])

  useEffect(() => {
    const autosaveId = window.setInterval(() => {
      persistGame()
    }, 10_000)

    return () => {
      window.clearInterval(autosaveId)
    }
  }, [persistGame])

  useEffect(() => {
    const saveOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistGame()
      }
    }

    const saveOnPageExit = () => {
      persistGame()
    }

    document.addEventListener('visibilitychange', saveOnVisibilityChange)
    window.addEventListener('pagehide', saveOnPageExit)
    window.addEventListener('beforeunload', saveOnPageExit)

    return () => {
      document.removeEventListener('visibilitychange', saveOnVisibilityChange)
      window.removeEventListener('pagehide', saveOnPageExit)
      window.removeEventListener('beforeunload', saveOnPageExit)
    }
  }, [persistGame])

  const formattedTotal = useMemo(
    () => formatIdleNumber(game.total),
    [game.total],
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Epoch Foundry</h1>
          <p className="text-sm text-muted-foreground">
            Total increases automatically based on selected multiplier.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-background px-4 py-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total
          </p>
          <p className="mt-1 text-4xl font-semibold tabular-nums">{formattedTotal}</p>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-background px-4 py-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Generation Rate
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            +{formatMultiplierLabel(game.selectedMultiplier)} / second
          </p>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Multiplier
          </p>
          <div className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
            {MULTIPLIER_OPTIONS.map((option, index) => (
              <Button
                key={option}
                variant={game.selectedMultiplier === option ? 'default' : 'outline'}
                className={cn(
                  'w-full',
                  index === 0 && 'h-9 text-sm',
                  index === 1 && 'h-10 text-sm',
                  index === 2 && 'h-11 text-base',
                  index === 3 && 'h-12 text-lg',
                  index === 4 && 'h-14 text-xl',
                  index >= 5 && index <= 9 && 'h-12 text-base',
                )}
                onClick={() =>
                  setGame((current) => ({
                    ...current,
                    selectedMultiplier: option,
                  }))
                }
              >
                {formatMultiplierLabel(option)}x
              </Button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Autosaves every 10s and on exit
          {lastSavedAt ? ` • Last save ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}
        </p>
      </section>
    </main>
  )
}

export default App
