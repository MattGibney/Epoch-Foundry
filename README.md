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

## Current MVP Slice

- A single total value that increases automatically over time.
- Exactly 10 multiplier options from `1x` to `10e12345x`, with much larger jumps between options.
- Larger multipliers render with larger button sizes.
- Selected multiplier controls generation rate per second.
- Number formatting switches to notation after `100,000,000` (for example `100T`, `50UvT`), with scientific fallback for extreme values.
- Autosave every 10 seconds.
- Save on tab/page exit.
- Restore previous state on load from `localStorage`.

## Save Format

The app stores one JSON save envelope in:

- `epochFoundry.save.main`

No Base64 encoding is used for runtime saves.
