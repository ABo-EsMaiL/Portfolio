# Connected Hero → About — owner review

## Open and review

- Local app: http://127.0.0.1:3000/?review=hero-about-v2
- Branch: `feature/hero-about-transition`; unmerged and not deployed.
- [Full entrance, forward journey and reversal recording](hero-about-motion.webm)
- [Desktop Hero](hero-about-1440-0.png) · [Desktop midpoint](hero-about-1440-50.png) · [Desktop About](hero-about-1440-100.png)
- [Phone Hero](hero-about-390-0.png) · [Phone About](hero-about-390-100.png) · [Narrow About](hero-about-320-100.png)

Watch the entrance, then scroll down and back up. `Find out` and the Hero/About capsule links traverse the same native range; expanding the capsule does not move the world.

## Implemented slice

The source portrait enters after image decode and local font readiness. Three frames search upper-body regions, converge on the measured face anchor, pulse green/white and reveal identity directly. A tensor loader appears only if required assets remain pending, with early-input and timeout handoffs.

The Hero begins inside the same real Three.js monitor: the initial screen extends beyond the viewport, then shared camera geometry zooms it out and carries it left. Side copy scales with that surface; the slogan exits upward without crossing the face. The same source portrait independently reveals its available body crop and protrudes in front of the bezel. The complete extrusion renders before and behind the cutout, so the frame no longer crosses its neck/head. No generated body, reconstructed side view or client ML model is claimed.

The Hero's side identity and selling copy have swapped sides: Ahmed AbdElHady Esmail appears above his role on the right; CV-backed value copy and social links start on the left. The upper name has become `From models to working systems`. About name/title/summary wording is unchanged, as explicitly requested.

The same three social links move into a smaller left dock, retaining 44px interaction targets behind 32px visual circles. The thinner translucent/blurred upper capsule has an original A/network monogram, smooth independent width/content motion and press feedback. Three procedural cables carry compact skill icons with names below; separate `0` and `1` textures move as independent inputs. Five brand SVGs are served locally, with original symbols for CV/NLP/SQL/AI and [source/license notices](../public/assets/skills/NOTICE.txt). Tablet geometry reserves clearance for the entire skill badge and social hit area. Mobile paths stop before About text and cycle packets. Later Skills/Experience/Projects/Contact stages are not implemented.

## Executed verification

- Production `npm run build`, TypeScript and ESLint: pass.
- Unit tests: 6 pass, including shared source aspect/crop geometry and deterministic reversal.
- Browser suite: 36 pass via `npm run test:e2e -- --grep-invert 'trusted touch'`, including separate digit textures, five successful local icon requests, capsule size change and retained social hit targets.
- Axe: no violations in tested Hero and About states at 320/390/768/1440px, including keyboard entry and the short-phone About view.
- Actual WebGL draws and the same GPU UV buffer change from Hero to About and return on reversal. Context loss stops draws, removes the canvas and restores the readable DOM cutout/monitor fallback.
- Five rendered widths: 320/390/768/1024/1440. Forward/reverse samples: 0/25/50/75/100%, with matching portrait geometry, no page overflow, no visible slogan crossing the detected face, and no JavaScript or shader errors. Raw measured rectangles are in project `tmp/connected-journey-renders.json`; captures and the motion recording are beside this report.
- Native trusted wheel and keyboard handoffs, capsule independence, social-node identity, decode races/timeout, missing source, no JS/WebGL and initial/live reduced-motion paths: pass.
- Short phone viewport: full About copy remains reachable using native scroll without reducing type size.
- Spec/source checks: 4 positive contract cases, 20 rejected negative cases, 24 requirement IDs and 3 preserved source hashes. Main remains `e22ea4a`; no remote.

The first browser run identified one shared accessibility defect: fading the Hero with `visibility:hidden` removed the page's sole h1 from the accessibility tree in About. The visual headline now fades via opacity while retaining semantic heading access; the complete suite passed after the fix.

## Open gates — not certified by this review

Owner visual/choreography acceptance, portrait/checkpoint licensing review, brand-policy review before publication, real-phone testing, native OS/tab visibility and the explicit CDP trusted-touch test remain open. The visibility-handler check is synthetic, not a native-tab result. Previous performance traces do not certify this new monitor/cable geometry; trace work remains paused under the owner direction, and no 60 FPS guarantee is made. This evidence does not approve T013/T017, authorize merge/deployment or accept Milestone 3.
