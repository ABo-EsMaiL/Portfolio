# Quickstart — Review and Validate Phase 2

From `D:/AI_Engineer/Portfolio` in Git Bash:

The feature selector is explicit because Spec Kit's local active-feature state is intentionally Git-ignored. This command therefore selects the same tracked spec even after a fresh checkout.
```bash
.tools/spec-kit-venv/Scripts/specify.exe version
SPECIFY_FEATURE=001-cinematic-identity bash .specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
.tools/spec-kit-venv/Scripts/python.exe scripts/check_specs.py
.tools/designmd/node_modules/.bin/designmd lint DESIGN.md
git -c safe.directory=D:/AI_Engineer/Portfolio status --short --branch
```

Open `docs/architecture-roadmap.html` for the offline visual architecture/state flow/storyboard; `docs/phase-2-review.md` is the sign-off index. Authored specs are `spec.md`, `ui-ux.md`, `data-model.md` and `plan.md`; `DESIGN.md` owns proposed tokens. `contracts/` contains real schemas/examples and exported review tokens, not app code.

Spec Kit's `.specify/commands/speckit.*.md` are project-local command templates. This agent can read and apply them; generic integration does not globally register `/speckit.*` with Hermes. Native Hermes integration was deliberately not installed because it writes outside this project. Official feature and plan scaffold helpers were executed without changing the owner-required Git branch.

No Next.js server/build exists yet. Do not run app build/test commands as if already installed. Milestone 2 begins only after package sign-off and explicit merge authorization for Milestone 1.
