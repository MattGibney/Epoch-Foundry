import { useState, type ReactNode } from 'react'
import type Decimal from 'decimal.js'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BUY_AMOUNT_OPTIONS } from '@/lib/game-engine'
import { cn } from '@/lib/utils'

import { ProducerListRow } from './producer-list-row'

export interface ProducerListGhostEntry {
  key: string
  type: 'ghost'
  title?: string
  description: string
}

export interface ProducerListRowEntry {
  key: string
  type?: 'producer'
  label: string
  description: string
  owned: number
  productionPerSecond: Decimal.Value
  cost: Decimal.Value
  currencyLabel: string
  canAfford: boolean
  affordabilityPercent: number
  helperText: ReactNode
  buttonLabel: string
  buttonDisabled?: boolean
  onAction: () => void
  footerActionLabel?: string
  footerActionDisabled?: boolean
  onFooterAction?: () => void
}

export type ProducerListEntry = ProducerListGhostEntry | ProducerListRowEntry

interface ProducerListProps {
  buyAmount: number
  onBuyAmountChange: (amount: number) => void
  formatRenderedValue: (value: Decimal.Value) => string
  entries: ProducerListEntry[]
}

export function ProducerList({
  buyAmount,
  onBuyAmountChange,
  formatRenderedValue,
  entries,
}: ProducerListProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <section className="border-b border-border/70 pb-3">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setIsOptionsOpen((current) => !current)}
          aria-expanded={isOptionsOpen}
          aria-controls="producer-options-panel"
        >
          <span className="text-sm font-semibold">Options</span>
          <ChevronDown
            className={cn(
              'size-4 text-muted-foreground transition-transform',
              isOptionsOpen && 'rotate-180',
            )}
            aria-hidden
          />
        </button>
        <div
          id="producer-options-panel"
          className={cn(
            'grid overflow-hidden transition-all duration-200 ease-out',
            isOptionsOpen ? 'grid-rows-[1fr] opacity-100 pt-3' : 'grid-rows-[0fr] opacity-0 pt-0',
          )}
        >
          <div className="min-h-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Buy amount</p>
              <div
                className="inline-flex items-center overflow-hidden rounded-md border border-border"
                role="group"
                aria-label="Buy amount"
              >
                {BUY_AMOUNT_OPTIONS.map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant={buyAmount === amount ? 'default' : 'ghost'}
                    className="h-7 rounded-none border-0 border-r border-border px-2 text-xs last:border-r-0"
                    onClick={() => onBuyAmountChange(amount)}
                  >
                    <span className="font-mono text-xs tabular-nums">{amount}x</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="divide-y divide-border/70">
        {entries.map((entry) => {
          if (entry.type === 'ghost') {
            return (
              <article key={entry.key} className="py-4 first:pt-0">
                <div className="space-y-2 blur-[1px]">
                  <p className="text-base font-semibold text-muted-foreground/70">
                    {entry.title ?? 'Unknown Producer'}
                  </p>
                  <p className="text-sm text-muted-foreground/70">{entry.description}</p>
                </div>
              </article>
            )
          }

          return (
            <ProducerListRow
              key={entry.key}
              entry={entry}
              formatRenderedValue={formatRenderedValue}
            />
          )
        })}
      </section>
    </div>
  )
}
