# Task Validation Bundle

- change-id: `convert-to-desktop-app-with-abstraction-layer`
- run-id: `0002`
- task-id: `1.2`
- ref-id: `R2`
- scope: `MIXED` (CLI + GUI)

## Task Goal

Migrate shared markdown document model, find/replace, and markdown file service logic into `src/core/` and make the current web frontend call through the core layer without behavior regression.

## Included Validation Assets

- Startup log: `logs/worker_startup.txt`
- CLI checks: `tests/test_cli_core_migration.sh` and `tests/test_cli_core_migration.bat`
- GUI MCP runbook: `tests/gui_runbook_web_core_migration.md`

## How To Run

- macOS/Linux (GUI start only): `bash run.sh`
- Windows (GUI start only): `run.bat`
- macOS/Linux CLI checks: `bash tests/test_cli_core_migration.sh`
- Windows CLI checks: `tests\test_cli_core_migration.bat`

## Inputs / Outputs

- Inputs: source code and tests under `src/`
- Outputs:
  - CLI log: `logs/cli_test.log`
  - GUI evidence (supervisor captured): save screenshots and notes under `outputs/`

## Acceptance Mapping

- Core migration:
  - `src/core/markdownDocumentModel.ts`
  - `src/core/findMatchEngine.ts`
  - `src/core/markdownFileService.ts`
- Frontend integration through core layer:
  - `src/App.tsx`
  - `src/components/WysiwygEditor.tsx`
- Compatibility wrappers retained for existing imports:
  - `src/utils/markdownDocumentModel.ts`
  - `src/utils/findMatchEngine.ts`
  - `src/utils/markdownFileIO.ts`

## Expected Results (No PASS/FAIL claimed by worker)

- CLI command exits with code `0` and runs the targeted core migration test suites.
- GUI runbook can reproduce web flows for edit, preview, and find/replace after starting local dev server.
- Supervisor records final PASS/FAIL and GUI evidence.
