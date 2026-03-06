# Agent Notes

## Durable Working Guidance

- Keep this file (and related docs) updated when new durable guidance appears outside existing `AGENTS.md` files.
- Prefer high-level guidance over feature-specific notes that are obvious from code.
- When naming new threads, include the worktree ID as a prefix in square brackets.
- When debugging, first evaluate whether the issue is a symptom introduced by current changes before treating the immediate symptom directly.
- Use TypeScript as the default language for JavaScript-runtime code; avoid plain JavaScript source unless there is a specific exception.
- Prefer React over Preact for this project; minimizing bundle size is not a primary objective.
- Prefer shadcn/ui components wherever possible for UI patterns (for example dialogs, forms, and actions) instead of ad-hoc custom elements.
- All gameplay numeric values must support magnitudes beyond JavaScript `number` limits; use one shared big-number library consistently across engine, UI formatting, and persistence.
- Production URL: `https://epoch-foundry.mattgibney.co.uk`.
- Commits merged/pushed to `main` auto-deploy to production; treat `main` changes as release-impacting.
- Preserve PWA/iOS home-screen support (manifest, service worker registration, iOS web-app meta tags, and touch icons) so installed app behavior remains stable.
- Include an in-app refresh/update control for installed PWA mode, since iOS home-screen apps do not expose normal browser refresh UI.
- Prefer mobile-first UI decisions and avoid unnecessary nested card/chrome containers; use spacing and simple dividers when a full card is not needed.
- Keep shadcn theme tokens/mappings in sync with the selected base theme so stateful component colors (for example `bg-input` on switches) render correctly.
- Keep `@/*` path alias configuration available in the root TypeScript config so shadcn CLI resolves `@/...` aliases to `src/...` paths correctly.
- Use monospace styling for all rendered numeric values in the game UI for readability and consistency.
- Avoid fixed-column navigation layouts on mobile; prefer patterns that scale with additional sections (for example a section switcher sheet/menu instead of dense tab rows).
- Keep primary navigation thumb-reachable on mobile (prefer bottom-anchored access patterns over top-only triggers).
