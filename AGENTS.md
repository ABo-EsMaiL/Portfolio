# Portfolio project instructions

## Source authority
- `chatgpt-chat-2026-09-20.md` is the complete North Star; preserve the original.
- `AI & Machine Learning Engineer.pdf` backs all professional claims.
- Newer explicit owner decisions in `docs/phase-2-decisions.md` supersede older uncertainty.
- The raw portrait is the sole source image. Ghost/light/data-aura effects are engineered from scratch, not a missing approved image.

## Current authorization
Milestone 1 specifications, architecture, contracts, design tokens and state flow are explicitly owner-approved. Milestone 2 (T008–T013) is authorized on `feature/hero-section`: minimal runnable shell, offline portrait processing, spatial Hero/detection intro, independent capsule and accessibility fallbacks. Newer explicit owner approval extends the next unmerged review prototype through Hero → About, dual navigation and initial skill-pulse cables; see `docs/owner-narrative-alignment.md`. This is not Milestone 3 acceptance or authorization to merge Hero, deploy, or implement the later Skills/Experience/Projects/Contact stages.

## Stack and motion
Next.js App Router + TypeScript + Tailwind CSS; GSAP + ScrollTrigger. Spatial WebGL is allowed and must not be arbitrarily reduced to DOM-only. Detection is an illusion with no client ML model. Separate the automatic intro from the visitor-controlled, reversible journey. Capsule hover/expansion must not scrub the world. English first; content/locale/layout boundaries must allow future Arabic without rewriting motion.

## Workflow and boundaries
- Milestone 1 is merged into `main`; current milestone is `feature/hero-section`. Approval is recorded in `docs/milestone-1-approval.md`.
- Every milestone/component is isolated on a feature branch. Technical checks, visual verification and explicit owner approval precede merge.
- No remote/push/deployment or global PATH/config/profile/skill modifications are authorized.
- Developer tools, model downloads and caches stay inside `.tools/`; application dependencies use ignored project-local `node_modules/`. Never commit them, credentials or application build output. Temporary work stays in project `tmp/`.
- Owner permits a reusable project-local skill, not changes to global Hermes profiles/skills.
- Native Spec Kit Hermes integration writes globally; use the official generic integration at `.specify/commands` instead.
- Official Spec Kit artifacts live in `specs/001-cinematic-identity/`; `DESIGN.md` owns tokens; `tasks/plan.md` indexes milestones and `tasks/todo.md` owns task tracking.

## Quality
Ponytail full: existing/native capabilities first, minimal justified dependencies, no speculative services. Never remove validation, accessibility or requested 3D to simplify. One animation authority; no React state updates per frame. Demonstrate performance with real traces on declared hardware. No fabricated project URLs, metrics or professional claims.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
