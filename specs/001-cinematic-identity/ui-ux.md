# UI/UX Spec — Cinematic Identity

**Status:** Proposed composition and choreography for sign-off. Stack, sole portrait, detection illusion, reversal, capsule material and English-first are owner decisions. Exact values below are creative/engineering proposals.
**Canonical tokens:** `../../DESIGN.md`.

## Creative direction: identity emerging from data
A near-black neutral stage preserves the suit/white-shirt contrast. Cool light outlines the cutout sparingly; it must not tint the face into a hologram. A ghost silhouette offset behind the right shoulder dissolves into a shallow spatial field, not a generic neon glow. The light capsule contrasts with the dark world. Do not add purple gradients, terminal chrome, dashboard cards, circuit wallpaper or floating unrelated widgets.

## Portrait pipeline (Milestone 2, not performed in Phase 2)
1. Keep the 3072×4096 JPEG untouched. Produce one transparent full-source cutout offline in a project asset-work directory; no remote upload.
2. Preserve hair/ears, white shirt and shoulder edges. Inspect on dark, light and checkerboard backgrounds at 100%; remove background green spill without repainting face details. If automated matting is insufficient, refine the mask manually.
3. Art-direct a Hero head/shoulder view and an About wider upper-body view from the SAME cutout, rather than swapping two textures. Anchors are normalized against the original source, then transformed through its crop matrix.
4. Proposed Hero source window: x=0.16, y=0.00, width=0.67, height=0.46; About: x=0.13, y=0.00, width=0.68, height=0.80. These are rough visual starting regions, **not verified final anchors**. Freeze measured crop/face rectangles after matte review.
5. Generate transparent WebP variants (640/960/1280 image widths) for ordinary reading; one source-aligned texture/mask for the scene. Try alpha AVIF only if quality/decoder support improves the measured result. LCP uses a real image with dimensions, not a late canvas-only portrait.
6. Keep face readable throughout detection; aura concentrates at silhouette/shoulder boundaries. No generative face replacement or pixels beyond the original framing.

## Hero layout and hierarchy
- Desktop ≥1024px: content left in a 5/12 region, portrait right in 7/12; navigation top-center, max scene content width 1440px; gutter scales 24–80px.
- Identity: “Ahmed Esmail” and “AI & Machine Learning Engineer”; only the full professional name is canonical in profile data. Short display name is a proposed editorial label.
- Annotation remains physically tied to the face/HUD. “Find out” and hint sit below copy; social links directly below, never top-right.
- 768–1023px: preserve left/right composition with a smaller portrait and readable copy.
- ≤767px: portrait in upper-right/upper band, compact identity/copy below-left; annotation avoids face, CTA remains on-screen. At short viewport heights use a readable flow rather than clipping or reducing body text below 16px.
- All stage headings have semantic DOM locations. Avoid duplicate IDs/duplicate spoken content when layering visual clones.

## Entrance storyboard (proposed total: 3.4s after image decode)
| Timeline | Action | Reason |
|---|---|---|
| 0.00–0.45s | restrained atmosphere; camera push | spatial orientation |
| 0.20–0.85s | portrait materializes; face stays natural | professional recognition |
| 0.75–1.95s | bounding corners search/resize through authored regions | explain detection illusion |
| 1.95–2.40s | lock to measured face box; coordinates + simulated confidence | make state legible |
| 2.40–2.75s | tiny pause/status “identity unresolved” | motivate discovery without alarming error |
| 2.75–3.15s | attached “Who is he?” annotation | narrative question |
| 3.05–3.40s | hint/CTA reveal | hand control to visitor |

Metadata is a deterministic illustrative value, e.g. “SIM · confidence 0.97”; never represents model output. It is decorative and hidden from assistive technology. No scary red error, scanline strobe or fabricated analysis of personal attributes.

Early input resolves intro in ≤200ms with the UI ease-out token. The intro is killed and its shared targets settle before journey writes begin; preserve pending scroll. Deep-link/scroll-restored visits initialize directly at the appropriate stage, not back at the intro.

## Hero → About storyboard (normalized journey interval)
| Progress | Continuous transformation |
|---|---|
| 0.00 | Interactive Hero endpoint; same object instances and portrait texture |
| 0.00–0.20 | annotation connector becomes a profile guide; bounding corners loosen; capsule compacts |
| 0.20–0.50 | camera pulls back; ghost edge particles redistribute into identity anchors; crop begins widening |
| 0.45–0.75 | annotation resolves into About heading/name; CV-backed bio and three capability statements form along guide lines |
| 0.70–1.00 | wider portrait rests alongside readable About; socials arrive as side nodes; next capability origin is suggested but not implemented |

Reverse follows the same parameterized states. Text transitions use DOM transform/opacity and retain reading order; no mesh-only prose. Do not morph facial pixels, erase the person or instantly replace the Hero with a new screen.

## Lighting / spatial rendering proposal
Use one Three.js scene with a portrait-aligned image plane, a slightly offset ghost-mask plane, and instanced/batched points distributed in a shallow 3D volume around the silhouette. Depth/parallax supports camera identity; a DOM overlay keeps text/HUD sharp. Start with Three.js directly; R3F is an option only if it demonstrably simplifies the scene lifecycle.

Proposed ghost material: silhouette mask × sparse noise threshold, cool edge emission at 0.12–0.28 visual opacity; offset stays within 6% of portrait width. Proposed points: 1200 desktop / 450 mobile starting budget, seeded positions, depth span 0.35 portrait-width units. These are starting budgets to profile, not certified results.

No mandatory full-screen bloom, depth-of-field, volumetric raymarching or multi-pass postprocessing. Add a post-process only after an A/B trace proves its cost fits; this does not prohibit 3D. Shader uniforms accept only authored numeric geometry and normalized journey progress, never editor text.

## Capsule and interaction
Expanded at Hero, compact current-stage label when journey starts. Fixed light translucent material, blur 16px, thin rim, dark text. Readability uses a minimum-opacity backing; blur is decorative. Hover only on fine pointers; focus-within and tap toggle provide equivalent access. Motion uses transform/opacity (180ms), not layout width animation. A stable hitbox avoids scroll/focus displacement. Target areas ≥44×44px.

Do not animate keyboard-triggered capsule toggles; pointer toggles use UI duration tokens. Stage selection uses a single interruptible scroll tween (proposed 650ms, UI ease-in-out), not a competing camera tween. Focus within the expanded control protects it from scroll-driven compaction.

## Accessibility and failure states
Text contrast ≥4.5:1; large text/UI boundaries ≥3:1 where required. Decorative HUD/particles excluded from reading order; truthful DOM identity appears immediately, even while visual copy is masked. Skip-to-content link and stage controls are keyboard reachable. No flashing >3 times/sec.

Reduced motion: direct readable Hero/About in normal flow, no hunt, pinning, camera push or parallax; opacity transitions ≤150ms. No-WebGL keeps the same art-directed cutout and semantic copy. No-JS serves readable image/content and normal anchors. Missing cutout/texture cannot yield a blank page; preserve readable identity with an honest unavailable-image state.

## Visual approval checklist
- [ ] Proposed palette/fonts and dark world/light capsule approved.
- [ ] Matte and Hero/About crop reviewed against original; no hair halo/green spill.
- [ ] Natural face preserved; ghost/3D aura supports identity instead of dominating it.
- [ ] Intro timing and uncertainty presentation approved at real speed.
- [ ] Hero → About forward/reverse sampled at 0/25/50/75/100% on phone/tablet/desktop.
- [ ] Content remains legible, links reachable and capsule independent of journey.

This checklist is a later implementation visual gate; Phase 2 renders only the specification diagram/roadmap, not a finished Hero.
