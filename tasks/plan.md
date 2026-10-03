# Portfolio Milestone Roadmap

**Status:** The owner accepts the actual refined Hero → About, authorizes saving and merging/pushing the current feature branch to `main`, and requests the next connected scene on a separate branch. Both background choices are deferred until the end. See `../docs/hero-about-owner-approval.md`; older unmerged-review restrictions below are historical. Physical-device/performance gaps remain disclosed, not certified by acceptance.
**Task-list target:** `todo.md`; official feature entry point: `../specs/001-cinematic-identity/tasks.md`.

## Capability and dependency map
| Stable responsibility | Consumes | Output |
|---|---|---|
| content-contract | CV + owner copy/decisions | validated localized content and reviewed asset manifest |
| hero-identity | content-contract + matte + approved design | semantic Hero, spatial aura, detection/interruptible entrance |
| hero-about | hero-identity | reversible identity transformation and About composition |
| navigation-ui | stable implemented stage IDs | separate focus/expanded state + scroll-selection requests |
| future-content-admin | content-contract + later auth/provider decision | owner editing/public snapshot; not scaffolded now |

Motion consumes content/layout measurements; content does not depend on motion. Navigation selection requests scroll change but UI expansion does not; no circular state ownership. The owner's already supplied milestone order controls this map.

## Sequential review gates
| Milestone | Branch | Scope | Merge condition |
|---|---|---|---|
| 1 | `feature/spec-kit-setup` | official local Spec Kit, formal specs/contracts, diagram/roadmap | doc/contract checks + diagram review + explicit owner sign-off |
| 2 | `feature/hero-section` | reviewed matte/crop + spatial aura + Hero + detection/handoff | real visual, keyboard/fallback, build and declared-device performance results |
| 3 | `feature/hero-about-transition` | continuous forward/reverse Hero → About | sampled-state reversal, nav independence, responsive/performance review |
| 4 | `feature/about-capabilities` | About generates capabilities | new scoped spec/storyboard first |
| 5 | `feature/capabilities-experience` | Experience bridge / distinct real timeline entries | new scoped spec and truthful content evidence |
| 6 | `feature/experience-projects` | retrieval/agents/project artifacts/live links | confirmed project content/demo destinations; new spec |
| 7 | `feature/projects-contact` | whole-world contraction and reversible Contact | contact behavior and destinations approved |

Admin is required, not skipped: schedule its own spec/branch after provider/editing scope are decided and before production launch. Each milestone branches from approved main only after the prior reviewed work merges; do not build later scenes speculatively on stacked unapproved branches.

### Owner-requested recovery and visual study

The owner requests a recovery checkpoint and a concrete engineering-world proposal before further integration. Freeze `checkpoint/hero-about-accepted-base` at `ad37b55`; keep review work isolated on `feature/engineering-world-study`. This local stacked study is not a formal milestone merge or authorization to ship a Skills stage. Scope/spec/storyboard and dashboard-readiness findings: `../docs/engineering-world-direction.md`. The independent live study keeps the production composition unchanged; only the explicit guided-navigation speed correction changes the app now. Tasks W001-W004 in `todo.md` track this extension without closing older owner/performance gates.

The dashboard plan must unify editable profile/Hero/About/skills/social/project records behind a versioned validated snapshot and approved media references. Derive rendering, captions, icon choice and responsive layout from those records. Review the current six-social schema limit, fixed four-contact geometry, fixed-ID icon branches and split Hero UI content before claiming add-item readiness. Overflow handling and bounded GPU packet counts are acceptance criteria, not reasons to hide extra content. No speculative CMS/database/auth scaffolding now.

### Current combined-review exception

The owner explicitly wants to judge continuity, not an isolated Hero still. The next review slice may include resource-aware entrance, three-frame lock with direct identity reveal, monitor pop-out, independent top capsule, left social docking and the start of skill cables. Use the proposed vertical slices and verification in `../docs/owner-narrative-alignment.md`. The milestone table remains the formal merge roadmap; no prior rejected Hero is considered approved and no automatic merge is implied. Detailed task acceptance must be reconciled with the new narrative before application changes.

## Architectural decisions
Native scroll + ScrollTrigger gives one story progress authority; intro is separate and killed before shared target handoff. Direct Three.js supplies spatial layers, semantic DOM supplies copy/controls. Locale/copy and authored motion are separate. Existing raw image is unchanged; processed assets are Milestone 2 work. Exact stack versions and numeric budgets are proposals in the feature plan.

## Checkpoints and parallel work
High-risk matte/face alignment comes first in Milestone 2, before coding a detection illusion around guessed pixels. Independent contract tests/asset reviews may run in parallel only after boundaries are approved. Shared motion ownership, branch transitions and scene composition stay sequential. Every completed task has a real check, not a future claim.

## Open decisions
Sign off palette/fonts, ghost treatment, timeline/handoff/native-scroll proposal, data limits and device/performance protocol now. Choose CMS/auth/media, domain/hosting budget, project order/links, extra socials and Contact form before their respective milestones. The earlier shared uv cache write is disclosed in `../docs/tooling.md`; deleting shared caches requires separate authorization.
