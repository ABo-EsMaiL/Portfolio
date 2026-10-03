---
version: alpha
name: Identity in Data
description: Cinematic engineering identity — natural portrait, twilight-blue computational atmosphere, projected latent-vector space and airy frosted navigation.
colors:
  primary: "#172D43"
  secondary: "#314D65"
  tertiary: "#08618B"
  neutral: "#ADC7DC"
  surface: "#E2EDF4"
  glass: "#E7EDF2"
  ink: "#111820"
  border: "#7A8996"
typography:
  h1:
    fontFamily: Manrope
    fontSize: 9.875rem
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.06em"
  h2:
    fontFamily: Manrope
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  body-md:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.4
  metadata:
    fontFamily: IBM Plex Mono
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 12px
  annotation: 16px
  capsule: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 48px
  wide: 80px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  secondary-copy:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
  capsule:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.capsule}"
    padding: 8px
    height: 56px
  annotation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.annotation}"
    padding: 16px
  action:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.capsule}"
    padding: 16px
  action-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
  hud:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.tertiary}"
    typography: "{typography.metadata}"
  outline-control:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.border}"
    rounded: "{rounded.sm}"
---

## Overview

**OWNER-DIRECTED REVISION — RENDERED RESULT AWAITS SIGN-OFF.** The current connected Hero → About review follows [authoritative owner corrections](docs/phase-2-decisions.md) and [current integration evidence](docs/hero-responsive-corrections.md). Earlier twilight recipes below are historical design context, superseded where the newer runtime direction differs. The Milestone 1 exported contracts remain the historical approved baseline. No generated portrait, terminal chrome, speculative services, merge or deployment approval.

### Current connected-review overrides

- Cool digital engineering world `#E9F0F2` belongs inside the monitor; outside it is a plain warm `#F6F2E9` / `#E8E2D6` environment with diffuse grounding light and no repeated grid. Semantic navy remains `#172D43`; headline accent `#08618B`, with `#417F8E` inside the AI word treatment. Preserve original colors on skill marks.
- `YOUR IDEAS / BUILT WITH AI` is integrated into the real route. Self-hosted Manrope 800, tracking −.06em, line height .96; IDEAS uses a 1.5px accent outline (1px stacked), AI uses a diagonal two-tone accent and 1.48× row size.
- At ≥1024px: first row `clamp(84px,10.6vw,158px)`, second `clamp(56px,6vw,90px)`. Below 1024px: first row `clamp(38px,13vw,72px)`, second `clamp(28px,9vw,52px)`; stack portrait, single-line name/role, CTA and contacts. These are review values, not final aesthetic acceptance.
- Desktop centers both rows above a larger, raised portrait; keep existing photo-alpha text occlusion. The title anchor is `.10 × frameHeight`, with −8px second-row margin. Portrait top adds a width-dependent 192–272px offset to that anchor; width is `min(.52 × width,.72 × frameHeight,680px)`. Phone/tablet Hero geometry stays unchanged. At 1024–1199px, lift both side-copy blocks and keep the fourth social clear of the coat.
- Hero shows the reviewed upper-body crop; About reveals the complete available body from the same natural source. Keep full-source UVs and a shared reversible DOM/WebGL clip boundary. Static mode includes a same-source full-body About view without adding another spatial portrait.
- The portrait stays horizontally centered in the monitor at every progress sample. Hold vertical position and size until the aperture catches the Hero hem; afterward anchor the visible source bottom to the aperture and settle size/reveal independently of the screen camera. Interpolate visible height directly to avoid an upward/downward bounce caused by multiplying independently changing crop and scale.
- Contact hit targets and decorative skill sizes remain independent; heading integration does not authorize larger skill packets. Navigation and the automatic intro remain separate from reversible visitor-controlled travel.
- LinkedIn, GitHub, Facebook and Email use four ≥44px targets; dock height is 220px and its conservative packet-clearance bounds match. Icons acquire their defined brand/action colors on pointer hover and keyboard-visible focus; contact captions keep readable slate contrast.
- Latest skill artwork is 60% of its preceding size, scaled around the same local icon center; packet labels and their rasterization stay readable at unchanged size. Conservative packet envelopes and independent binary inputs remain unchanged.

## Colors

Primary is deep navy text; secondary is meaningful slate-blue copy. Tertiary supplies accessible focus/action contrast, while decorative cyan face brackets use `#80E9FF`. Pale sky blue on the left blends into twilight blue on the right; diffuse ice light sits behind the source portrait. Validate translucent surfaces against the actual rendered gradient, not only flat token swatches.

## Typography

Self-hosted Manrope remains the identity/body face. Current headline sizing and word treatments are defined by the connected-review overrides above. Name and role each stay on their own single line; About CV copy remains readable and reachable through native scroll rather than being compressed into one phone frame. Detection is an authored illusion, not biometric measurement.

Future Arabic uses a locale font slot, proposed Noto Sans Arabic, with logical CSS properties, locale direction and generous line height. Do not mirror WebGL geometry because the locale changes. Arabic assets/translations are not shipped in this milestone.

## Layout

Spacing follows the tokens; content width ≤1440px. Desktop copy-left/portrait-right; mobile art direction is in `specs/001-cinematic-identity/ui-ux.md`. Use safe-area insets for floating controls. All primary hitboxes ≥44px. The native scroll runway must not look like stacked generic sections; reduced-motion/no-JS modes use normal readable flow.

## Elevation & Depth

The source portrait and a synthetic latent-vector cloud create depth. Seeded six-dimensional clusters project onto three orthonormal axes; sparse edges encode nearest neighbors in the original six dimensions. Three.js renders portrait, points and edges in three passes. Slow drift and damped fine-pointer parallax share the existing GSAP ticker; no competing RAF or per-frame React state. Cursor changes decorative geometry only, never the registered face or narrative progress. No postprocessing dependency or client ML.

### Owner-directed runtime surface recipes
- Base: pale `#E2EDF4` / `#BED3E3` on the reading side, through `#688AAB` into `#274963`; localized diffused sky-light behind the portrait. No room surfaces or viewport noise overlay.
- Glass: `rgba(255,255,255,.2)` surface, `rgba(255,255,255,.4)` border, 24px backdrop blur and a subtle small shadow. Pill contracts visually from 430px maximum to a 180px stage indicator through a clipped backing and child transforms; no text-scale distortion or animated layout width.
- CTA: airy glass, 52px target, restrained fine-pointer hover and 120ms press. Focus remains visible; reduced motion disables transform feedback.
- Detection: four frosted step rows, cyan open face corners, timed scanline, and voice-wave question badge connected to the authored face edge. No speech recording, microphone access or facial inference.
- Portrait: source-derived DOM/WebGL layers share `mask-image:linear-gradient(to top,transparent,black 40%)`; facial pixels and anchors are untouched.

## Shapes

Only capsule/CTA are fully rounded. Annotation is 16px, minor borders 4px. Detection corners are open SVG strokes tied to measured portrait face anchors. Their hunt resizes through transforms, not repeated layout writes.

## Components

Hero, attached identity annotation, detection HUD, navigation capsule and About profile are unique compositions, not a reusable dashboard card library. All reading content stays DOM-based; canvas is decorative. Prefer native buttons/links and CSS pointer/focus feedback.

## Do's and Don'ts

Do preserve the natural face and wide suit silhouette. Do use the same source cutout through both scenes. Do transform the HUD/aura into About identity guides. Do test content on a real small screen. Do show truthful semantic identity without forcing the visitor to wait.

Don't use a terminal, purple gradients, strobing error screens, decorative ML claims, star-rated skills, templated project cards or a second motion engine. Don't call the particles a computed biometric scan. Don't replace reversible interaction with video.

## Motion Tokens (proposal)

- Pointer UI: 180ms; press 120ms; interrupt resolve ≤200ms.
- UI ease-out: `cubic-bezier(0.23, 1, 0.32, 1)`.
- UI ease-in-out: `cubic-bezier(0.77, 0, 0.175, 1)`.
- Journey mapping: GSAP `ease: none`, ScrollTrigger scrub directly mapped to normalized progress; no secondary smoothing loop.
- Intro: 2.5s after portrait decode, independent of deferred WebGL compilation. Stages: entering 0s, analyzing .45s, matching 1.15s, unresolved 1.85s, ready 2.5s. Early intent retains the ≤200ms handoff.
- Reduced motion: no spatial travel/hunting/pinning, optional opacity ≤150ms. Keyboard capsule toggle is instant. Pointer hover is gated to fine hover-capable devices.

CSS `@theme` and DTCG token exports live under `specs/001-cinematic-identity/contracts/`; they are review artifacts, not installed application styles.
