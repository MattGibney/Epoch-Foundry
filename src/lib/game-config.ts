// Safe area is any viewport region not obscured by OS UI (e.g. status bar,
// Dynamic Island, and home indicator in standalone/PWA mode).
export const SAFE_AREA_INSETS = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
} as const
