# Milestone 2 — Hero implementation review

**HISTORICAL / VISUALLY REJECTED BY OWNER.** The owner rejected this version and directed a cinematic art-direction replacement. See [current revision](hero-art-direction-review.md). Counts, screenshots, build/source fingerprints and performance traces below belong to the previous implementation, not the revised visual treatment. Trace/CDP investigation is paused. No Hero merge, push or deployment; Hero → About is not implemented.

## Verified scope
- Minimal validated Next.js/TypeScript/Tailwind shell, self-hosted fonts and semantic no-JS identity.
- Sole-source offline portrait derivatives; reviewed normalized face/crop anchors. Source originals unchanged; owner matte/crop approval pending.
- Actual Three.js natural sRGB portrait plane, thin sparse offset ghost and seeded perspective silhouette particles: three draw calls; 1200 desktop / 450 mobile; DPR caps 1.5 / 1.25. No post-process or client ML.
- GSAP owns intro and all scene render ticks. Hunting → cosmetic SIM lock → Who is he? → localized hint; trusted wheel/keyboard/CDP touch resolve once within the tested 200ms ceiling. Native scroll is retained.
- Capsule hover/focus/tap/Escape remains independent. Native wheel over the capsule still counts as journey input; Space on a toggle does not. CTA opens the existing semantic profile summary, not a new About scene.
- WebGL unavailable, context loss, texture/image failure, late decode, live reduced motion, high DPR and no-JS paths tested. Context loss restores the cutout and stops actual WebGL draw calls.

## Technical verification
- Production build PASS; strict typecheck PASS; ESLint PASS; Node unit tests **4/4**; Playwright installed-Edge browser tests **25/25**, no skipped tests.
- Viewports 320/390/768/1440; Axe has no violations in these checks; no horizontal overflow. Positive WebGL screenshot capture has no console/page errors.
- Source/spec check PASS: 4 positive contracts, 20 invalid fixtures rejected, 24 functional requirements, three original source hashes unchanged.
- Production npm audit: zero vulnerabilities at the checked time. No dependency added for CustomEase; it comes from the installed GSAP package.
- Main and peeled milestone-1 tag remain `e22ea4a184132864d3e3c00e411c3f0c3bc75f95`; active feature/hero-section has uncommitted implementation/review changes. No new commits were requested.

## Declared lab setup
- CPU: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz; GPU: NVIDIA GeForce GTX 1650; RAM: 15.91 GiB; Balanced power; reported physical refresh 60Hz.
- Installed Edge 154.0.4258.37, headless ANGLE/D3D11 on the NVIDIA GPU, unthrottled loopback, fresh contexts and disabled HTTP cache. Driver/shader cache not controlled. Not real phone hardware or field p75.
- Production build ID `G55UkO6G7OUM1OEaJns86`; source-input fingerprint `db914943a1b67c916769f450fe7b5456f8bce574df683a9e8090fbcdc1574d3b`.
- Protocol: complete intro, 20 seconds native wheel reversal, ten Hero-only stage selections interrupted by native wheel, three seconds idle. This does not claim a reversible Hero→About interval. That is Milestone 3.

| Tier / run | rAF p95 ms | Trace DrawFrame p95 ms | Paired callback + GPU p95 ms | Steady trace dropped % | LCP ms | CLS |
|---|---:|---:|---:|---:|---:|---:|
| desktop / 1 | 16.80 | 18.573 | 0.261 | 0.000 | 1844 | 0.000 |
| desktop / 2 | 16.80 | 19.151 | 0.259 | 0.000 | 136 | 0.000 |
| desktop / 3 | 16.80 | 18.815 | 0.259 | 0.000 | 92 | 0.000 |
| mobile-emulation / 1 | 16.80 | 20.750 | 0.248 | 0.000 | 88 | 0.000 |
| mobile-emulation / 2 | 16.80 | 18.581 | 0.248 | 0.000 | 140 | 0.000 |
| mobile-emulation / 3 | 16.80 | 18.329 | 0.248 | 0.000 | 88 | 0.000 |

- Initial emitted script gzip upper bound: **218.00 KiB**; deferred WebGL: **134.40 KiB**; combined **352.39 KiB**. Within the approved plan's 250KiB excluding deferred WebGL / 450KiB total-code starting budgets.
- Hero variants and scene texture are individually below 250KiB; self-hosted fonts total 42,988 bytes. Archive/mask/model are not requested by the browser.
- GPU times use paired EXT_disjoint_timer_query_webgl2 samples; CPU is the complete RAF callback issuing the three draws. Capture adds overhead. These are ready-frame costs, not cold compilation costs.
- Trace summary uses the dominant layerTreeId and excludes the first six seconds from its first DrawFrame. This approximate warm window is disclosed; it is not a phase-specific presentation timestamp. Raw traces retain cold-load stalls and whole-run dropped events.
- Long tasks are retained: maximum 914ms. Lab interaction Event Timing maxima are not field INP; no RUM/analytics was added.

## Approval gaps — do not certify 60 FPS
- **Browser compositor trace p95 exceeds the proposed 18ms ceiling in every captured run**, despite the much smaller own-work cost and nominal ~16.7ms RAF median. Trace-vs-RAF disagreement is not hidden. No story/3D/accessibility was removed to improve a number.
- A verbose cc/gpu/viz capture baseline was retained separately. Lighter trace categories reduced artifact volume but did not solve the p95 gap; this is a capture-method experiment, not an app performance improvement.
- Shader preparation now uses the installed Three.js `compileAsync`; KHR_parallel_shader_compile was confirmed on this GPU. Observed first desktop LCP changed from 3104ms to 1844ms, with maximum cold long task 2380ms → 914ms, under the same lighter protocol. The six before/after runs and raw traces are retained. Driver cache is uncontrolled and earlier cold baselines varied: this is not a statistically isolated speedup or a guarantee that first-render stalls are eliminated. A cold stall remains; the compositor p95 gap remains.
- **A representative real mid-range phone and physical browser check are still needed.** Mobile emulation uses the same GTX 1650 and is not Android/iOS GPU proof. Firefox/Safari/real iOS are not checked here.
- **Native visibility is not verified.** Headed/headless automation did not expose hidden=true when switching/minimizing; a separate native Edge/CDP probe times out even evaluating the constant `1`, before Hero readiness/visibility checks. This localizes the latest failure below the app. The passing visibility test explicitly injects a synthetic signal and checks actual draw-stop/resume. It does not certify OS/tab visibility. `hero-visibility.json` preserves the FAIL result; manual verification is still required.
- Owner visual approval of matte/crop, natural portrait, ghost strength, HUD choreography and capsule is pending. Full parent inference/matting now succeeds with byte-identical derivatives after releasing the unused ORT arena; checkpoint license caveats remain in portrait-verification.md.

## Continued technical investigation
- A six-run trivial Canvas2D platform diagnostic has compositor p95 17.254–17.407ms. Its shorter/no-scroll protocol is not a matched app A/B or acceptance proof; it does not support dismissing the app discrepancy as inevitable host jitter. See hero-platform-baseline.json.
- Disabled only GPU timer-query probing and repeated the same six-run app protocol, on the identical source/build: compositor p95 remained 18.678–19.177ms. The GPU-probe hypothesis did not close the gap. Existing GPU cost measurements remain separate; no portfolio work was skipped.
- Temporarily consolidated the two bottom-fade masks on their parent. Browser tests passed but six-run p95 was 18.541–21.745ms, no reproducible improvement. **Reverted** the CSS change, rebuilt and restored the previous appearance. Rejected experiment data and raw traces are retained, not presented as current app performance.
- The current production bundle has been rebuilt after the revert. Original app source fingerprint remains the same; build ID may differ from the captured artifact. No deployment or merge occurred. Detailed before/after data is in hero-performance-without-gpu-probe.json and hero-performance-rejected-parent-mask.json with corresponding trace-summary files.

## Review artifacts and reproduction
- Live local production app: http://127.0.0.1:3000/ (same-machine only; no deployment).
- hero-review-1440.png / hero-review-390.png are actual WebGL screenshots; portrait-matte-review.png is the dark/light/checkerboard edge board.
- hero-intro-review.gif contains seven actual sampled screenshots with measured capture durations; it is a phase storyboard, **not** smooth video or an FPS demonstration. Inspect the live app for feel.
- hero-performance.json / hero-trace-summary.json contain current run data. Raw six traces and GPU/CPU samples: .tools/review/hero/. Verbose baseline: .tools/review/hero-verbose/ and the -verbose JSON reports.
- Pre-async baseline: hero-performance-before-async.json / hero-trace-summary-before-async.json and .tools/review/hero-before-async/. No source story, particle tier or accessibility was reduced in the experiment.
- Rebuild/restart the production server before review; run npm run test:unit, npm run typecheck, npm run lint, npm run build, npm run test:e2e and the --hero spec check.
- Profiling: populate tmp/hero-hardware.json from the actual host, then node scripts/profile_hero.mjs. Do not run matting/builds concurrently. Native visibility experiment: node scripts/check_hero_visibility.mjs; its current failure is an explicit capability gap, not part of the passing automated suite.

## Owner decision required
Review the actual Hero/matte and provide the representative phone model/browser for the physical-device gate. A visual acceptance is not a merge authorization or a performance certification. Keep Milestone 2 open until remaining gates are addressed or the owner explicitly revises them.
