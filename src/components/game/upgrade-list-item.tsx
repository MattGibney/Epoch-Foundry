import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

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
  purchaseFeedbackIntensityLevel?: 1 | 2 | 3
  purchaseFeedbackToken?: unknown
  isExiting?: boolean
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
  purchaseFeedbackIntensityLevel = 3,
  purchaseFeedbackToken,
  isExiting = false,
}: UpgradeListItemProps) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-[240ms] ease-out first:[&_article]:pt-0',
        isExiting
          ? 'grid-rows-[0fr] overflow-hidden opacity-0 pointer-events-none'
          : 'grid-rows-[1fr] overflow-visible opacity-100',
      )}
    >
      <div className="min-h-0 overflow-visible">
        <PurchaseFeedbackContainer
          as="article"
          className="relative overflow-hidden border-b border-border/70 py-4"
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
            <div className="w-36 shrink-0">
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
      </div>
    </div>
  )
}
