# Project-local Tooling / Reproducibility

## Installed
- Official GitHub Spec Kit v1.0.13, release commit `f1a548a39dba4e5e8600de1d2e0d3ff0c468d2a9`.
- Source `.tools/spec-kit-source`; Python 3.14.7 venv `.tools/spec-kit-venv`.
- Generic integration `.specify/commands`, sh scripts, bundled speckit workflow.
- Design lint/export CLI `@google/design.md` 0.4.0 under `.tools/designmd`.
- JSON Schema validator `jsonschema` 4.26.0 in the same local venv, for document tests only.
- `.tools/uv-cache` and `.tools/npm-cache` are the explicit cache paths for subsequent calls. `.tools/` is Git-ignored.

## Installation boundary incident (not hidden)
The first uv package-install invocation did not retain environment variables exported in an earlier tool call and therefore used the existing default cache `C:/Users/kakak/AppData/Local/uv/cache`. The installation itself was project-local, but that first cache write violated the requested project-only boundary. Spec Kit was subsequently reinstalled with an explicit per-command local cache, and the validator install also used that local cache. No global PATH/config or Hermes skills were changed. The shared uv cache has not been deleted: cleanup could affect unrelated tools and requires the owner's authorization. Do not claim that this historical write was undone.

## Rebuild commands (project-local; not global installs)
Use the existing Python rather than downloading a managed interpreter. Commands below are for a fresh tool folder; preserve `.specify/` and authored docs when rebuilding.
```bash
git clone --branch v1.0.13 --depth 1 https://github.com/github/spec-kit.git .tools/spec-kit-source
UV_CACHE_DIR='D:/AI_Engineer/Portfolio/.tools/uv-cache' UV_PYTHON_DOWNLOADS=never uv venv .tools/spec-kit-venv --python 3.14 --no-python-downloads
UV_CACHE_DIR='D:/AI_Engineer/Portfolio/.tools/uv-cache' UV_PYTHON_DOWNLOADS=never uv pip install --python D:/AI_Engineer/Portfolio/.tools/spec-kit-venv/Scripts/python.exe .tools/spec-kit-source jsonschema==4.26.0
npm_config_cache='D:/AI_Engineer/Portfolio/.tools/npm-cache' npm_config_update_notifier=false npm install --prefix .tools/designmd --no-audit --no-fund --ignore-scripts --save-exact @google/design.md@0.4.0
```
Record exact tool dependencies/source hashes in `tooling-lock.json`. Application version proposals are in the plan and have not been installed. Do not rerun `specify init --force` across authored docs without review; setup is already complete.

## Initialization actually executed
```bash
.tools/spec-kit-venv/Scripts/specify.exe init --here --force --non-interactive --script sh --integration generic --integration-options='--commands-dir .specify/commands' --ignore-agent-tools
bash .specify/scripts/bash/create-new-feature.sh --json --number 1 --short-name cinematic-identity 'Hero entrance and reversible Hero to About identity journey'
bash .specify/scripts/bash/setup-plan.sh --json
```
The CLI read-back confirmed generic is default/installed and the bundled workflow is present. Feature JSON selects `specs/001-cinematic-identity` without changing the actual Git branch. No native Hermes global skill install occurred.

## Source newline preservation
The raw North Star contains 16 CRLF boundaries among otherwise LF text. The first main commit's Git autocrlf filter normalized those 16 boundaries in the Git blob, but the working source remained its original 190,916 bytes. The raw and baseline blob hashes are therefore recorded separately. `.gitattributes` disables text conversion for this exact source file and binary assets; the feature branch will record the original raw bytes. Checks require both the original on-disk hash and equivalence to main apart from those documented newline boundaries. The source prose was not edited, and main was not rewritten.

## Git ownership and privacy
Git reported dubious ownership on the pre-existing project directory. An exact-path `-c safe.directory=D:/AI_Engineer/Portfolio` exception is used per invocation; no global config change or wildcard exemption. The initial baseline contains private source conversation/CV/portrait and stays local. No remote was added, no push occurred. Review source privacy/license before any future publication.

An optional AGENTS.md request first timed out; the owner later explicitly approved project-local creation, and the file was written. It changes project instructions only, not user-global Hermes settings.
