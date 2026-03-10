# Epoch Foundry Roadmap

Detailed roadmap for rebuilding the game around a two-phase progression model:

- Phase one is a clean, low-complexity producer ladder with strong idle-game pacing fundamentals.
- Phase two begins after roughly `10-24` hours of progress and unlocks producer-specific subsystems.
- Later development layers additional interconnected systems so the game expands in depth instead of only adding bigger numbers.

## 1. Re-baseline the core economy around a strong phase-one loop

**Goal**

Establish a simple opening game where buying producers, hitting ownership milestones, and timing prestige already feel good without relying on later systems to rescue the pacing.

**Changes**

- Rework producer base costs, production values, and per-purchase growth so the early ladder supports low-complexity decisions, frequent unlocks, and predictable "next target" planning.
- Replace sparse producer upgrade ladders with deeper ownership breakpoint ladders that continue much further into the hundreds owned, so producers keep revealing new value instead of going flat after a few milestones.
- Revisit prestige so the first few resets are meaningfully transformational, not just small additive bumps. The reset should speed up the next run, unlock new planning options, and teach the player that resets are progression, not loss.
- Add balancing instrumentation and test fixtures so we can target specific cadence windows such as first meaningful prestige, first higher-tier producer breakout, and the `10-24` hour subsystem unlock point.

**Gameplay impact**

The first several hours should feel fast, legible, and satisfying. Players should regularly see a next producer, a next ownership milestone, or a next prestige target that clearly matters.

**Wider fit**

This is the foundation for everything else. If the base producer loop does not stand on its own, every future subsystem will feel like compensation for a weak core rather than an exciting expansion of the game.

## 2. Define the phase transition that unlocks the "real" game

**Goal**

Introduce a deliberate moment where the game shifts from straightforward producer growth into layered systems, without overwhelming the player too early.

**Changes**

- Add a named progression gate that unlocks after roughly `10-24` hours of normal play. This can be framed as an "operations expansion", "network awakening", or similar fiction-friendly transition.
- Tie the unlock to a clear achievement or prestige milestone so the player understands they have entered a new tier of play rather than merely opening another menu.
- Add transition UX: celebratory reveal, tutorial copy, "new systems available" callouts, and a persistent screen or hub where unlocked subsystems live.
- Ensure the unlock happens after the player has already learned the core producer and prestige language, so the new layer reads as escalation rather than correction.

**Gameplay impact**

Players get a memorable midpoint milestone. The game stops feeling like "buy more producers forever" and starts promising specialization, mastery, and longer-term planning.

**Wider fit**

This transition is the structural hinge for the whole roadmap. Every later system should either be unlocked by this moment or be a consequence of it.

## 3. Build a shared subsystem framework for producers

**Goal**

Create one reusable design and technical pattern for producer-specific subsystems before authoring bespoke versions for every producer.

**Changes**

- Define what every producer subsystem has in common: unlock rule, local state, upgrade slots or nodes, a small action space, a local output stat, and explicit hooks back into the main economy.
- Add a generalized data model and persistence shape for subsystem state so new subsystems can be added without bespoke engine plumbing each time.
- Decide how subsystem power feeds back into the core loop. Examples: local production multipliers, local cost discounts, burst windows, efficiency conversions, or milestone-triggered bonuses.
- Create shared UI patterns for subsystem navigation, status summaries, upgrade presentation, and "this is affecting producer X" feedback.

**Gameplay impact**

Subsystems will feel like a coherent second layer rather than twenty unrelated mini-games with different rules and unreadable impact.

**Wider fit**

This framework is what allows the game to grow for months without turning into a maintenance nightmare. It also keeps later inter-system features from requiring a rewrite.

## 4. Ship the first wave of producer subsystems

**Goal**

Prove the phase-two concept with a small but representative set of producer subsystems before expanding it across the entire ladder.

**Changes**

- Pick the first `3-5` producers that players interact with most and design distinct subsystem archetypes for them. Each one should boost that producer in a different way rather than repeating the same local upgrade tree.
- Keep the first wave intentionally compact. Each subsystem should be understandable within a few minutes, but still provide medium-term mastery over several sessions.
- Add milestone rewards inside each subsystem so local progress keeps paying out even before cross-system interactions exist.
- Tune the first wave so subsystem engagement noticeably changes the productivity of that specific producer, making the connection between effort and output immediately visible.

**Gameplay impact**

Phase two starts with novelty and identity. Players should feel that producers have personalities and that investing in a subsystem changes how they plan the rest of the run.

**Wider fit**

The first wave establishes the archetypes future subsystems can remix: passive optimizer, timing game, resource routing game, probabilistic booster, market-linked enhancer, and so on.

## 5. Expand producer subsystems across the full producer ladder

**Goal**

Turn subsystem design from a one-off feature into the main long-term content engine for the game.

**Changes**

- Roll subsystem support across the full producer roster in batches, prioritizing producers that anchor important breakpoints in the progression curve.
- Keep each subsystem mechanically distinct, but constrain them to the shared framework so the player can transfer knowledge from one system to the next.
- Add subsystem milestone ladders, local achievements, and UI summaries so players can compare the maturity of each producer's side-system at a glance.
- Introduce catch-up rules so late-unlocked subsystems are worth entering even if the player has already spent a long time in the current phase.

**Gameplay impact**

The game gains durable mid-game content. Owning a new producer no longer only means "another row with a higher number"; it means a new area of mastery and a new optimization puzzle.

**Wider fit**

Once every producer has a subsystem, the game has enough surface area to support cross-system features, seasonal content, and alternate build paths without depending on new producers alone.

## 6. Add cross-system interactions so subsystems play into one another

**Goal**

Move from isolated producer mini-games to a networked economy where decisions in one area affect another.

**Changes**

- Introduce explicit links between subsystems such as shared catalysts, conversion bonuses, demand/supply modifiers, or temporary buffs that can be generated in one subsystem and spent in another.
- Build system-to-system feedback loops carefully so the player can reason about them. Strong interactions are good; opaque interactions are not.
- Add summary surfaces that explain the current global state of subsystem bonuses and where the biggest leverage points are.
- Ensure the best play is not "ignore half the systems". Each subsystem should either feed another system or be fed by one.

**Gameplay impact**

The game starts to produce the "web of systems" feeling that keeps long-arc idle games interesting. Planning becomes about relationships, not just isolated purchases.

**Wider fit**

This is the layer that turns the game from a collection of features into a cohesive economy. It is also the prerequisite for market systems and more advanced prestige design.

## 7. Introduce a stock-market-style economic system

**Goal**

Add a medium-complexity market system that rewards observation, timing, and portfolio thinking without becoming mandatory busywork.

**Changes**

- Design a market with its own understandable inputs and outputs: tradable goods, volatility bands, production-linked pricing, and clear ways player behavior can influence or exploit it.
- Tie market instruments back to producers and subsystems so prices are not abstract. Producer performance, subsystem states, or world conditions should shape what the market is doing.
- Decide the role of the market in the wider economy. It should provide meaningful alternate progression vectors such as rare upgrade materials, temporary production boons, or prestige preparation advantages.
- Add safeguards against the market dominating the entire game. Passive players should still progress, while engaged players can extract extra value through skillful timing.

**Gameplay impact**

This creates a new style of play: not just building and upgrading, but reading economic conditions and deciding when to act. It introduces tension, timing, and memorable "good trade" moments.

**Wider fit**

The market becomes one of the anchor systems that other subsystems can feed into. It is a natural place for future events, special contracts, prestige modifiers, and advanced automation.

## 8. Layer in additional mini-games and specialist systems

**Goal**

Broaden the game's mid- and late-game identity beyond one flagship side-system.

**Changes**

- Add new mini-games and specialist systems one at a time, only after each one has a clear role in the economy. Candidate directions include logistics routing, research drafting, event forecasting, maintenance/overclock planning, and black-market trading.
- Give each new system a specific niche rather than another generic production multiplier source. Every system should answer "what kind of decision does this add that the game does not already have?"
- Introduce automation and assistive tooling only after the manual version of a system is fun, so automation becomes progression rather than a bandage over tedious play.
- Continue to tie new systems into the existing subsystem network so the overall game deepens instead of fragmenting.

**Gameplay impact**

Players keep receiving new forms of agency over time. The game can stay fresh for months because new systems change how the existing economy is played, not just how quickly numbers rise.

**Wider fit**

This is the content cadence layer. Once the framework is solid, new systems become the primary way to extend the game's lifespan without bloating the base loop.

## 9. Rebuild prestige around structural unlocks, not only multipliers

**Goal**

Make reset decisions feel as consequential as they do in the strongest long-arc idle games.

**Changes**

- Shift prestige rewards away from mostly numeric bumps and toward structural unlocks such as subsystem capacity, market access, automation slots, rule modifiers, or producer-specific permanent perks.
- Add prestige branches or packages so different reset strategies support different builds instead of converging on one obvious best spend order.
- Tie phase-two and later systems into prestige so resets change how the player approaches subsystems, not just how quickly base production climbs.
- Balance resets around multiple cadence bands: short resets for tactical gains, longer resets for structural unlocks, and eventual deep resets for major system expansion.

**Gameplay impact**

Prestige becomes exciting because it changes the shape of the next run. Players should look forward to a reset because it opens a new plan, not because it slightly improves old math.

**Wider fit**

This is what lets the game sustain a long lifespan. Once prestige touches systems, not just numbers, future content can slot into the reset structure cleanly.

## 10. Add balance telemetry, progression targets, and validation gates

**Goal**

Keep the expanding design shippable and tunable as complexity grows.

**Changes**

- Define target pacing windows for every stage of the roadmap: first prestige, phase-two unlock, first subsystem mastery beat, first market success, and later structural reset milestones.
- Build simulation tools and invariant tests for producer scaling, subsystem rewards, prestige yields, and save migration so each balance pass can be validated quickly.
- Add internal analytics hooks or debug summaries that show time-to-unlock estimates, dominant bonus sources, and dead-content detection.
- Gate each roadmap milestone behind explicit "fun and readability" checks, not just "feature exists" completion.

**Gameplay impact**

Players experience a smoother curve with fewer dead zones, fewer runaway exploits, and fewer systems that feel useless or mandatory.

**Wider fit**

Without this step, every future system increases the chance of balance collapse. With it, the roadmap becomes sustainable instead of speculative.

## Immediate sequencing recommendation

Implement these roadmap items in this order:

1. Re-baseline the core economy around a strong phase-one loop.
2. Define the phase transition that unlocks the "real" game.
3. Build a shared subsystem framework for producers.
4. Ship the first wave of producer subsystems.
5. Expand producer subsystems across the full producer ladder.
6. Add cross-system interactions so subsystems play into one another.
7. Introduce a stock-market-style economic system.
8. Rebuild prestige around structural unlocks, not only multipliers.
9. Layer in additional mini-games and specialist systems.
10. Add balance telemetry, progression targets, and validation gates continuously throughout.
