# Validation Bundle - update-wysiwyg-search-experience R7 (Run 0012)

- change-id: `update-wysiwyg-search-experience`
- run#: `0012`
- task-id: `3.1`
- ref-id: `R7`
- scope: `MIXED`

## Task
Fix task `3.1 [#R7]` Latin whole-word regression only:
- Whole-word Latin matching counts repeated token hits correctly when tokens are separated by editor block boundaries.
- Case toggle + whole-word combination remains correct.
- Regex mode still auto-disables whole-word.

## How To Run
- Start service for GUI verification (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0012__task-3.1__ref-R7__20260220T170855Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0012__task-3.1__ref-R7__20260220T170855Z\run.bat`
- Run CLI matcher checks:
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0012__task-3.1__ref-R7__20260220T170855Z/tests/test_cli_r7_match_engine.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0012__task-3.1__ref-R7__20260220T170855Z\tests\test_cli_r7_match_engine.bat`

## Test Assets
- CLI: `tests/test_cli_r7_match_engine.sh`, `tests/test_cli_r7_match_engine.bat`
  - Runs `npm test -- src/utils/findMatchEngine.test.ts`.
  - Covers case toggle behavior, Latin whole-word boundary, block-boundary whole-word regression, regex/whole-word mutual exclusion.
- GUI (MCP only): `tests/gui_runbook_r7_latin_whole_word_regression.md`

## Inputs / Outputs
- inputs: none (editor content seeded in MCP runbook)
- expected: assertions in CLI tests and GUI runbook
- outputs:
  - CLI output in terminal
  - supervisor-captured GUI screenshots/logs under this run folder

## Acceptance Assertions
- Query `cat` with whole-word ON returns `0/2` for text `cat category scat cat`.
- First `cat` at line start is counted correctly even when previous line ends with Latin letter.
- Case-sensitive toggle remains explicit and deterministic.
- Regex mode ON disables whole-word toggle.
