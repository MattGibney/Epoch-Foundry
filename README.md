# Epoch Foundry

Minimal idle-game bootstrap built with:

- React + TypeScript + Vite (SPA)
- Tailwind CSS v4
- shadcn-style UI components

## Run

```bash
npm install
npm run dev
```

## iPhone Home Screen

- PWA manifest and service worker are configured.
- iOS web-app meta tags and `apple-touch-icon` are configured.
- For production behavior, test from the deployed URL and use Safari -> Share -> Add to Home Screen.

## Current MVP Slice

- Single-currency loop focused only on `Credits`.
- Generator ladder with 6 credit-producing tiers:
  - `Miners`
  - `Drills`
  - `Extractors`
  - `Refineries`
  - `Mega Rigs`
  - `Orbital Platforms`
- Bulk-buy controls (`1x`, `10x`, `100x`) and geometric generator pricing.
- Large upgrade list with unlock requirements and multiplicative production boosts.
- Stats panel with run/lifetime credit metrics.
- Settings panel with shadcn confirmation dialog for reset.
- Number formatting with suffix/scientific fallback for large values.
- Autosave every 10 seconds.
- Save on tab/page exit.
- Restore previous state on load from `localStorage`, including migration from legacy save shapes.

## Save Format

The app stores one JSON save envelope in:

- `epochFoundry.save.main`

No Base64 encoding is used for runtime saves.
