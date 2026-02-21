# Validation Bundle - update-wysiwyg-search-experience R8 (Run 0013)

- change-id: `update-wysiwyg-search-experience`
- run#: `0013`
- task-id: `3.2`
- ref-id: `R8`
- scope: `MIXED`

## Task
Implement task `3.2 [#R8]` only:
- Regex find/replace uses JavaScript RegExp semantics.
- Allowed regex flags are `i/m`; global matching remains controlled by find flow.
- Invalid regex shows explicit error text and does not mutate editor content/state.

## How To Run
- Start GUI server (start-server-only for MIXED bundles):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0013__task-3.2__ref-R8__20260220T172121Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0013__task-3.2__ref-R8__20260220T172121Z\run.bat`
- Run CLI matcher checks:
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0013__task-3.2__ref-R8__20260220T172121Z/tests/test_cli_r8_regex_engine.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0013__task-3.2__ref-R8__20260220T172121Z\tests\test_cli_r8_regex_engine.bat`

## Test Assets
- CLI: `tests/test_cli_r8_regex_engine.sh`, `tests/test_cli_r8_regex_engine.bat`
  - Executes `npm test -- src/utils/findMatchEngine.test.ts`.
  - Covers valid regex match (`i/m`), invalid regex error message, and regex replacement capture groups.
- GUI (MCP only): `tests/gui_runbook_r8_regex_error_recovery.md`
  - Verifies invalid-regex error rendering, non-mutating behavior, recovery to valid query, and continued find navigation.

## Inputs / Outputs
- inputs: none (GUI text seeded by MCP runbook)
- expected: assertions in CLI tests and GUI runbook
- outputs:
  - CLI log: `outputs/cli_test_output.txt`
  - Supervisor GUI evidence: screenshots/logs under `outputs/` and `logs/`

## Acceptance Assertions
- In regex mode, valid JS regex search works with `i/m` and match counting remains flow-controlled.
- Regex replace uses JS replacement semantics (including capture groups like `$1`).
- Invalid regex displays explicit error text (`正则表达式无效...`).
- Under invalid regex, find/replace actions are disabled and editor content is not modified.
- After correcting regex, error clears and normal find navigation continues.
