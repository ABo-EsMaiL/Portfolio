# Portfolio Milestone Roadmap

**Status:** Milestone 1 approved; Milestone 2 in progress. The owner now authorizes a combined unmerged Hero → About review prototype; see `../docs/owner-narrative-alignment.md`. This exception does not approve a milestone merge or later stages.
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

### Current combined-review exception

The owner explicitly wants to judge continuity, not an isolated Hero still. The next review slice may include resource-aware entrance, three-frame lock with direct identity reveal, monitor pop-out, independent top capsule, left social docking and the start of skill cables. Use the proposed vertical slices and verification in `../docs/owner-narrative-alignment.md`. The milestone table remains the formal merge roadmap; no prior rejected Hero is considered approved and no automatic merge is implied. Detailed task acceptance must be reconciled with the new narrative before application changes.

## Architectural decisions
Native scroll + ScrollTrigger gives one story progress authority; intro is separate and killed before shared target handoff. Direct Three.js supplies spatial layers, semantic DOM supplies copy/controls. Locale/copy and authored motion are separate. Existing raw image is unchanged; processed assets are Milestone 2 work. Exact stack versions and numeric budgets are proposals in the feature plan.

## Checkpoints and parallel work
High-risk matte/face alignment comes first in Milestone 2, before coding a detection illusion around guessed pixels. Independent contract tests/asset reviews may run in parallel only after boundaries are approved. Shared motion ownership, branch transitions and scene composition stay sequential. Every completed task has a real check, not a future claim.

## Open decisions
Sign off palette/fonts, ghost treatment, timeline/handoff/native-scroll proposal, data limits and device/performance protocol now. Choose CMS/auth/media, domain/hosting budget, project order/links, extra socials and Contact form before their respective milestones. The earlier shared uv cache write is disclosed in `../docs/tooling.md`; deleting shared caches requires separate authorization.
