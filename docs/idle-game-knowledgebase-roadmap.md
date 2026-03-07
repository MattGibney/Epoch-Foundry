# Epoch Foundry Knowledgebase

Knowledgebase for building a long-arc idle game with upgrade trees and layered prestige.

## 1. Document Purpose

This document is the source of truth for:

- [ ] Core design decisions.
- [ ] MVP scope and acceptance criteria.
- [ ] Build order to ship a playable version quickly.
- [ ] Post-MVP content roadmap toward a 12-month play arc.

## 2. Product Vision

### 2.1 Player Fantasy

The player runs a self-scaling industrial empire across collapsing timelines. Each reset is strategic and unlocks permanent capabilities, not just raw multipliers.

### 2.2 Design Pillars

- [ ] Strategic resets: prestige is a meaningful choice, not a forced tax.
- [ ] Build identity: mutually exclusive tree keystones create different run styles.
- [ ] Always-progressing: every run contributes to at least one permanent system.
- [ ] Long arc: fresh goals for 12 months via layered systems and content cadence.
- [ ] Idle-first interaction: progression is primarily passive simulation, not click-to-generate.

### 2.3 Session Targets

- [ ] Active loop: meaningful actions every 15-60 seconds.
- [ ] Mid-session planning: every 10-20 minutes.
- [ ] Long horizon decisions: every 1-3 days.
- [ ] Offline value: sessions should still feel rewarding after 8-24 hours away.

## 3. Core Game Knowledgebase

## 3.1 Currencies

- [x] `Credits`: primary spend resource; generated continuously.
- [ ] `Components`: crafted currency for progression gates.
- [ ] `Research`: earned from milestones/contracts; spent in upgrade trees.
- [ ] `Influence`: first prestige currency (from Reboot).
- [ ] `Epoch Shards`: deep prestige currency (post-MVP layer).

## 3.2 Generator Ladder (MVP baseline)

- [x] Tier 1: `Miners` -> produce Credits.
- [ ] Tier 2: `Refiners` -> consume Credits to produce Components.
- [ ] Tier 3: `Labs` -> consume Components to produce Research.
- [ ] Tier 4 (optional in MVP): `Directives` -> temporary buffs and contracts acceleration.

Design intent: each tier introduces a new bottleneck, forcing ratio decisions instead of pure linear buying.

## 3.3 Core Actions

- [x] Buy generator units.
- [x] Buy run upgrades (non-permanent).
- [ ] Trigger `Overclock` (timed production burst with cooldown).
- [ ] Complete contracts for burst rewards.
- [x] Reboot (prestige) for Influence and permanent progression.

## 3.4 Upgrade Trees

MVP includes 3 trees:

- [ ] `Industry`: production multipliers and generator efficiency.
- [ ] `Automation`: autobuy, auto-contract, priority rules.
- [ ] `Chronotech`: prestige gain and post-reboot acceleration.

Post-MVP trees:

- [ ] `Logistics`: costs/offline efficiency.
- [ ] `Speculation`: volatility and risk-reward scaling.

### Keystone Rule

Each tree eventually provides one keystone that is mutually exclusive with sibling keystones in that tree, locking in run identity.

## 3.5 Prestige Layers

### Layer 1 (MVP): Reboot

- [x] Resets run resources and run upgrades.
- [ ] Keeps permanent tree unlocks and Influence upgrades.
- [ ] Typical cadence target: every 1-6 hours.

### Layer 2 (Post-MVP): Acquisition

- [ ] Resets Reboot progression.
- [ ] Grants long-term structural bonuses (automation slots, global modifiers).
- [ ] Cadence target: every 2-7 days.

### Layer 3 (Post-MVP): Timeline Collapse

- [ ] Broad reset with major meta unlocks via Epoch Shards.
- [ ] Cadence target: every 2-6 weeks.

## 3.6 Offline Progress Rules

- [ ] Baseline offline cap: 12 hours (MVP).
- [ ] Upgradeable cap post-MVP: up to 72 hours.
- [ ] Formula: offline gains use a reduced effectiveness coefficient (start at 70%).
- [ ] Catch-up mechanic: temporary gain bonus after long inactivity.

## 3.7 Progression Philosophy

- [ ] Early game: fast unlocks, low complexity, frequent dopamine.
- [ ] Mid game: ratio optimization and choice friction.
- [ ] Late game: build planning and prestige timing depth.
- [ ] No dead states: player can always recover from weak choices through reset value.

## 4. MVP Definition

## 4.1 MVP Goal

Ship a stable vertical slice that proves:

- [ ] Core idle loop feels good for multiple days.
- [ ] First prestige loop is satisfying.
- [ ] Upgrade tree decisions are meaningful.
- [ ] Automation reduces repetitive clicking without trivializing strategy.

## 4.2 In Scope (MVP)

- [ ] 3 resources: Credits, Components, Research.
- [ ] 3 generator tiers (Miners, Refiners, Labs).
- [ ] Run upgrades + 3 permanent trees (Industry/Automation/Chronotech).
- [ ] Reboot prestige with Influence currency.
- [ ] Contracts system (simple rotating objectives).
- [ ] Overclock burst action with cooldown.
- [ ] Offline progress (12-hour cap).
- [ ] Save/load subsystem optimized for mobile web (localStorage, versioned schema, backup slot).
- [ ] Basic balancing table with tunable JSON.
- [ ] Minimal UI with 5 screens/panels:
  - [ ] Main production
  - [ ] Upgrades
  - [ ] Trees
  - [ ] Prestige
  - [ ] Stats/log

## 4.3 Out of Scope (MVP)

- [ ] Acquisition and Timeline Collapse layers.
- [ ] Seasonal/weekly modifiers.
- [ ] Social systems, cloud sync, leaderboards.
- [ ] Heavy narrative/lore.
- [ ] Mobile app packaging (web-first is enough for validation).

## 4.4 MVP Success Criteria

- [ ] Player can reach first Reboot within 45-120 minutes.
- [ ] Reboot 2 is at least 2.5x faster than Reboot 1 with good choices.
- [ ] Player has at least 2 viable early builds (e.g., Industry-heavy vs Automation-heavy).
- [ ] Offline return session always provides meaningful gains.
- [ ] Save integrity survives refresh and version migration on test data.

## 5. Technical Architecture (MVP)

## 5.1 Recommended Stack

- [x] Frontend: React + TypeScript.
- [ ] State: deterministic store (Zustand/Redux-style).
- [x] Numbers: decimal library or fixed scientific notation utility.
- [ ] Persistence: localStorage with plain JSON (no Base64), explicit schema versioning, and backup recovery.
- [ ] Content tuning: data-driven JSON tables in `/content`.

## 5.2 Data Model (High-Level)

- [ ] `PlayerState`
  - [ ] resources
  - [ ] generators
  - [ ] runUpgrades
  - [ ] treeNodes
  - [ ] prestige
  - [ ] automationConfig
  - [ ] cooldowns
  - [ ] contracts
  - [ ] stats
  - [ ] meta (version, lastSaveAt)

- [ ] `ContentTables`
  - [ ] generators.json
  - [ ] upgrades.json
  - [ ] treeNodes.json
  - [ ] prestige.json
  - [ ] contracts.json
  - [ ] balanceConstants.json

## 5.3 Engine Loop

- [ ] Tick interval: 100-250ms simulation step.
- [x] Use delta-time accumulation for idle consistency.
- [x] Clamp large deltas to prevent runaway jumps.
- [x] Save cadence: every 10-20 seconds plus lifecycle events.

## 5.4 Balancing Controls

Expose these for fast tuning:

- [ ] Generator base cost, growth exponent, base output.
- [ ] Resource conversion ratios.
- [ ] Overclock multiplier and cooldown.
- [ ] Reboot Influence formula coefficients.
- [ ] Offline effectiveness coefficient and cap.

## 5.5 Save System Spec (MVP)

### Goals

- [ ] Fast write path on mobile browsers.
- [ ] Fast cold-load and restore path.
- [ ] Strong resilience to corrupted or partial saves.
- [ ] Smooth forward evolution through schema migrations.

### Storage Decision

- [ ] Primary format: plain JSON string in `localStorage`.
- [ ] Explicitly do not Base64-encode runtime saves, because:
  - [ ] Base64 adds payload overhead.
  - [ ] Encode/decode cost adds avoidable CPU work.
  - [ ] Obfuscation is not required for single-player local use.

### Keys

- [ ] `epochFoundry.save.main`
- [ ] `epochFoundry.save.backup`
- [ ] `epochFoundry.save.meta`

`meta` tracks quick info for diagnostics and boot decisions (last success timestamp, save size, schema version).

### Save Envelope (v1)

```json
{
  "format": "epoch-foundry-save",
  "schemaVersion": 1,
  "savedAtMs": 1772800000000,
  "playtimeMs": 12345678,
  "checksum": "fnv1a32:9f34ab12",
  "state": {
    "resources": {},
    "generators": {},
    "runUpgrades": {},
    "treeNodes": {},
    "prestige": {},
    "automationConfig": {},
    "cooldowns": {},
    "contracts": {},
    "stats": {},
    "meta": {}
  }
}
```

### Serialization Rules

- [ ] Save only canonical state.
- [ ] Do not save derived/transient values (`perSecond`, cached UI values, memoized selectors).
- [ ] Keep logs bounded (ring buffers) to prevent unbounded payload growth.
- [ ] Keep numbers in a deterministic representation (string for big-number values if required by number library).

### Write Strategy

1. Track `isDirty` in state.
2. Autosave every 15 seconds only if dirty.
3. Force save on lifecycle events: `visibilitychange`, `pagehide`, manual save action.
4. Use throttled "critical action" saves (e.g., every 2 seconds max) for prestige/reset events.
5. Write `main` every save; write `backup` every N saves (recommend N=10) or immediately after prestige.
6. Update `meta` only after successful main write.

### Load Strategy

1. Read and parse `main`.
2. Validate `format`, `schemaVersion`, required fields, and checksum.
3. If validation fails, attempt `backup`.
4. If both fail, initialize default fresh state.
5. Run migrations from save schema to current schema before hydration.
6. Apply offline progress using `savedAtMs` after hydration.

### Migration Policy

- [ ] Each schema change increments `schemaVersion`.
- [ ] Maintain sequential migration functions (`v1->v2`, `v2->v3`, etc.).
- [ ] Migrations must be pure and idempotent on valid input.
- [ ] Never silently drop unknown top-level fields during migration; preserve unless intentionally removed.

### Integrity and Recovery

- [ ] Checksum guards against malformed/truncated blobs.
- [ ] Keep last-known-good backup slot.
- [ ] On failed load, surface non-blocking warning and continue with backup/default state.
- [ ] Include a developer "export save" and "import save" for manual recovery/testing.

### Performance Targets (MVP)

- [ ] Save payload target: under 200 KB typical, hard alert at 500 KB.
- [ ] `JSON.stringify + setItem` p95: under 25 ms on mid-range mobile.
- [ ] Cold load parse + validate + hydrate p95: under 50 ms.
- [ ] Offline simulation on boot: capped by existing offline cap to avoid long blocking startup.

## 6. Content and Balancing Starter Values

Numbers below are starting points for iteration, not final values.

- [ ] Miners cost growth exponent: `1.15`.
- [ ] Refiners cost growth exponent: `1.18`.
- [ ] Labs cost growth exponent: `1.21`.
- [ ] Overclock: `x3 production for 20s`, `180s cooldown`.
- [ ] Reboot requirement baseline: `1e6 Credits equivalent`.
- [ ] Reboot Influence gain: floor of scaled log reward.
- [ ] Offline effectiveness: `0.7`.

Balancing process:

1. Simulate no-click baseline.
2. Simulate optimal active play.
3. Tune so first Reboot lands in target window.
4. Validate that each tree has at least one strong early node.


## 7. Roadmap Reference

Roadmap planning has been split into a dedicated document:

- [ ] [Idle Game Roadmap](./idle-game-roadmap.md)
