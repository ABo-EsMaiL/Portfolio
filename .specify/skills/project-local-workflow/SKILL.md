---
name: project-local-workflow
description: Use when setting up or verifying this portfolio locally. Keep tools/caches isolated, sources byte-preserved and milestones owner-gated.
---

# Project-local setup and verification

This skill is deliberately stored in the repository, not registered in a global Hermes profile. Read AGENTS.md, tasks/todo.md and the active spec before acting. Latest explicit owner authorization controls scope.

- Check Git status/branch before changes. Scope every milestone to its authorized feature branch. Commit tested slices; merge only after explicit owner approval. Local tags are allowed only for authorized milestone checkpoints. Never push or add a remote without authorization.
- Preserve the three source assets and verify their pinned SHA-256 values in docs/tooling-lock.json. The original North Star mixes LF/CRLF; its -text attribute preserves raw bytes. Historical main's first blob normalized newlines, so compare documented raw and baseline hashes separately; never rewrite the original to make a check pass.
- Keep developer environments/models/caches in .tools; temporary work in project tmp/. Set UV_CACHE_DIR, U2NET_HOME, TMP/TEMP and npm cache explicitly before tool work. App node_modules/.next remain local and ignored. Native Spec Kit Hermes integration writes globally: retain generic .specify/commands instead.
- Select Spec Kit's tracked feature explicitly with SPECIFY_FEATURE=001-cinematic-identity. Active-feature state is intentionally Git-ignored.
- Discover real package engines/peer ranges before pinning; latest is not compatibility proof. Keep package-lock.json. Do not force peer overrides or skip validation to silence incompatibility. Record named tooling support gaps and production audit results.
- Prefer installed Edge and a project-local browser profile for tests; do not download a duplicate browser by default. Verify a server with a real HTTP health check, not a blind wait. Stop only browser processes belonging to this review.
- Run npm run test:unit, npm run typecheck, npm run lint, npm run build and phase-appropriate contract/source checks. Never call passing lint or document screenshots proof of a working Hero, matte quality or 60 FPS.
- Render actual implementation at required widths and inspect screenshots. Test keyboard, reduced motion, no JS/WebGL, repeated interruption and lifecycle teardown. Record actual traces/build/device details; missing real phone access remains an explicit approval gap.
- Source portrait processing is offline and owner-authorized. Models must stay out of public/ and client imports. Preserve natural facial pixels; inspect matte edges on dark/light/checkerboard at full resolution.
- Do not edit global profile/skills/PATH or source originals. Do not clean shared caches without permission. Record boundary incidents honestly.

Current Hero contract command: `.tools/spec-kit-venv/Scripts/python.exe scripts/check_specs.py --hero`.
