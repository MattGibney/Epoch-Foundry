import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Decimal from 'decimal.js'
import {
  ArrowLeft,
  Coins,
  Factory,
  MoreHorizontal,
  Pickaxe,
  ChartNoAxesColumn,
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
import { createDevBootstrapState, type DevBootstrapPresetKey } from '@/lib/dev-bootstrap'
import {
  clearGameSave,
  loadGameStateWithSummary,
  saveGameState,
  type OfflineProgressLoadSummary,
} from '@/lib/game-save'
import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_ORDER,
  applyOfflineProgress,
  applyPrestigeReset,
  canBuyGenerator,
  canBuyMinerSubsystemUpgrade,
  canBuyUpgrade,
  canPrestige,
  createInitialGameState,
  GENERATOR_ORDER,
  getMinerOreData,
  getMinerSubsystemGeneratorCost,
  getMinerSubsystemTotalProductionPerSecond,
  getOfflineProgressCapSeconds,
  getPermanentUpgradeBulkCost,
  getPrestigeGainForReset,
  getPrestigeMultiplier,
  getPrestigeMultiplierFromPermanentUpgrades,
  getTotalProductionPerSecond,
  getUnlockedAchievementCount,
  MINER_SUBSYSTEM_GENERATOR_ORDER,
  MINER_SUBSYSTEM_UPGRADE_ORDER,
  PERMANENT_UPGRADE_ORDER,
  tickGame,
  UPGRADE_ORDER,
  type AchievementKey,
  type GameState,
  type PermanentUpgradeKey,
  type PermanentUpgradesState,
} from '@/lib/game-engine'
import { SAFE_AREA_INSETS } from '@/lib/game-config'
import {
  OFFLINE_PRODUCTION_TOAST_THRESHOLD_SECONDS,
  TOP_CREDITS_SHORTHAND_THRESHOLD,
  UPDATE_FPS_BY_MODE,
} from '@/lib/consts'
import { formatIdleNumber } from '@/lib/number-format'
import { MINER_SUBSYSTEM_CONFIG, type SubsystemKey } from '@/lib/progression-config'
import { PrestigeScreen } from '@/screens/prestige-screen'
import {
  AboutTabView,
  AchievementsTabView,
  HelpTabView,
  MinerSubsystemProductionTabView,
  MinerSubsystemUpgradesTabView,
  ProductionTabView,
  SettingsTabView,
  StatsTabView,
  type TabKey,
  UpgradesTabView,
} from '@/screens/tab-views'
import { cn } from '@/lib/utils'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'production', label: 'Production' },
  { key: 'upgrades', label: 'Upgrades' },
  { key: 'stats', label: 'Stats' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'help', label: 'Help' },
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
  { key: 'stats', label: 'Stats', icon: ChartNoAxesColumn },
]

const FOCUSED_SUBSYSTEM_NAV_ITEMS: {
  key: 'production' | 'upgrades' | 'stats'
  label: string
  icon: LucideIcon
}[] = [
  { key: 'production', label: 'Production', icon: Factory },
  { key: 'upgrades', label: 'Upgrades', icon: Wrench },
  { key: 'stats', label: 'Stats', icon: ChartNoAxesColumn },
]

function isPrimaryTab(tab: TabKey): tab is 'production' | 'upgrades' | 'stats' {
  return tab === 'production' || tab === 'upgrades' || tab === 'stats'
}

function getScreenScrollKey(
  activeTab: TabKey,
  focusedSubsystem: SubsystemKey | null,
  isPrestigeMode: boolean,
): string {
  if (isPrestigeMode) {
    return 'prestige'
  }

  return `${focusedSubsystem ?? 'main'}:${activeTab}`
}

function createPermanentUpgradeSnapshot(
  source: Partial<Record<PermanentUpgradeKey, number>> | undefined,
): PermanentUpgradesState {
  return PERMANENT_UPGRADE_ORDER.reduce((accumulator, key) => {
    accumulator[key] = Math.max(0, Math.floor(source?.[key] ?? 0))
    return accumulator
  }, {} as PermanentUpgradesState)
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
  const [activeTab, setActiveTab] = useState<TabKey>('production')
  const [focusedSubsystem, setFocusedSubsystem] = useState<SubsystemKey | null>(null)
  const [isSectionsOpen, setIsSectionsOpen] = useState(false)
  const [nowMs, setNowMs] = useState<number>(() => Date.now())
  const [showFloatingSummary, setShowFloatingSummary] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [floatingAnchorElement, setFloatingAnchorElement] = useState<HTMLElement | null>(null)
  const [jumpRequestIds, setJumpRequestIds] = useState({
    production: 0,
    upgrades: 0,
  })
  const [prestigePlan, setPrestigePlan] = useState<{
    availableEssence: string
    baseAvailableEssence: string
    draftUpgrades: PermanentUpgradesState
    baseUpgrades: PermanentUpgradesState
  } | null>(null)
  const gameRef = useRef(game)
  const topSafeAreaBoundaryRef = useRef<HTMLDivElement | null>(null)
  const knownUnlockedAchievementsRef = useRef<Set<AchievementKey>>(new Set())
  const screenScrollPositionsRef = useRef<Record<string, number>>({})
  const activeScreenScrollKeyRef = useRef(getScreenScrollKey('production', null, false))

  const rememberCurrentScreenScroll = useCallback(() => {
    screenScrollPositionsRef.current[activeScreenScrollKeyRef.current] = window.scrollY
  }, [])

  const resetRememberedScreenScroll = useCallback(() => {
    screenScrollPositionsRef.current = {}
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    gameRef.current = game
  }, [game])

  const showOfflineProductionToast = useCallback((offlineProgress: OfflineProgressLoadSummary | null) => {
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
  }, [])

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

      showOfflineProductionToast(loaded.offlineProgress)
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [showOfflineProductionToast])

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
    resetRememberedScreenScroll()
    setGame(nextState)
    setNowMs(now)
    setActiveTab('production')
    setFocusedSubsystem(null)
    setPrestigePlan(null)

    void (async () => {
      await clearGameSave()
      await saveGameState(nextState)
    })()
  }, [resetRememberedScreenScroll])

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

  const applyDevBootstrap = useCallback((preset: DevBootstrapPresetKey) => {
    const now = Date.now()
    const bootstrapped = createDevBootstrapState(preset, now)
    const nextState: GameState = {
      ...bootstrapped,
      settings: gameRef.current.settings,
    }

    gameRef.current = nextState
    resetRememberedScreenScroll()
    setGame(nextState)
    setNowMs(now)
    setActiveTab('production')
    setFocusedSubsystem(null)
    setPrestigePlan(null)
    toast(`Loaded dev preset: ${preset}`)

    void saveGameState(nextState)
  }, [resetRememberedScreenScroll])

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

    const applyOfflineProgressOnResume = () => {
      if (document.visibilityState === 'hidden') {
        return
      }

      const current = gameRef.current
      const now = Date.now()
      const elapsedSeconds = Math.max(0, (Math.max(now, current.stats.lastTickAtMs) - current.stats.lastTickAtMs) / 1_000)
      const cappedSeconds = Math.min(elapsedSeconds, getOfflineProgressCapSeconds(current))
      const nextState = applyOfflineProgress(current, now)
      const producedCredits = new Decimal(nextState.credits).minus(current.credits)

      if (
        nextState.credits === current.credits &&
        nextState.stats.totalCredits === current.stats.totalCredits &&
        nextState.stats.totalCreditsAllResets === current.stats.totalCreditsAllResets &&
        nextState.stats.lastTickAtMs === current.stats.lastTickAtMs
      ) {
        return
      }

      gameRef.current = nextState
      setGame(nextState)
      setNowMs(now)
      void saveGameState(nextState)

      showOfflineProductionToast(
        cappedSeconds > 0 && producedCredits.greaterThan(0)
          ? {
              appliedSeconds: cappedSeconds,
              producedCredits: producedCredits.toString(),
            }
          : null,
      )
    }

    const saveOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void persistGame()
        return
      }

      applyOfflineProgressOnResume()
    }

    const saveOnPageExit = () => {
      void persistGame()
    }

    const applyOnPageShow = () => {
      applyOfflineProgressOnResume()
    }

    document.addEventListener('visibilitychange', saveOnVisibilityChange)
    window.addEventListener('pageshow', applyOnPageShow)
    window.addEventListener('pagehide', saveOnPageExit)
    window.addEventListener('beforeunload', saveOnPageExit)

    return () => {
      document.removeEventListener('visibilitychange', saveOnVisibilityChange)
      window.removeEventListener('pageshow', applyOnPageShow)
      window.removeEventListener('pagehide', saveOnPageExit)
      window.removeEventListener('beforeunload', saveOnPageExit)
    }
  }, [isHydrated, persistGame, showOfflineProductionToast])

  useEffect(() => {
    const summaryElement = floatingAnchorElement
    if (!summaryElement) {
      return
    }

    let frameId: number | null = null

    const syncFloatingState = () => {
      const blurBoundary = topSafeAreaBoundaryRef.current?.getBoundingClientRect().bottom ?? 0
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
  const offlineProgressCapSeconds = useMemo(() => getOfflineProgressCapSeconds(game), [game])
  const purchasableUpgradeCount = useMemo(
    () => UPGRADE_ORDER.reduce((count, key) => count + (canBuyUpgrade(game, key) ? 1 : 0), 0),
    [game],
  )
  const purchasableGeneratorCount = useMemo(
    () =>
      GENERATOR_ORDER.reduce((count, key) => {
        return count + (canBuyGenerator(game, key) ? 1 : 0)
      }, 0),
    [game],
  )
  const purchasableMinerSubsystemGeneratorCount = useMemo(() => {
    if (!game.purchasedUpgrades[MINER_SUBSYSTEM_CONFIG.unlockUpgrade]) {
      return 0
    }

    const oreData = getMinerOreData(game)
    return MINER_SUBSYSTEM_GENERATOR_ORDER.reduce((count, key) => {
      return count + (oreData.greaterThanOrEqualTo(getMinerSubsystemGeneratorCost(game, key)) ? 1 : 0)
    }, 0)
  }, [game])
  const purchasableMinerSubsystemUpgradeCount = useMemo(() => {
    if (!game.purchasedUpgrades[MINER_SUBSYSTEM_CONFIG.unlockUpgrade]) {
      return 0
    }

    return MINER_SUBSYSTEM_UPGRADE_ORDER.reduce(
      (count, key) => count + (canBuyMinerSubsystemUpgrade(game, key) ? 1 : 0),
      0,
    )
  }, [game])
  const unlockedAchievementCount = useMemo(() => getUnlockedAchievementCount(game), [game])
  const plannedPrestigeMultiplier = useMemo(
    () =>
      prestigePlan
        ? getPrestigeMultiplierFromPermanentUpgrades(
            prestigePlan.draftUpgrades,
            game.prestige.resets + 1,
          )
        : prestigeMultiplier,
    [game.prestige.resets, prestigeMultiplier, prestigePlan],
  )
  const runDuration = Math.max(0, Math.floor((nowMs - game.stats.startedAtMs) / 1_000))
  const overflowTabs = TABS.filter((tab) => !isPrimaryTab(tab.key))
  const isOtherActive = !isPrimaryTab(activeTab)
  const isPrestigeMode = prestigePlan !== null
  const isSubsystemFocused = focusedSubsystem !== null
  const activeScreenScrollKey = getScreenScrollKey(activeTab, focusedSubsystem, isPrestigeMode)
  const subsystemHeaderValue =
    focusedSubsystem === 'miners' ? getMinerOreData(game) : new Decimal(0)
  const subsystemHeaderPerSecond =
    focusedSubsystem === 'miners' ? getMinerSubsystemTotalProductionPerSecond(game) : new Decimal(0)
  const shouldShowFloatingSummary =
    !isPrestigeMode && activeTab !== 'about' && activeTab !== 'help' && showFloatingSummary

  useLayoutEffect(() => {
    if (!isHydrated) {
      activeScreenScrollKeyRef.current = activeScreenScrollKey
      return
    }

    if (activeScreenScrollKeyRef.current === activeScreenScrollKey) {
      return
    }

    activeScreenScrollKeyRef.current = activeScreenScrollKey
    const targetScrollY = screenScrollPositionsRef.current[activeScreenScrollKey] ?? 0
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetScrollY, left: 0, behavior: 'auto' })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [activeScreenScrollKey, isHydrated])

  const enterSubsystem = useCallback((subsystem: SubsystemKey) => {
    rememberCurrentScreenScroll()
    setFocusedSubsystem(subsystem)
    setActiveTab('production')
    setIsSectionsOpen(false)
  }, [rememberCurrentScreenScroll])

  const handlePrimaryNavPress = useCallback(
    (tabKey: 'production' | 'upgrades' | 'stats', badgeCount: number) => {
      if (activeTab !== tabKey) {
        rememberCurrentScreenScroll()
        setActiveTab(tabKey)
        return
      }

      if ((tabKey === 'production' || tabKey === 'upgrades') && badgeCount > 0) {
        setJumpRequestIds((current) => ({
          ...current,
          [tabKey]: current[tabKey] + 1,
        }))
      }
    },
    [activeTab, rememberCurrentScreenScroll],
  )

  const exitSubsystem = useCallback(() => {
    rememberCurrentScreenScroll()
    setFocusedSubsystem(null)
    setActiveTab('production')
    setIsSectionsOpen(false)
  }, [rememberCurrentScreenScroll])

  const startPrestigePlanning = useCallback(() => {
    const current = gameRef.current
    const gain = getPrestigeGainForReset(current)
    if (gain.lessThanOrEqualTo(0)) {
      return
    }

    rememberCurrentScreenScroll()
    const availableEssence = new Decimal(current.prestige.essence).plus(gain).toString()
    const baseUpgrades = createPermanentUpgradeSnapshot(current.prestige.permanentUpgrades)

    setPrestigePlan({
      availableEssence,
      baseAvailableEssence: availableEssence,
      draftUpgrades: { ...baseUpgrades },
      baseUpgrades: { ...baseUpgrades },
    })
  }, [rememberCurrentScreenScroll])

  const cancelPrestigePlanning = useCallback(() => {
    rememberCurrentScreenScroll()
    setPrestigePlan(null)
  }, [rememberCurrentScreenScroll])

  const purchasePermanentUpgrade = useCallback((key: PermanentUpgradeKey, amount: number) => {
    setPrestigePlan((current) => {
      if (!current) {
        return current
      }

      const normalizedAmount = Math.max(1, Math.floor(amount))
      const cost = getPermanentUpgradeBulkCost(current.draftUpgrades, key, normalizedAmount)
      const available = new Decimal(current.availableEssence)
      if (available.lessThan(cost)) {
        return current
      }

      return {
        ...current,
        availableEssence: available.minus(cost).toString(),
        draftUpgrades: {
          ...current.draftUpgrades,
          [key]: current.draftUpgrades[key] + normalizedAmount,
        },
      }
    })
  }, [])

  const resetPrestigeChoices = useCallback(() => {
    setPrestigePlan((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        availableEssence: current.baseAvailableEssence,
        draftUpgrades: { ...current.baseUpgrades },
      }
    })
  }, [])

  const confirmPrestigeReset = useCallback(() => {
    if (!prestigePlan) {
      return
    }

    const now = Date.now()
    const nextState = applyPrestigeReset(gameRef.current, now, {
      remainingEssence: prestigePlan.availableEssence,
      permanentUpgrades: prestigePlan.draftUpgrades,
    })
    if (nextState === gameRef.current) {
      setPrestigePlan(null)
      return
    }

    gameRef.current = nextState
    resetRememberedScreenScroll()
    setGame(nextState)
    setNowMs(now)
    setActiveTab('production')
    setFocusedSubsystem(null)
    setPrestigePlan(null)

    void saveGameState(nextState)
  }, [prestigePlan, resetRememberedScreenScroll])

  const renderActiveTab = () => {
    const sharedTabProps = {
      game,
      creditsPerSecond,
      formatRenderedCredits,
      formatTopCreditsDisplay,
      onAnchorRefChange: setFloatingAnchorElement,
      onGameChange: setGame,
      repeatTapScrollDirection: game.settings.repeatTapScrollDirection,
      jumpRequestIds,
    }

    if (focusedSubsystem === 'miners') {
      if (activeTab === 'upgrades') {
        return (
          <MinerSubsystemUpgradesTabView
            {...sharedTabProps}
            onExitSubsystem={exitSubsystem}
          />
        )
      }

      if (activeTab === 'stats') {
        return (
          <StatsTabView
            {...sharedTabProps}
            runDuration={runDuration}
            offlineProgressCapSeconds={offlineProgressCapSeconds}
            prestigeMultiplier={prestigeMultiplier}
            prestigeGain={prestigeGain}
            canPrestigeNow={canPrestigeNow}
            onOpenPrestige={startPrestigePlanning}
            formatDuration={formatDuration}
            focusedSubsystem="miners"
            onExitSubsystem={exitSubsystem}
          />
        )
      }

      return (
        <MinerSubsystemProductionTabView
          {...sharedTabProps}
          onExitSubsystem={exitSubsystem}
          formatAffordabilityEta={formatAffordabilityEta}
          getSecondsUntilAffordable={getSecondsUntilAffordable}
        />
      )
    }

    switch (activeTab) {
      case 'production':
        return (
          <ProductionTabView
            {...sharedTabProps}
            formatAffordabilityEta={formatAffordabilityEta}
            getSecondsUntilAffordable={getSecondsUntilAffordable}
            onOpenSubsystem={enterSubsystem}
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
            onOpenPrestige={startPrestigePlanning}
            formatDuration={formatDuration}
          />
        )
      case 'achievements':
        return <AchievementsTabView {...sharedTabProps} unlockedAchievementCount={unlockedAchievementCount} />
      case 'settings':
        return (
          <SettingsTabView
            {...sharedTabProps}
            isRefreshing={isRefreshing}
            refreshError={refreshError}
            onRefreshApp={refreshApp}
            onResetGame={resetGame}
            onApplyDevBootstrap={applyDevBootstrap}
          />
        )
      case 'help':
        return <HelpTabView />
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
          paddingBottom: isPrestigeMode
            ? `calc(${SAFE_AREA_INSETS.bottom} + 1rem)`
            : `calc(${SAFE_AREA_INSETS.bottom} + 5.25rem)`,
        }}
      >
        {isPrestigeMode && prestigePlan ? (
          <PrestigeScreen
            currentEssence={game.prestige.essence}
            resetGain={prestigeGain}
            availableEssence={new Decimal(prestigePlan.availableEssence)}
            currentMultiplier={prestigeMultiplier}
            projectedMultiplier={plannedPrestigeMultiplier}
            permanentUpgrades={prestigePlan.draftUpgrades}
            getUpgradeCost={(key, amount) =>
              getPermanentUpgradeBulkCost(prestigePlan.draftUpgrades, key, amount)
            }
            canPurchaseUpgrade={(key, amount) =>
              new Decimal(prestigePlan.availableEssence).greaterThanOrEqualTo(
                getPermanentUpgradeBulkCost(prestigePlan.draftUpgrades, key, amount),
              )
            }
            onPurchaseUpgrade={purchasePermanentUpgrade}
            onResetChoices={resetPrestigeChoices}
            onCancel={cancelPrestigePlanning}
            onConfirm={confirmPrestigeReset}
            formatValue={formatIdleNumber}
          />
        ) : (
          <>
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
              <div ref={topSafeAreaBoundaryRef} style={{ height: SAFE_AREA_INSETS.top }} />
              <div
                className={cn(
                  'w-full py-2 text-sm transition-all duration-200',
                  shouldShowFloatingSummary ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
                )}
              >
                <div className="flex items-center justify-between gap-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {isSubsystemFocused && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="pointer-events-auto h-8 px-2"
                        onClick={exitSubsystem}
                      >
                        <ArrowLeft className="size-4" aria-hidden />
                        Main Game
                      </Button>
                    )}
                    <p className="flex items-center gap-1.5 font-mono tabular-nums font-semibold">
                      {isSubsystemFocused ? (
                        <Pickaxe className="size-4 text-muted-foreground" aria-hidden />
                      ) : (
                        <Coins className="size-4 text-muted-foreground" aria-hidden />
                      )}
                      <span>
                        {formatRenderedCredits(
                          isSubsystemFocused ? subsystemHeaderValue : game.credits,
                        )}
                      </span>
                    </p>
                  </div>
                  <p className="font-mono tabular-nums">
                    +
                    {formatRenderedCredits(
                      isSubsystemFocused ? subsystemHeaderPerSecond : creditsPerSecond,
                    )}{' '}
                    / sec
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
                  <div
                    className={cn(
                      'grid gap-1',
                      isSubsystemFocused ? 'grid-cols-3' : 'grid-cols-4',
                    )}
                  >
                    {(isSubsystemFocused ? FOCUSED_SUBSYSTEM_NAV_ITEMS : PRIMARY_NAV_ITEMS).map((item) => {
                      const Icon = item.icon
                      const productionBadgeCount = isSubsystemFocused
                        ? purchasableMinerSubsystemGeneratorCount
                        : purchasableGeneratorCount
                      const upgradeBadgeCount = isSubsystemFocused
                        ? purchasableMinerSubsystemUpgradeCount
                        : purchasableUpgradeCount
                      const badgeCount =
                        item.key === 'upgrades'
                          ? upgradeBadgeCount
                          : item.key === 'production'
                            ? productionBadgeCount
                            : 0

                      return (
                        <Button
                          key={item.key}
                          size="sm"
                          variant="ghost"
                          className={cn(
                            'h-12 flex-col gap-1.5 rounded-lg bg-transparent px-0.5 shadow-none hover:bg-transparent active:bg-transparent',
                            activeTab === item.key ? 'text-foreground' : 'text-muted-foreground/70',
                          )}
                          onClick={() => handlePrimaryNavPress(item.key, badgeCount)}
                          aria-label={item.label}
                        >
                          <span className="relative">
                            <Icon className="size-7" />
                            {(item.key === 'upgrades' && upgradeBadgeCount > 0) ||
                            (item.key === 'production' && productionBadgeCount > 0) ? (
                              <span className="absolute -right-4 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none text-background">
                                {badgeCount > 99 ? '99+' : badgeCount}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-[10px] leading-none">{item.label}</span>
                        </Button>
                      )
                    })}
                    {!isSubsystemFocused && (
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
                            <SheetDescription>Additional navigation options.</SheetDescription>
                          </SheetHeader>
                          <div className="mt-2 space-y-1 px-4">
                            {overflowTabs.map((tab) => (
                              <Button
                                key={tab.key}
                                variant={activeTab === tab.key ? 'default' : 'ghost'}
                                className="h-10 w-full justify-start"
                                onClick={() => {
                                  rememberCurrentScreenScroll()
                                  setActiveTab(tab.key)
                                  setIsSectionsOpen(false)
                                }}
                              >
                                {tab.label}
                              </Button>
                            ))}
                            {overflowTabs.length === 0 && (
                              <p className="px-2 py-1 text-sm text-muted-foreground">No additional sections yet.</p>
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
