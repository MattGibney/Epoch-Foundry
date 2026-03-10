import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import { UNKNOWN_PRODUCER_REVEAL_RATIO } from '@/lib/consts'
import { MINER_SUBSYSTEM_CONFIG } from '@/lib/progression-config'
import {
  BUY_AMOUNT_OPTIONS,
  buyMinerSubsystemGenerator,
  buyMinerSubsystemUpgrade,
  canBuyMinerSubsystemUpgrade,
  getMinerOreData,
  getMinerSubsystemGeneratorCost,
  getMinerSubsystemGeneratorProductionPerSecond,
  getMinerSubsystemMultiplier,
  getMinerSubsystemPurchasedUpgradeCount,
  getMinerSubsystemUpgradeCost,
  getMinerSubsystemUpgradeUnlockProgress,
  getMinerTotalOreData,
  isMinerSubsystemUpgradeUnlocked,
  isSubsystemUnlocked,
  MINER_SUBSYSTEM_GENERATOR_DEFS,
  MINER_SUBSYSTEM_GENERATOR_ORDER,
  MINER_SUBSYSTEM_UPGRADE_DEFS,
  MINER_SUBSYSTEM_UPGRADE_ORDER,
  setBuyAmount,
  type GameState,
  type MinerSubsystemUpgradeKey,
} from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface MinerSubsystemScreenProps {
  game: GameState
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedValue: (value: Decimal.Value) => string
}

function getMinerMaxRevealedProducerIndex(game: GameState, oreData: Decimal): {
  highestOwnedProducerIndex: number
  maxRevealedProducerIndex: number
  ghostProducerIndex: number | null
} {
  const highestOwnedProducerIndex = MINER_SUBSYSTEM_GENERATOR_ORDER.reduce(
    (highest, key, index) => (game.subsystems.miners.generators[key] > 0 ? index : highest),
    -1,
  )

  let maxRevealedProducerIndex = highestOwnedProducerIndex
  let ghostProducerIndex: number | null = null

  for (
    let index = highestOwnedProducerIndex + 1;
    index < MINER_SUBSYSTEM_GENERATOR_ORDER.length;
    index += 1
  ) {
    const key = MINER_SUBSYSTEM_GENERATOR_ORDER[index]
    const revealThreshold = new Decimal(MINER_SUBSYSTEM_GENERATOR_DEFS[key].baseCost).times(
      UNKNOWN_PRODUCER_REVEAL_RATIO,
    )
    if (oreData.greaterThanOrEqualTo(revealThreshold)) {
      maxRevealedProducerIndex = index
      continue
    }

    ghostProducerIndex = index
    break
  }

  return {
    highestOwnedProducerIndex,
    maxRevealedProducerIndex,
    ghostProducerIndex,
  }
}

function getVisibleMinerUpgradeKeys(
  game: GameState,
  maxRevealedProducerIndex: number,
): MinerSubsystemUpgradeKey[] {
  const childByParent = new Map<MinerSubsystemUpgradeKey, MinerSubsystemUpgradeKey>()
  for (const key of MINER_SUBSYSTEM_UPGRADE_ORDER) {
    const parent = MINER_SUBSYSTEM_UPGRADE_DEFS[key].requiresUpgrade
    if (parent) {
      childByParent.set(parent, key)
    }
  }

  const roots = MINER_SUBSYSTEM_UPGRADE_ORDER.filter(
    (key) => !MINER_SUBSYSTEM_UPGRADE_DEFS[key].requiresUpgrade,
  )
  const visibleUpgrades = new Set<MinerSubsystemUpgradeKey>()

  for (const root of roots) {
    const chain: MinerSubsystemUpgradeKey[] = []
    let current: MinerSubsystemUpgradeKey | undefined = root
    while (current) {
      chain.push(current)
      current = childByParent.get(current)
    }

    const rootDef = MINER_SUBSYSTEM_UPGRADE_DEFS[root]
    const rootTarget = rootDef.effectType === 'generator' ? rootDef.target : undefined
    if (rootTarget) {
      const typedRootTarget = rootTarget as (typeof MINER_SUBSYSTEM_GENERATOR_ORDER)[number]
      const targetIndex = MINER_SUBSYSTEM_GENERATOR_ORDER.indexOf(typedRootTarget)
      const isTargetRevealed =
        game.subsystems.miners.generators[typedRootTarget] > 0 ||
        targetIndex <= maxRevealedProducerIndex
      if (!isTargetRevealed) {
        continue
      }
    }

    const nextUpgrade = chain.find((key) => !game.subsystems.miners.purchasedUpgrades[key])
    if (nextUpgrade) {
      visibleUpgrades.add(nextUpgrade)
    }

    if (game.settings.showPurchasedUpgrades) {
      for (const key of chain) {
        if (game.subsystems.miners.purchasedUpgrades[key]) {
          visibleUpgrades.add(key)
        }
      }
    }
  }

  return MINER_SUBSYSTEM_UPGRADE_ORDER.filter((key) => visibleUpgrades.has(key))
}

function MinerSubsystemLockedState() {
  return (
    <section className="rounded-2xl border border-dashed border-border/80 px-4 py-5">
      <p className="text-sm text-muted-foreground">
        Unlock <span className="font-medium text-foreground">{MINER_SUBSYSTEM_CONFIG.label}</span>{' '}
        from the main game before entering this view.
      </p>
    </section>
  )
}

export function MinerSubsystemProductionScreen({
  game,
  onGameChange,
  formatRenderedValue,
}: MinerSubsystemScreenProps) {
  if (!isSubsystemUnlocked(game, 'miners')) {
    return <MinerSubsystemLockedState />
  }

  const oreData = getMinerOreData(game)
  const totalOreData = getMinerTotalOreData(game)
  const minerMultiplier = getMinerSubsystemMultiplier(game)
  const { maxRevealedProducerIndex, ghostProducerIndex } = getMinerMaxRevealedProducerIndex(
    game,
    oreData,
  )

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3">
        <div className="space-y-1 rounded-2xl border border-border/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Miner Boost</p>
          <p className="font-mono text-lg font-semibold tabular-nums">
            x{minerMultiplier.toDecimalPlaces(2).toString()}
          </p>
          <p className="text-xs text-muted-foreground">Applied back into Miners in the main game</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-border/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Lifetime {MINER_SUBSYSTEM_CONFIG.currencyLabel}
          </p>
          <p className="font-mono text-lg font-semibold tabular-nums">
            {formatRenderedValue(totalOreData)}
          </p>
          <p className="text-xs text-muted-foreground">Total Mining Network output this run</p>
        </div>
      </section>

      <section className="border-b border-border/70 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Buy Amount</p>
            <p className="text-xs text-muted-foreground">
              Spend {MINER_SUBSYSTEM_CONFIG.currencyLabel} on local producers.
            </p>
          </div>
          <div
            className="inline-flex items-center overflow-hidden rounded-md border border-border"
            role="group"
            aria-label="Buy amount"
          >
            {BUY_AMOUNT_OPTIONS.map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant={game.buyAmount === amount ? 'default' : 'ghost'}
                className="h-7 rounded-none border-0 border-r border-border px-2 text-xs last:border-r-0"
                onClick={() => onGameChange((current) => setBuyAmount(current, amount))}
              >
                <span className="font-mono text-xs tabular-nums">{amount}x</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
            Producers
          </h3>
          <p className="text-sm text-muted-foreground">
            Build out the Mining Network. More {MINER_SUBSYSTEM_CONFIG.currencyLabel} per second
            means a stronger Miner multiplier.
          </p>
        </div>

        <div className="divide-y divide-border/70">
          {MINER_SUBSYSTEM_GENERATOR_ORDER.map((key, index) => {
            const owned = game.subsystems.miners.generators[key]
            const isOwned = owned > 0
            const isRevealed = isOwned || index <= maxRevealedProducerIndex
            const isGhost = ghostProducerIndex === index

            if (!isRevealed && !isGhost) {
              return null
            }

            const definition = MINER_SUBSYSTEM_GENERATOR_DEFS[key]
            const cost = getMinerSubsystemGeneratorCost(game, key)
            const canBuy = oreData.greaterThanOrEqualTo(cost)
            const contribution = getMinerSubsystemGeneratorProductionPerSecond(game, key)
            const affordabilityPercent = Decimal.min(new Decimal(100), oreData.div(cost).times(100))
              .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
              .toNumber()

            if (isGhost) {
              return (
                <article key={definition.key} className="py-4 first:pt-0">
                  <div className="space-y-2 blur-[1px]">
                    <p className="text-base font-semibold text-muted-foreground/70">Unknown Producer</p>
                    <p className="text-sm text-muted-foreground/70">
                      More of the network will become visible as {MINER_SUBSYSTEM_CONFIG.currencyLabel} grows.
                    </p>
                  </div>
                </article>
              )
            }

            return (
              <article key={definition.key} className="py-4 first:pt-0">
                <div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold">{definition.label}</h3>
                        <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                          {owned}
                        </span>
                      </div>
                      <p className="shrink-0 text-sm text-muted-foreground">
                        +
                        <span className="font-mono tabular-nums">
                          {formatRenderedValue(contribution)}
                        </span>{' '}
                        / sec
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{definition.description}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-muted-foreground">
                        Cost:{' '}
                        <span className="font-mono tabular-nums">{formatRenderedValue(cost)}</span>{' '}
                        {MINER_SUBSYSTEM_CONFIG.currencyLabel}
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-75',
                            canBuy ? 'bg-foreground/70' : 'bg-muted-foreground/60',
                          )}
                          style={{ width: `${Math.max(0, affordabilityPercent)}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-10 min-w-[5.5rem] shrink-0 font-mono tabular-nums"
                      disabled={!canBuy}
                      onClick={() =>
                        onGameChange((current) =>
                          buyMinerSubsystemGenerator(current, key, Date.now()),
                        )
                      }
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export function MinerSubsystemUpgradesScreen({
  game,
  onGameChange,
  formatRenderedValue,
}: MinerSubsystemScreenProps) {
  if (!isSubsystemUnlocked(game, 'miners')) {
    return <MinerSubsystemLockedState />
  }

  const oreData = getMinerOreData(game)
  const minerMultiplier = getMinerSubsystemMultiplier(game)
  const purchasedUpgradeCount = getMinerSubsystemPurchasedUpgradeCount(game)
  const { maxRevealedProducerIndex } = getMinerMaxRevealedProducerIndex(game, oreData)
  const visibleUpgradeKeys = getVisibleMinerUpgradeKeys(game, maxRevealedProducerIndex)

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3">
        <div className="space-y-1 rounded-2xl border border-border/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Miner Boost</p>
          <p className="font-mono text-lg font-semibold tabular-nums">
            x{minerMultiplier.toDecimalPlaces(2).toString()}
          </p>
          <p className="text-xs text-muted-foreground">Current multiplier exported to Miners</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-border/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Upgrades</p>
          <p className="font-mono text-lg font-semibold tabular-nums">
            {purchasedUpgradeCount}/{MINER_SUBSYSTEM_UPGRADE_ORDER.length}
          </p>
          <p className="text-xs text-muted-foreground">Mining Network progression</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
            Upgrades
          </h3>
          <p className="text-sm text-muted-foreground">
            Upgrade local producers and the network-wide economy. Stronger local output directly
            increases the Miner multiplier.
          </p>
        </div>

        <div className="divide-y divide-border/70">
          {visibleUpgradeKeys.map((key) => {
            const definition = MINER_SUBSYSTEM_UPGRADE_DEFS[key]
            const purchased = game.subsystems.miners.purchasedUpgrades[key]
            const isUnlocked = isMinerSubsystemUpgradeUnlocked(game, key)
            const unlockProgress = getMinerSubsystemUpgradeUnlockProgress(game, key)
            const cost = getMinerSubsystemUpgradeCost(game, key)
            const canBuy = canBuyMinerSubsystemUpgrade(game, key)
            const affordabilityRatio = Decimal.min(new Decimal(1), oreData.div(cost)).toNumber()

            return (
              <article key={definition.key} className="py-4 first:pt-0">
                <div className="flex items-stretch justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold">{definition.label}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{definition.description}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Price:{' '}
                      <span className="font-mono tabular-nums">{formatRenderedValue(cost)}</span>{' '}
                      {MINER_SUBSYSTEM_CONFIG.currencyLabel}
                    </p>
                  </div>
                  <div className="w-36 shrink-0">
                    {purchased ? (
                      <div className="flex h-full items-center justify-end">
                        <Button size="sm" className="h-10 min-w-[5.5rem]" variant="secondary" disabled>
                          Owned
                        </Button>
                      </div>
                    ) : canBuy ? (
                      <div className="flex h-full items-center justify-end">
                        <Button
                          size="sm"
                          className="h-10 min-w-[5.5rem]"
                          onClick={() =>
                            onGameChange((current) =>
                              buyMinerSubsystemUpgrade(current, key, Date.now()),
                            )
                          }
                        >
                          Buy
                        </Button>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-center space-y-1.5 text-center">
                        <p className="text-xs text-muted-foreground">
                          {isUnlocked ? MINER_SUBSYSTEM_CONFIG.currencyLabel : 'Requires'}
                        </p>
                        {isUnlocked ? (
                          <>
                            <p className="break-all text-xs text-muted-foreground">
                              <span className="font-mono tabular-nums">
                                {formatRenderedValue(oreData)}/{formatRenderedValue(cost)}
                              </span>
                            </p>
                            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                              <div
                                className="h-full rounded-full bg-foreground/35 transition-[width] duration-300"
                                style={{ width: `${affordabilityRatio * 100}%` }}
                              />
                            </div>
                          </>
                        ) : unlockProgress ? (
                          <>
                            <p className="break-words text-xs text-muted-foreground">
                              <span className="font-mono tabular-nums">
                                {unlockProgress.current}/{unlockProgress.required}
                              </span>{' '}
                              {unlockProgress.label}
                            </p>
                            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                              <div
                                className="h-full rounded-full bg-foreground/35 transition-[width] duration-300"
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      unlockProgress.required <= 0
                                        ? 100
                                        : (unlockProgress.current / unlockProgress.required) * 100,
                                    ),
                                  )}%`,
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            More {MINER_SUBSYSTEM_CONFIG.currencyLabel}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {!game.settings.showPurchasedUpgrades &&
          MINER_SUBSYSTEM_UPGRADE_ORDER.every(
            (key) => game.subsystems.miners.purchasedUpgrades[key],
          ) && (
            <p className="text-sm text-muted-foreground">
              All Mining Network upgrades are purchased. Enable &quot;Show Purchased Upgrades&quot; in
              Settings to review completed upgrades.
            </p>
          )}
      </section>
    </div>
  )
}
