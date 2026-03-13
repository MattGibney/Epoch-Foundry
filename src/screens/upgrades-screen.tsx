import { useEffect, useRef } from 'react'
import Decimal from 'decimal.js'

import { UpgradeListItem } from '@/components/game/upgrade-list-item'
import { useAnimatedPresenceKeys } from '@/components/game/use-animated-presence-keys'
import { useRecentPurchaseKeys } from '@/components/game/use-recent-purchase-keys'
import { UNKNOWN_PRODUCER_REVEAL_RATIO } from '@/lib/consts'
import {
  buyUpgrade,
  canBuyUpgrade,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getUpgradeCost,
  getUpgradeUnlockProgress,
  isUpgradeUnlocked,
  UPGRADE_DEFS,
  UPGRADE_ORDER,
  type GameState,
  type RunUpgradeKey,
} from '@/lib/game-engine'

const UPGRADE_SECTIONS: {
  effectType: (typeof UPGRADE_DEFS)[RunUpgradeKey]['effectType']
  heading: string
}[] = [
  { effectType: 'generator', heading: 'Generator Upgrades' },
  { effectType: 'subsystemUnlock', heading: 'Subsystem Unlocks' },
  { effectType: 'global', heading: 'Global Upgrades' },
]

interface UpgradesScreenProps {
  game: GameState
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedCredits: (value: Decimal.Value) => string
  jumpRequestId: number
  repeatTapScrollDirection: GameState['settings']['repeatTapScrollDirection']
}

export function UpgradesScreen({
  game,
  onGameChange,
  formatRenderedCredits,
  jumpRequestId,
  repeatTapScrollDirection,
}: UpgradesScreenProps) {
  const credits = new Decimal(game.credits)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const lastHandledJumpRequestIdRef = useRef(jumpRequestId)
  const { recentPurchaseKeys, markRecentlyPurchased } =
    useRecentPurchaseKeys<RunUpgradeKey>()
  const highestOwnedProducerIndex = GENERATOR_ORDER.reduce(
    (highest, key, index) => (game.generators[key] > 0 ? index : highest),
    -1,
  )
  let maxRevealedProducerIndex = highestOwnedProducerIndex

  for (
    let index = highestOwnedProducerIndex + 1;
    index < GENERATOR_ORDER.length;
    index += 1
  ) {
    const key = GENERATOR_ORDER[index]
    const revealThreshold = new Decimal(GENERATOR_DEFS[key].baseCost).times(
      UNKNOWN_PRODUCER_REVEAL_RATIO,
    )
    if (credits.greaterThanOrEqualTo(revealThreshold)) {
      maxRevealedProducerIndex = index
      continue
    }
    break
  }

  const revealedProducers = new Set(
    GENERATOR_ORDER.filter(
      (key, index) => game.generators[key] > 0 || index <= maxRevealedProducerIndex,
    ),
  )

  const childByParent = new Map<RunUpgradeKey, RunUpgradeKey>()
  for (const key of UPGRADE_ORDER) {
    const parent = UPGRADE_DEFS[key].requiresUpgrade
    if (parent) {
      childByParent.set(parent, key)
    }
  }

  const roots = UPGRADE_ORDER.filter((key) => !UPGRADE_DEFS[key].requiresUpgrade)
  const visible = new Set<RunUpgradeKey>()

  for (const root of roots) {
    const chain: RunUpgradeKey[] = []
    let current: RunUpgradeKey | undefined = root
    while (current) {
      chain.push(current)
      current = childByParent.get(current)
    }

    const rootDef = UPGRADE_DEFS[root]
    const rootTarget = rootDef.effectType === 'generator' ? rootDef.target : undefined
    if (rootTarget && !revealedProducers.has(rootTarget)) {
      continue
    }

    const nextUpgrade = chain.find((key) => !game.purchasedUpgrades[key])
    if (nextUpgrade) {
      visible.add(nextUpgrade)
    }

    if (game.settings.showPurchasedUpgrades) {
      for (const key of chain) {
        if (game.purchasedUpgrades[key]) {
          visible.add(key)
        }
      }
    } else {
      for (const key of chain) {
        if (game.purchasedUpgrades[key] && recentPurchaseKeys[key]) {
          visible.add(key)
        }
      }
    }
  }

  const visibleUpgradeKeys = UPGRADE_ORDER.filter((key) => visible.has(key))
  const renderedUpgradeEntries = useAnimatedPresenceKeys(visibleUpgradeKeys)
  const scrollTargetKey =
    repeatTapScrollDirection === 'bottomToTop'
      ? [...visibleUpgradeKeys].reverse().find((key) => canBuyUpgrade(game, key)) ?? null
      : visibleUpgradeKeys.find((key) => canBuyUpgrade(game, key)) ?? null

  useEffect(() => {
    if (jumpRequestId <= lastHandledJumpRequestIdRef.current) {
      return
    }

    lastHandledJumpRequestIdRef.current = jumpRequestId
    if (!scrollTargetKey) {
      return
    }

    const target = contentRef.current?.querySelector<HTMLElement>(
      `[data-upgrade-key="${scrollTargetKey}"]`,
    )
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [jumpRequestId, scrollTargetKey])

  const purchasedUpgradeCount = UPGRADE_ORDER.reduce(
    (count, key) => count + (game.purchasedUpgrades[key] ? 1 : 0),
    0,
  )

  const renderUpgradeItem = (key: RunUpgradeKey, isExiting = false) => {
    const definition = UPGRADE_DEFS[key]
    const purchased = game.purchasedUpgrades[key]
    const canBuy = canBuyUpgrade(game, key)
    const isUnlocked = isUpgradeUnlocked(game, key)
    const unlockProgress = getUpgradeUnlockProgress(game, key)
    const cost = getUpgradeCost(game, key)
    const creditProgress = {
      current: `${formatRenderedCredits(credits)}/${formatRenderedCredits(cost)}`,
      ratio: Decimal.min(new Decimal(1), credits.div(cost)).toNumber(),
    }
    const progress = unlockProgress
      ? {
          current: `${unlockProgress.current}/${unlockProgress.required}`,
          ratio: Math.max(
            0,
            Math.min(
              1,
              unlockProgress.required <= 0
                ? 1
                : unlockProgress.current / unlockProgress.required,
            ),
          ),
        }
      : null

    return (
      <UpgradeListItem
        key={definition.key}
        itemKey={definition.key}
        itemDataAttributeName="data-upgrade-key"
        title={definition.label}
        description={definition.description}
        priceContent={
          <>
            Price: <span className="font-mono tabular-nums">{formatRenderedCredits(cost)}</span>{' '}
            credits
          </>
        }
        purchased={purchased}
        canBuy={canBuy}
        onBuy={() => {
          onGameChange((current) => buyUpgrade(current, key))
          markRecentlyPurchased(key)
        }}
        recentlyPurchased={Boolean(recentPurchaseKeys[key])}
        purchaseFeedbackToken={recentPurchaseKeys[key] ? key : null}
        isExiting={isExiting}
        unavailableContent={
          <div className="flex h-full flex-col justify-center space-y-1.5 text-center">
            <p className="text-xs text-muted-foreground">{isUnlocked ? 'Credits' : 'Requires'}</p>
            {isUnlocked ? (
              <>
                <p className="break-all text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums">{creditProgress.current}</span>
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-foreground/35 transition-[width] duration-300"
                    style={{ width: `${creditProgress.ratio * 100}%` }}
                  />
                </div>
              </>
            ) : unlockProgress ? (
              <>
                <p className="break-words text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums">{progress?.current}</span>{' '}
                  {unlockProgress.label}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-foreground/35 transition-[width] duration-300"
                    style={{ width: `${(progress?.ratio ?? 0) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">More credits</p>
            )}
          </div>
        }
      />
    )
  }

  return (
    <div ref={contentRef} className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Progress
        </p>
        <p className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Purchased</span>
          <span className="font-mono tabular-nums">
            {purchasedUpgradeCount}/{UPGRADE_ORDER.length}
          </span>
        </p>
      </section>
        {UPGRADE_SECTIONS.map((section) => {
          const renderedSectionEntries = renderedUpgradeEntries.filter(
            (entry) => UPGRADE_DEFS[entry.key].effectType === section.effectType,
          )

          if (renderedSectionEntries.length === 0) {
            return null
          }

          return (
            <section key={section.effectType} className="space-y-3 pt-2 first:pt-0">
              <h3 className="border-b border-border/70 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
                {section.heading}
              </h3>
              <div>
                {renderedSectionEntries.map((entry) =>
                  renderUpgradeItem(entry.key, entry.isExiting),
                )}
              </div>
            </section>
          )
        })}
        {!game.settings.showPurchasedUpgrades &&
          renderedUpgradeEntries.length === 0 &&
          UPGRADE_ORDER.every((key) => game.purchasedUpgrades[key]) && (
            <section className="py-3">
              <p className="text-sm text-muted-foreground">
                All upgrades are purchased. Enable "Show Purchased Upgrades" in Settings to
                review completed upgrades.
              </p>
            </section>
          )}
    </div>
  )
}
