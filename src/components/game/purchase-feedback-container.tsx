import {
  type AnimationEvent,
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
  const { onAnimationEnd: externalOnAnimationEnd, ...restProps } = props as unknown as {
    onAnimationEnd?: (event: AnimationEvent<HTMLElement>) => void
  } & Omit<ComponentPropsWithoutRef<T>, 'onAnimationEnd'>
  const containerRef = useRef<HTMLElement | null>(null)
  const previousFeedbackTokenRef = useRef(feedbackToken)
  const resetTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const previousFeedbackToken = previousFeedbackTokenRef.current
    const hasTriggeredFeedback =
      feedbackToken !== undefined && feedbackToken !== null && feedbackToken !== false

    if (hasTriggeredFeedback && feedbackToken !== previousFeedbackToken) {
      restartCssAnimation(containerRef.current, ACTIVE_FEEDBACK_CLASS_NAME)

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = window.setTimeout(() => {
        containerRef.current?.classList.remove(ACTIVE_FEEDBACK_CLASS_NAME)
        resetTimerRef.current = null
      }, 240)
    }

    previousFeedbackTokenRef.current = feedbackToken
  }, [feedbackToken])

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const handleAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (
      event.target === event.currentTarget &&
      event.animationName === 'producer-purchase-flash'
    ) {
      event.currentTarget.classList.remove(ACTIVE_FEEDBACK_CLASS_NAME)

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = null
      }
    }

    externalOnAnimationEnd?.(event)
  }

  return (
    <Comp
      ref={containerRef}
      className={cn('purchase-feedback-container', className)}
      data-purchase-feedback-intensity={intensityLevel}
      onAnimationEnd={handleAnimationEnd}
      {...restProps}
    >
      {children}
    </Comp>
  )
}
