import { useCallback, useEffect, useRef, useState } from 'react'

type RecentPurchaseMap<Key extends string> = Partial<Record<Key, true>>

export function useRecentPurchaseKeys<Key extends string>(durationMs = 720) {
  const timeoutIdsRef = useRef<Partial<Record<Key, number>>>({})
  const [recentPurchaseKeys, setRecentPurchaseKeys] = useState<RecentPurchaseMap<Key>>({})

  const markRecentlyPurchased = useCallback(
    (key: Key) => {
      setRecentPurchaseKeys((current) => ({ ...current, [key]: true }))

      const existingTimeoutId = timeoutIdsRef.current[key]
      if (existingTimeoutId !== undefined) {
        window.clearTimeout(existingTimeoutId)
      }

      timeoutIdsRef.current[key] = window.setTimeout(() => {
        setRecentPurchaseKeys((current) => {
          if (!current[key]) {
            return current
          }

          const next = { ...current }
          delete next[key]
          return next
        })
        delete timeoutIdsRef.current[key]
      }, durationMs)
    },
    [durationMs],
  )

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    return () => {
      for (const timeoutId of Object.values(timeoutIds)) {
        if (typeof timeoutId === 'number') {
          window.clearTimeout(timeoutId)
        }
      }
    }
  }, [])

  return {
    recentPurchaseKeys,
    markRecentlyPurchased,
  }
}
