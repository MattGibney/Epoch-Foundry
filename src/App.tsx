import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Decimal from 'decimal.js'
import {
  BarChart3,
  Coins,
  Factory,
  MoreHorizontal,
  type LucideIcon,
  Wrench,
} from 'lucide-react'
import { toast } from 'sonner'

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import { Switch } from '@/components/ui/switch'
import {
  clearGameSave,
  loadGameStateWithSummary,
  saveGameState,
} from '@/lib/game-save'
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
  getOfflineProgressCapSeconds,
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
import {
  SAFE_AREA_INSETS,
} from '@/lib/game-config'
import {
  GAME_TICK_INTERVAL_MS,
  OFFLINE_PRODUCTION_TOAST_THRESHOLD_SECONDS,
} from '@/lib/consts'
import { formatIdleNumber } from '@/lib/number-format'
import { cn } from '@/lib/utils'

type TabKey = 'production' | 'upgrades' | 'stats' | 'settings' | 'about'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'production', label: 'Production' },
  { key: 'upgrades', label: 'Upgrades' },
  { key: 'stats', label: 'Stats' },
  { key: 'settings', label: 'Settings' },
  { key: 'about', label: 'About' },
]

const PRIMARY_NAV_ITEMS: {
  key: 'production' | 'upgrades' | 'stats'
  label: string
  icon: LucideIcon
}[] = [
  { key: 'production', label: 'Production', icon: Factory },
  { key: 'upgrades', label: 'Upgrades', icon: Wrench },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
]

function isPrimaryTab(tab: TabKey): tab is 'production' | 'upgrades' | 'stats' {
  return tab === 'production' || tab === 'upgrades' || tab === 'stats'
}

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

function getSecondsUntilAffordable(
  credits: Decimal,
  cost: Decimal,
  creditsPerSecond: Decimal,
): number | null {
  if (credits.greaterThanOrEqualTo(cost)) {
    return 0
  }

  if (creditsPerSecond.lessThanOrEqualTo(0)) {
    return null
  }

  const remaining = cost.minus(credits)
  const eta = remaining.div(creditsPerSecond)
  if (!eta.isFinite()) {
    return null
  }

  if (eta.greaterThan(Number.MAX_SAFE_INTEGER)) {
    return Number.MAX_SAFE_INTEGER
  }

  return Math.max(1, eta.ceil().toNumber())
}

function App() {
  const [game, setGame] = useState<GameState>(() => createInitialGameState(Date.now()))
  const [isHydrated, setIsHydrated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('production')
  const [isSectionsOpen, setIsSectionsOpen] = useState(false)
  const [nowMs, setNowMs] = useState<number>(() => Date.now())
  const [showFloatingSummary, setShowFloatingSummary] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const gameRef = useRef(game)
  const creditsSummaryRef = useRef<HTMLElement | null>(null)
  const topSafeAreaBoundaryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gameRef.current = game
  }, [game])

  useEffect(() => {
    let cancelled = false

    const hydrate = async () => {
      const loaded = await loadGameStateWithSummary()
      if (cancelled) {
        return
      }

      gameRef.current = loaded.state
      setGame(loaded.state)
      setNowMs(Date.now())
      setIsHydrated(true)

      const offlineProgress = loaded.offlineProgress
      if (
        !offlineProgress ||
        offlineProgress.appliedSeconds <= OFFLINE_PRODUCTION_TOAST_THRESHOLD_SECONDS
      ) {
        return
      }

      toast(
        <span className="inline-flex items-center gap-1.5">
          <span>Offline Production</span>
          <Coins className="size-4 text-muted-foreground" aria-hidden />
          <span className="font-mono tabular-nums">
            {formatIdleNumber(offlineProgress.producedCredits)}
          </span>
        </span>,
        { id: 'offline-production' },
      )
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [])

  const persistGame = useCallback(async () => {
    await saveGameState(gameRef.current)
  }, [])

  const resetGame = useCallback(() => {
    const now = Date.now()
    const initialState = createInitialGameState(now)
    const currentSettings = gameRef.current.settings

    const nextState = {
      ...initialState,
      settings: currentSettings,
    }

    gameRef.current = nextState
    setGame(nextState)
    setNowMs(now)
    setActiveTab('production')

    void (async () => {
      await clearGameSave()
      await saveGameState(nextState)
    })()
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
    if (!isHydrated) {
      return
    }

    const tickId = window.setInterval(() => {
      const now = Date.now()
      setNowMs(now)
      setGame((current) => tickGame(current, now))
    }, GAME_TICK_INTERVAL_MS)

    return () => {
      window.clearInterval(tickId)
    }
  }, [isHydrated])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const autosaveId = window.setInterval(() => {
      void persistGame()
    }, 10_000)

    return () => {
      window.clearInterval(autosaveId)
    }
  }, [isHydrated, persistGame])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const saveOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void persistGame()
      }
    }

    const saveOnPageExit = () => {
      void persistGame()
    }

    document.addEventListener('visibilitychange', saveOnVisibilityChange)
    window.addEventListener('pagehide', saveOnPageExit)
    window.addEventListener('beforeunload', saveOnPageExit)

    return () => {
      document.removeEventListener('visibilitychange', saveOnVisibilityChange)
      window.removeEventListener('pagehide', saveOnPageExit)
      window.removeEventListener('beforeunload', saveOnPageExit)
    }
  }, [isHydrated, persistGame])

  useEffect(() => {
    const summaryElement = creditsSummaryRef.current
    if (!summaryElement) {
      return
    }

    let frameId: number | null = null

    const syncFloatingState = () => {
      const blurBoundary =
        topSafeAreaBoundaryRef.current?.getBoundingClientRect().bottom ?? 0
      const summaryTop = summaryElement.getBoundingClientRect().top
      setShowFloatingSummary(summaryTop < blurBoundary)
    }

    const syncOnNextFrame = () => {
      if (frameId !== null) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null
        syncFloatingState()
      })
    }

    syncFloatingState()
    window.addEventListener('scroll', syncOnNextFrame, { passive: true })
    window.addEventListener('resize', syncOnNextFrame)

    return () => {
      window.removeEventListener('scroll', syncOnNextFrame)
      window.removeEventListener('resize', syncOnNextFrame)
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const creditsPerSecond = useMemo(() => getTotalProductionPerSecond(game), [game])
  const offlineProgressCapSeconds = useMemo(
    () => getOfflineProgressCapSeconds(game),
    [game],
  )
  const runDuration = Math.max(0, Math.floor((nowMs - game.stats.startedAtMs) / 1_000))
  const overflowTabs = TABS.filter((tab) => !isPrimaryTab(tab.key))
  const isOtherActive = !isPrimaryTab(activeTab)

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
              <span className="font-mono tabular-nums">{amount}x</span>
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
          const remainingCredits = canBuy ? new Decimal(0) : cost.minus(credits)
          const secondsUntilAffordable = getSecondsUntilAffordable(
            credits,
            cost,
            creditsPerSecond,
          )
          const affordabilityPercent = Decimal.min(
            new Decimal(100),
            credits.div(cost).times(100),
          )
            .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
            .toNumber()

          return (
            <article key={definition.key} className="py-4 first:pt-0">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold">{definition.label}</h3>
                    <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                      {owned}
                    </span>
                  </div>
                  <p className="shrink-0 text-sm text-muted-foreground">
                    +<span className="font-mono tabular-nums">{formatIdleNumber(contribution)}</span> / sec
                  </p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {definition.description}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-muted-foreground">
                    Cost:{' '}
                    <span className="font-mono tabular-nums">{formatIdleNumber(cost)}</span>{' '}
                    credits
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        canBuy ? 'bg-foreground/70' : 'bg-muted-foreground/60',
                      )}
                      style={{ width: `${Math.max(0, affordabilityPercent)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {canBuy ? (
                      'Ready to purchase'
                    ) : (
                      <>
                        Need{' '}
                        <span className="font-mono tabular-nums">
                          {formatIdleNumber(remainingCredits)}
                        </span>{' '}
                        more
                        {secondsUntilAffordable !== null && secondsUntilAffordable > 0
                          ? ` (${formatDuration(secondsUntilAffordable)})`
                          : ''}
                      </>
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-10 min-w-[5.5rem] shrink-0 font-mono tabular-nums"
                  disabled={!canBuy}
                  onClick={() => setGame((current) => buyGenerator(current, key))}
                >
                  Buy
                </Button>
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
                  Cost:{' '}
                  <span className="font-mono tabular-nums">
                    {formatIdleNumber(definition.cost)}
                  </span>{' '}
                  credits
                </p>
                {!unlocked && unlockProgress && (
                  <p className="text-xs text-muted-foreground">
                    Requires{' '}
                    <span className="font-mono tabular-nums">
                      {unlockProgress.required}
                    </span>{' '}
                    {GENERATOR_DEFS[unlockProgress.generator].label} (
                    <span className="font-mono tabular-nums">
                      {unlockProgress.current}
                    </span>
                    /
                    <span className="font-mono tabular-nums">
                      {unlockProgress.required}
                    </span>
                    )
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
            <span className="font-mono tabular-nums">{formatDuration(runDuration)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Credits / sec</span>
            <span className="font-mono tabular-nums">{formatIdleNumber(creditsPerSecond)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-muted-foreground">Offline Cap</span>
            <span className="font-mono tabular-nums">
              {formatDuration(offlineProgressCapSeconds)}
            </span>
          </p>
        </div>
      </section>
      <section className="border-t border-border/70 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime</p>
        <p className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Credits Produced</span>
          <span className="font-mono tabular-nums">{formatIdleNumber(game.stats.totalCredits)}</span>
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

  const renderAboutTab = () => (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-semibold">About</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Epoch Foundry is a mobile-first idle game built around long-term
          credit production growth.
        </p>
      </section>
      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Current Focus</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Early progression centers on credits, generators, and upgrades that
          speed up credit production. Additional systems are planned for later
          phases.
        </p>
      </section>
      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Technical Notes</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Progress is stored locally with automatic saves and offline
          production, including a capped offline window that can be expanded by
          late-game upgrades.
        </p>
      </section>
    </div>
  )

  return (
    <>
      <main
        className="mx-auto min-h-screen w-full max-w-lg"
        style={{
          paddingTop: `1rem`,
          paddingLeft: `calc(${SAFE_AREA_INSETS.left} + 1rem)`,
          paddingRight: `calc(${SAFE_AREA_INSETS.right} + 1rem)`,
          paddingBottom: `calc(${SAFE_AREA_INSETS.bottom} + 5.25rem)`,
        }}
      >
      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-40 overflow-hidden bg-background/70 backdrop-blur-md transition-[height,border-color] duration-200',
          showFloatingSummary ? 'border-b border-border' : 'border-b border-transparent',
        )}
        style={{
          height: showFloatingSummary
            ? `calc(${SAFE_AREA_INSETS.top} + 3rem)`
            : SAFE_AREA_INSETS.top,
          paddingLeft: `calc(${SAFE_AREA_INSETS.left} + 1rem)`,
          paddingRight: `calc(${SAFE_AREA_INSETS.right} + 1rem)`,
        }}
      >
        <div
          ref={topSafeAreaBoundaryRef}
          style={{ height: SAFE_AREA_INSETS.top }}
        />
        <div
          className={cn(
            'w-full py-2 text-sm transition-all duration-200',
            showFloatingSummary ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          )}
        >
          <div className="flex items-center justify-between gap-3 whitespace-nowrap">
            <p className="flex items-center gap-1.5 font-mono tabular-nums font-semibold">
              <Coins className="size-4 text-muted-foreground" aria-hidden />
              <span>{formatIdleNumber(game.credits)}</span>
            </p>
            <p className="font-mono tabular-nums">
              +{formatIdleNumber(creditsPerSecond)} / sec
            </p>
          </div>
        </div>
      </div>

      <section ref={creditsSummaryRef} className="border-b border-border/70 pb-4">
        <article>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Coins className="size-3.5 text-muted-foreground" aria-hidden />
            <span>Credits</span>
          </p>
          <p className="mt-1 text-3xl font-mono font-semibold tabular-nums">
            {formatIdleNumber(game.credits)}
          </p>
        </article>
        <article className="mt-2">
          <p className="text-sm text-muted-foreground">
            +<span className="font-mono tabular-nums">{formatIdleNumber(creditsPerSecond)}</span> / sec
          </p>
        </article>
      </section>

      <section className="mt-5">
        {activeTab === 'production' && renderProductionTab()}
        {activeTab === 'upgrades' && renderUpgradesTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'about' && renderAboutTab()}
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40"
        style={{
          paddingLeft: `calc(${SAFE_AREA_INSETS.left} + 1rem)`,
          paddingRight: `calc(${SAFE_AREA_INSETS.right} + 1rem)`,
          paddingBottom: `calc(${SAFE_AREA_INSETS.bottom} + 0.75rem)`,
        }}
      >
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
            <div className="grid grid-cols-4 gap-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon

                return (
                  <Button
                    key={item.key}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      'h-12 flex-col gap-1.5 rounded-lg bg-transparent px-0.5 shadow-none hover:bg-transparent active:bg-transparent',
                      activeTab === item.key ? 'text-foreground' : 'text-muted-foreground/70',
                    )}
                    onClick={() => setActiveTab(item.key)}
                    aria-label={item.label}
                  >
                    <Icon className="size-7" />
                    <span className="text-[10px] leading-none">{item.label}</span>
                  </Button>
                )
              })}
              <Sheet open={isSectionsOpen} onOpenChange={setIsSectionsOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      'h-12 flex-col gap-1.5 rounded-lg bg-transparent px-0.5 shadow-none hover:bg-transparent active:bg-transparent',
                      isOtherActive ? 'text-foreground' : 'text-muted-foreground/70',
                    )}
                    aria-label="Other sections"
                  >
                    <MoreHorizontal className="size-7" />
                    <span className="text-[10px] leading-none">Other</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[80vh] rounded-t-xl px-0 pb-6">
                  <SheetHeader className="px-4 pb-1">
                    <SheetTitle>Other Sections</SheetTitle>
                    <SheetDescription>
                      Additional navigation options.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-2 space-y-1 px-4">
                    {overflowTabs.map((tab) => (
                      <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? 'default' : 'ghost'}
                        className="h-10 w-full justify-start"
                        onClick={() => {
                          setActiveTab(tab.key)
                          setIsSectionsOpen(false)
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                    {overflowTabs.length === 0 && (
                      <p className="px-2 py-1 text-sm text-muted-foreground">
                        No additional sections yet.
                      </p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Toaster
        position="top-right"
        offset={{
          top: `calc(${SAFE_AREA_INSETS.top} + 1rem)`,
          right: `calc(${SAFE_AREA_INSETS.right} + 0.75rem)`,
        }}
        mobileOffset={{
          top: `calc(${SAFE_AREA_INSETS.top} + 1rem)`,
          left: `calc(${SAFE_AREA_INSETS.left} + 0.75rem)`,
          right: `calc(${SAFE_AREA_INSETS.right} + 0.75rem)`,
        }}
      />
    </>
  )
}

export default App
