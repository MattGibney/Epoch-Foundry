import type Decimal from 'decimal.js'

import { Coins } from 'lucide-react'

interface CreditsHeaderProps {
  credits: Decimal.Value
  creditsPerSecond: Decimal.Value
  formatTopCreditsDisplay: (value: Decimal.Value) => string
  formatRenderedCredits: (value: Decimal.Value) => string
  onAnchorRefChange: (element: HTMLElement | null) => void
}

export function CreditsHeader({
  credits,
  creditsPerSecond,
  formatTopCreditsDisplay,
  formatRenderedCredits,
  onAnchorRefChange,
}: CreditsHeaderProps) {
  return (
    <section ref={onAnchorRefChange} className="pb-4">
      <article>
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <Coins className="size-3.5 text-muted-foreground" aria-hidden />
          <span>Credits</span>
        </p>
        <p className="mt-1 text-3xl font-mono font-semibold tabular-nums">
          {formatTopCreditsDisplay(credits)}
        </p>
      </article>
      <article className="mt-2">
        <p className="text-sm text-muted-foreground">
          +
          <span className="font-mono tabular-nums">
            {formatRenderedCredits(creditsPerSecond)}
          </span>{' '}
          / sec
        </p>
      </article>
    </section>
  )
}
