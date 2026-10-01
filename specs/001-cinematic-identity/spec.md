# Feature Specification: Cinematic Identity — Hero and Hero → About

**Spec ID:** 001-cinematic-identity
**Working branch:** `feature/spec-kit-setup`
**Implementation branches:** `feature/hero-section`, then `feature/hero-about-transition`
**Created:** 2026-10-01
**Status:** Owner-approved Milestone 1; Hero implementation authorized on `feature/hero-section`. See `docs/milestone-1-approval.md`. Hero → About implementation remains Milestone 3.
**Input:** Complete North Star + CV + owner Phase 2 refinements in `docs/phase-2-decisions.md`.

## Objective and Scope

Introduce Ahmed Esmail professionally, then let visitors discover his identity by controlling a continuous, reversible visual world. Milestone 2 ships the Hero/entrance as an independently testable composition. Milestone 3 adds only its transformation into About. Capabilities, Experience, Projects and Contact remain roadmap stages, not implemented scenes here.

The sole portrait supplies a background-removed head-and-shoulders Hero crop and wider upper-body About view. A custom digital ghost/particle aura carries visual continuity. Detection is an engineered illusion; no camera access, biometrics, client ML, video substitution or extra portrait source.

## User Scenarios & Testing

### US1 — Professional entrance (P1; Milestone 2)
**Why:** Identity and the discovery affordance must work before the cinematic journey exists.
**Independent test:** Open Hero only and observe the complete intro plus usable links.
1. Given the portrait is decoded, when the page starts, atmosphere/camera push precede portrait emergence and an actively hunting/resizing bounding box.
2. Given hunting completes, when the HUD locks to authored face anchors, simulated coordinates/confidence appear, identity becomes uncertain, then “Who is he?”, “Scroll to explore” and “Find out” become available.
3. Given slow assets, failed WebGL or disabled JavaScript, the visitor can still read identity/copy and use links without waiting for effects.

### US2 — Early control handoff (P1; Milestone 2)
**Why:** The intro cannot hold the visitor hostage.
**Independent test:** Interrupt each entrance phase with real wheel, touch-scroll or keyboard scroll.
1. Given the intro is in progress, when intentional journey input arrives, a short resolve settles to the interactive Hero state and kills the intro writer; control transfers once.
2. Given input continues during the resolve, when it completes, scroll progress is preserved and no scene jumps back to the start.
3. Given capsule hover/focus or interaction with a link, no handoff or camera movement occurs merely from that UI event.

### US3 — Discover and reverse identity (P1; Milestone 3)
**Why:** Object continuity and reversal are the defining experience.
**Independent test:** Advance to About and return, repeatedly, at sampled progress positions.
1. Given interactive Hero, downward scroll transforms the existing annotation/HUD/aura into an identity/profile composition while the same portrait framing widens.
2. Given any transition progress, upward scroll restores the same geometry/crop/text state at that progress without repeating the automatic detection intro.
3. Given the visitor stops scrolling, the camera and narrative transformation stop. Decorative particles may drift, but must not change story progress.
4. Given About, its content communicates identity and CV-backed work rather than dumping the CV into cards.

### US4 — Independent navigation and alternatives (P1)
**Independent test:** Mouse, touch, keyboard, reduced-motion and no-WebGL paths.
1. Hero begins with expanded light/glass navigation; journey onset compresses it to the current-stage label. Pointer hover or focus/tap expands it without changing journey progress.
2. Stage selection moves the native scroll position smoothly through existing stage geometry; wheel/touch input cancels the navigation tween immediately. Reduced-motion stage selection is direct.
3. Escape closes the expanded capsule; focus returns to its toggle. Focus within keeps it open; no hover-only feature.
4. Socials sit below the Hero hint/CTA, not top-right; during transition they relocate as side nodes. Only CV-backed destinations are used.

## Requirements

### Functional Requirements
- **FR-001:** Present a sparse professional Hero: semantic identity/copy on the left, cutout portrait on the right at wide widths; responsive art direction is defined in the UI spec.
- **FR-002:** Use only the supplied image; preserve the original and manually review the matte/crop against it.
- **FR-003:** Run detection automatically on load/reload, not on the first scroll; it is explicitly simulated and non-biometric.
- **FR-004:** Follow entrance order: atmosphere → portrait → search/resize → lock/metadata → uncertainty → annotation → gesture/CTA.
- **FR-005:** Publish exactly “Who is he?”, “Scroll to explore” and “Find out” for the English discovery affordance. Never use the rejected “Start Journey” or “What is in his mind?” copy.
- **FR-006:** Early intentional scrolling resolves the intro smoothly and transfers control exactly once; neither timeline overwrites the other.
- **FR-007:** Use one normalized journey progress value driven by native document scroll; avoid wheel hijacking, inertia libraries and body-wide prevented scroll.
- **FR-008:** Native scroll runway is an implementation detail behind a visually persistent stage, not visible stacked section designs. Semantic linear content remains in the DOM.
- **FR-009:** Journey transformation is scrubbable/reversible; no irreversible callback-created objects, random scene regeneration or time-based story autoplay.
- **FR-010:** Use seeded particle/geometry sampling. Re-entering the same progress reproduces the same narrative geometry, independent of decorative idle drift.
- **FR-011:** Annotation/HUD/aura visibly generate About; the camera reframes and the same source portrait widens without a scene cut or identity swap.
- **FR-012:** Stop story progress when input stops. Freeze atmospheric rendering when the tab is hidden; no perpetual expensive offscreen animation.
- **FR-013:** Maintain separate intro, journey and navigation-UI states. Hover/focus/open/close never writes journey progress or scroll position.
- **FR-014:** Stage selection traverses the same timeline, is interruptible, updates current-stage semantics, and moves focus to the target heading only after deliberate selection finishes.
- **FR-015:** Do not include navigation destinations for unimplemented scenes. Milestone 2 has Hero only; Milestone 3 adds About. Future six-stage IDs are stable contracts, not false live links.
- **FR-016:** Use readable DOM for all substantive copy/links; WebGL is decorative and `aria-hidden`, never the only information channel.
- **FR-017:** Reduced-motion skips hunting/camera travel, shows readable Hero/About with gentle fades or direct stage navigation, and does not pin the visitor into an empty cinematic runway.
- **FR-018:** No-JS/no-WebGL/image-failure modes expose ordered content and usable navigation, not a blank canvas or spinner.
- **FR-019:** English content lives in locale-aware contracts; future Arabic direction/fonts/copy do not alter timeline identities, positions or callbacks.
- **FR-020:** Validate editable content, links, cardinality and media-anchor bounds before consumption. Never allow CMS strings to become CSS, shader source, HTML or executable animation parameters.
- **FR-021:** Keep CV-backed facts distinct from artistic effects and simulated HUD telemetry. Unknown project URLs/metrics remain absent.
- **FR-022:** Support 320px, 390px, 768px, 1024px, 1440px and 1920px review widths with no clipped controls or horizontal page overflow.
- **FR-023:** Dispose renderers/materials/textures/listeners and revert GSAP context on unmount, route change and layout rebuild.
- **FR-024:** Meet the measured performance/security/accessibility gates in the plan before milestone approval. No unconditional 60 FPS claim across unspecified hardware.

### Key Entities
Profile, localized copy, source/derived portrait manifest, normalized face anchors, social links, stage IDs; ephemeral intro/journey/capsule states are separate from editorial content. See `data-model.md` and `contracts/content.schema.json`.

### Edge Cases
Fast bidirectional scrolling during handoff; touch momentum; keyboard scrolling within text inputs; scroll restoration/deep linking; refresh mid-stage; delayed fonts/images; resize/orientation during transition; navigation scroll and real input racing; WebGL context loss; high-DPI/120 Hz screens; hidden tabs; long translated text; zero/maximum social links; invalid content/URLs; reverse at both endpoints.

## Success Criteria
- **SC-001:** Intro completes in the proposed 3.4-second timeline after image decode, or resolves within 200ms of intentional interruption; identity is readable before effects finish. Slow assets time out to readable mode within 2 seconds after hydration (proposal).
- **SC-002:** Progress samples 0, 0.25, 0.5, 0.75 and 1 reproduce portrait/camera/HUD/text narrative state within 1px and 0.001 progress tolerance after settling, both forward and backward. Ambient particle time is excluded, narrative particle positions are not.
- **SC-003:** Hover, focus, touch-toggle and Escape change neither scroll position nor journey progress (tolerance 0.001); keyboard focus is visible and stage selection remains reachable.
- **SC-004:** Semantic reading order and links remain usable with reduced motion, WebGL disabled and JavaScript disabled; no relevant content exists only in a canvas.
- **SC-005:** Measured production traces sustain the 60 FPS target on agreed representative hardware in intro, bidirectional scrubbing and navigation; the measurement protocol and explicit dropped-frame limits are in `plan.md`.
- **SC-006:** Every example passes the contract; negative cases reject invalid URLs, unknown fields, duplicate IDs and out-of-bounds face boxes. Raw sources hash-match the baseline.

## Traceability
| North Star ledger | This spec |
|---|---|
| R01–R02, R19–R25 | FR-001–002, FR-011, FR-021 |
| R03–R13 | FR-006–013 |
| R26–R39 | FR-003–006, FR-010–011 |
| R42–R52 | FR-013–015 |
| R53–R55 | FR-011, US3 |
| R71–R76 | FR-016–024, data contract |
| R80–R88 | Scope, constitution, plan and approval gates |

Owner Phase 2 refinements resolve R24/R29/R35/R40/R41 only through proposals: use a removed About background, subtle “identity unresolved” status, explicit timing and proposed palette/fonts. Approval is required before treating these visual details as fixed.

## Assumptions and Review Gates
The exact visual/timing values are proposals, not missing information silently filled in. CMS/auth, domain budget, project order/URLs, extra socials and Contact form are deferred to their milestones. Raw-photo background removal is planned offline with no third-party upload; matte tooling/model download, if needed, requires a named project-local installation. Full implementation begins only after explicit spec sign-off.
