import type Decimal from 'decimal.js'
import type { ReactNode } from 'react'

import { ArrowLeft, Coins, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ResourceHeaderProps {
  contextLabel?: string
  contextValuePerSecond?: Decimal.Value
  label: string
  value: Decimal.Value
  valuePerSecond: Decimal.Value
  valueDetail?: ReactNode
  detailLabel?: string
  detailValue?: Decimal.Value
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  formatTopValueDisplay: (value: Decimal.Value) => string
  formatRenderedValue: (value: Decimal.Value) => string
  onAnchorRefChange: (element: HTMLElement | null) => void
}

export function ResourceHeader({
  contextLabel,
  contextValuePerSecond,
  label,
  value,
  valuePerSecond,
  valueDetail,
  detailLabel,
  detailValue,
  icon: Icon = Coins,
  actionLabel,
  onAction,
  formatTopValueDisplay,
  formatRenderedValue,
  onAnchorRefChange,
}: ResourceHeaderProps) {
  return (
    <section ref={onAnchorRefChange} className="pb-4">
      {contextLabel && contextValuePerSecond !== undefined ? (
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-border/70 pb-4">
          {onAction ? (
            <Button
              size="sm"
              variant="ghost"
              className="shrink-0 self-center"
              onClick={onAction}
            >
              <ArrowLeft className="size-4" aria-hidden />
              {actionLabel ?? 'Back'}
            </Button>
          ) : null}
          <article className="min-w-0 flex-1">
            <div className="flex flex-col items-end justify-start gap-0">
              <p className="text-sm font-semibold">{contextLabel}</p>
              <p className="text-xs text-muted-foreground">
                +
                <span className="font-mono tabular-nums">
                  {formatRenderedValue(contextValuePerSecond)}
                </span>{' '}
                / sec
              </p>
            </div>
          </article>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        {!contextLabel && onAction ? (
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 self-center"
            onClick={onAction}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {actionLabel ?? 'Back'}
          </Button>
        ) : null}
        <article className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Icon className="size-3.5 text-muted-foreground" aria-hidden />
            <span>{label}</span>
          </p>
          <p className="mt-1 text-3xl font-mono font-semibold tabular-nums">
            {formatTopValueDisplay(value)}
          </p>
        </article>
      </div>
      <article className="mt-2">
        <p className="text-sm text-muted-foreground">
          +
          <span className="font-mono tabular-nums">
            {formatRenderedValue(valuePerSecond)}
          </span>{' '}
          / sec
        </p>
        {valueDetail ? <div className="mt-1 text-sm text-muted-foreground">{valueDetail}</div> : null}
        {detailLabel && detailValue !== undefined ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {detailLabel}{' '}
            <span className="font-mono tabular-nums">
              +{formatRenderedValue(detailValue)}
            </span>{' '}
            / sec
          </p>
        ) : null}
      </article>
    </section>
  )
}
