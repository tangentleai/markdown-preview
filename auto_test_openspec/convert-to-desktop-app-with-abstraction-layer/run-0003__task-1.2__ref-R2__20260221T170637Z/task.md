# Task Validation Bundle

- change-id: `convert-to-desktop-app-with-abstraction-layer`
- run-id: `0003`
- task-id: `1.2`
- ref-id: `R2`
- scope: `MIXED` (CLI + GUI)

## Task Goal

Continue task 1.2 / R2 validation with unblock-oriented GUI preflight for the known Playwright MCP Chrome persistent context startup conflict, while keeping the same core migration acceptance scope.

## Included Validation Assets

- Startup log: `logs/worker_startup.txt`
- CLI checks: `tests/test_cli_core_migration.sh` and `tests/test_cli_core_migration.bat`
- GUI MCP runbook: `tests/gui_runbook_web_core_migration_unblock.md`

## How To Run

- macOS/Linux GUI start-only: `bash run.sh`
- Windows GUI start-only: `run.bat`
- macOS/Linux CLI checks: `bash tests/test_cli_core_migration.sh`
- Windows CLI checks: `tests\test_cli_core_migration.bat`

## GUI Preflight (Required before MCP navigation)

If previous run failed with `正在现有的浏览器会话中打开` / persistent context startup error:

1. Ensure prior MCP browser session is closed.
   - Use MCP close action on existing tab/context before creating a new one.
2. Ensure no stale Chrome profile lock from previous attempt remains.
   - Close all Chrome windows used by testing profile.
3. Start the web server with `run.sh`/`run.bat` and wait until URL is ready.
4. Execute GUI steps only via `tests/gui_runbook_web_core_migration_unblock.md`.

## Inputs / Outputs

- Inputs: source code and tests under `src/`
- Outputs:
  - CLI log: `logs/cli_test.log`
  - GUI evidence: supervisor stores screenshots/notes under `outputs/` and `logs/`

## Expected Results (No PASS/FAIL claimed by worker)

- CLI script exits with code `0` and runs the targeted migration test suites.
- GUI runbook is executable after preflight and covers edit, preview, and find/replace paths.
- Supervisor records final PASS/FAIL and evidence chain.
