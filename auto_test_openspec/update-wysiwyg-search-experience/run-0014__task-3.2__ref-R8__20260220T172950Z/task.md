# Validation Bundle - update-wysiwyg-search-experience R8 (Run 0014)

- change-id: `update-wysiwyg-search-experience`
- run#: `0014`
- task-id: `3.2`
- ref-id: `R8`
- scope: `MIXED`

## Task
Fix task `3.2 [#R8]` regression only:
- Regex replace-current mutates exactly one matched range without corrupting surrounding editor text.
- Invalid regex disables actions without mutating content.
- Correcting regex restores normal match count and next navigation.

## Unified Regex Input Semantics
- Regex mode accepts two equivalent query forms:
  - raw source: `([a-z]+)-(\\d+)`
  - slash-wrapped source: `/([a-z]+)-(\\d+)/im`
- Only `i/m` flags are recognized from wrapped form.
- Global replacement/search is controlled by find flow (next/prev/current/all), not by user-supplied `g`.

## How To Run
- Start GUI server (start-server-only for MIXED bundles):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0014__task-3.2__ref-R8__20260220T172950Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0014__task-3.2__ref-R8__20260220T172950Z\run.bat`
- Run CLI matcher checks:
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0014__task-3.2__ref-R8__20260220T172950Z/tests/test_cli_r8_regex_engine.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0014__task-3.2__ref-R8__20260220T172950Z\tests\test_cli_r8_regex_engine.bat`

## Test Assets
- CLI: `tests/test_cli_r8_regex_engine.sh`, `tests/test_cli_r8_regex_engine.bat`
  - Executes `npm test -- src/utils/findMatchEngine.test.ts`.
  - Covers valid regex matching, wrapped/raw query equivalence, invalid regex diagnostics, and capture-group replacement.
- GUI (MCP only): `tests/gui_runbook_r8_regex_recovery_round2.md`
  - Verifies replace-current exactness, invalid regex non-mutation, and recovery to enabled navigation.

## Inputs / Outputs
- inputs: none (GUI text seeded by MCP runbook)
- expected: assertions in CLI tests and GUI runbook
- outputs:
  - CLI log: `outputs/cli_test_output.txt`
  - Supervisor GUI evidence: screenshots/logs under `outputs/` and `logs/`

## Acceptance Assertions
- For `alpha-42 alpha-7 alpha-11`, regex replace-current first step yields `42:alpha alpha-7 alpha-11`.
- Invalid regex query renders explicit error text, disables actions, and preserves editor content.
- After correcting regex to a valid query, error clears, actions are re-enabled, and `查找下一个` can move counter to `匹配：1/2`.
