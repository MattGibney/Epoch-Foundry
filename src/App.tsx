import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import { loadGameState, saveGameState } from '@/lib/game-save'
import {
  BUY_AMOUNT_OPTIONS,
  buyGenerator,
  buyRunUpgrade,
  canTriggerOverclock,
  claimContract,
  CONTRACT_DEFS,
  GENERATOR_DEFS,
  getActiveContract,
  getContractProgress,
  getGeneratorCost,
  getOverclockTime,
  getPotentialInfluence,
  getProductionRates,
  getRunUpgradeCost,
  reboot,
  RUN_UPGRADE_DEFS,
  setBuyAmount,
  tickGame,
  TREE_NODE_DEFS,
  triggerOverclock,
  type GameState,
  type GeneratorKey,
  type RunUpgradeKey,
  type TreeNodeKey,
  unlockTreeNode,
} from '@/lib/mvp-engine'
import { formatIdleNumber } from '@/lib/number-format'
import { cn } from '@/lib/utils'

type TabKey = 'production' | 'upgrades' | 'trees' | 'prestige' | 'stats'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'production', label: 'Production' },
  { key: 'upgrades', label: 'Upgrades' },
  { key: 'trees', label: 'Trees' },
  { key: 'prestige', label: 'Prestige' },
  { key: 'stats', label: 'Stats' },
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

  const rates = useMemo(() => getProductionRates(game, nowMs), [game, nowMs])
  const overclock = useMemo(() => getOverclockTime(game, nowMs), [game, nowMs])
  const activeContract = useMemo(() => getActiveContract(game), [game])
  const contractProgress = useMemo(() => getContractProgress(game), [game])
  const potentialInfluence = useMemo(() => getPotentialInfluence(game), [game])

  const contractRatio = contractProgress.target.lessThanOrEqualTo(0)
    ? 0
    : Number(
        Decimal.min(
          new Decimal(1),
          Decimal.max(
            new Decimal(0),
            contractProgress.current.div(contractProgress.target),
          ),
        ).toString(),
      )

  const runDuration = Math.max(0, Math.floor((nowMs - game.stats.startedAtMs) / 1_000))

  const renderProductionTab = () => (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-background p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Overclock
            </p>
            <p className="text-sm text-muted-foreground">
              3x global production for 20s, 180s cooldown
            </p>
            <p className="mt-1 text-sm font-medium">
              {overclock.activeSecondsRemaining > 0
                ? `Active: ${overclock.activeSecondsRemaining.toFixed(1)}s remaining`
                : overclock.cooldownSecondsRemaining > 0
                  ? `Cooldown: ${overclock.cooldownSecondsRemaining.toFixed(1)}s`
                  : 'Ready'}
            </p>
          </div>
          <Button
            className="h-11 px-6"
            disabled={!canTriggerOverclock(game, nowMs)}
            onClick={() => {
              const now = Date.now()
              setNowMs(now)
              setGame((current) => triggerOverclock(current, now))
            }}
          >
            Trigger Overclock
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Contract
        </p>
        <p className="mt-1 text-base font-medium">{activeContract.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatIdleNumber(contractProgress.current)} /{' '}
          {formatIdleNumber(contractProgress.target)}
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${contractRatio * 100}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Reward: +{formatIdleNumber(activeContract.rewardAmount)}{' '}
            {activeContract.rewardResource}
          </p>
          <Button
            size="sm"
            disabled={!contractProgress.isComplete}
            onClick={() => setGame((current) => claimContract(current))}
          >
            Claim
          </Button>
        </div>
      </section>

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
        {(Object.keys(GENERATOR_DEFS) as GeneratorKey[]).map((key) => {
          const definition = GENERATOR_DEFS[key]
          const cost = getGeneratorCost(game, key)
          const owned = game.generators[key]
          const available = new Decimal(game.resources[definition.currency])
          const canBuy = available.greaterThanOrEqualTo(cost)
          const rate =
            key === 'miners'
              ? rates.creditsPerSecond
              : key === 'refiners'
                ? rates.componentsPerSecond
                : rates.researchPerSecond

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
                    Throughput: +{formatIdleNumber(rate)} / sec
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-right text-sm">
                    Cost: {formatIdleNumber(cost)} {definition.currency}
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
      {(Object.keys(RUN_UPGRADE_DEFS) as RunUpgradeKey[]).map((key) => {
        const definition = RUN_UPGRADE_DEFS[key]
        const level = game.runUpgrades[key]
        const cost = getRunUpgradeCost(game, key)
        const available = new Decimal(game.resources[definition.currency])
        const canBuy = available.greaterThanOrEqualTo(cost)

        return (
          <article
            key={definition.key}
            className="rounded-lg border border-border bg-background p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold">{definition.label}</h3>
                <p className="text-sm text-muted-foreground">{definition.description}</p>
                <p className="mt-1 text-sm">Level: {level}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-right text-sm">
                  Cost: {formatIdleNumber(cost)} {definition.currency}
                </p>
                <Button
                  disabled={!canBuy}
                  onClick={() => setGame((current) => buyRunUpgrade(current, key))}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )

  const renderTreesTab = () => (
    <div className="space-y-3">
      {(Object.keys(TREE_NODE_DEFS) as TreeNodeKey[]).map((key) => {
        const definition = TREE_NODE_DEFS[key]
        const unlocked = game.treeNodes[key]
        const influence = new Decimal(game.resources.influence)
        const cost = new Decimal(definition.costInfluence)
        const canUnlock = !unlocked && influence.greaterThanOrEqualTo(cost)

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
                  Cost: {formatIdleNumber(cost)} influence
                </p>
              </div>
              <Button
                disabled={!canUnlock}
                variant={unlocked ? 'secondary' : 'default'}
                onClick={() => setGame((current) => unlockTreeNode(current, key))}
              >
                {unlocked ? 'Unlocked' : 'Unlock'}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )

  const renderPrestigeTab = () => (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Current Run Credits
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">
          {formatIdleNumber(game.stats.runCredits)}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Potential Reboot Gain
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">
          +{formatIdleNumber(potentialInfluence)} influence
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Reboot resets run resources, generators, and run upgrades.
        </p>
        <Button
          className="mt-4 h-11 w-full"
          disabled={potentialInfluence.lessThanOrEqualTo(0)}
          onClick={() => {
            const now = Date.now()
            setNowMs(now)
            setGame((current) => reboot(current, now))
          }}
        >
          Reboot Timeline
        </Button>
      </section>
    </div>
  )

  const renderStatsTab = () => (
    <div className="space-y-3">
      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Session
        </p>
        <p className="mt-1 text-sm">Run Time: {formatDuration(runDuration)}</p>
        <p className="text-sm">Reboots: {game.stats.reboots}</p>
        <p className="text-sm">Contracts Completed: {game.contract.completedCount}</p>
      </section>

      <section className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Lifetime Production
        </p>
        <p className="mt-1 text-sm">
          Credits: {formatIdleNumber(game.stats.totalCredits)}
        </p>
        <p className="text-sm">
          Components: {formatIdleNumber(game.stats.totalComponents)}
        </p>
        <p className="text-sm">
          Research: {formatIdleNumber(game.stats.totalResearch)}
        </p>
      </section>
    </div>
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-6 md:px-6">
      <header className="rounded-xl border border-border bg-card p-4">
        <h1 className="text-2xl font-semibold tracking-tight">Epoch Foundry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          MVP Slice: production ladder, upgrades, trees, contracts, and reboot
          prestige.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <article className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Credits
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatIdleNumber(game.resources.credits)}
          </p>
          <p className="text-xs text-muted-foreground">
            +{formatIdleNumber(rates.creditsPerSecond)}/s
          </p>
        </article>
        <article className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Components
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatIdleNumber(game.resources.components)}
          </p>
          <p className="text-xs text-muted-foreground">
            +{formatIdleNumber(rates.componentsPerSecond)}/s
          </p>
        </article>
        <article className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Research
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatIdleNumber(game.resources.research)}
          </p>
          <p className="text-xs text-muted-foreground">
            +{formatIdleNumber(rates.researchPerSecond)}/s
          </p>
        </article>
        <article className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Influence
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatIdleNumber(game.resources.influence)}
          </p>
          <p className="text-xs text-muted-foreground">
            Potential +{formatIdleNumber(potentialInfluence)}
          </p>
        </article>
      </section>

      <nav className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-2 md:grid-cols-5">
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
        {activeTab === 'trees' && renderTreesTab()}
        {activeTab === 'prestige' && renderPrestigeTab()}
        {activeTab === 'stats' && renderStatsTab()}
      </section>

      <footer className="pb-2 text-xs text-muted-foreground">
        Autosaves every 10s and on exit
        {lastSavedAt ? ` • Last save ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}
        {` • Contracts: ${CONTRACT_DEFS.length} templates`}
      </footer>
    </main>
  )
}

export default App
