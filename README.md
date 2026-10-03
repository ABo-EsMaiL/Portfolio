# Ahmed Esmail — AI & Machine Learning Portfolio

A custom, camera-led portfolio: one persistent world, reversible transformations, real CV-backed content, and an engineered portrait/data aura.

## Current status

Milestone 1 is explicitly approved and merged into main at `e22ea4a` (local tag `milestone-1`). Both dark Milestone 2 aesthetics were rejected; the latest twilight/latent-space Hero is running on `feature/hero-section`. See [current art-direction review](docs/hero-twilight-review.md); the [prior cinematic revision](docs/hero-art-direction-review.md) and [previous technical review](docs/hero-milestone-review.md) are historical. Trace/CDP investigation is paused by owner direction. No Hero merge or Milestone 3 implementation is authorized yet.

- Stack: Next.js App Router + TypeScript + Tailwind CSS; GSAP + ScrollTrigger.
- Detection: visual illusion, not client-side machine learning inference.
- Rendering: semantic DOM plus spatial WebGL where the composition calls for it.
- Language: English first, i18n-ready boundaries.
- Workflow: milestone branches; technical/visual checks and owner approval before merge.

## Source assets

- `chatgpt-chat-2026-09-20.md` — complete North Star conversation.
- `AI & Machine Learning Engineer.pdf` — professional source of truth.
- `Picsart_26-07-31_23-36-42-453.jpg.jpeg` — sole portrait source.

See `AGENTS.md`, `docs/phase-1-analysis.md` and `docs/phase-2-decisions.md`.

## Specification review package

Start with [Phase 2 review](docs/phase-2-review.md) and the offline [architecture/state-flow/visual roadmap](docs/architecture-roadmap.html).

- [Functional spec](specs/001-cinematic-identity/spec.md)
- [Design tokens](DESIGN.md) and [composition/choreography](specs/001-cinematic-identity/ui-ux.md)
- [Data contract](specs/001-cinematic-identity/data-model.md)
- [Implementation plan](specs/001-cinematic-identity/plan.md) and [milestone roadmap](tasks/plan.md)
- [Runnable checks](specs/001-cinematic-identity/quickstart.md) and [tooling provenance/boundary disclosure](docs/tooling.md)

The specification package is owner-approved. See [recorded approval](docs/milestone-1-approval.md). The Phase 2 review remains historical evidence of the pre-implementation checks.

Run `npm run dev` locally. Production verification uses `npm run build` then `npm run start`. Checks: `npm run test:unit`, `npm run typecheck`, `npm run lint`, `.tools/spec-kit-venv/Scripts/python.exe scripts/check_specs.py --hero`; start the local server before `npm run test:e2e`. npm cache is project-local; browser tests use installed Edge. No CMS, remote repository or deployment exists.
