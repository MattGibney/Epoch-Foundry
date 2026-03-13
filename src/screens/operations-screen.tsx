import { useEffect, useRef } from 'react'
import Decimal from 'decimal.js'

import {
  ProducerList,
  type ProducerListEntry,
} from '@/components/game/producer-list'
import { UpgradeListItem } from '@/components/game/upgrade-list-item'
import { useAnimatedPresenceKeys } from '@/components/game/use-animated-presence-keys'
import { useRecentPurchaseKeys } from '@/components/game/use-recent-purchase-keys'
import { UNKNOWN_PRODUCER_REVEAL_RATIO } from '@/lib/consts'
import { MINER_SUBSYSTEM_CONFIG } from '@/lib/progression-config'
import {
  buyMinerSubsystemGenerator,
  buyMinerSubsystemUpgrade,
  canBuyMinerSubsystemUpgrade,
  getMinerOreData,
  getMinerSubsystemGeneratorCost,
  getMinerSubsystemGeneratorProductionPerSecond,
  getMinerSubsystemTotalProductionPerSecond,
  getMinerSubsystemUpgradeCost,
  getMinerSubsystemUpgradeUnlockProgress,
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

interface MinerSubsystemScreenProps {
  game: GameState
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedValue: (value: Decimal.Value) => string
  jumpRequestId: number
  repeatTapScrollDirection: GameState['settings']['repeatTapScrollDirection']
}

interface MinerSubsystemProductionScreenProps extends MinerSubsystemScreenProps {
  formatAffordabilityEta: (totalSeconds: number) => string
  getSecondsUntilAffordable: (
    credits: Decimal,
    cost: Decimal,
    creditsPerSecond: Decimal,
  ) => number | null
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
  recentPurchaseKeys: Partial<Record<MinerSubsystemUpgradeKey, true>>,
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
    } else {
      for (const key of chain) {
        if (game.subsystems.miners.purchasedUpgrades[key] && recentPurchaseKeys[key]) {
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
  formatAffordabilityEta,
  getSecondsUntilAffordable,
  jumpRequestId,
  repeatTapScrollDirection,
}: MinerSubsystemProductionScreenProps) {
  if (!isSubsystemUnlocked(game, 'miners')) {
    return <MinerSubsystemLockedState />
  }

  const oreData = getMinerOreData(game)
  const oreDataPerSecond = getMinerSubsystemTotalProductionPerSecond(game)
  const { maxRevealedProducerIndex, ghostProducerIndex } = getMinerMaxRevealedProducerIndex(
    game,
    oreData,
  )

  const entries = MINER_SUBSYSTEM_GENERATOR_ORDER.reduce<ProducerListEntry[]>(
    (accumulator, key, index) => {
      const owned = game.subsystems.miners.generators[key]
      const isOwned = owned > 0
      const isRevealed = isOwned || index <= maxRevealedProducerIndex
      const isGhost = ghostProducerIndex === index

      if (!isRevealed && !isGhost) {
        return accumulator
      }

      const definition = MINER_SUBSYSTEM_GENERATOR_DEFS[key]
      if (isGhost) {
        accumulator.push({
          key: definition.key,
          type: 'ghost',
          description: `More of the network will become visible as ${MINER_SUBSYSTEM_CONFIG.currencyLabel} grows.`,
        })
        return accumulator
      }

      const cost = getMinerSubsystemGeneratorCost(game, key)
      const canBuy = oreData.greaterThanOrEqualTo(cost)
      const contribution = getMinerSubsystemGeneratorProductionPerSecond(game, key)
      const remainingOreData = canBuy ? new Decimal(0) : cost.minus(oreData)
      const secondsUntilAffordable = getSecondsUntilAffordable(oreData, cost, oreDataPerSecond)
      const affordabilityPercent = Decimal.min(new Decimal(100), oreData.div(cost).times(100))
        .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
        .toNumber()

      accumulator.push({
        key: definition.key,
        label: definition.label,
        description: definition.description,
        owned,
        productionPerSecond: contribution,
        cost,
        currencyLabel: MINER_SUBSYSTEM_CONFIG.currencyLabel,
        canAfford: canBuy,
        affordabilityPercent,
        helperText: canBuy ? (
          'Ready to purchase'
        ) : (
          <>
            Need{' '}
            <span className="font-mono tabular-nums">
              {formatRenderedValue(remainingOreData)}
            </span>{' '}
            more
            {secondsUntilAffordable !== null && secondsUntilAffordable > 0
              ? ` (${formatAffordabilityEta(secondsUntilAffordable)})`
              : ''}
          </>
        ),
        buttonLabel: 'Buy',
        onAction: () =>
          onGameChange((current) =>
            buyMinerSubsystemGenerator(current, key, Date.now()),
          ),
      })

      return accumulator
    },
    [],
  )

  const scrollTargetKey =
    repeatTapScrollDirection === 'bottomToTop'
      ? [...entries].reverse().find((entry) => entry.type !== 'ghost' && entry.canAfford)?.key ?? null
      : entries.find((entry) => entry.type !== 'ghost' && entry.canAfford)?.key ?? null

  return (
    <ProducerList
      buyAmount={game.buyAmount}
      onBuyAmountChange={(amount) => onGameChange((current) => setBuyAmount(current, amount))}
      formatRenderedValue={formatRenderedValue}
      entries={entries}
      scrollTargetKey={scrollTargetKey}
      scrollRequestId={jumpRequestId}
    />
  )
}

export function MinerSubsystemUpgradesScreen({
  game,
  onGameChange,
  formatRenderedValue,
  jumpRequestId,
  repeatTapScrollDirection,
}: MinerSubsystemScreenProps) {
  const isUnlocked = isSubsystemUnlocked(game, 'miners')
  const contentRef = useRef<HTMLDivElement | null>(null)
  const lastHandledJumpRequestIdRef = useRef(jumpRequestId)
  const { recentPurchaseKeys, markRecentlyPurchased } =
    useRecentPurchaseKeys<MinerSubsystemUpgradeKey>()
  const oreData = isUnlocked ? getMinerOreData(game) : new Decimal(0)
  const { maxRevealedProducerIndex } = isUnlocked
    ? getMinerMaxRevealedProducerIndex(game, oreData)
    : { maxRevealedProducerIndex: -1 }
  const visibleUpgradeKeys = isUnlocked
    ? getVisibleMinerUpgradeKeys(game, maxRevealedProducerIndex, recentPurchaseKeys)
    : []
  const renderedUpgradeEntries = useAnimatedPresenceKeys(visibleUpgradeKeys)
  const scrollTargetKey =
    repeatTapScrollDirection === 'bottomToTop'
      ? [...visibleUpgradeKeys].reverse().find((key) => canBuyMinerSubsystemUpgrade(game, key)) ?? null
      : visibleUpgradeKeys.find((key) => canBuyMinerSubsystemUpgrade(game, key)) ?? null

  useEffect(() => {
    if (!isUnlocked || jumpRequestId <= lastHandledJumpRequestIdRef.current) {
      return
    }

    lastHandledJumpRequestIdRef.current = jumpRequestId
    if (!scrollTargetKey) {
      return
    }

    const target = contentRef.current?.querySelector<HTMLElement>(
      `[data-subsystem-upgrade-key="${scrollTargetKey}"]`,
    )
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [isUnlocked, jumpRequestId, scrollTargetKey])

  if (!isUnlocked) {
    return <MinerSubsystemLockedState />
  }

  return (
    <div ref={contentRef} className="space-y-8">
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

        <div>
          {renderedUpgradeEntries.map((entry) => {
            const key = entry.key
            const definition = MINER_SUBSYSTEM_UPGRADE_DEFS[key]
            const purchased = game.subsystems.miners.purchasedUpgrades[key]
            const isUnlocked = isMinerSubsystemUpgradeUnlocked(game, key)
            const unlockProgress = getMinerSubsystemUpgradeUnlockProgress(game, key)
            const cost = getMinerSubsystemUpgradeCost(game, key)
            const canBuy = canBuyMinerSubsystemUpgrade(game, key)
            const affordabilityRatio = Decimal.min(new Decimal(1), oreData.div(cost)).toNumber()

            return (
              <UpgradeListItem
                key={definition.key}
                itemKey={definition.key}
                itemDataAttributeName="data-subsystem-upgrade-key"
                title={definition.label}
                description={definition.description}
                priceContent={
                  <>
                    Price:{' '}
                    <span className="font-mono tabular-nums">{formatRenderedValue(cost)}</span>{' '}
                    {MINER_SUBSYSTEM_CONFIG.currencyLabel}
                  </>
                }
                purchased={purchased}
                canBuy={canBuy}
                onBuy={() => {
                  onGameChange((current) =>
                    buyMinerSubsystemUpgrade(current, key, Date.now()),
                  )
                  markRecentlyPurchased(key)
                }}
                recentlyPurchased={Boolean(recentPurchaseKeys[key])}
                purchaseFeedbackToken={recentPurchaseKeys[key] ? key : null}
                isExiting={entry.isExiting}
                unavailableContent={
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
                }
              />
            )
          })}
        </div>

        {!game.settings.showPurchasedUpgrades &&
          renderedUpgradeEntries.length === 0 &&
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
