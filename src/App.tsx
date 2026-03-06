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
import { Switch } from '@/components/ui/switch'
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
  setShowPurchasedUpgrades,
  tickGame,
  UPGRADE_DEFS,
  UPGRADE_ORDER,
  type GameState,
} from '@/lib/game-engine'
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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
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
    const currentSettings = gameRef.current.settings

    clearGameSave()
    const nextState = {
      ...initialState,
      settings: currentSettings,
    }

    saveGameState(nextState)

    gameRef.current = nextState
    setGame(nextState)
    setNowMs(now)
    setActiveTab('production')
    setLastSavedAt(now)
  }, [])

  const refreshApp = useCallback(async () => {
    setIsRefreshing(true)
    setRefreshError(null)

    try {
      if (window.__epochFoundryUpdateSW) {
        await window.__epochFoundryUpdateSW(true)
      } else if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          await registration.update()
        }
      }

      window.location.reload()
    } catch (error) {
      console.error('Failed to refresh app', error)
      setRefreshError('Refresh failed. Close and reopen the app to retry.')
      setIsRefreshing(false)
    }
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
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Buy Amount
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
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
      </section>

      <section className="divide-y divide-border/70">
        {GENERATOR_ORDER.map((key) => {
          const definition = GENERATOR_DEFS[key]
          const cost = getGeneratorCost(game, key)
          const owned = game.generators[key]
          const credits = new Decimal(game.credits)
          const canBuy = credits.greaterThanOrEqualTo(cost)
          const contribution = getGeneratorProductionPerSecond(game, key)

          return (
            <article key={definition.key} className="py-4 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{definition.label}</h3>
                  <p className="text-sm text-muted-foreground">{definition.description}</p>
                </div>
                <Button
                  size="sm"
                  disabled={!canBuy}
                  onClick={() => setGame((current) => buyGenerator(current, key))}
                >
                  Buy
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <p>Owned: {owned}</p>
                <p>+{formatIdleNumber(contribution)} / sec</p>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Cost: {formatIdleNumber(cost)} credits
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )

  const renderUpgradesTab = () => (
    <div className="space-y-4">
      {UPGRADE_ORDER.filter((key) => {
        if (game.settings.showPurchasedUpgrades) {
          return true
        }

        return !game.purchasedUpgrades[key]
      }).map((key) => {
        const definition = UPGRADE_DEFS[key]
        const purchased = game.purchasedUpgrades[key]
        const unlocked = isUpgradeUnlocked(game, key)
        const canBuy = canBuyUpgrade(game, key)
        const unlockProgress = getUpgradeUnlockProgress(game, key)

        return (
          <article key={definition.key} className="border-b border-border/70 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{definition.label}</h3>
                <p className="text-sm text-muted-foreground">{definition.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">
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
                size="sm"
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
      {!game.settings.showPurchasedUpgrades &&
        UPGRADE_ORDER.every((key) => game.purchasedUpgrades[key]) && (
          <section className="py-3">
            <p className="text-sm text-muted-foreground">
              All upgrades are purchased. Enable "Show Purchased Upgrades" in
              Settings to review completed upgrades.
            </p>
          </section>
        )}
    </div>
  )

  const renderStatsTab = () => (
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Session</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Run Time</span>
            <span>{formatDuration(runDuration)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Credits / sec</span>
            <span>{formatIdleNumber(creditsPerSecond)}</span>
          </p>
        </div>
      </section>
      <section className="border-t border-border/70 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime</p>
        <p className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Credits Produced</span>
          <span>{formatIdleNumber(game.stats.totalCredits)}</span>
        </p>
      </section>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-semibold">App Updates</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Installed home-screen mode does not expose browser refresh controls.
          Use this to fetch the latest deployed version and reload the app.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          disabled={isRefreshing}
          onClick={() => void refreshApp()}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh App'}
        </Button>
        {refreshError && (
          <p className="mt-2 text-sm text-red-600">{refreshError}</p>
        )}
      </section>

      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Upgrade Display</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Hide completed upgrades by default to keep the list focused.
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Show Purchased Upgrades</p>
            <p className="text-xs text-muted-foreground">
              Display already-owned upgrades in the Upgrades tab.
            </p>
          </div>
          <Switch
            checked={game.settings.showPurchasedUpgrades}
            onCheckedChange={(checked) =>
              setGame((current) => setShowPurchasedUpgrades(current, checked))
            }
          />
        </div>
      </section>

      <section className="border-t border-border/70 pt-4">
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
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-8 pt-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Epoch Foundry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Early-game foundation: credits, generators, and upgrade acceleration.
        </p>
      </header>

      <section className="mt-5 border-b border-border/70 pb-4">
        <article>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Credits
          </p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">
            {formatIdleNumber(game.credits)}
          </p>
        </article>
        <article className="mt-2">
          <p className="text-sm text-muted-foreground">
            +{formatIdleNumber(creditsPerSecond)} / sec
          </p>
        </article>
      </section>

      <nav className="mt-4 grid grid-cols-2 gap-2">
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

      <section className="mt-5">
        {activeTab === 'production' && renderProductionTab()}
        {activeTab === 'upgrades' && renderUpgradesTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </section>

      <footer className="mt-8 pb-2 text-xs text-muted-foreground">
        Autosaves every 10s and on exit
        {lastSavedAt ? ` • Last save ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}
      </footer>
    </main>
  )
}

export default App
