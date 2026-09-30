# Phase 2 — Specification Sign-off Package

**Milestone:** 1 — local Git + Spec Kit + formal contracts/specifications
**Branch:** `feature/spec-kit-setup`
**Status:** Draft for owner review; no application code and no merge to main.

## Review index

| Deliverable | Document |
|---|---|
| Functional Hero / Hero → About specification | [spec.md](../specs/001-cinematic-identity/spec.md) |
| Exact proposed tokens / typography | [DESIGN.md](../DESIGN.md) |
| Composition, ghost/lighting and choreography | [ui-ux.md](../specs/001-cinematic-identity/ui-ux.md) |
| Data contracts and content/motion boundary | [data-model.md](../specs/001-cinematic-identity/data-model.md) |
| Machine-readable content schema | [content.schema.json](../specs/001-cinematic-identity/contracts/content.schema.json) |
| CV-backed English sample (derivatives honestly null) | [content.example.json](../specs/001-cinematic-identity/contracts/content.example.json) |
| Component/state diagram + visual storyboard | [architecture-roadmap.html](architecture-roadmap.html) |
| Technical implementation plan / profiling gates | [plan.md](../specs/001-cinematic-identity/plan.md) |
| Sequential milestones / task target | [tasks/plan.md](../tasks/plan.md), [tasks/todo.md](../tasks/todo.md) |
| Project constitution | [constitution.md](../.specify/memory/constitution.md) |
| Setup provenance / boundary incident | [tooling.md](tooling.md), [tooling-lock.json](tooling-lock.json) |
| Runnable validation commands | [quickstart.md](../specs/001-cinematic-identity/quickstart.md) |

## Proposed creative execution

A dark neutral spatial field, natural head/shoulder cutout, subtle ice-cyan ghost-edge/particle volume, and the required light translucent capsule. The same image texture widens to About while HUD/annotation/aura generate identity guides. Three.js supplies meaningful depth; DOM supplies readable copy and controls. Manrope is proposed for copy; IBM Plex Mono only for detection metadata.

Automatic detection is a 3.4s proposed cinematic illusion after image decode. Early input resolves it in ≤200ms and hands control over once. Native scroll maps to a single reversible GSAP/ScrollTrigger journey. Hover/focus/capsule expansion never writes progress. English copy is localized by contract; future Arabic changes text/layout/direction, not scene IDs.

The diagram's four frames are a schematic storyboard, not processed portrait artwork or a finished Hero. Background removal, measured face anchors, real shaders and performance profiling belong to Milestone 2.

## Choices requested for sign-off

1. Proposed palette/fonts, sparse ghost/aura direction and removed-background About composition.
2. Intro order/timing and subtle “identity unresolved” treatment, with simulated metadata clearly non-biometric.
3. Native-scroll/pinned-world mechanism, early-input handoff and same-timeline navigation/reversal behavior.
4. Content field/cardinality limits, English-first locale boundaries and portrait anchor ownership.
5. Accessibility fallbacks, responsive art direction, proposed frame/bundle budgets and representative-device profiling protocol.
6. Approval of this specification package and explicit authorization to merge Milestone 1. Do not infer merge permission from general praise.

Downstream CMS/auth/media provider, domain/hosting budget, project order/URLs, extra socials and Contact form are deferred before their own milestones—not fabricated or removed from scope.

## Verification

Verification is in progress. Final results and commit IDs will be recorded after the runnable checks complete; no application/60 FPS claim is made here.

The local rendered diagram report is [diagram-verification.json](diagram-verification.json). Desktop/mobile screenshots are review evidence only. Tokens have been linted with zero errors/warnings; exports are [design.tokens.json](../specs/001-cinematic-identity/contracts/design.tokens.json) and [design.theme.css](../specs/001-cinematic-identity/contracts/design.theme.css). DESIGN.md remains canonical: inspect typography when integrating exports, since the CLI export does not preserve every prose/layout/motion detail or numeric line-height token.

## Boundary disclosure

Spec Kit's native Hermes integration writes user-global skills, so the official generic integration was installed under `.specify/commands`. No global Hermes skills or PATH changes occurred. The first uv install accidentally used the default shared cache; the subsequent reinstall used the project cache. Shared-cache cleanup was not authorized and was not performed. See tooling.md for the precise disclosure.

The previously timed-out AGENTS.md approval was resent; the owner explicitly approved creation inside this project, and the file now exists.
