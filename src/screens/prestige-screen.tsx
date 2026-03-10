import { useState } from 'react'
import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  BUY_AMOUNT_OPTIONS,
  PERMANENT_UPGRADE_DEFS,
  PERMANENT_UPGRADE_ORDER,
  type PermanentUpgradesState,
  type PermanentUpgradeKey,
} from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface PrestigeScreenProps {
  currentEssence: string
  resetGain: Decimal
  availableEssence: Decimal
  currentMultiplier: Decimal
  projectedMultiplier: Decimal
  permanentUpgrades: PermanentUpgradesState
  getUpgradeCost: (key: PermanentUpgradeKey, amount: number) => Decimal
  canPurchaseUpgrade: (key: PermanentUpgradeKey, amount: number) => boolean
  onPurchaseUpgrade: (key: PermanentUpgradeKey, amount: number) => void
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
  const [buyAmount, setBuyAmount] =
    useState<(typeof BUY_AMOUNT_OPTIONS)[number]>(BUY_AMOUNT_OPTIONS[0])

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
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
            Permanent Upgrades
          </h2>
          <div
            className="inline-flex items-center overflow-hidden rounded-md border border-border"
            role="group"
            aria-label="Prestige buy amount"
          >
            {BUY_AMOUNT_OPTIONS.map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant={buyAmount === amount ? 'default' : 'ghost'}
                className={cn(
                  'h-7 rounded-none border-0 border-r border-border px-2 text-xs last:border-r-0',
                )}
                onClick={() => setBuyAmount(amount)}
              >
                <span className="font-mono text-xs tabular-nums">{amount}x</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border/70">
          {PERMANENT_UPGRADE_ORDER.map((key) => {
            const definition = PERMANENT_UPGRADE_DEFS[key]
            const level = permanentUpgrades[key]
            const cost = getUpgradeCost(key, buyAmount)
            const canBuy = canPurchaseUpgrade(key, buyAmount)
            const bonusText =
              definition.effectType === 'productionAdditive'
                ? `+${formatValue(new Decimal(definition.value).times(level))} production multiplier`
                : definition.effectType === 'startingCredits'
                  ? `+${formatValue(new Decimal(definition.value).times(level))} starting credits`
                : definition.effectType === 'generatorCostDiscount'
                  ? `${formatValue(new Decimal(1).minus(new Decimal(definition.value).pow(level)).times(100))}% generator cost reduction`
                  : definition.effectType === 'upgradeRequirementDiscount'
                    ? `${formatValue(new Decimal(1).minus(new Decimal(definition.value).pow(level)).times(100))}% lower run-upgrade requirements`
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
                    onClick={() => onPurchaseUpgrade(key, buyAmount)}
                    disabled={!canBuy}
                  >
                    Buy {buyAmount}x
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
