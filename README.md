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

- Resource loop with `Credits`, `Components`, `Research`, and `Influence`.
- Generator ladder with 3 tiers: `Miners`, `Refiners`, `Labs`.
- Bulk-buy controls (`1x`, `10x`, `100x`) and geometric generator pricing.
- Run upgrades panel (`Improved Drills`, `Precision Refining`, `Neural Lab Cores`).
- Tree panel (`Industry`, `Automation`, `Chronotech`) purchased with Influence.
- Overclock ability (3x production burst with cooldown).
- Contract system with rotating goals and rewards.
- Reboot prestige panel with Influence projection and reset flow.
- Stats panel with run/lifetime metrics and contract completion count.
- Number formatting with suffix/scientific fallback for large values.
- Autosave every 10 seconds.
- Save on tab/page exit.
- Restore previous state on load from `localStorage`, including migration from legacy save shape.

## Save Format

The app stores one JSON save envelope in:

- `epochFoundry.save.main`

No Base64 encoding is used for runtime saves.
