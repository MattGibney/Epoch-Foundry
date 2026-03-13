import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
} from 'react'

import { cn } from '@/lib/utils'

const ACTIVE_FEEDBACK_CLASS_NAME = 'purchase-feedback-container--active'

function restartCssAnimation(element: HTMLElement | null, className: string): void {
  if (!element) {
    return
  }

  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
}

type PurchaseFeedbackContainerProps<T extends ElementType = 'div'> = {
  as?: T
  children: ReactNode
  className?: string
  feedbackToken?: unknown
  intensityLevel?: 1 | 2 | 3
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function PurchaseFeedbackContainer<T extends ElementType = 'div'>({
  as,
  children,
  className,
  feedbackToken,
  intensityLevel = 1,
  ...props
}: PurchaseFeedbackContainerProps<T>) {
  const Comp = (as ?? 'div') as ElementType
  const containerRef = useRef<HTMLElement | null>(null)
  const previousFeedbackTokenRef = useRef(feedbackToken)

  useEffect(() => {
    const previousFeedbackToken = previousFeedbackTokenRef.current
    const hasTriggeredFeedback =
      feedbackToken !== undefined && feedbackToken !== null && feedbackToken !== false

    if (hasTriggeredFeedback && feedbackToken !== previousFeedbackToken) {
      restartCssAnimation(containerRef.current, ACTIVE_FEEDBACK_CLASS_NAME)
    }

    previousFeedbackTokenRef.current = feedbackToken
  }, [feedbackToken])

  return (
    <Comp
      ref={containerRef}
      className={cn('purchase-feedback-container', className)}
      data-purchase-feedback-intensity={intensityLevel}
      {...props}
    >
      {children}
    </Comp>
  )
}
