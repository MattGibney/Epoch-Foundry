/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare global {
  interface Window {
    __epochFoundryUpdateSW?: (reloadPage?: boolean) => Promise<void>
  }
}

export {}
