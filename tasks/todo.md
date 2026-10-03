# Canonical Task List — Cinematic Identity

**Status:** Milestone 1 approved and merged; Milestone 2 authorized on `feature/hero-section`. Owner explicitly extends the next unmerged review through Hero → About. Merge and formal milestone acceptance remain gated. The combined-review tasks below supersede rejected visual/choreography assumptions in historical progress notes.
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
- [x] **T007 — Owner approves Milestone 1 and authorizes merge.**
  - Acceptance: owner explicitly accepts proposal package and merge; no automatic merge.
  - Verify: recorded owner decision, checks remain green and main has approved changes only.
  - Depends: T006. Files: docs/phase-2-review.md, .specify/memory/constitution.md, specs status metadata.

## Milestone 2 — feature/hero-section (in progress)

- [x] **T008 — Establish the minimal runnable shell.**
  - Acceptance: approved stack/lockfile, English semantic content and readable fallback; no speculative CMS/services.
  - Verify: planned lint/typecheck/build + JS-disabled page test.
  - Depends: T007 and branch from approved main. Files: framework baseline (generated setup, separately reviewed), app/layout.tsx, app/page.tsx, globals.css, lib/content.ts, content/en.json.
- [ ] **T009 — Review portrait matte and measured anchors.**
  - Progress: full parent inference/matting rerun now succeeds after releasing the unused ORT arena before the sparse solver; all six derivatives and manifest are byte-identical to the reviewed archive. Measured anchors/source/RGB/edge checks complete; owner visual approval pending. Evidence: `../docs/portrait-verification.md`.
  - Acceptance: source unchanged; transparent cutout with head/shoulder and upper-body framing; correct face/crop anchors; no remote upload/generative replacement.
  - Verify: 100% edge check on dark/light/checkerboard + source SHA + image dimensions/size + owner visual review.
  - Depends: T008. Files: controlled public/assets derivatives, portrait manifest, content/en.json (asset fields).
- [ ] **T010 — Build spatial Hero and semantic overlay.**
  - Progress: both dark treatments rejected. Latest moodboard-led revision uses twilight/sky-blue illumination, source portrait, 6D-to-3D synthetic vector cloud with true latent-space neighbor edges and GPU-verified cursor parallax. Current screenshots reviewed at 320/390/768/1024/1440; owner approval pending. See `../docs/hero-twilight-review.md`.
  - Acceptance: visible interactive embedding space, professional natural face, responsive copy-left/portrait-right and airy white/20 frosted surfaces (latest owner direction); no per-frame React state.
  - Verify: renderer teardown/context-loss test, viewport screenshots and initial production trace.
  - Depends: T009. Files: Journey.tsx, scene.ts, globals.css, page.tsx.
- [ ] **T011 — Add intro and early-input handoff.**
  - Progress: four-step tracker, cyan face corners and voice-wave question badge resolve in 2.5s. Timed phase-order, early-wheel/decode-race, trusted native keyboard/wheel checks pass. Explicit CDP-touch check remains excluded during the owner-directed pause. Owner choreography review pending.
  - Acceptance: ordered hunt/lock/uncertainty; exact owner copy; early input resolves once without lost progress or competing writers.
  - Verify: focused state tests + browser interruption at every intro phase; real wheel/touch/keyboard paths.
  - Depends: T010. Files: journey.ts, Journey.tsx, tests/journey.test.ts, tests/intro.spec.ts.
- [ ] **T012 — Add accessible capsule and fallback behavior.**
  - Progress: airy capsule visually contracts through clip/child transforms without scaling text; scroll reversal, toggle/focus/Escape and independence checks pass. Current axe, reduced-motion, no-JS/WebGL, texture-failure, context-loss and touch-emulated DPR tests pass. Synthetic visibility verifies the handler only; native OS/tab behavior remains unverified. No explicit CDP tests run during this revision.
  - Acceptance: focus/tap/Escape equivalents; hover does not scrub; Hero socials in correct place; reduced-motion/no-WebGL/no-JS readable.
  - Verify: keyboard/axe/failure-mode/hover-progress browser checks.
  - Depends: T011. Files: Navigation.tsx, Journey.tsx, globals.css, tests/navigation.spec.ts, tests/fallbacks.spec.ts.
- [ ] **T013 — Review and approve Hero milestone.**
  - Progress: latest twilight/latent-space revision awaiting visual approval. Current production build/typecheck/lint, five unit and 31 non-CDP browser checks pass, including actual GPU matrix response to cursor input. Five rendered viewport screenshots are current; prior traces are historical and cannot certify this revision. Trace/CDP work paused by owner instruction. Real phone/native visibility and final acceptance remain open; no merge. See `../docs/hero-twilight-review.md`.
  - Acceptance: build/tests pass; real matte/Hero screenshots and declared-device traces meet approved targets or gaps disclosed; explicit approval before merge.
  - Verify: production build, full relevant tests and 3-run desktop/phone measurement protocol.
  - Depends: T012. Files: milestone review evidence; scene.ts/globals.css only if profiling justifies changes.

## Milestone 3 — feature/hero-about-transition (authorized review prototype; formal milestone gated)

### Authorized combined-review prototype (not formal milestone completion)

Source and proposed technical approach: `../docs/owner-narrative-alignment.md`. Do not mark T013/T017 approved from this exception.

- [ ] **R001 — Resource-aware entrance and three-frame identity lock.**
  - Progress: implemented and technically verified; measured face-lock/cause ordering, early input, delayed/missing decode and timeout checks pass. Owner choreography acceptance remains pending; evidence: `../docs/hero-about-review.md`.
  - Acceptance: no forced loader after resources are ready; three frames converge at the measured face; green/white confirmation directly reveals identity instead of Who is he?; early input and failures leave a usable page.
  - Verify: focused intro/interruption/failure checks, lint/typecheck/unit/build and desktop/narrow mobile motion captures.
  - Depends: reviewed source portrait; existing intro gate. Files likely touched: hero.ts, page.tsx, globals.css, focused browser tests.
- [ ] **R002 — Same-source monitor pop-out and reversible About.**
  - Progress: actual Three.js monitor/crop/occlusion and full CV copy implemented; five-width forward/reverse captures, same GPU UV buffer, no-JS/WebGL/context-loss and reduced-motion checks pass. Owner visual acceptance remains pending.
  - Acceptance: continuous camera/crop transformation into a real spatial display frame; lower body inside/head beyond bezel; full name/title/CV summary; reverse restores the starting composition.
  - Verify: actual WebGL and 0/25/50/75/100% forward/reverse samples; no-JS/reduced-motion/context-loss readability; build checks.
  - Depends: R001; monitor asset selection or native geometry review. Files likely touched: scene.ts, hero.ts, page.tsx, transition tests, content/en.json.
- [ ] **R003 — Independent dual capsules and cable-entry skill pulses.**
  - Progress: stage-aware top capsule, same-node social docking and CV-backed skill/binary pulses implemented. Nav independence, keyboard/tap/Escape and responsive checks pass; full slice recording is ready. Owner interaction/visual acceptance remains pending.
  - Acceptance: top capsule tracks implemented stages; same Hero socials dock left without duplicate focus targets; nav expansion never scrubs the world; CV-backed skill icons feed the screen on grouped cables.
  - Verify: keyboard/tap/Escape/nav independence, responsive collision checks and continuous forward/reverse recording. Asset/license review before imported geometry.
  - Depends: R002. Files likely touched: Navigation.tsx, scene.ts, globals.css, localized content, focused browser tests.
- [ ] **Combined-review checkpoint.**
  - Progress: localhost preview and `../docs/hero-about-review.md` delivered with six passing unit and 35 passing browser checks. Explicit CDP touch excluded; native visibility/phone/performance gates disclosed. No merge or milestone acceptance.
  - Review the entire entrance → Hero → About recording and localhost interaction, not only still images. Report performance/native-device gaps; explicit owner acceptance before any merge. No later-stage implementation.

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

## Owner extension: recovery checkpoint and engineering-world study

- [x] **W001 - Preserve the accepted functional foundation locally.**
  - Acceptance: source/assets/review evidence committed to frozen checkpoint branch/tag; ignored working experiments archived and read-back hash-verified; developer caches/credentials excluded; no remote or main merge.
  - Verified: `ad37b55`, annotated tag, Git bundle verify and 7,071 archive members. Evidence: `../docs/checkpoint-hero-about.md`.
- [x] **W002 - Slow guided navigation without changing native scrolling.**
  - Acceptance: full range 2.4s gentle sine-in-out, remaining-distance duration; wheel/touch/navigation keys interrupt; focus/hash complete only on arrival; reduced-motion uses native anchor.
  - Verified: regression fails on old 0.9s and passes after the change; lint/typecheck/build, 11 unit and 45 production browser tests pass.
  - Files: hero.ts and choreography.spec.ts. Depends: W001.
- [x] **W003 - Produce an independent environment/entrance/next-scene study.**
  - Acceptance: actual Three.js interior/exterior proposal, full-source-to-Hero detection zoom and selectable CV-backed capability assembly; no new package, image generation, public next-stage route or duplicate skill inventory.
  - Verified: study rendered at 320/390/768/1440px, real draw calls, source-anchored face-frame samples, scene/domain controls, overflow/error/network and reduced-motion/no-WebGL checks. Evidence: `../docs/engineering-study-verification.json` and corresponding screenshots. This is study completion, not aesthetic acceptance or production integration.
  - Files: engineering-world-study.html, engineering-world-direction.md, local review server/check. Depends: W001.
- [ ] **W004 - Owner reviews direction and confirms next-stage scope before integration.**
  - Owner outcome: environment/next-scene study rejected. W003 records historical production of a study, not a passing visual review. Resume actual Hero/About correction; no environment/Skills integration.
  - Acceptance: explicit review of full-source entrance, both environments and proposed Skills scene; clarify whether the owner's intended next scene is Skills. Preserve accepted app controls/content; no later-stage implementation before the scope/spec gate.
  - Verification: record owner decision, then define scoped production tasks and device/performance protocol. Future dashboard remains required before launch, not implemented by this study.
  - Depends: W002-W003. No older milestone acceptance gate is closed by this checkpoint.

## Corrective actual-site review

- [x] **W005 - Integrate the retained entrance into the actual Next.js route.**
  - Scope: `feature/hero-about-integrated-refinement`; whole-source portrait at the visible viewport bottom, face lock/reframe, existing Hero/About geometry and gentle Find out retained. No study UI, planning copy or rejected backgrounds. No new stages.
  - Verify: entrance/source/face registration, short viewport, 768px screen/copy clearance, production browser suite, unit, lint, typecheck, build and owner review. Checkpoint stays frozen.
  - Technical verification complete: production build/lint/typecheck/contracts, 12 unit and 48 browser tests passed. Actual-route capture check covers eight viewport sizes, full-source grounding, zoom-time face registration and reversible travel; evidence is `../docs/integrated-site-verification.json`. The checkbox remains open for owner visual review. No replacement-background or later-stage acceptance is claimed.

- [x] **W006 - Correct the rejected desktop centering, intro order and compact contact lanes.**
  - Newer owner decision: preserve the accepted desktop left-screen/right-CV composition; desktop nodes precede streamed text; no compact annotation nodes; neutral recognizable contact glyphs without visible names, brand backplates/white glyphs only on hover or keyboard focus.
  - Implementation: current actual Next.js route only; shared DOM/WebGL compact lane geometry, short-landscape sizing and measured copy/CTA clearance. Source entrance stays viewport-centered and grounded; portrait remains centered inside the moving monitor during reversible travel. No new stage, replacement background or merge.
  - Verification: 13 unit tests, 65 production browser tests, build/lint/typecheck/contracts and a 17-viewport, 36-capture rendered verification pass. Evidence: `../docs/owner-review-correction.md`. Checkbox remains open for owner visual acceptance; physical-phone/performance gaps are not closed by emulation.
  - Newer phone/tablet review: full available source to the visible phone bottom, stable centered tablet columns around 1000–1038px, distinct left copy, unchanged accepted desktop portrait/monitor geometry. Current verification is 14 unit / 66 browser tests plus build/lint/typecheck/contracts and eight representative viewports with 24 captures (`../tmp/mobile-fill/verification.json`). No exhaustive width sweep or next stage; owner acceptance remains open.
  - Latest localized spacing review: lower Hero side copy in the near-1209px scrollbar/typography mismatch, widen stacked About within its existing column, and anchor the skill caption beneath the monitor/stand instead of the CV footer. Current verification: 14 unit / 68 browser tests, build/lint/typecheck/contracts and seven representative viewports with fourteen captures (`../tmp/spacing-review/verification.json`). 1440px portrait/monitor geometry is unchanged. Owner acceptance remains open.
  - Superseding owner acceptance: the current actual Hero/About is approved for preservation and merge/push to main; both backgrounds are deferred. Next connected scene is authorized as a separate review branch, not as an accepted main merge. See `../docs/hero-about-owner-approval.md`. Native-device/performance gaps remain open.
