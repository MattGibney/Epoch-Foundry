export const OFFLINE_PRODUCTION_TOAST_THRESHOLD_SECONDS = 5 * 60
export const UPDATE_FPS_BY_MODE = {
  slow: 4,
  medium: 12,
  fast: 30,
} as const

export type UpdateFrequencyMode = keyof typeof UPDATE_FPS_BY_MODE

export const TOP_CREDITS_SHORTHAND_THRESHOLD = '9.99e14'
