import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  buyUpgrade,
  canBuyUpgrade,
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
  const visibleUpgradeKeys = UPGRADE_ORDER.filter((key) => {
    if (game.settings.showPurchasedUpgrades) {
      return true
    }

    return !game.purchasedUpgrades[key]
  })

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
