import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) {
      return
    }

    window.setInterval(() => {
      registration.update()
    }, 60_000)
  },
})

if (typeof window !== 'undefined') {
  window.__epochFoundryUpdateSW = updateSW
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
