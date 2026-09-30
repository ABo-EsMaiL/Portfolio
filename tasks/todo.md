# Canonical Task List — Cinematic Identity

**Status:** Phase 2 preparation; application tasks remain unstarted until sign-off.
Each task has acceptance, verification, dependency and concrete files. Generated upstream Spec Kit scaffold is a tool initialization exception, not handwritten app boilerplate. Application slices touch no more than five files each; generated framework baseline must be separately reviewed.

## Milestone 1 — feature/spec-kit-setup

- [x] **T001 — Preserve baseline and initialize branches.**
  - Acceptance: source assets preserved; baseline on main; exact feature/spec-kit-setup current; no remote.
  - Verify: Git log/status/branch/remotes and source SHA-256 checks.
  - Depends: none. Files: source assets, .gitignore, README, Phase 1/2 decision docs (authorized baseline).
- [x] **T002 — Initialize official project-local Spec Kit.**
  - Acceptance: v1.0.13 installed locally; generic commands/scaffolding/workflow and independent feature identity verified; initial shared-cache incident documented.
  - Verify: CLI version/check/integration list/workflow list + feature path resolution.
  - Depends: T001. Files: generated .specify scaffold; docs/tooling.md; ignored .tools tooling.
- [x] **T003 — Specify functional behavior and creative treatment.**
  - Acceptance: scoped Hero/transition scenarios, reversibility/handoff/nav/fallback boundaries and proposal tokens; no template placeholders.
  - Verify: spec cross-links, requirement ID checks and DESIGN.md contrast lint.
  - Depends: T002. Files: spec.md, ui-ux.md, research.md, DESIGN.md, constitution.md.
- [x] **T004 — Specify validated locale-aware content.**
  - Acceptance: strict schema and CV-backed example; null assets explicitly unfinished; content/motion separated.
  - Verify: JSON Schema and semantic positive/negative cases in T006.
  - Depends: T003. Files: data-model.md, contracts/content.schema.json, contracts/content.example.json.
- [x] **T005 — Render architecture and review roadmap.**
  - Acceptance: offline component/state-flow diagram and Hero/About storyboard readable at desktop/mobile; no claim of finished Hero.
  - Verify: actual browser rendering + DOM overflow/text/network/console checks.
  - Depends: T003–T004. Files: docs/architecture-roadmap.html, docs/phase-2-review.md.
- [x] **T006 — Verify specs and preserve reproducibility.**
  - Acceptance: positive/negative contract checks, source hashes, link/placeholder/branch checks; design lint has no errors/warnings; token exports generated.
  - Verify: local check_specs.py, Spec Kit prerequisites, design CLI lint/export and git diff --check.
  - Depends: T004–T005. Files: scripts/check_specs.py, docs/tooling-lock.json, contracts/design.tokens.json, contracts/design.theme.css.
- [ ] **T007 — Owner approves Milestone 1 and authorizes merge.**
  - Acceptance: owner explicitly accepts proposal package and merge; no automatic merge.
  - Verify: recorded owner decision, checks remain green and main has approved changes only.
  - Depends: T006. Files: docs/phase-2-review.md, .specify/memory/constitution.md, specs status metadata.

## Milestone 2 — feature/hero-section (not started)

- [ ] **T008 — Establish the minimal runnable shell.**
  - Acceptance: approved stack/lockfile, English semantic content and readable fallback; no speculative CMS/services.
  - Verify: planned lint/typecheck/build + JS-disabled page test.
  - Depends: T007 and branch from approved main. Files: framework baseline (generated setup, separately reviewed), app/layout.tsx, app/page.tsx, globals.css, lib/content.ts, content/en.json.
- [ ] **T009 — Review portrait matte and measured anchors.**
  - Acceptance: source unchanged; transparent cutout with head/shoulder and upper-body framing; correct face/crop anchors; no remote upload/generative replacement.
  - Verify: 100% edge check on dark/light/checkerboard + source SHA + image dimensions/size + owner visual review.
  - Depends: T008. Files: controlled public/assets derivatives, portrait manifest, content/en.json (asset fields).
- [ ] **T010 — Build spatial Hero and semantic overlay.**
  - Acceptance: approved ghost/3D volume, professional natural face, responsive copy-left/portrait-right and light capsule; no per-frame React state.
  - Verify: renderer teardown/context-loss test, viewport screenshots and initial production trace.
  - Depends: T009. Files: Journey.tsx, scene.ts, globals.css, page.tsx.
- [ ] **T011 — Add intro and early-input handoff.**
  - Acceptance: ordered hunt/lock/uncertainty; exact owner copy; early input resolves once without lost progress or competing writers.
  - Verify: focused state tests + browser interruption at every intro phase; real wheel/touch/keyboard paths.
  - Depends: T010. Files: journey.ts, Journey.tsx, tests/journey.test.ts, tests/intro.spec.ts.
- [ ] **T012 — Add accessible capsule and fallback behavior.**
  - Acceptance: focus/tap/Escape equivalents; hover does not scrub; Hero socials in correct place; reduced-motion/no-WebGL/no-JS readable.
  - Verify: keyboard/axe/failure-mode/hover-progress browser checks.
  - Depends: T011. Files: Navigation.tsx, Journey.tsx, globals.css, tests/navigation.spec.ts, tests/fallbacks.spec.ts.
- [ ] **T013 — Review and approve Hero milestone.**
  - Acceptance: build/tests pass; real matte/Hero screenshots and declared-device traces meet approved targets or gaps disclosed; explicit approval before merge.
  - Verify: production build, full relevant tests and 3-run desktop/phone measurement protocol.
  - Depends: T012. Files: milestone review evidence; scene.ts/globals.css only if profiling justifies changes.

## Milestone 3 — feature/hero-about-transition (not started)

- [ ] **T014 — Add deterministic Hero → About geometry.**
  - Acceptance: same portrait source widens; HUD/aura/annotation generate About; stable seeded positions, no abrupt section replacement.
  - Verify: fixed-progress forward/reverse math checks and 0/25/50/75/100% screenshots.
  - Depends: T013 approved merge. Files: journey.ts, scene.ts, Journey.tsx, tests/journey.test.ts.
- [ ] **T015 — Bind About content and stage selection.**
  - Acceptance: truthful localized copy, social side-node transition and same-timeline interruptible stage navigation.
  - Verify: edit-copy fixture preserves stage IDs; nav cancellation/focus tests; no unimplemented stage links.
  - Depends: T014. Files: page.tsx, Navigation.tsx, content/en.json, globals.css, tests/navigation.spec.ts.
- [ ] **T016 — Verify reversal, layout rebuild and device performance.**
  - Acceptance: reverse restores narrative state; resize/refresh/scroll restoration/long-copy/reduced-motion paths work; measured frame targets met on declared hardware.
  - Verify: production traces and browser edge-case suite, not dev-mode estimates.
  - Depends: T015. Files: tests/transition.spec.ts, tests/fallbacks.spec.ts, milestone evidence.
- [ ] **T017 — Owner approves transition and authorizes merge.**
  - Acceptance: technical/visual evidence reviewed and explicit merge approval; only then specify Capabilities.
  - Verify: recorded sign-off, clean branch and passing checks.
  - Depends: T016. Files: milestone approval doc/spec status.
