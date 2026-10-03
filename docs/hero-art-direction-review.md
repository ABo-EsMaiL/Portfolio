# Hero — owner-directed cinematic revision

**Status: historical — this revision was explicitly rejected by the owner.** See [current twilight/latent-space revision](hero-twilight-review.md). Preserve these screenshots as rejected evidence, not current acceptance. No merge, push, deployment or Hero → About transition was authorized.

## Implemented direction
- Obsidian `#05070a` / slate stage, broad ice-cyan ambient lighting behind the subject, fine static grain and a restrained lens-like depth boundary.
- Existing source portrait and reviewed derivatives unchanged. Custom alpha-sampled emissive ghost has a thin cyan contour, diffuse halo and slowly varying strata; no replacement/generated face.
- Three-dimensional silhouette points and interleaved ambient dust drift/orbit at different depths. Soft-core additive sprites and fine-pointer parallax are driven from the existing GSAP render callback, with no new RAF loop or React per-frame state. The natural portrait and face HUD stay registered.
- Dark frosted pill: requested `.03` white surface, `.12` white border, 24px backdrop blur, fully rounded silhouette and micro breathing status light. No bullet list; tap/focus/Escape controls retained.
- Technical corner brackets, midpoint crosshairs and a scan sweep on the existing GSAP intro timeline. Authored normalized coordinates are explicitly labelled `LANDMARK / SIMULATION`, not represented as a real biometric result.
- Glass “Who is he?” badge with angled vector starting at the measured face-box right edge. Content-safe minimum badge width avoids narrow-screen text spill.
- Editorial Manrope identity, tighter tracking with explicit word spacing, cyan-glass CTA and gated hover aura. Minimal `Profile notes` link replaces the raw details control; it reveals the same existing bio, not a new About scene. Works via native fragment navigation without JS.

## Rendered screenshots
- [Desktop 1440×900](hero-redesign-1440.png)
- [Mobile 390px](hero-redesign-390.png)
- [Narrow mobile 320px](hero-redesign-320.png)
- [Tablet 768×900](hero-redesign-768.png)
- [Cursor/parallax state](hero-redesign-parallax.png)
- [CTA hover](hero-redesign-cta-hover.png)
- [Live hunting HUD](hero-redesign-hunting.png)

These are screenshots of the actual local production app with compiled shaders, not mockups. Desktop captures are viewport-sized; mobile captures include the complete Hero. See `hero-art-direction-verification.json` for the build and artifact fingerprint.

## Verification
- Production build, typecheck and lint pass. Four unit tests and 19 focused non-CDP browser checks pass.
- Shader/page console errors absent in rendered desktop/mobile/tablet states. WebGL active at all four widths; no horizontal document overflow. CTA is in the first 844px mobile viewport.
- Axe checks pass at 320/390/768/1440. Keyboard capsule/Escape, early-wheel handoff, late-image interruption, failed-portrait identity, reduced motion and no-JS link/portrait paths pass.
- No new dependency, model download, remote image/font or portrait reprocessing. Temporary rendering work remains in project `tmp/`.
- **No trace benchmarks or native CDP tests were run for this revision**, per owner direction. The previous performance traces and previous broader spatial test run are historical, not certification of this new shader/CSS treatment. Real-phone/native-visibility/final acceptance remain open; no new 60 FPS claim.

## Reproduce
Start the production app with `npm run build` then `npm run start -- --port 3000`. Current live URL: http://127.0.0.1:3000/ (local only).

Focused checks: `npm run test:unit`; `npm run typecheck`; `npm run lint`; `npm run test:e2e -- tests/hero.spec.ts tests/shell.spec.ts tests/art-direction.spec.ts`. Screenshot helper: `node tmp/render-hero-art-direction.mjs`.
