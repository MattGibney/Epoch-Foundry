import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Decimal from 'decimal.js'
import {
  Coins,
  Factory,
  House,
  MoreHorizontal,
  type LucideIcon,
  Wrench,
} from 'lucide-react'
import { toast } from 'sonner'

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
import {
  clearGameSave,
  loadGameStateWithSummary,
  saveGameState,
} from '@/lib/game-save'
import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_ORDER,
  applyPrestigeReset,
  canPrestige,
  canBuyUpgrade,
  createInitialGameState,
  getOfflineProgressCapSeconds,
  getPrestigeGainForReset,
  getPrestigeMultiplier,
  getUnlockedAchievementCount,
  getTotalProductionPerSecond,
  tickGame,
  UPGRADE_ORDER,
  type GameState,
  type AchievementKey,
} from '@/lib/game-engine'
import {
  SAFE_AREA_INSETS,
} from '@/lib/game-config'
import {
  OFFLINE_PRODUCTION_TOAST_THRESHOLD_SECONDS,
  TOP_CREDITS_SHORTHAND_THRESHOLD,
  UPDATE_FPS_BY_MODE,
} from '@/lib/consts'
import { formatIdleNumber } from '@/lib/number-format'
import {
  AboutTabView,
  AchievementsTabView,
  HomeTabView,
  ProductionTabView,
  SettingsTabView,
  StatsTabView,
  type TabKey,
  UpgradesTabView,
} from '@/screens/tab-views'
import { cn } from '@/lib/utils'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'production', label: 'Production' },
  { key: 'upgrades', label: 'Upgrades' },
  { key: 'stats', label: 'Stats' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'settings', label: 'Settings' },
  { key: 'about', label: 'About' },
]

const PRIMARY_NAV_ITEMS: {
  key: 'home' | 'production' | 'upgrades'
  label: string
  icon: LucideIcon
}[] = [
  { key: 'home', label: 'Home', icon: House },
  { key: 'production', label: 'Production', icon: Factory },
  { key: 'upgrades', label: 'Upgrades', icon: Wrench },
]

function isPrimaryTab(tab: TabKey): tab is 'home' | 'production' | 'upgrades' {
  return tab === 'home' || tab === 'production' || tab === 'upgrades'
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

function formatCompactTimeUnit(value: number): string {
  const rounded = value >= 100 ? value.toFixed(0) : value.toFixed(1)
  return rounded.endsWith('.0') ? rounded.slice(0, -2) : rounded
}

const yearEtaFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const topCreditsShorthandThreshold = new Decimal(TOP_CREDITS_SHORTHAND_THRESHOLD)

function formatAffordabilityEta(totalSeconds: number): string {
  const daySeconds = 24 * 60 * 60
  const yearSeconds = 365 * daySeconds
  const twoDaySeconds = 48 * 60 * 60

  if (totalSeconds > yearSeconds) {
    return `${yearEtaFormatter.format(totalSeconds / yearSeconds)}y`
  }

  if (totalSeconds > twoDaySeconds) {
    return `${formatCompactTimeUnit(totalSeconds / daySeconds)}d`
  }

  return formatDuration(totalSeconds)
}

function formatRenderedCredits(value: Decimal.Value): string {
  return formatIdleNumber(value)
}

function formatGroupedInteger(value: Decimal): string {
  const absoluteRounded = value.abs().toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toFixed(0)
  const grouped = absoluteRounded.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return value.isNegative() && grouped !== '0' ? `-${grouped}` : grouped
}

function formatTopCreditsDisplay(value: Decimal.Value): string {
  let decimalValue: Decimal

  try {
    decimalValue = new Decimal(value)
  } catch {
    return 'NaN'
  }

  if (!decimalValue.isFinite()) {
    if (decimalValue.isNaN()) {
      return 'NaN'
    }

    return decimalValue.isNegative() ? '-Infinity' : 'Infinity'
  }

  const absoluteValue = decimalValue.abs()

  if (absoluteValue.lessThanOrEqualTo(topCreditsShorthandThreshold)) {
    if (absoluteValue.lessThan(10_000)) {
      return formatIdleNumber(decimalValue)
    }

    return formatGroupedInteger(decimalValue)
  }

  return formatIdleNumber(decimalValue)
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
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [isSectionsOpen, setIsSectionsOpen] = useState(false)
  const [isPrestigeDrawerOpen, setIsPrestigeDrawerOpen] = useState(false)
  const [nowMs, setNowMs] = useState<number>(() => Date.now())
  const [showFloatingSummary, setShowFloatingSummary] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [floatingAnchorElement, setFloatingAnchorElement] = useState<HTMLElement | null>(null)
  const gameRef = useRef(game)
  const topSafeAreaBoundaryRef = useRef<HTMLDivElement | null>(null)
  const knownUnlockedAchievementsRef = useRef<Set<AchievementKey>>(new Set())

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
      knownUnlockedAchievementsRef.current = new Set(
        ACHIEVEMENT_ORDER.filter((key) => loaded.state.achievements[key]),
      )

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
            {formatRenderedCredits(offlineProgress.producedCredits)}
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

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const knownUnlocked = knownUnlockedAchievementsRef.current
    const newlyUnlocked = ACHIEVEMENT_ORDER.filter(
      (key) => game.achievements[key] && !knownUnlocked.has(key),
    )

    if (newlyUnlocked.length === 0) {
      return
    }

    for (const key of newlyUnlocked) {
      const achievement = ACHIEVEMENT_DEFS[key]
      toast(`Achievement Unlocked: ${achievement.label}`)
      knownUnlocked.add(key)
    }
  }, [game.achievements, isHydrated])

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

    const gameTickIntervalMs = 1000 / UPDATE_FPS_BY_MODE[gameRef.current.settings.updateFrequency]
    const tickId = window.setInterval(() => {
      const now = Date.now()
      setNowMs(now)
      setGame((current) => tickGame(current, now))
    }, gameTickIntervalMs)

    return () => {
      window.clearInterval(tickId)
    }
  }, [game.settings.updateFrequency, isHydrated])

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
    const summaryElement = floatingAnchorElement
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
  }, [activeTab, floatingAnchorElement])

  const creditsPerSecond = useMemo(() => getTotalProductionPerSecond(game), [game])
  const prestigeGain = useMemo(() => getPrestigeGainForReset(game), [game])
  const prestigeMultiplier = useMemo(() => getPrestigeMultiplier(game), [game])
  const canPrestigeNow = useMemo(() => canPrestige(game), [game])
  const offlineProgressCapSeconds = useMemo(
    () => getOfflineProgressCapSeconds(game),
    [game],
  )
  const purchasableUpgradeCount = useMemo(
    () => UPGRADE_ORDER.reduce((count, key) => count + (canBuyUpgrade(game, key) ? 1 : 0), 0),
    [game],
  )
  const unlockedAchievementCount = useMemo(
    () => getUnlockedAchievementCount(game),
    [game],
  )
  const nextPrestigeMultiplier = useMemo(
    () => new Decimal(1).plus(new Decimal(game.prestige.essence).plus(prestigeGain).times('0.1')),
    [game.prestige.essence, prestigeGain],
  )
  const runDuration = Math.max(0, Math.floor((nowMs - game.stats.startedAtMs) / 1_000))
  const overflowTabs = TABS.filter((tab) => !isPrimaryTab(tab.key))
  const isOtherActive = !isPrimaryTab(activeTab)
  const shouldShowFloatingSummary = activeTab !== 'about' && showFloatingSummary

  const prestigeReset = useCallback(() => {
    const now = Date.now()
    const nextState = applyPrestigeReset(gameRef.current, now)
    if (nextState === gameRef.current) {
      return
    }

    gameRef.current = nextState
    setGame(nextState)
    setNowMs(now)
    setActiveTab('production')
    setIsPrestigeDrawerOpen(false)

    void saveGameState(nextState)
  }, [])

  const renderActiveTab = () => {
    const sharedTabProps = {
      game,
      creditsPerSecond,
      formatRenderedCredits,
      formatTopCreditsDisplay,
      onAnchorRefChange: setFloatingAnchorElement,
      onGameChange: setGame,
    }

    switch (activeTab) {
      case 'home':
        return <HomeTabView {...sharedTabProps} />
      case 'production':
        return (
          <ProductionTabView
            {...sharedTabProps}
            canPrestigeNow={canPrestigeNow}
            prestigeGain={prestigeGain}
            onOpenPrestige={() => setIsPrestigeDrawerOpen(true)}
            formatAffordabilityEta={formatAffordabilityEta}
            getSecondsUntilAffordable={getSecondsUntilAffordable}
          />
        )
      case 'upgrades':
        return <UpgradesTabView {...sharedTabProps} />
      case 'stats':
        return (
          <StatsTabView
            {...sharedTabProps}
            runDuration={runDuration}
            offlineProgressCapSeconds={offlineProgressCapSeconds}
            prestigeMultiplier={prestigeMultiplier}
            prestigeGain={prestigeGain}
            canPrestigeNow={canPrestigeNow}
            onOpenPrestige={() => setIsPrestigeDrawerOpen(true)}
            formatDuration={formatDuration}
          />
        )
      case 'achievements':
        return (
          <AchievementsTabView
            {...sharedTabProps}
            unlockedAchievementCount={unlockedAchievementCount}
          />
        )
      case 'settings':
        return (
          <SettingsTabView
            {...sharedTabProps}
            isRefreshing={isRefreshing}
            refreshError={refreshError}
            onRefreshApp={refreshApp}
            onResetGame={resetGame}
          />
        )
      case 'about':
        return <AboutTabView />
      default:
        return null
    }
  }

  return (
    <>
      <main
        className="mx-auto min-h-screen w-full max-w-lg"
        style={{
          paddingTop: `calc(${SAFE_AREA_INSETS.left} + 1rem)`,
          paddingLeft: `calc(${SAFE_AREA_INSETS.left} + 1rem)`,
          paddingRight: `calc(${SAFE_AREA_INSETS.right} + 1rem)`,
          paddingBottom: `calc(${SAFE_AREA_INSETS.bottom} + 5.25rem)`,
        }}
      >
      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-40 overflow-hidden bg-background/70 backdrop-blur-md transition-[height,border-color] duration-200',
          shouldShowFloatingSummary ? 'border-b border-border' : 'border-b border-transparent',
        )}
        style={{
          height: shouldShowFloatingSummary
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
            shouldShowFloatingSummary ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          )}
        >
          <div className="flex items-center justify-between gap-3 whitespace-nowrap">
            <p className="flex items-center gap-1.5 font-mono tabular-nums font-semibold">
              <Coins className="size-4 text-muted-foreground" aria-hidden />
              <span>{formatRenderedCredits(game.credits)}</span>
            </p>
            <p className="font-mono tabular-nums">
              +{formatRenderedCredits(creditsPerSecond)} / sec
            </p>
          </div>
        </div>
      </div>

      {renderActiveTab()}

      <div
        className="fixed inset-x-0 bottom-0 z-40"
        style={{
          paddingTop: `calc(${SAFE_AREA_INSETS.top} + 1rem)`,
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
                const showUpgradeBadge =
                  item.key === 'upgrades' && purchasableUpgradeCount > 0

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
                    <span className="relative">
                      <Icon className="size-7" />
                      {showUpgradeBadge && (
                        <span className="absolute -right-4 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none text-background">
                          {purchasableUpgradeCount > 99 ? '99+' : purchasableUpgradeCount}
                        </span>
                      )}
                    </span>
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
      <Sheet open={isPrestigeDrawerOpen} onOpenChange={setIsPrestigeDrawerOpen}>
        <SheetContent side="bottom" className="rounded-t-xl px-0 pb-6">
          <SheetHeader className="px-4 pb-1">
            <SheetTitle>Prestige this run?</SheetTitle>
            <SheetDescription>
              This resets credits, generators, and upgrades for this run.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-2 space-y-4 px-4">
            <p className="text-sm text-muted-foreground">
              You gain{' '}
              <span className="font-mono tabular-nums">
                +{formatIdleNumber(prestigeGain)}
              </span>{' '}
              essence and your multiplier becomes{' '}
              <span className="font-mono tabular-nums">
                x{formatIdleNumber(nextPrestigeMultiplier)}
              </span>
              .
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={prestigeReset}>Confirm Prestige</Button>
              <Button variant="outline" onClick={() => setIsPrestigeDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
