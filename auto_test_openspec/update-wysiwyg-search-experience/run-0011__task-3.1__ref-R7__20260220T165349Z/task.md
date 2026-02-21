# Validation Bundle - update-wysiwyg-search-experience R7 (Run 0011)

- change-id: `update-wysiwyg-search-experience`
- run#: `0011`
- task-id: `3.1`
- ref-id: `R7`
- scope: `MIXED`

## Task
Implement task `3.1 [#R7]` only:
- Case-sensitive toggle defaults to off.
- When case-sensitive is off, matching is always case-insensitive.
- When case-sensitive is on, matching is forced case-sensitive.
- Whole-word matching applies only to Latin words.
- Enabling regex mode automatically disables whole-word matching.

## How To Run
- Start service for GUI verification (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0011__task-3.1__ref-R7__20260220T165349Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0011__task-3.1__ref-R7__20260220T165349Z\run.bat`
- Run CLI matcher checks:
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0011__task-3.1__ref-R7__20260220T165349Z/tests/test_cli_r7_match_engine.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0011__task-3.1__ref-R7__20260220T165349Z\tests\test_cli_r7_match_engine.bat`

## Test Assets
- CLI checks: `tests/test_cli_r7_match_engine.sh` and `tests/test_cli_r7_match_engine.bat`
  - Runs `npm test -- src/utils/findMatchEngine.test.ts`
  - Verifies:
    - case toggle off/on behavior
    - whole-word Latin boundary behavior
    - regex `i/m` behavior under case toggle control
    - regex + whole-word mutual exclusion
- GUI checks (MCP only): `tests/gui_runbook_r7_match_options.md`

## Inputs / Outputs
- inputs: none (in-memory editor content seeded by MCP runbook)
- expected: assertions listed in CLI tests and GUI runbook
- outputs:
  - CLI console output in terminal
  - supervisor-captured GUI screenshots/logs under this run folder

## Acceptance Assertions
- With case toggle off, `alpha` matches `Alpha/alpha/ALPHA`.
- With case toggle on, `alpha` matches only exact-case `alpha`.
- Whole-word mode filters Latin word boundaries (`cat` does not match `category` or `scat`).
- Whole-word mode does not apply Latin boundary rules to non-Latin tokens.
- When regex mode is enabled, whole-word option is disabled and reset off.
