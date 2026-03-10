import type Decimal from 'decimal.js'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { ProducerListRowEntry } from './producer-list'

interface ProducerListRowProps {
  entry: ProducerListRowEntry
  formatRenderedValue: (value: Decimal.Value) => string
}

export function ProducerListRow({
  entry,
  formatRenderedValue,
}: ProducerListRowProps) {
  return (
    <article className='py-2'>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{entry.label}</h3>
            <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
              {entry.owned}
            </span>
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
