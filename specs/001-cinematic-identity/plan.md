# Implementation Plan: Cinematic Identity

**Branch:** `feature/spec-kit-setup` | **Prepared:** 2026-10-01 | **Spec:** `spec.md`
**Status:** Draft for sign-off. No app packages or app directories have been created.

## Summary
One Next.js site, one client cinematic boundary, one scene progress authority, semantic server content. Milestone 2 creates the portrait matte and cinematic Hero. Milestone 3 adds the reversible Hero → About interval. Later scenes have their own specs/branches. No microservices, store library, CMS vendor or extra animation engine is scaffolded now.

## Technical Context
- Selected stack: Next.js App Router, TypeScript, Tailwind CSS, GSAP + ScrollTrigger.
- Proposed spatial implementation: direct Three.js, one batched particle field and two portrait-aligned planes; readable text/HUD in DOM/SVG. R3F remains an option, not an automatic second scene layer.
- npm stable versions inspected at setup: Next.js 16.3.8; React 19.3.0; TypeScript 7.0.2; Tailwind CSS 4.3.3; GSAP 3.15.0; Three.js 0.186.1. These are proposed version pins, not installed app dependencies. Re-check security/peer compatibility and create a lockfile when Milestone 2 is authorized.
- Current tooling: Node 26.7.0, npm 11.19.0; Next inspected engine requires Node ≥20.9.0. Existing Node is non-LTS; choose supported production runtime during deployment planning, without global installation now.
- Storage: validated local content JSON for prototype. CMS/auth/storage providers deferred, not waived.
- Target: modern Chromium, Firefox and Safari on desktop/tablet/phone. Real iOS/Android validation requires available devices; emulator results are not phone GPU proof.
- Tests: current phase uses a small Python contract/document check with local JSON Schema tooling. Future motion math tests use Node's test runner; browser/interaction/axe tests use a single project-local Playwright dev setup when authorized. No separate Jest/Vitest/Storybook stack by default.

## Constitution Check
Source fidelity, reversible control, meaningful 3D, semantic/accessibility fallbacks, validated locale boundaries and owner-gated branching are addressed in spec/design/data docs. Ratification remains pending. Tooling incident: first uv package install used the default shared cache; subsequent reinstall and validation dependency install explicitly use project-local cache. See `docs/tooling.md`; no assertion that the original outside-project cache write did not happen.

## Proposed Project Structure (not created now)
```text
src/app/layout.tsx                server document/lang/font shell
src/app/page.tsx                  validated content, semantic Hero/About
src/components/Journey.tsx        client lifecycle + scene boundary
src/components/Navigation.tsx     focus/tap/capsule state, stage selection
src/lib/content.ts               contract validation + locale projection
src/lib/journey.ts               shared progress/intro-handoff helpers
src/lib/scene.ts                 Three.js objects/materials/disposal
src/app/globals.css              approved token import + layout/fallbacks
public/assets/                   reviewed portrait derivatives only
content/en.json                  editorial snapshot (CMS-ready shape)
tests/                           small math/interaction regression checks
```
Start with these logical responsibilities; do not create empty files or component abstractions solely to match the tree. Add files only when a task needs them. Source identifiers/state values stay separate from localized headings.

## Animation and State Ownership
1. Server resolves and validates content, renders semantic DOM and real LCP portrait.
2. Journey client measures layout once after fonts/image decode, then creates source-aligned scene targets. Loading has a bounded fallback, not indefinite cinematic blocking.
3. Intro state: loading → entering → hunting → locked → unresolved → ready; an interrupt moves any active phase to resolving → ready. Repeated input during resolving updates pending scroll but does not start another resolve.
4. Only the intro owns shared targets before ready. On handoff it is killed, common endpoints settle, then one paused GSAP journey timeline reads ScrollTrigger progress. No callback must recreate irreversible geometry on stage entry.
5. One scroll-derived value updates camera/portrait crop/particle geometry/HUD/DOM transforms. Continuous decorative time is separate and cannot advance the narrative. React updates occur only for discrete state/stage changes.
6. Capsule expanded/focus state never writes progress. Stage selection animates the native scroll position through the same timeline using one cancellable scroll tween; real input cancels it.
7. Resize/font/locale layout changes capture progress, rebuild measured geometry, restore that progress and dispose the old context. Media assets keep source-normalized anchors.
8. Reduced-motion/no-JS/no-WebGL bypasses cinematic pinning and renders readable content/controls. Browser scroll restoration and #about initialize interactive state without replaying intro. No URL route is invented for unbuilt stages.

## Performance Verification Protocol (proposed approval gate)
60 FPS is a target on a declared 60Hz device, not an unconditional guarantee on unknown hardware. Before reporting success record CPU/GPU/RAM, browser/version, viewport/DPR/refresh, quality tier, power mode and build hash. Use production build, not dev mode. Agree a representative desktop and a real mid-range phone; missing real-device access blocks full performance approval, not the documentation phase.

- Record 3 runs each: full intro; 20 seconds repeated forward/reverse scrub; 10 stage-nav selections interrupted by wheel/touch; idle and hidden-tab behavior. Separate cold-load from warm animation traces. No invented trace results.
- Propose total frame budget 16.67ms at 60Hz; median cadence ~16.67ms, p95 frame interval ≤18ms, ≤1% dropped frames, no repeated >33.3ms stalls during steady interaction. Target own CPU+GPU work p95 ≤12ms to leave browser headroom. Report both browser trace frames and rAF cadence; rAF alone cannot prove GPU smoothness.
- High-refresh displays are tested separately and must not be labelled “60 FPS certified” from the wrong cadence. Device tiers reduce DPR/particle count/overdraw, not the story or control semantics. Do not silently replace 3D with DOM for capable devices.
- Starting budgets: DPR ≤1.5 desktop / 1.25 mobile; 1200/450 batched particles; ≤12 scene draw calls; no obligatory full-screen post-process. Texture quality is selected from real decode/memory/visual measurements.
- Proposed network budget: initial JS ≤250KiB gzip excluding deferred WebGL; total loaded scene code ≤450KiB gzip; portrait variant ≤250KiB; self-hosted fonts ≤120KiB. Measure emitted artifacts; if a selected stack exceeds a budget, show the report and revise deliberately rather than hiding bytes. No performance claim yet.
- Proposed public targets: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms; lab checks cannot prove field p75. RUM/analytics policy is a later explicit decision.

## Verification Commands
Current, runnable now from project root:
```bash
.tools/spec-kit-venv/Scripts/specify.exe version
bash .specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
.tools/spec-kit-venv/Scripts/python.exe scripts/check_specs.py
.tools/designmd/node_modules/.bin/designmd lint DESIGN.md
git -c safe.directory=D:/AI_Engineer/Portfolio diff --check
```
Future, **planned package scripts only**, not runnable until application initialization:
```bash
npm run dev
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run start
```
Define these scripts in Milestone 2; modern Next lint uses ESLint directly, not removed `next lint`. Browser tests cover each US, especially input handoff/hover independence/reversal; stage snapshots sample 0/25/50/75/100% after settling. Include reduced motion, JS-disabled, WebGL failure, resize, touch, keyboard and long-copy fixtures.

## Code Style and Boundaries
Typed small functions with explicit inputs, stable kebab-case data IDs, named PascalCase React components, semantic CSS tokens. Avoid global mutable state/frame-driven React updates and speculative adapters. The data-model doc includes a documentation-only TypeScript example.
- Always: validate content/assets, preserve sources, run checks, profile 3D, test keyboard/fallbacks and reverse before milestone review.
- Ask first: add packages/services, alter a selected stack, exceed a budget, change narrative choreography, upload assets or deploy.
- Never: implement before sign-off, merge without approval, commit credentials/caches, edit originals, fabricate metrics/URLs, install global Hermes skills or hijack native scrolling.

## Risks / Deferred Choices
Matte quality and face/crop alignment are high-risk and tested first. WebGL overdraw/thermal throttling need device measurements. Long text/layout changes need measured bounds. Navigation/intro races need deterministic tests. CMS/auth, hosting/domain costs, project order/URLs, extra socials, publications and Contact form are pending before their own milestone. Detailed sequencing/acceptance lives in `../../tasks/todo.md`; `tasks.md` links to it rather than duplicating task state.
