# Epoch Foundry Roadmap

A simple, ordered feature roadmap for implementation.

## 1. Core Foundation

- [x] Project scaffold (Vite + React + TypeScript)
- [x] Deterministic tick simulation
- [x] Big-number support across engine/UI/save
- [x] Save/load pipeline with schema handling
- [x] Offline production calculation

## 2. Core Production Loop

- [x] Credits as the primary currency
- [x] Generator purchase and scaling formulas
- [x] Multiple generator tiers
- [x] Buy amount controls
- [x] Production screen with affordability/progress feedback

## 3. Upgrade System

- [x] Run upgrades with clear effects
- [x] Upgrade requirements and unlock gating
- [x] Upgrade chains where higher tiers depend on lower tiers
- [x] Upgrade grouping by category
- [x] Upgrade availability badge in navigation

## 4. Prestige Loop

- [x] Prestige/reset flow
- [x] Permanent multiplier from prestige currency
- [x] Prestige confirmation UI
- [x] Prestige stats and projected gain display

## 5. Progress Visibility

- [x] Stats screen (run + lifetime metrics)
- [x] All-reset credits produced tracking
- [x] Achievements system
- [x] Achievement unlock notifications
- [x] Large-number formatting and readability rules

## 6. Mobile UX and App Shell

- [x] PWA install support
- [x] Safe-area-aware layout for iOS home-screen usage
- [x] Bottom navigation with overflow drawer
- [x] Floating top status summary on scroll
- [x] Settings screen (refresh app, reset, toggles)

## 7. Content and Architecture Scaling

- [x] Progression pacing rebalance (cost curves + prestige gain tuning)
- [x] Move progression content to data-driven config tables with validation
- [ ] Add a "next meaningful goal" panel on Production
- [ ] Add economy invariant tests (tick math, prestige, save/load, unlock rules)

## 8. Upcoming Systems

- [ ] Contracts/objective layer
- [ ] Overclock burst ability
- [ ] Early automation rules
- [ ] Tree/keystone progression layer

## 9. Longer-Term Expansion

- [ ] Additional prestige layers
- [ ] Challenge/modifier runs
- [ ] Endgame progression systems
