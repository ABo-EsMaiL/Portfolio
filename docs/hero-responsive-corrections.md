# Responsive correction review

Status: local, unmerged prototype on `feature/hero-about-transition`. Owner visual acceptance is pending. No remote write, deployment or merge was performed.

## Applied to the connected Hero → About scene

- Skill icon artwork is now 60% of its preceding size, including generated field symbols. The 60px desktop / 52px phone packet envelopes and label typography stay unchanged to avoid shrinking readable captions. Contact controls retain their separate larger hit targets and conservative packet collision bounds remain intact.
- OpenCV and Computer Vision use the owner's supplied colored references, with near-white paper removed and no replacement illustration. Byte provenance is in `public/assets/skills/owner-references.json`. Original author/publication license is not established; local review use is not publication clearance.
- Cables use thinner tubes, 128 longitudinal segments, connector-aligned first tangents and vertical, tangent-continuous joins to their complete pre-existing tails. Phone connectors are under the bezel so the programming skill feed is not entirely off-screen.
- The initial monitor encloses the entire tall About stage, preventing its stand/cables from appearing below the Hero before traversal begins. Hero now shows head/shoulders only; a shared DOM/WebGL bottom boundary reversibly reveals the complete available source body in About, without changing full-source UVs. Static mode uses the same source for a cropped Hero and full-source About.

## Heading/composition integrated into the actual route

The owner explicitly requested connecting the larger `YOUR IDEAS / BUILT WITH AI` direction to the real application. It is now rendered by `src/app/page.tsx` with outline IDEAS and blue, separately treated AI; `npm run dev` serves it on the normal route, not a separate study. Phone/tablet composition is stacked; desktop is spatial. Localized line layout lives in `content/hero-ui.json`; validated continuous heading text lives in `content/en.json`, so content control-character checks remain intact. Final visual acceptance is still pending.

`tmp/hero-heading-study.html` and its screenshots are historical design-study evidence. Current implementation screenshots are `docs/hero-about-{width}-{progress}.png`.

Latest owner refinement tightens the desktop second-row margin from 10px to −8px, raises the title anchor from .11 to .10 of frame height and slightly enlarges the portrait while retaining head clearance. Both rows remain centered. Narrow-desktop side copy and the fourth social are kept clear of the larger coat. Phone Hero geometry is unchanged. `tmp/verify-desktop-polish.mjs` verifies centered rows, face clearance and overflow at 1024, 1199, 1440 and 1920px, including a 1200px-tall viewport; evidence is in `tmp/desktop-polish-verification.json` and corresponding captures.

The portrait now follows the monitor center horizontally from the start, but holds its vertical position/size until the lower aperture reaches the Hero crop hem. Then that same aperture pulls the visible bottom upward as size settles independently into About. Direct visible-height interpolation avoids vertical bounce. The cool grid is exclusive to the display; the exterior is warm and plain, including the no-WebGL fallback. The exact owner Facebook URL is preserved, four contact controls train into a 220px dock, brand hover/focus is tested in Hero and About, and mobile packet exclusion uses the larger dock boundary.

## Executed verification on the final scene build

- `npm.cmd run typecheck` — PASS.
- `npm.cmd run lint` — PASS.
- `npm.cmd run test:unit` — 11 passed, including 1001 progress samples per responsive width checking horizontal screen registration, pre-capture vertical/size hold, hem attachment and monotonic upward pull.
- `npm.cmd run build` — PASS.
- `npm.cmd run test:e2e` — all 44 passed against the development route; after the final visible-height refinement, the 5 targeted social/capture/hydration regressions passed again.
- Fresh production build on isolated review port 3002 — all 44 tests passed using `tmp/production-playwright.config.ts`, including actual WebGL/source reversal, frame capture, four socials/brand focus, trusted input, Axe, fallback paths and larger-dock packet clearance. Only agent-owned verification servers were started/stopped.
- `PLAYWRIGHT_BROWSERS_PATH=D:/AI_Engineer/Portfolio/.tools/playwright node.exe tmp/review-connected-journey.mjs` — PASS for 1440, 1024, 768, 600, 390 and 320px; native reversal verified, WebGL active, no captured page errors.
- `.tools/spec-kit-venv/Scripts/python.exe scripts/check_specs.py --hero` — PASS, source authority hashes unchanged.
- `git -c safe.directory=D:/AI_Engineer/Portfolio diff --check` — PASS.

Actual route screenshots were inspected at phone, tablet and desktop widths, including cropped Hero and complete-source About. The enhanced image and CSS fallback share the motion authority and clipping boundary.

## Development warning diagnosis

One-shot `beforeInteractive` cleanup was insufficient: a regression that reinserts the exact Grammarly attributes after their first removal reproduced the owner's same warning and failed before the fix. `src/app/layout.tsx` now guards only those two attribute names with a bootstrap MutationObserver until `Journey`'s initial client effect signals hydration commit. It then disconnects, cleans once and does not police the extension afterward; post-commit attributes are verified to remain. It handles the body arriving later in streamed HTML. No `suppressHydrationWarning`, console filter, permanent observer or extension/system setting change was added. A full page reload is needed to run this bootstrap path; HMR alone does not rerun it.

`node.exe tmp/check-dev-hydration.mjs` was red for the exact reported attribute mismatch before the fix, then green for clean and parser-time Grammarly-injected contexts. A third context deliberately injects unrelated metadata and still produces React's mismatch warning while retaining that attribute, proving diagnostics are not globally suppressed. Results are in `tmp/dev-hydration-verification.json`; this is a simulated extension-timing regression, not a claim that the owner's installed extension was driven directly.

The slow-filesystem notice is a separate compilation-performance warning, not a hydration failure. Fresh production build, development rendering and warm local HTTP requests succeeded. No antivirus, system paths, browser extensions or drive settings were modified; no claim is made that the owner's disk benchmark is fixed.

This correction run did not collect a new hardware-declared performance trace; it does not make a new FPS/performance acceptance claim.
