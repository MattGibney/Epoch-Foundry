# Agent Notes

## Durable Working Guidance

- Keep this file (and related docs) updated when new durable guidance appears outside existing `AGENTS.md` files.
- Prefer high-level guidance over feature-specific notes that are obvious from code.
- When naming new threads, include the worktree ID as a prefix in square brackets.
- When debugging, first evaluate whether the issue is a symptom introduced by current changes before treating the immediate symptom directly.
- Use TypeScript as the default language for JavaScript-runtime code; avoid plain JavaScript source unless there is a specific exception.
- Prefer React over Preact for this project; minimizing bundle size is not a primary objective.
- All gameplay numeric values must support magnitudes beyond JavaScript `number` limits; use one shared big-number library consistently across engine, UI formatting, and persistence.
- Production URL: `https://epoch-foundry.mattgibney.co.uk`.
- Commits merged/pushed to `main` auto-deploy to production; treat `main` changes as release-impacting.
- Preserve PWA/iOS home-screen support (manifest, service worker registration, iOS web-app meta tags, and touch icons) so installed app behavior remains stable.
