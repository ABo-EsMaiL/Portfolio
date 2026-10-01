# Portfolio project instructions

## Source authority
- `chatgpt-chat-2026-09-20.md` is the complete North Star; preserve the original.
- `AI & Machine Learning Engineer.pdf` backs all professional claims.
- Newer explicit owner decisions in `docs/phase-2-decisions.md` supersede older uncertainty.
- The raw portrait is the sole source image. Ghost/light/data-aura effects are engineered from scratch, not a missing approved image.

## Current authorization
Milestone 1 specifications, architecture, contracts, design tokens and state flow are explicitly owner-approved. Milestone 2 (T008–T013) is authorized on `feature/hero-section`: minimal runnable shell, offline portrait processing, spatial Hero/detection intro, independent capsule and accessibility fallbacks. Hero → About remains Milestone 3; do not implement it or merge Hero before owner review.

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
