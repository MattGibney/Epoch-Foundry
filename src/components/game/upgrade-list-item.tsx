import type { ReactNode } from 'react'

import { PurchaseFeedbackContainer } from '@/components/game/purchase-feedback-container'
import { Button } from '@/components/ui/button'

interface UpgradeListItemProps {
  itemKey: string
  itemDataAttributeName: string
  title: string
  description: string
  priceContent: ReactNode
  purchased: boolean
  canBuy: boolean
  onBuy: () => void
  unavailableContent: ReactNode
  recentlyPurchased?: boolean
  purchaseFeedbackLabel?: string
  purchaseFeedbackIntensityLevel?: 1 | 2 | 3
  purchaseFeedbackToken?: unknown
}

export function UpgradeListItem({
  itemKey,
  itemDataAttributeName,
  title,
  description,
  priceContent,
  purchased,
  canBuy,
  onBuy,
  unavailableContent,
  recentlyPurchased = false,
  purchaseFeedbackLabel = 'Bought',
  purchaseFeedbackIntensityLevel = 3,
  purchaseFeedbackToken,
}: UpgradeListItemProps) {
  return (
    <PurchaseFeedbackContainer
      as="article"
      className="relative overflow-hidden border-b border-border/70 py-4 first:pt-0"
      feedbackToken={purchaseFeedbackToken}
      intensityLevel={purchaseFeedbackIntensityLevel}
      {...{ [itemDataAttributeName]: itemKey }}
    >
      <div className="flex items-stretch justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{priceContent}</p>
        </div>
        <div className="relative w-36 shrink-0">
          {recentlyPurchased ? (
            <span
              className="producer-purchase-delta pointer-events-none absolute -top-4 right-0 font-mono text-[11px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400"
              data-purchase-feedback-intensity={purchaseFeedbackIntensityLevel}
            >
              {purchaseFeedbackLabel}
            </span>
          ) : null}
          <div className="h-full">
            {purchased ? (
              <div className="flex h-full items-center justify-end">
                <Button size="sm" className="h-10 min-w-[5.5rem]" variant="secondary" disabled>
                  Owned
                </Button>
              </div>
            ) : canBuy ? (
              <div className="flex h-full items-center justify-end">
                <Button size="sm" className="h-10 min-w-[5.5rem]" onClick={onBuy}>
                  Buy
                </Button>
              </div>
            ) : (
              unavailableContent
            )}
          </div>
        </div>
      </div>
    </PurchaseFeedbackContainer>
  )
}
