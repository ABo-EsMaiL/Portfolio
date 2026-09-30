# Research / Decisions — Cinematic Identity

**Prepared:** 2026-10-01. Owner stack decisions supersede earlier candidates.

| Decision | Why | Rejected/deferred alternative |
|---|---|---|
| Native scroll runway + pinned visual world | touch/keyboard/history/scroll restoration remain native; ScrollTrigger maps one progress value | wheel hijacking, Lenis or custom inertial camera input |
| Separate interruptible intro and journey | two writers must not race on shared scene targets | one autoplay sequence owning the whole site |
| Three.js spatial portrait/ghost/particle layer + semantic DOM | fulfills 3D ambition while keeping text and links accessible | DOM-only restriction; all-text WebGL |
| Three.js direct initially | one small scene does not need extra React renderer abstractions | R3F stays available if measured maintenance benefit warrants it |
| Seeded journey geometry | reversal must reconstruct objects | random per-entry particles, irreversible callbacks |
| Offline portrait matte, same cutout texture throughout | source identity continuity and privacy | remote upload/generative portrait/video replacement |
| Local editorial snapshot for prototype | no CMS choice is needed for Hero validation | inventing provider, auth, media-storage and paid services now |
| Strict localized content contract | future Arabic changes copy/layout, not motion | motion selectors coupled to English words or RTL mirroring geometry |
| Official Spec Kit generic local integration | native Hermes integration explicitly writes to ~/.hermes/skills | global skills installation conflicts with project-only authorization |

## Spec Kit provenance and behavior
Official repository: https://github.com/github/spec-kit . Latest stable release retrieved at setup: v1.0.13, commit f1a548a39dba4e5e8600de1d2e0d3ff0c468d2a9. Installed in `.tools/spec-kit-venv`; cloned source in `.tools/spec-kit-source`. Bundled templates/scripts/workflow were actually installed using the CLI; feature/plan scaffold scripts were exercised.

This release separates Spec Kit feature identity (`001-cinematic-identity` in `.specify/feature.json`) from Git branch identity. No Git extension was installed: the owner's exact `feature/spec-kit-setup` remains current. Do not rename it to the default numbered branch. Generic command templates are read/run by this agent; this does **not** assert global Hermes slash-command registration.

## Rendering risks
Hair/shirt matte against green/glass backdrop needs manual review. Crop-based anchors must remain source-aligned through camera/viewport changes. Browser GPU/DPI/device tiers are unknown until profiling. Transparent particles cause overdraw; begin batched, bound DPR and use a small volume. Text wrapping is locale/viewport dependent; measure only at layout changes, not every frame. Context loss must not blank the semantic page.

## Sources
- North Star requirement ledger in `docs/phase-1-analysis.md`, plus original conversation line references.
- CV extracted in Phase 1 and rechecked for Hero/About example content.
- Owner refinements: `docs/phase-2-decisions.md`.
- Official release: https://github.com/github/spec-kit/releases/tag/v1.0.13 .
- Hermes skills documentation: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills .
- Design token CLI package inspected: `@google/design.md` 0.4.0, installed locally for lint/export only.

Exact visual values are proposals awaiting sign-off. Rendering/performance results cannot exist before the application prototype exists.
