# Epoch Foundry

This project is 100% AI-generated code and is being used as a practical testbed for different agentic coding practices.

Epoch Foundry is a mobile-first idle game focused on long-term progression through credit production, generator scaling, and upgrade optimization.

## What The Game Includes

- Single primary currency: `Credits`
- 10 generators with escalating costs and output
- Buy-amount controls for faster purchasing
- Upgrade tree with unlock requirements
- Prestige resets that grant persistent essence-based multipliers
- Achievements system with toast notifications
- Offline progression (capped, with upgrade extensions)
- Large-number formatting for very high-value progression

## Tech Stack

- React + TypeScript + Vite (SPA)
- Tailwind CSS v4
- shadcn/ui components
- `decimal.js` for gameplay numbers beyond JavaScript number limits
- IndexedDB save system (with schema/versioned handling in one storage layer)
- PWA support for iOS home-screen installation

## Run Locally

### Prerequisites

- Node.js 20+ (recommended)
- npm

### Install

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### Build Production Bundle

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Save Data

- Progress is stored locally in IndexedDB.
- Saves are automatic every 10 seconds and also triggered on page exit/visibility loss.
- Loading restores the latest valid state and applies offline progress immediately.

## Production Deploy

Live URL: [https://epoch-foundry.mattgibney.co.uk](https://epoch-foundry.mattgibney.co.uk)
