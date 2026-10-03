# T009 — portrait asset verification

Status: independently checked locally; owner visual approval remains pending. Hero milestone is not merged.

## Source and geometry
- Original SHA-256 unchanged: `b7d08c04b6759e21e6f58df44069329584ed4c826891066f7473fe800add15e4`. No image upload, generated face, or browser ML.
- Normalized anchors in the manifest and runtime `content/en.json` agree. `tests/journey.test.ts` checks the original-to-Hero crop transform against the measured Hero-relative face box.
- Original decoded face interior RGB and opaque alpha were independently checked. White-shirt opacity and lossless round-trip regression checks also pass in the export script.
- Parent inspected the dark/white/checkerboard board and 100% crown tiles: no obvious cyan fringe or cut facial features; existing JPEG hair softness remains.

## Checked derivatives (6)
| Asset | Dimensions | Bytes |
|---|---|---:|
| `assets/portrait-source-cutout.webp` | 3072×4096 | 2,906,494 |
| `assets/portrait-source-mask.png` | 3072×4096 | 129,228 |
| `assets/portrait-hero-640.webp` | 640×640 | 29,646 |
| `assets/portrait-hero-960.webp` | 960×960 | 49,826 |
| `assets/portrait-hero-1280.webp` | 1280×1280 | 75,248 |
| `assets/portrait-scene-960.webp` | 960×1280 | 60,914 |

The scene loads the small source-aligned texture, not the full-resolution archival cutout or model. Its Hero UV window uses the same original portrait and can widen in Milestone 3 without swapping identity. Hero → About is not implemented.

## Reproduction and limitation
- Complete inference/matting: `.tools/portrait-venv/Scripts/python.exe scripts/process_portrait.py`.
- Verified re-export: `.tools/portrait-venv/Scripts/python.exe scripts/process_portrait.py --reuse-reviewed-matte`.
- Earlier full-resolution reruns exhausted NumPy memory. A new isolated reproduction located the failed 963MiB allocation in the closed-form sparse system, while the unused ONNX Runtime arena was still retained. Releasing the completed inference session and collecting it **before** matting fixed the overlap without lowering resolution or changing the solver.
- The complete parent inference/matting/export rerun now exits **0**. All six derivative SHA-256 values and the entire manifest match the previously reviewed archive, including the 60,914-byte scene texture. Source/opaque-face RGB/white-shirt/geometry checks pass. This is full-pipeline reproducibility, not reuse-mode-only evidence.
- Upstream DIS license evidence explicitly covers code/metrics; a separate checkpoint license grant is not confirmed. Local authorized processing is recorded; do not certify commercial weight redistribution or publishing clearance from that evidence.

## Historical DOM integration evidence (before spatial integration)
Production build, four unit checks, strict typecheck, lint and source/contract checks passed. Four viewport tests (320/390/768/1440) plus intro interruption, capsule focus/Escape, reduced motion, missing image, and no-JS tests passed: **14 browser tests total**. Parent inspected staged 1440/390 screenshots. All four tested intro phases settled within the asserted 200ms ceiling, including repeated input and a late image-decode race.

These checks cover the DOM/HUD/fallback slice. The Three.js integration, real wheel/touch/keyboard input matrix, context loss/teardown, network/bundle budgets and declared-device three-run performance traces are still pending; they are not certified by this report.

Subsequent spatial integration and its current evidence/gaps are recorded in [Hero milestone review](hero-milestone-review.md). This historical paragraph is not the current task status. Owner portrait approval and checkpoint-license limitations remain open; the parent full-pipeline reproduction issue is resolved.
