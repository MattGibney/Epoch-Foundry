import type Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import {
  LEGACY_UPGRADE_DEFS,
  getLegacyBranchLabel,
  getLegacyUpgradeBranchOrder,
  getLegacyUpgradeEffectSummary,
  getVisibleLegacyUpgradeBranchEntries,
  type LegacyUpgradeKey,
  type PurchasedLegacyUpgradesState,
} from '@/lib/game-engine'
import { cn } from '@/lib/utils'

interface AscensionScreenProps {
  currentShards: Decimal.Value
  ascensionGain: Decimal.Value
  totalAvailableShards: Decimal.Value
  remainingShards: Decimal.Value
  currentMultiplier: Decimal.Value
  projectedMultiplier: Decimal.Value
  purchasedLegacyUpgrades: PurchasedLegacyUpgradesState
  canPurchaseLegacyUpgrade: (key: LegacyUpgradeKey) => boolean
  getLegacyUpgradeProgressText: (key: LegacyUpgradeKey) => string | null
  onPurchaseLegacyUpgrade: (key: LegacyUpgradeKey) => void
  onResetChoices: () => void
  onConfirm: () => void
  formatValue: (value: Decimal.Value) => string
}

export function AscensionScreen({
  currentShards,
  ascensionGain,
  totalAvailableShards,
  remainingShards,
  currentMultiplier,
  projectedMultiplier,
  purchasedLegacyUpgrades,
  canPurchaseLegacyUpgrade,
  getLegacyUpgradeProgressText,
  onPurchaseLegacyUpgrade,
  onResetChoices,
  onConfirm,
  formatValue,
}: AscensionScreenProps) {
  return (
    <div className="space-y-6 pb-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ascension</h1>
        <p className="text-sm text-muted-foreground">
          Current-run credits convert into Shards. Previous runs determine your permanent boost.
        </p>
      </section>

      <section className="space-y-2 border-y border-border/70 py-4 text-sm">
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Current Shards</span>
          <span className="font-mono tabular-nums">{formatValue(currentShards)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Shards From This Run</span>
          <span className="font-mono tabular-nums">+{formatValue(ascensionGain)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Shards To Spend</span>
          <span className="font-mono tabular-nums">{formatValue(totalAvailableShards)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Shards Remaining</span>
          <span className="font-mono tabular-nums font-semibold">
            {formatValue(remainingShards)}
          </span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Current Permanent Boost</span>
          <span className="font-mono tabular-nums">x{formatValue(currentMultiplier)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Boost After Ascension</span>
          <span className="font-mono tabular-nums font-semibold">
            x{formatValue(projectedMultiplier)}
          </span>
        </p>
      </section>

      <section className="space-y-5">
        {getLegacyUpgradeBranchOrder().map((branch) => (
          <div key={branch} className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
                {getLegacyBranchLabel(branch)}
              </h2>
            </div>
            <div className="space-y-3">
              {getVisibleLegacyUpgradeBranchEntries(branch, purchasedLegacyUpgrades).map((key) => {
                const definition = LEGACY_UPGRADE_DEFS[key]
                const isPurchased = purchasedLegacyUpgrades[key]
                const lockText = getLegacyUpgradeProgressText(key)
                const canBuy = canPurchaseLegacyUpgrade(key)
                const statusText = isPurchased
                  ? 'Owned'
                  : lockText
                    ? lockText
                    : `${formatValue(definition.cost)} shards`

                return (
                  <article
                    key={key}
                    className={cn(
                      'rounded-xl border border-border/70 px-4 py-3',
                      isPurchased && 'border-border bg-muted/25',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="text-base font-semibold">{definition.label}</p>
                        <p className="text-sm text-muted-foreground">{definition.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {getLegacyUpgradeEffectSummary(key)}
                        </p>
                        <p className="text-xs text-muted-foreground">{statusText}</p>
                      </div>
                      <Button
                        size="sm"
                        className="h-9 min-w-[5rem] shrink-0"
                        variant={isPurchased ? 'outline' : 'default'}
                        disabled={isPurchased || !canBuy}
                        onClick={() => onPurchaseLegacyUpgrade(key)}
                      >
                        {isPurchased ? 'Owned' : 'Buy'}
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <Button size="sm" variant="outline" onClick={onResetChoices}>
          Reset Draft
        </Button>
        <Button size="sm" onClick={onConfirm}>
          Ascend
        </Button>
      </section>
    </div>
  )
}
