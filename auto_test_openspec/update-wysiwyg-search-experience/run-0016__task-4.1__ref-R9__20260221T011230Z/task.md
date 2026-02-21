# Validation Bundle - update-wysiwyg-search-experience R9 (Run 0016)

- change-id: `update-wysiwyg-search-experience`
- run#: `0016`
- task-id: `4.1`
- ref-id: `R9`
- scope: `GUI`

## Task
Fix task `4.1 [#R9]` replace-mode replacement integrity only:
- Keep default find mode and find/replace mode toggle behavior.
- Keep close-and-reopen reset to default find mode.
- Fix `替换当前` and `全部替换` so they mutate exact target matches without corrupting surrounding text.

## How To Run
- Start GUI server (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0016__task-4.1__ref-R9__20260221T011230Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0016__task-4.1__ref-R9__20260221T011230Z\run.bat`
- Execute MCP GUI verification using:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0016__task-4.1__ref-R9__20260221T011230Z/tests/gui_runbook_r9_replace_integrity_round2.md`

## Inputs / Outputs
- inputs: none (MCP runbook seeds editor content deterministically)
- expected: runbook assertion points
- outputs:
  - screenshots under `outputs/screenshots/`
  - startup and execution logs under `logs/`

## Acceptance Assertions
- Opening find toolbar defaults to find mode (`替换文本` hidden).
- Switching to replace mode shows `替换文本`, `替换当前`, and `全部替换`.
- For seeded text `alpha beta alpha beta`, replace-current after one next-navigation yields `ALPHA beta alpha beta`.
- Subsequent replace-all yields `ALPHA beta ALPHA beta` with no surrounding text corruption.
- Closing and reopening toolbar resets to find mode.

## GUI Hard Rule
- This bundle contains MCP runbook only (no browser automation scripts).
