---
version: alpha
name: Identity in Data
description: Proposed cinematic identity system — natural portrait, dark spatial field, restrained ice-cyan aura and light glass navigation.
colors:
  primary: "#EDF2F5"
  secondary: "#A7B4C0"
  tertiary: "#9FE8F5"
  neutral: "#080C11"
  surface: "#111820"
  glass: "#E7EDF2"
  ink: "#111820"
  border: "#7A8996"
typography:
  h1:
    fontFamily: Manrope
    fontSize: 4rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.04em"
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
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.capsule}"
    padding: 8px
    height: 56px
  annotation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.annotation}"
    padding: 16px
  action:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.ink}"
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

**DRAFT FOR SIGN-OFF.** This is a proposed treatment, not a palette previously selected in the North Star. Natural professional identity sits within a sparse spatial field; light makes the supplied portrait's outline a bridge to data. The iPhone-like light capsule remains white/translucent in a dark scene. No stock grids, terminal chrome or unrelated sci-fi ornament.

## Colors

Primary is readable pale text; secondary is meaningful muted copy, not disabled text. Tertiary is the sole expressive aura/CTA accent. Neutral and surface form quiet depth. Glass/ink supply high-contrast navigation. Border is for interactive outlines; it is not the body-copy color. Verify the real blurred/translucent capsule against every scene it crosses, not only these solid reference colors.

## Typography

Propose self-hosted Manrope for identity/body and IBM Plex Mono only for small decorative detection metadata. Confirm licensing and exact subset files at implementation; no remote font dependency. No fabricated font asset is included now. Mobile H1 scales down to 36px; desktop H1 is a clamp from 40px to 72px rather than a fixed overflowing size. Body stays ≥16px. Metadata conveys no substantive claim and is not the only state indication.

Future Arabic uses a locale font slot, proposed Noto Sans Arabic, with logical CSS properties, locale direction and generous line height. Do not mirror WebGL geometry because the locale changes. Arabic assets/translations are not shipped in this milestone.

## Layout

Spacing follows the tokens; content width ≤1440px. Desktop copy-left/portrait-right; mobile art direction is in `specs/001-cinematic-identity/ui-ux.md`. Use safe-area insets for floating controls. All primary hitboxes ≥44px. The native scroll runway must not look like stacked generic sections; reduced-motion/no-JS modes use normal readable flow.

## Elevation & Depth

The portrait and ghost/particle volume create depth rather than layered UI shadows. Capsule blur is proposed 16px with a bounded single backing layer. Do not animate blur/shadow across the viewport. Scene clipping, opacity and transforms are driven by the one journey authority. Single-pass point rendering first; selective postprocessing only after profiling.

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
- Intro: 3.4s total after texture/image decode. Individual stage timing belongs to the UI spec.
- Reduced motion: no spatial travel/hunting/pinning, optional opacity ≤150ms. Keyboard capsule toggle is instant. Pointer hover is gated to fine hover-capable devices.

CSS `@theme` and DTCG token exports live under `specs/001-cinematic-identity/contracts/`; they are review artifacts, not installed application styles.
