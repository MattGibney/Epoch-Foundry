import Decimal from 'decimal.js'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { UNKNOWN_PRODUCER_REVEAL_RATIO } from '@/lib/consts'
import {
  buyUpgrade,
  canBuyUpgrade,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getUpgradeUnlockProgress,
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
  { effectType: 'global', heading: 'Global Upgrades' },
  { effectType: 'offlineCap', heading: 'Offline Upgrades' },
]

interface UpgradesScreenProps {
  game: GameState
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedCredits: (value: Decimal.Value) => string
}

export function UpgradesScreen({ game, onGameChange, formatRenderedCredits }: UpgradesScreenProps) {
  const visibleUpgradeKeys = useMemo(() => {
    const credits = new Decimal(game.credits)
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
      }
    }

    return UPGRADE_ORDER.filter((key) => visible.has(key))
  }, [game.credits, game.generators, game.purchasedUpgrades, game.settings.showPurchasedUpgrades])

  const purchasedUpgradeCount = UPGRADE_ORDER.reduce(
    (count, key) => count + (game.purchasedUpgrades[key] ? 1 : 0),
    0,
  )

  const renderUpgradeItem = (key: RunUpgradeKey) => {
    const definition = UPGRADE_DEFS[key]
    const purchased = game.purchasedUpgrades[key]
    const canBuy = canBuyUpgrade(game, key)
    const unlockProgress = getUpgradeUnlockProgress(game, key)
    const cost = new Decimal(definition.cost)

    return (
      <article key={definition.key} className="border-b border-border/70 py-4 first:pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold">{definition.label}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{definition.description}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Price:{' '}
              <span className="font-mono tabular-nums">{formatRenderedCredits(cost)}</span>{' '}
              credits
            </p>
          </div>
          <div className="shrink-0 text-center">
            {purchased ? (
              <Button size="sm" className="h-10 min-w-[5.5rem]" variant="secondary" disabled>
                Owned
              </Button>
            ) : canBuy ? (
              <Button
                size="sm"
                className="h-10 min-w-[5.5rem]"
                onClick={() => onGameChange((current) => buyUpgrade(current, key))}
              >
                Buy
              </Button>
            ) : (
              <div className="min-w-[5.5rem]">
                <p className="text-xs text-muted-foreground">Requires</p>
                {unlockProgress ? (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono tabular-nums">
                      {unlockProgress.current}/{unlockProgress.required}
                    </span>{' '}
                    {unlockProgress.label}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">More credits</p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="space-y-8">
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
          const sectionUpgrades = visibleUpgradeKeys.filter(
            (key) => UPGRADE_DEFS[key].effectType === section.effectType,
          )

          if (sectionUpgrades.length === 0) {
            return null
          }

          return (
            <section key={section.effectType} className="space-y-3 pt-2 first:pt-0">
              <h3 className="border-b border-border/70 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
                {section.heading}
              </h3>
              <div>{sectionUpgrades.map((key) => renderUpgradeItem(key))}</div>
            </section>
          )
        })}
        {!game.settings.showPurchasedUpgrades &&
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
