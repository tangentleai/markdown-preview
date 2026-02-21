# Validation Bundle - update-wysiwyg-search-experience R9 (Run 0015)

- change-id: `update-wysiwyg-search-experience`
- run#: `0015`
- task-id: `4.1`
- ref-id: `R9`
- scope: `GUI`

## Task
Implement task `4.1 [#R9]` only:
- Replace UI is collapsed by default (find area visible, replace area hidden).
- Provide explicit find/replace mode switch; replace mode shows replace input and replace action buttons.
- Closing the toolbar and reopening resets back to default find mode.

## How To Run
- Start GUI server (GUI bundle must be start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0015__task-4.1__ref-R9__20260220T173918Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0015__task-4.1__ref-R9__20260220T173918Z\run.bat`
- Execute GUI verification via MCP runbook:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0015__task-4.1__ref-R9__20260220T173918Z/tests/gui_runbook_r9_find_replace_mode_reset.md`

## Inputs / Outputs
- inputs: none (editor text seeded through MCP steps)
- expected: assertion points in MCP runbook
- outputs:
  - Supervisor GUI evidence screenshots under `outputs/screenshots/`
  - Startup and run logs under `logs/`

## Acceptance Assertions
- On first `Ctrl+F`/`Cmd+F`, `查找文本` is visible while `替换文本` is absent.
- Clicking `切换到替换模式` shows `替换文本`, `替换当前`, and `全部替换`.
- Replace flow works in replace mode (single replace then replace-all changes editor content).
- After closing the toolbar and reopening, replace controls are hidden again until switching mode.

## GUI Hard Rule
- Browser validation is MCP-only. No browser automation scripts are included in this bundle.
