# Portfolio — Phase 1: Source Analysis and Decision Gaps

Status: historical Phase 1 analysis; not an approved implementation specification. The owner subsequently resolved source completeness, asset strategy, stack, detection, language and Phase 2 authorization in `docs/phase-2-decisions.md`; the open questions below describe the earlier checkpoint.
No frontend code, Git initialization, package installation, deployment, or Hermes configuration changes were performed.

## Evidence and scope

- North Star: `chatgpt-chat-2026-09-20.md`, fully read, 4,903 lines. The export has 35 top-level messages: 20 User and 15 ChatGPT. It is not a numbered 75-question interview. A further conversation is embedded in the last User message.
- Ten individual paragraphs exceed the file reader's per-line display limit. Their complete text was recovered directly in smaller chunks. The actual source contains no literal `[truncated]` markers.
- Professional content: the complete extracted text of `AI & Machine Learning Engineer.pdf` was read. CV statements are source-backed, not independently audited performance or clinical claims.
- Portrait: `Picsart_26-07-31_23-36-42-453.jpg.jpeg`, 3072 × 4096 pixels, 3,666,212 bytes. Visually inspected. Available framing extends from the head to the upper thighs, not the entire body. The existing image supports a head-and-shoulders crop and a wider upper-body reveal without generating new body pixels.
- Before this report, the project contained only those three source assets. No local or parent Git repository was found.
- Missing: the generated Hero image praised and provisionally approved in the conversation. The portrait is not that image. The export's image placeholders do not provide its visual content.

Interpretation rule: explicit later User corrections supersede earlier wording or assistant proposals. A proposed idea remains provisional unless approved. This report does not convert an assistant suggestion into a user requirement.

## Executive digest

Build a professional AI & Machine Learning Engineer portfolio as one persistent, interactive visual world. It should feel camera-led and causally connected rather than like vertically stacked sections decorated with animations. The introductory portrait scan runs automatically; everything after the introduction is led by the visitor. Objects persist, change roles, decompose and recombine so that each composition generates the next. Backward input must undo those changes coherently.

The Hero concept is provisionally accepted: identity/copy on the left, a head-and-shoulders portrait on the right, a restrained AI atmosphere, portrait-bound detection annotation, and a white/translucent blurred iPhone-like navigation capsule. The digital ghost/light treatment in the missing generated image matters; a substitute must not be invented and labelled approved.

Content management is a real requirement, not a future extra. The owner must be able to change copy, portrait/media, capabilities, experiences, projects and links without editing source components. Live projects are independent destinations on domains or subdomains, not portfolio path-based demos.

The immediate design checkpoint inherited from the end of the source conversation is Hero → About, not an attempt to invent the entire final site at once.

## Requirements and decisions ledger

Each `N` reference is a line or line range in the North Star Markdown; `M` refers to the new mission attachment. IDs are traceability identifiers, not reconstructed interview questions.

| ID | Extracted requirement / decision | Status | Evidence |
|---|---|---|---|
| R01 | Professional identity is AI & Machine Learning Engineer, not a generic web developer persona. | Confirmed | N859; CV summary |
| R02 | The visual identity must be custom to the owner rather than an AI-generated template. | Confirmed | N16, N859; M16 |
| R03 | One persistent viewport/world, not a visibly stacked section-based page. | Confirmed | N851, N1172–1259, N2966–2984 |
| R04 | Wheel/trackpad progression controls movement through the world. | Confirmed | N1213–1215, N2970–2980 |
| R05 | Conventional visible scrolling-page behavior is rejected; exact hidden-scroll/input implementation is unresolved. | Intent confirmed; mechanism open | N851, N2944, N2982 |
| R06 | Use a hybrid of camera movement, object continuity and scene transformation. | Confirmed | N2944, N2988–3019 |
| R07 | Do not force the entire journey to revolve around one travelling object. | Confirmed | N2944 |
| R08 | The visitor controls journey pace; it must not autoplay through the entire portfolio. | Confirmed | N2944, N3084–3088 |
| R09 | Automatic motion is allowed for the introductory detection sequence. | Confirmed | N2936, N2944 |
| R10 | Reverse movement must reconstruct earlier states, not leave broken or random animation state. | Confirmed | N16, N2944, N2984 |
| R11 | Elements should transform into or generate subsequent elements rather than abruptly disappear. | Confirmed | N2228, N2998–3019 |
| R12 | Text is part of the composition and can change arrangement or role. | Accepted principle | N174–194, N857 |
| R13 | Movement serves professional storytelling; avoid a decorative animated technical diagram. | Accepted direction | N2304–2406, N2946 |
| R14 | References supply behavior and composition principles, not copied branding or page designs. | Confirmed | N2228, N3584–3617, N4035–4059 |
| R15 | The primary reference is exactly https://pear.no/, not Bear or earlier mis-transcriptions. | Corrected and confirmed | N3584–3585 |
| R16 | Love & Money's Our Playbook supplies the fixed-viewport/changing-content reference. | Confirmed preference | N1515, N2952 |
| R17 | The OBYS/Format reference supplies object continuity and transformations. Its exact reference URL needs confirmation. | Behavior confirmed; URL open | N1522, N2936 |
| R18 | Codrops supplies specific interaction techniques rather than a collage of effects. | Accepted direction | N1520, N2901–2908, N4039 |
| R19 | Hero should still look like a professional portfolio entrance, not an overt movie-player screen. | Confirmed | N2936, N3633 |
| R20 | Hero has a text/identity side and a portrait side; left/right assignment is established in the handoff. | Accepted baseline | N3633, N3675–3679, N4754 |
| R21 | Hero portrait is head and shoulders, using the supplied personal photo. | Confirmed | N4252, N4380–4386 |
| R22 | Remove the original photo background for the Hero. | Confirmed | N4252, N4288 |
| R23 | About can reveal a wider upper-body crop from the same photo. | Confirmed intent | N4252, N4866 |
| R24 | About background may be original, custom or removed; this choice is not finalized. | Open | N4252 |
| R25 | Hero UI should be sparse, not a widget-heavy AI dashboard. | Accepted direction | N4284, N4441, N4690 |
| R26 | Detection starts on load/reload, not only on the first wheel movement. | Confirmed | N2936, N4416 |
| R27 | The detection frame searches by moving and changing dimensions before locking onto the face. | Confirmed | N4416, N4457–4485 |
| R28 | Detection is followed by identity uncertainty, which motivates discovery. | Confirmed | N3633, N4416 |
| R29 | Exact failure presentation is undecided: a subtle failure marker versus the assistant's unresolved/unknown wording. | Open | N4416, N4531–4563 |
| R30 | The question is an annotation/speech bubble attached to the portrait/detection, not a separate screen or detached card. | Confirmed | N3633, N3699–3711 |
| R31 | Remove “What is in his mind?” from the final Hero copy. | Explicit correction | N3633 |
| R32 | “Who is he?” is the established question concept; exact published wording remains to be frozen. | Accepted direction | N3633, N4498, N4855 |
| R33 | Reject “Start Journey” as a film-like marketing CTA; “Find out” is subsequently used and accepted in discussion. | Corrected direction | N3633, N4510, N4665 |
| R34 | Include a clear gesture hint such as “Scroll to explore.” | Accepted direction | N4521–4527, N4665 |
| R35 | Exact intro delay, stage timing and total duration are not specified; several approximate timings appear. | Open | N2936, N3627, N4447 |
| R36 | Keep the approved digital ghost/light/particle treatment and integrate it into the transition. | Confirmed preference; asset missing | N4708, N4756, N4869 |
| R37 | AI atmosphere must be recognizable but restrained, not cliché sci-fi HUD clutter. | Confirmed | N4665, N4687–4693 |
| R38 | No terminal-themed portfolio. | Confirmed | N16, N859 |
| R39 | Reject generic gradient-hover/glow/template aesthetics; this is not a blanket ban on the particular light effect later approved. | Confirmed with later exception | N16, N4708 |
| R40 | Neither light nor dark mode was definitively selected; quality matters more than that label. | Open | N16, N3633 |
| R41 | Exact colors, typography, spacing, dimensions, radii and motion curves are absent. | Open | N3542–3556, N4392–4407 |
| R42 | Navigation is an iPhone-like rounded interactive control, not a literal island illustration. | Explicit correction | N3633, N3647–3651 |
| R43 | Navigation material is white/light, translucent and blurred; subtle glow was mentioned. | Confirmed direction | N1515, N3633 |
| R44 | Navigation is expanded in the Hero. | Confirmed | N3627, N3653 |
| R45 | When the journey starts, navigation compresses into a compact current-stage title. | Confirmed | N3627, N3657 |
| R46 | Social/contact nodes emerge from navigation toward the side during the journey. | Confirmed intent | N3627, N3657–3663 |
| R47 | Navigation expands on hover to show all stages and contracts after the pointer leaves. | Confirmed desktop behavior | N3627, N3665 |
| R48 | Stage selection traverses intermediate choreography smoothly rather than instantly skipping all states. | Confirmed | N3627 |
| R49 | Current-stage text updates as the world progresses. | Confirmed | N3627 |
| R50 | Social-link count is editable through the admin and the group remains centered as items change. | Confirmed | N3627, N3663 |
| R51 | Hero social icons must not be top-right; place them below the CTA/hint or at the left-side position described by the owner. | Confirmed constraint; exact position open | N4665, N4677–4681 |
| R52 | LinkedIn, GitHub and email are CV-backed; WhatsApp/Facebook are requested possibilities requiring exact destinations. | Mixed confirmed/open | N3627; CV contact block |
| R53 | Detection/annotation should generate About through a continuous transformation. | Accepted next direction | N4613–4645, N4843–4888 |
| R54 | Proposed first transformation converts detection/ghost elements to points, network and profile layers while widening portrait framing. | Proposal awaiting visual approval | N4824–4835, N4859–4883 |
| R55 | About reveals identity, problems solved and real capabilities, not a dumped CV list. | Accepted direction | N4831–4833, N4877–4888 |
| R56 | About generates capabilities/skills rather than ending before a disconnected skills section begins. | Confirmed | N3627, N3152–3156 |
| R57 | Primary skills presentation is capabilities/systems/objects, not a plain list, star ratings or ordinary skill cards. | Confirmed | N1526, N3164–3187, N3747–3753 |
| R58 | Technology names may remain in secondary detail; capability labels and exact grouping are not finalized. | Open detail | N3170–3182 |
| R59 | Code/functions/equations forming an ML representation is a candidate visual metaphor, not approved final geometry. | Provisional | N3627, N3633, N4894 |
| R60 | ML/Transformer decomposition and token/language fragments producing Experience are candidate choreography. | Provisional | N3627, N3753–3807 |
| R61 | Transformer/tokenizer representations must be engineered as an artistic metaphor without falsely explaining the technical architecture. | Technical clarification needed | N3633, N3789–3801 |
| R62 | Experience presentation may use a stable scene with moving entries; exact layout is undecided. | Provisional | N2952, N3222–3244 |
| R63 | Education, internship and military service can be represented distinctly; future experience must be addable. | Accepted scope; hierarchy open | N2952, N3240–3244; CV |
| R64 | Experience becoming stored knowledge/retrieval, then RAG/agents and projects, is a proposed bridge. | Provisional | N3627, N3811–3843 |
| R65 | Projects must feel like artifacts produced by earlier systems, not a generic uniform card grid. | Confirmed | N2946, N3280–3294 |
| R66 | Projects evolve toward deployment and expose Live/GitHub actions. | Accepted direction | N3292–3312, N3847–3861 |
| R67 | Live project destinations use independent domains/subdomains, not /projects/name for the deployed demo. | Confirmed | N855, N1412–1432, N3310–3312 |
| R68 | Project preview, tags, exploration and links should be organized and interactive; case-study details and opening behavior are not finalized. | Intent confirmed; details open | N16, N481–586 |
| R69 | Finale contracts the whole world back into identity/contact, not just a group of cards. | Confirmed | N2946, N3316–3347, N3865–3883 |
| R70 | Reversing the finale should unfold the world from contact back to its previous state. | Confirmed | N3627 |
| R71 | An admin dashboard must edit content without requiring JSX/source edits. | Confirmed | N855, N1356–1408 |
| R72 | Editable data includes identity/Hero, About, skills, experience, projects, certificates, links and media. | Accepted content scope | N1378–1390, N855 |
| R73 | Content updates must not silently break choreography; cardinality, text-length and media constraints need a contract. | Architectural gap to resolve | N855, N3627; derived consequence, not an approved limit |
| R74 | Responsive behavior is required on phones, tablets and computers. | Confirmed | N2944; M59 |
| R75 | Keyboard/touch alternatives to hover, reduced-motion behavior and no-WebGL/no-JS readability are not specified. | Open implementation requirements | N3627; M59 accessibility requirement |
| R76 | Performance and security are required; improve performance without silently downgrading the approved visual concept. | Confirmed | N1515, N2950; M59 |
| R77 | No paid development/design services; the source permits hosting/domain expense, but service budgets need clarification. | Confirmed budget intent | N857 |
| R78 | Video may support specific transitions or concept exploration, but cannot replace required interactive objects. | Accepted constraint | N853, N1116–1168, N4093–4220 |
| R79 | Do not choose technology first and then force the entire experience into Three.js/video. | Accepted direction | N3435–3483 |
| R80 | The next approved work boundary is the first Hero → About transition, with owner feedback before expanding scope. | Confirmed process | N4816–4835, N4839–4898 |
| R81 | Read and clarify before frontend coding; no guessing at missing design/core features. | Mandatory | M15–18, M65–70 |
| R82 | Initialize Git before application code; commit baseline docs/specifications to main. | Mandatory future phase | M29–31 |
| R83 | Use isolated feature branches for every phase/component. | Mandatory future phase | M32 |
| R84 | Merge only after tests, visual verification and explicit approval. | Mandatory future phase | M33, M61 |
| R85 | Initialize Spec Kit and produce functional, design-system, data-contract and execution-plan artifacts. | Mandatory future phase | M34–36 |
| R86 | Produce a component/state-flow architecture diagram. | Mandatory future phase | M54 |
| R87 | All professional claims must align with the supplied CV. | Mandatory | M18 |
| R88 | Do not create project work outside the project without permission; temporary-directory intent needs reconciliation with host scratch policy. | Mandatory boundary; clarify | M4 |

## CV-backed content

### Identity and history

- Name as written: Ahmed AbdElHady Mohamed Esmail.
- Title: AI & Machine Learning Engineer; location: Cairo, Egypt.
- Bachelor of Computer Science, Modern Academy For Computer Science And Information Technology, graduation 2024; grade 3.18 / 4.00.
- AI and Machine Learning Intern, AMIT Learning, June 2023–February 2024. Work description includes Python/TensorFlow, CV, NLP and the model lifecycle.
- Military service completed, Egyptian Armed Forces, February 2025–March 2026. Do not portray this as another AI engineering job.
- English Intermediate; Arabic Native or Bilingual.

### Four named primary projects

| Project | CV-supported content | Publication caveats |
|---|---|---|
| Psoriasis Disease Classification System | Hybrid CNN/ViT; FastAPI/Docker API; Keras-to-TFLite conversion; asynchronous file-handling pipeline. | No numeric clinical performance, clinical validation or regulatory approval is supplied. |
| Omni Enterprise AI Agent (Custom Agentic Workflow) | Manual ReAct loop with LangChain Core, in-memory sessions, mock enterprise JSON databases, Pydantic/FastAPI and Ollama Qwen 2.5. | Preserve the word mock; do not imply real enterprise system integrations. |
| Smart Document Q&A System (Local RAG Engine) | FastAPI, ChromaDB, Ollama, PDF ingestion, chunking, local embeddings, Nomic-Embed-Text and guardrail prompts. | Local/private intent is supported. Do not promise guaranteed elimination of hallucinations. |
| Enterprise AI Automation Suite (n8n Multi-Agent Platform) | 19+ workflows; WhatsApp/Telegram router with 5 sub-agents; Airtable; Google Drive/Pinecone ingestion and namespace isolation. | Numbers are CV claims, not independently reproduced benchmark results. |

Additional academic projects: image caption generation, breast cancer detection, T5 text summarization and an NLP music recommender using TF-IDF/cosine similarity, Spotify API and Streamlit. The captioning project states 98% accuracy without a named metric, dataset, split or evaluation method: request clarification before publishing it as a headline result.

Certificates listed: University of Colorado Boulder computer vision (Mar 2024), DeepLearning.AI deep learning fundamentals (Jan 2024), IBM CV/image processing (Jan 2024), and DataCamp data scientist / data analyst Python certificates (Dec 2023). Certificate evidence/URLs are not supplied.

Skills categories cover Python/JavaScript/SQL; ML/DL/CV/NLP/GenAI/RAG/agents; TensorFlow/PyTorch/Keras/OpenCV/LangChain/LangGraph/Pandas/NumPy/scikit-learn; FastAPI/Docker/Pydantic/REST/Git/MLOps; PGVector/ChromaDB/Pinecone/Ollama/n8n/PostgreSQL.

CV-backed destinations: ahmedaboesmail16@gmail.com, linkedin.com/in/ahmed-abdelhady-esmail, github.com/ABo-EsMail. Phone numbers appear masked in the extracted content and must not be reconstructed. No individual project repository/demo URLs or publication bibliography are present in the extracted CV.

## Tech stack: what is and is not selected

No final implementation stack or dependency versions are selected in the North Star.

- React/Next.js, GSAP/ScrollTrigger, Framer Motion, Lenis, Three.js/WebGL and Vercel are discussed as possibilities or recommendations.
- React and Django also describe the owner's learning background; that is not a requirement to use Django.
- DOM + GSAP was suggested as a starting point with selective WebGL if the approved design earns it.
- Tailwind, TypeScript, Supabase and Sanity are not specified in the source.
- No CMS/auth/database/media-storage provider, package manager or exact deployment topology is chosen.

Recommendation for discussion, not authorization: a React/Next.js + TypeScript application with GSAP/ScrollTrigger for shared reversible choreography; semantic DOM for content/controls; selective Three.js only where the approved spatial composition requires it. Do not add Lenis, a second animation library, global state framework or microservices by default. CMS/provider choices must follow the approved admin scope and budget.

## Logical architectural summary — proposal only

```text
Authenticated owner → Content admin → Validated content + media → Public portfolio
                                                               │
                                                  Semantic content + links
                                                               │
Wheel / touch / keyboard / navigation → Journey progress → Shared visual timeline
                                             │                    │
                                Current stage + navigation    DOM + optional WebGL
                                             │
                                       Project selection → Independent live subdomain

On load: autonomous intro timeline → visitor-controlled journey
```

Suggested capability boundaries for approval:

| Module ID | Responsibility | Dependency |
|---|---|---|
| content | CV-backed identity, capabilities, history, projects, links and media contract | — |
| admin | Authenticated editing and publishing; media validation | content |
| experience | Persistent world, introduction, reversible journey and approved transformations | content |
| navigation | Compact/expanded stage navigation, social controls and input alternatives | experience |
| project-explorer | Project details and verified external demo/repository destinations | content, experience |

These are logical responsibilities, not a mandate for five services or five packages. A single application may cover the portfolio and admin. Independent project applications are separate only because the source explicitly requires independent destinations. No deployment provider is implied by the diagram.

Important constraints to resolve in the specifications:

- Intro timing is separate from journey progress. Define early input, replay, interruption and returning to the Hero.
- Stage navigation must advance the same progress/timeline as wheel/touch, rather than another animation controller with divergent state.
- Expanding a navigation menu must not unexpectedly advance the camera; touch and keyboard need equivalent controls.
- Public content and media must survive missing/empty data and additions without overflows or inaccessible offscreen content.
- Native semantic links/buttons and readable text remain necessary even when the visual stage is immersive.
- Decorative face scanning should not be represented as real model inference unless that feature is explicitly approved.
- A tokenizer is normally a preprocessing component; representing it inside a Transformer can be an artistic metaphor, not a technical claim.
- Vercel discussion does not decide where local Ollama sessions, persistent files or model inference will run for live demos.

## Selected Hermes skills and actual readiness

The live skill catalogue returned 98 entries, including plugin-qualified entries; this is not a claim of 98 unique installed plugins.

Loaded for analysis/selection:

- using-agent-skills
- ponytail (full)
- spec-driven-development
- pdf
- design-md
- popular-web-designs (reference knowledge only; no template selected)
- frontend-ui-engineering
- architecture-diagram (includes cloud/infra diagrams; does not decide providers)
- git-workflow-and-versioning
- code-review-and-quality
- performance-optimization
- codex
- opencode
- computer-use
- hermes-agent

The Skills Retriever context hook is present in this session. The catalogue also exposes the Ponytail plugin namespace. No plugin was newly installed or enabled, no profile configuration was changed, and no external coding worker was launched.

Read-only PATH discovery found Git, Node, npm, uv and OpenCode. `specify` and the standalone `codex` executable were not found on this shell's PATH. OpenCode authentication/runtime readiness was not tested. Computer Use instructions were loaded but desktop automation was not exercised. Loading a skill is not proof its external CLI/service is operational.

Official Spec Kit README was retrieved from https://raw.githubusercontent.com/github/spec-kit/main/README.md. It currently documents `uv tool install specify-cli` and integration-specific initialization. No installation was run; integration compatibility and file-write locations must be verified before initialization. Hermes documentation index was retrieved from https://hermes-agent.nousresearch.com/docs/llms.txt. The web extraction backend was search-only, so direct read-only HTTPS retrieval was used instead.

## Clarifications before initialization and implementation

### Gate A — authoritative inputs and setup authorization

1. Is this 35-message export the complete North Star, or is there a separate approximately 75-question interview? Supply it if it exists.
2. Please supply the last provisionally approved generated Hero image with the digital ghost/light treatment. If it is elsewhere, provide its exact path and authorize reading it. Do not restart the approved art direction from scratch without that evidence.
3. Does “Spec Kit” mean the official GitHub `github/spec-kit` project? May tools be installed strictly within the project, or may installer-managed caches/configuration outside it be used? No global installation is currently authorized.
4. What did `/tmp` mean on this Windows machine? No temporary project file has been created. A project-local `tmp/` would satisfy project containment, while any Hermes-managed scratch outside the project requires permission and remains subject to the host policy.
5. May the technical stack be proposed for review, or must an existing exact stack be followed? The source does not select one.

### Gate B — decisions needed to write binding specs / code

6. Should the first specification focus on Hero + navigation + Hero → About, leaving later choreography explicitly provisional? The source's final checkpoint says to do exactly that.
7. With the missing Hero baseline supplied, may exact tokens be extracted and proposed for approval rather than asking the owner to invent hex values/fonts from scratch? Confirm final theme, fonts and composition through that review.
8. Is detection a choreographed visual effect or actual browser/model inference? What exact timing, question/CTA wording and failure cue should ship? What happens if a visitor scrolls before the intro completes?
9. What is the website language: English, Arabic or bilingual? What is the displayed name and final Hero/About copy?
10. What admin scope ships first: content/media only, or also ordering, theme and motion editing? Who can access it, how is access authenticated, and are draft/preview/publish and rollback required? Define acceptable update delay.
11. What is the hosting/domain budget and preferred CMS/storage/auth setup? Which domain is available? Are existing live projects supplied, or is building/hosting their demos a separate scope?
12. Which projects are featured, in what order, and what are their exact repository/live URLs and screenshots? Clarify captioning “98% accuracy”; confirm whether publications exist, since none are listed in this CV.
13. Which social destinations and contact behavior should ship? Confirm exact WhatsApp/Facebook URLs if wanted. Is contact links-only or a form with delivery/storage/spam protection?
14. What is the preferred phone/keyboard/reduced-motion fallback? May a simplified readable mode exist for accessibility without changing the approved full-motion desktop composition?
15. Which browsers/devices and measurable quality budgets should gate approval? Proposed starting points, not approved targets: WCAG AA, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, and smooth motion tested on a named mid-range phone. Define counts/text/media limits or overflow behavior for admin-managed content.
16. Please confirm the exact OBYS/Format and Love & Money reference URLs if live reference inspection is wanted; do not infer spelling from older transcriptions.

## Phase boundaries and verification

Phase 1: all source text available on disk has been read; portrait inspected; requirements and professional content separated from proposals; gaps identified. Missing visual baseline and the interview-count discrepancy prevent claiming all requested inputs are complete.

Phase 2 remains gated: initialize local Git, commit baseline documentation to main, create `feature/spec-kit-setup`, initialize the approved Spec Kit integration and generate modular specifications/plan/architecture diagram. Confirm the intended exception allowing the initial docs-only baseline commit on main before normal feature branching.

Phase 3 remains gated: feature branches per phase/component; tests and real visual/runtime checks; explicit owner approval before merge. No merge, deployment, global tool installation or frontend implementation has been authorized by this analysis.
