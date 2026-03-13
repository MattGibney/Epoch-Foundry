import { useEffect, useRef, useState } from 'react'
import type Decimal from 'decimal.js'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { ProducerListRowEntry } from './producer-list'

type PurchaseFeedbackIntensity = 'base' | 'surge' | 'burst'

function restartCssAnimation(element: HTMLElement | null, className: string): void {
  if (!element) {
    return
  }

  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
}

function getPurchaseFeedbackIntensity(delta: number): PurchaseFeedbackIntensity {
  if (delta >= 100) {
    return 'burst'
  }

  if (delta >= 10) {
    return 'surge'
  }

  return 'base'
}

interface ProducerListRowProps {
  entry: ProducerListRowEntry
  formatRenderedValue: (value: Decimal.Value) => string
}

export function ProducerListRow({
  entry,
  formatRenderedValue,
}: ProducerListRowProps) {
  const articleRef = useRef<HTMLElement | null>(null)
  const badgeRef = useRef<HTMLSpanElement | null>(null)
  const previousOwnedRef = useRef(entry.owned)
  const resetTimerRef = useRef<number | null>(null)
  const [purchaseDelta, setPurchaseDelta] = useState<number | null>(null)
  const [purchaseFeedbackSequence, setPurchaseFeedbackSequence] = useState(0)
  const purchaseFeedbackIntensity =
    purchaseDelta === null ? 'base' : getPurchaseFeedbackIntensity(purchaseDelta)

  useEffect(() => {
    const previousOwned = previousOwnedRef.current
    if (entry.owned > previousOwned) {
      const delta = entry.owned - previousOwned
      const intensity = getPurchaseFeedbackIntensity(delta)

      setPurchaseDelta(delta)
      setPurchaseFeedbackSequence((current) => current + 1)
      articleRef.current?.setAttribute('data-purchase-intensity', intensity)
      badgeRef.current?.setAttribute('data-purchase-intensity', intensity)
      restartCssAnimation(articleRef.current, 'producer-purchase-feedback')
      restartCssAnimation(badgeRef.current, 'producer-purchase-badge')

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = window.setTimeout(() => {
        setPurchaseDelta(null)
        resetTimerRef.current = null
      }, 720)
    }

    previousOwnedRef.current = entry.owned
  }, [entry.owned])

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  return (
    <article
      ref={articleRef}
      className="relative py-2"
      data-producer-entry-key={entry.key}
      data-purchase-intensity={purchaseFeedbackIntensity}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{entry.label}</h3>
            <div className="relative shrink-0">
              {purchaseDelta !== null ? (
                <span
                  key={purchaseFeedbackSequence}
                  className="producer-purchase-delta pointer-events-none absolute -top-4 right-0 font-mono text-[11px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400"
                  data-purchase-intensity={purchaseFeedbackIntensity}
                >
                  +{purchaseDelta}
                </span>
              ) : null}
              <span
                ref={badgeRef}
                className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground"
                data-purchase-intensity={purchaseFeedbackIntensity}
              >
                {entry.owned}
              </span>
            </div>
          </div>
          <p className="shrink-0 text-sm text-muted-foreground">
            +
            <span className="font-mono tabular-nums">
              {formatRenderedValue(entry.productionPerSecond)}
            </span>{' '}
            / sec
          </p>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {entry.description}
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm text-muted-foreground">
            Cost:{' '}
            <span className="font-mono tabular-nums">
              {formatRenderedValue(entry.cost)}
            </span>{' '}
            {entry.currencyLabel}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-75',
                entry.canAfford ? 'bg-foreground/70' : 'bg-muted-foreground/60',
              )}
              style={{ width: `${Math.max(0, entry.affordabilityPercent)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{entry.helperText}</div>
        </div>
        <div className="min-w-[5.5rem] shrink-0">
          <Button
            size="sm"
            className="h-10 min-w-[5.5rem] font-mono tabular-nums"
            disabled={entry.buttonDisabled ?? !entry.canAfford}
            onClick={entry.onAction}
          >
            {entry.buttonLabel}
          </Button>
        </div>
      </div>

      {entry.onFooterAction ? (
        <div className='mt-3 mb-1'>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-between text-xs font-medium text-foreground bg-muted/70"
            disabled={entry.footerActionDisabled ?? false}
            onClick={entry.onFooterAction}
          >
            <span>{entry.footerActionLabel ?? 'Open subsystem'}</span>
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
          </Button>
        </div>
      ) : null}
    </article>
  )
}
