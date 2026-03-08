import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  PERMANENT_UPGRADE_DEFS,
  PERMANENT_UPGRADE_ORDER,
  type PermanentUpgradesState,
  type PermanentUpgradeKey,
} from '@/lib/game-engine'

interface PrestigeScreenProps {
  currentEssence: string
  resetGain: Decimal
  availableEssence: Decimal
  currentMultiplier: Decimal
  projectedMultiplier: Decimal
  permanentUpgrades: PermanentUpgradesState
  getUpgradeCost: (key: PermanentUpgradeKey) => Decimal
  canPurchaseUpgrade: (key: PermanentUpgradeKey) => boolean
  onPurchaseUpgrade: (key: PermanentUpgradeKey) => void
  onResetChoices: () => void
  onCancel: () => void
  onConfirm: () => void
  formatValue: (value: Decimal.Value) => string
}

export function PrestigeScreen({
  currentEssence,
  resetGain,
  availableEssence,
  currentMultiplier,
  projectedMultiplier,
  permanentUpgrades,
  getUpgradeCost,
  canPurchaseUpgrade,
  onPurchaseUpgrade,
  onResetChoices,
  onCancel,
  onConfirm,
  formatValue,
}: PrestigeScreenProps) {
  return (
    <div className="space-y-6 pb-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Prestige</h1>
        <p className="text-sm text-muted-foreground">
          Spend essence on permanent upgrades before confirming your reset.
        </p>
      </section>

      <section className="space-y-2 border-y border-border/70 py-4 text-sm">
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Current Essence</span>
          <span className="font-mono tabular-nums">{formatValue(currentEssence)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Reset Gain</span>
          <span className="font-mono tabular-nums">+{formatValue(resetGain)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Essence Available</span>
          <span className="font-mono tabular-nums font-semibold">{formatValue(availableEssence)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Current Multiplier</span>
          <span className="font-mono tabular-nums">x{formatValue(currentMultiplier)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">After Prestige</span>
          <span className="font-mono tabular-nums font-semibold">x{formatValue(projectedMultiplier)}</span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
          Permanent Upgrades
        </h2>
        <div className="divide-y divide-border/70">
          {PERMANENT_UPGRADE_ORDER.map((key) => {
            const definition = PERMANENT_UPGRADE_DEFS[key]
            const level = permanentUpgrades[key]
            const cost = getUpgradeCost(key)
            const canBuy = canPurchaseUpgrade(key)
            const bonusText =
              definition.effectType === 'productionAdditive'
                ? `+${formatValue(new Decimal(definition.value).times(level))} production multiplier`
                : definition.effectType === 'generatorCostDiscount'
                  ? `${formatValue(new Decimal(1).minus(new Decimal(definition.value).pow(level)).times(100))}% generator cost reduction`
                  : `x${formatValue(new Decimal(definition.value).pow(level))} prestige gain`

            return (
              <article key={key} className="py-4 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-base font-semibold">{definition.label}</p>
                    <p className="text-sm text-muted-foreground">{definition.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Level <span className="font-mono tabular-nums">{level}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{bonusText}</p>
                    <p className="text-xs text-muted-foreground">
                      Cost{' '}
                      <span className="font-mono tabular-nums text-foreground">
                        {formatValue(cost)}
                      </span>{' '}
                      essence
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="h-9 min-w-[5rem] shrink-0"
                    onClick={() => onPurchaseUpgrade(key)}
                    disabled={!canBuy}
                  >
                    Buy
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <Button size="sm" variant="outline" onClick={onResetChoices}>
          Reset Choices
        </Button>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm}>
            Confirm Prestige
          </Button>
        </div>
      </section>
    </div>
  )
}
