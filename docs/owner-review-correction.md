# Actual Hero/About correction review

Status: local implementation under review, not owner acceptance. Branch: `feature/hero-about-integrated-refinement`. Frozen checkpoint `ad37b55` remains unchanged. No commit, merge, push, deployment, replacement background or next stage.

## Corrected interpretation

- Restore desktop About to the checkpoint's left monitor/portrait and right CV columns. Center the person within the monitor, not the monitor across the viewport.
- Show desktop face-linked nodes before their information. Stream stable word spans without changing layout, hold the complete information for 1.6 seconds, then dissolve the decorative outlines. The photograph and real copy remain. This is a visual illusion, not model inference.
- No annotation nodes/connectors/dust in compact phone/tablet Hero. Use separate left contact, portrait and right name/role/CTA lanes, with width/short-landscape sizing. Contact hit targets remain accessible; visible glyphs are smaller. Compact names/roles wrap where required.
- Restore previous neutral circular contacts at rest. Only fine-pointer hover or keyboard focus uses brand backplates with white glyphs. No visible contact names; accessible labels and exact destinations remain.

## Previous verification (before the newer phone-occupancy review)

- Production build, lint, typecheck and 13 unit tests pass. Contract/source checks pass with all three source hashes unchanged.
- `node tmp/verify-owner-correction.mjs 0 9` followed by `node tmp/verify-owner-correction.mjs 9 17` verifies 17 viewport/orientation combinations and generates 36 captures. Evidence: `tmp/latest-review/verification.json` and its screenshot paths, all inside the project.
- Viewports: 320x568, 390x600, 430x932, 600x844, 640x900, 700x900, 767x900, 768x900, 780x900, 790x900, 844x390, 1036x900, 1100x900, 1190x900, 1200x900, 1440x900 and 1920x900.
- Source face registration maximum error is 0.596341609954834px. Measured first words follow the visible node by 249.8–266.8ms. Measured completed-stream hold is 1599–1616.1ms.
- Every reviewed viewport uses actual WebGL draw calls, has no page/console errors, preserves person/monitor registration and returns to the same portrait geometry during reverse travel. Compact layouts never show annotation nodes. Contact labels are absent. Short-view landscape CTA stays in the visible viewport.
- Screenshots were inspected for desktop columns, empty-node-before-text, partial streaming, 320px shoulder/text clearance, 780px Hero/About and short landscape. Initial phone shoulder/text and landscape heading/name collisions were corrected before the final captures.

Full browser verification passes: `npm run test:e2e -- --workers=2`, 65 tests, no skips, exit 0; log: `tmp/latest-full-e2e-final.log`. The prior single-worker run passed 64/65 and exposed an obsolete fixed 20px texture-rescale assumption at 390px. Its replacement checks the actual visible-source change while preserving all identity, source, registration and reverse checks; the focused two-width regression and complete suite both pass. No application geometry was changed merely to satisfy that threshold.

Automation/emulation is not physical-phone testing, performance certification or owner aesthetic acceptance. Background redesign remains unaccepted and outside this correction. The actual review server remains available at `http://127.0.0.1:3000/`.

## Previous phone/tablet correction verification

The owner rejects the old phone's floating torso crop and large empty lower half, and the changing composition near 1000–1038px. Compact Hero now reveals the available same-source body to the visible viewport bottom. Its picture scales and travels after frame capture, reversibly; no missing source pixels are generated. The monitor still pre-exists beyond the initial visible stage. Compact source-height interpolation is linear in the already-eased camera progress to prevent the whole-body geometry from bouncing downward.

Tablet Hero uses one stable centered portrait with narrative left and identity/focus right across 1000, 1025 and 1038px. The left headline is `From pixels to decisions`, not a repeat of `Your ideas / Built with AI`. Compact nodes remain disabled. Portrait/monitor positions and dimensions on the 1440px desktop Hero and About are unchanged against the prior saved geometry; only the left copy changes.

Current checks: 14 unit tests, 66 browser tests, build, lint, typecheck and source/contracts pass. Browser log: `tmp/mobile-fill-e2e.log` (exit 0, 66 passed). A bounded eight-viewport visual probe (`node tmp/check-mobile-fill.mjs`) verifies 320x568, 390x844, 440x956, 1000x900, 1025x900, 1038x900, 1440x900 and 844x390, with 24 captures, live WebGL and no console/page errors. Evidence: `tmp/mobile-fill/verification.json`. This is representative review, not an exhaustive per-pixel sweep.

The phone hems are within 0.36px of their visible bottoms. At 440x956 the portrait width changes from 347px in Hero to 187px during capture and 172px in About. Sampled source-alpha intersections with name, role and CTA are zero at the reviewed viewports; compact controls remain visible. Screenshots were inspected at the owner phone size, small phone, tablet, landscape, desktop and phone capture/About. Visual acceptance and real-device testing remain open. No merge, commit, remote write, new scene or background redesign.

## Current localized spacing and About-width review

Sources: `image_f321d3.png` and `image_dc4516.png`. A stable native scrollbar gutter reproduces the near-1209px Hero overlap: compact stage geometry coexists with desktop viewport typography. Measure the headline height during layout and lower both side blocks only in that mismatch; distant accepted widths keep their previous Hero placement. Stacked About removes the desktop heading/paragraph width caps inside its existing column. The display caption now follows the monitor center and stand bottom, including phones, rather than the bottom of the reading stage. Source, WebGL geometry, navigation, background and cable design are unchanged.

Verification: 14 unit tests, lint, production build, typecheck and contracts/source checks pass. Full production browser suite: **68 passed**, no skips, exit 0 (`tmp/spacing-full-final.log`). The first full run passed 67/68: the tablet resize test sampled the previous frame before the resize handler rendered; the test now waits for the same strict centering condition rather than loosening it. Focused regressions and the full rerun both pass.

Rendered review: seven representative viewports (1206x914, 1209x914, 1214x914, 1059x900, 768x900, 440x956, 1440x900), fourteen captures, live WebGL, no page/console errors, no horizontal overflow and reversible source geometry. Evidence: `tmp/spacing-review/verification.json`, generated by `node tmp/check-spacing-correction.mjs`. The three narrow gutter cases have approximately 48px headline/side-copy clearance; their About biography uses the complete existing 840px column instead of 459px. Caption clearance is approximately 32px below the stand, before stacked About. Screenshots inspected: 1209px Hero, 1059px About, 440px About and 1440px About. The 1440px Hero portrait, About portrait and monitor rectangles exactly match the saved preceding verification. Owner acceptance and physical-device testing remain open; no merge or next stage.
