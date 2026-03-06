import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Decimal from 'decimal.js'

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
import { clearGameSave, loadGameState, saveGameState } from '@/lib/game-save'
import {
  BUY_AMOUNT_OPTIONS,
  buyGenerator,
  buyUpgrade,
  canBuyUpgrade,
  createInitialGameState,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getGeneratorCost,
  getGeneratorProductionPerSecond,
  getTotalProductionPerSecond,
  getUpgradeUnlockProgress,
  isUpgradeUnlocked,
  setBuyAmount,
  tickGame,
  UPGRADE_DEFS,
  UPGRADE_ORDER,
  type GameState,
} from '@/lib/mvp-engine'
import { formatIdleNumber } from '@/lib/number-format'
import { cn } from '@/lib/utils'

type TabKey = 'production' | 'upgrades' | 'stats' | 'settings'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'production', label: 'Production' },
  { key: 'upgrades', label: 'Upgrades' },
  { key: 'stats', label: 'Stats' },
  { key: 'settings', label: 'Settings' },
]

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }

  return `${seconds}s`
}

function App() {
  const [game, setGame] = useState<GameState>(() => loadGameState())
  const [activeTab, setActiveTab] = useState<TabKey>('production')
  const [nowMs, setNowMs] = useState<number>(() => Date.now())
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const gameRef = useRef(game)

  useEffect(() => {
    gameRef.current = game
  }, [game])

  const persistGame = useCallback(() => {
    saveGameState(gameRef.current)
    setLastSavedAt(Date.now())
  }, [])

  const resetGame = useCallback(() => {
    const now = Date.now()
    const initialState = createInitialGameState(now)

    clearGameSave()
    saveGameState(initialState)

    gameRef.current = initialState
    setGame(initialState)
    setNowMs(now)
    setActiveTab('production')
    setLastSavedAt(now)
  }, [])

  useEffect(() => {
    const tickId = window.setInterval(() => {
      const now = Date.now()
      setNowMs(now)
      setGame((current) => tickGame(current, now))
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

  const creditsPerSecond = useMemo(() => getTotalProductionPerSecond(game), [game])
  const runDuration = Math.max(0, Math.floor((nowMs - game.stats.startedAtMs) / 1_000))

  const renderProductionTab = () => (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Buy Amount
          </p>
          <div className="flex gap-2">
            {BUY_AMOUNT_OPTIONS.map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant={game.buyAmount === amount ? 'default' : 'outline'}
                onClick={() => setGame((current) => setBuyAmount(current, amount))}
              >
                {amount}x
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {GENERATOR_ORDER.map((key) => {
          const definition = GENERATOR_DEFS[key]
          const cost = getGeneratorCost(game, key)
          const owned = game.generators[key]
          const credits = new Decimal(game.credits)
          const canBuy = credits.greaterThanOrEqualTo(cost)
          const contribution = getGeneratorProductionPerSecond(game, key)

          return (
            <article
              key={definition.key}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold">{definition.label}</h3>
                  <p className="text-sm text-muted-foreground">{definition.description}</p>
                  <p className="mt-1 text-sm">Owned: {owned}</p>
                  <p className="text-xs text-muted-foreground">
                    +{formatIdleNumber(contribution)} / sec
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-right text-sm">
                    Cost: {formatIdleNumber(cost)} credits
                  </p>
                  <Button
                    disabled={!canBuy}
                    onClick={() => setGame((current) => buyGenerator(current, key))}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )

  const renderUpgradesTab = () => (
    <div className="space-y-3">
      {UPGRADE_ORDER.map((key) => {
        const definition = UPGRADE_DEFS[key]
        const purchased = game.purchasedUpgrades[key]
        const unlocked = isUpgradeUnlocked(game, key)
        const canBuy = canBuyUpgrade(game, key)
        const unlockProgress = getUpgradeUnlockProgress(game, key)

        return (
          <article
            key={definition.key}
            className="rounded-lg border border-border bg-background p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold">{definition.label}</h3>
                <p className="text-sm text-muted-foreground">{definition.description}</p>
                <p className="mt-1 text-sm">
                  Cost: {formatIdleNumber(definition.cost)} credits
                </p>
                {!unlocked && unlockProgress && (
                  <p className="text-xs text-muted-foreground">
                    Requires {unlockProgress.required} {GENERATOR_DEFS[unlockProgress.generator].label}{' '}
                    ({unlockProgress.current}/{unlockProgress.required})
                  </p>
                )}
                {purchased && <p className="text-xs text-emerald-600">Purchased</p>}
              </div>
              <Button
                variant={purchased ? 'secondary' : 'default'}
                disabled={purchased || !canBuy}
                onClick={() => setGame((current) => buyUpgrade(current, key))}
              >
                {purchased ? 'Owned' : 'Buy Upgrade'}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )

  const renderStatsTab = () => (
    <div className="space-y-3">
      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Session</p>
        <p className="mt-1 text-sm">Run Time: {formatDuration(runDuration)}</p>
        <p className="text-sm">
          Credits / sec: {formatIdleNumber(creditsPerSecond)}
        </p>
      </section>
      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Lifetime
        </p>
        <p className="mt-1 text-sm">
          Total Credits Produced: {formatIdleNumber(game.stats.totalCredits)}
        </p>
      </section>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-background p-4">
        <h3 className="text-base font-semibold">Reset Game</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This clears all progress and starts a fresh run.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-4 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Reset Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset your game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently erase your current progress. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={resetGame}
              >
                Yes, reset game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-6 md:px-6">
      <header className="rounded-xl border border-border bg-card p-4">
        <h1 className="text-2xl font-semibold tracking-tight">Epoch Foundry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Early-game foundation: credits, generators, and upgrade acceleration.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Credits
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatIdleNumber(game.credits)}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Credits / second
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            +{formatIdleNumber(creditsPerSecond)}
          </p>
        </article>
      </section>

      <nav className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-2 md:grid-cols-4">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            className={cn('h-9', activeTab === tab.key && 'shadow-sm')}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>

      <section className="rounded-xl border border-border bg-card p-4">
        {activeTab === 'production' && renderProductionTab()}
        {activeTab === 'upgrades' && renderUpgradesTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </section>

      <footer className="pb-2 text-xs text-muted-foreground">
        Autosaves every 10s and on exit
        {lastSavedAt ? ` • Last save ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}
      </footer>
    </main>
  )
}

export default App
