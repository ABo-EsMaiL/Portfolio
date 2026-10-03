# Hero / About checkpoint

The owner requested a local recovery point before changing the environment and entrance. This is a checkpoint approval, not an instruction to merge into main, publish to GitHub or deploy.

## Recovery handles

- Frozen local branch: `checkpoint/hero-about-accepted-base`.
- Local annotated tag: `checkpoint-hero-about-accepted-base`.
- Next isolated review branch: `feature/engineering-world-study`.
- Complete source, assets and review evidence are committed, including previously untracked files.
- Project-local working-file archive: `tmp/checkpoints/hero-about-working-files-20261003-041732.zip`.
- Archive SHA-256: `94ce971867acfd50b63d0ae1863584586606b492aed1c0728fdb58ab274655a3`.
- Manifest: `tmp/checkpoints/hero-about-working-files-20261003-041732.json`. All 7,071 archived members were read back and hash-verified, including ignored `tmp/` studies and probes.
- A Git bundle under `tmp/checkpoints/` preserves the checkpoint history separately; verify its references with `git bundle list-heads`.

The archive excludes developer tools/model caches, installed dependencies, generated build/test output and credential/local configuration files. These remain untouched locally and must not be force-added to Git. The ignored archive is a local backup, not off-device redundancy.

## Checks rerun at checkpoint

Lint, typecheck and 11 unit tests passed. Production build and the Hero contract/source-hash validator passed. A first build encountered duplicate inactive dev/production generated type declarations; removing inactive `.next/dev/types/` resolved it without altering validation or source code. No preview listener was running on ports 3000-3003 during that cleanup.

The earlier connected prototype has browser evidence; this checkpoint report does not claim a newly rerun browser suite. Owner review of new world styling remains pending.

## Restore safely

To inspect or resume the saved application later, first preserve any new edits, then switch to `checkpoint/hero-about-accepted-base`. Do not use `git reset --hard` as a routine restore command. The frozen branch retains the previous application; the working-file archive restores temporary studies independently. Do not extract it over newer edits without comparing the manifest.

No Git remote is configured. No remote was added, and no push or merge occurred.
