import { useEffect, useReducer, useRef } from 'react'

interface PresenceEntry<K extends string> {
  key: K
  isExiting: boolean
}

type PresenceAction<K extends string> =
  | {
      type: 'sync'
      keys: readonly K[]
    }
  | {
      type: 'remove'
      key: K
    }

function mergePresenceEntries<K extends string>(
  previousEntries: PresenceEntry<K>[],
  nextKeys: readonly K[],
): PresenceEntry<K>[] {
  const nextKeySet = new Set(nextKeys)
  const nextEntries = nextKeys.map((key) => ({ key, isExiting: false }))

  previousEntries.forEach((entry, index) => {
    if (nextKeySet.has(entry.key)) {
      return
    }

    nextEntries.splice(Math.min(index, nextEntries.length), 0, {
      key: entry.key,
      isExiting: true,
    })
  })

  return nextEntries
}

function presenceReducer<K extends string>(
  state: PresenceEntry<K>[],
  action: PresenceAction<K>,
): PresenceEntry<K>[] {
  if (action.type === 'sync') {
    const nextState = mergePresenceEntries(state, action.keys)

    if (
      state.length === nextState.length &&
      state.every(
        (entry, index) =>
          entry.key === nextState[index]?.key &&
          entry.isExiting === nextState[index]?.isExiting,
      )
    ) {
      return state
    }

    return nextState
  }

  const nextState = state.filter((entry) => entry.key !== action.key)
  return nextState.length === state.length ? state : nextState
}

export function useAnimatedPresenceKeys<K extends string>(
  keys: readonly K[],
  exitDurationMs = 240,
): PresenceEntry<K>[] {
  const [entries, dispatch] = useReducer(
    presenceReducer<K>,
    keys,
    (initialKeys) => initialKeys.map((key) => ({ key, isExiting: false })),
  )
  const previousKeysRef = useRef<readonly K[]>(keys)
  const timeoutIdsRef = useRef<Partial<Record<K, number>>>({})

  useEffect(() => {
    const nextKeySet = new Set(keys)
    const previousKeys = previousKeysRef.current

    keys.forEach((key) => {
      const existingTimeoutId = timeoutIdsRef.current[key]
      if (existingTimeoutId !== undefined) {
        window.clearTimeout(existingTimeoutId)
        delete timeoutIdsRef.current[key]
      }
    })

    const removedKeys = previousKeys.filter((key) => !nextKeySet.has(key))
    removedKeys.forEach((key) => {
      if (timeoutIdsRef.current[key] !== undefined) {
        return
      }

      timeoutIdsRef.current[key] = window.setTimeout(() => {
        dispatch({ type: 'remove', key })
        delete timeoutIdsRef.current[key]
      }, exitDurationMs)
    })

    dispatch({ type: 'sync', keys })
    previousKeysRef.current = keys
  }, [exitDurationMs, keys])

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current

    return () => {
      Object.keys(timeoutIds).forEach((key) => {
        const timeoutId = timeoutIds[key as K]
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId)
        }
      })
    }
  }, [])

  return entries
}
