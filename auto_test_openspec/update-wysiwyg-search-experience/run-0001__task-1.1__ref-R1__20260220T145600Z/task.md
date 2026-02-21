# Validation Bundle - update-wysiwyg-search-experience R1

- change-id: `update-wysiwyg-search-experience`
- run#: `0001`
- task-id: `1.1`
- ref-id: `R1`
- scope: `GUI`

## Task
Implement shortcut entry for find bar in WYSIWYG editor:
- `Ctrl+F` / `Cmd+F` opens the find bar.
- If editor has selected text, prefill find query with normalized plain-text selection and build match index immediately.
- If no selection, the find bar still opens normally.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0001__task-1.1__ref-R1__20260220T145600Z\\run.bat`

This is a GUI scope run. `run.sh` / `run.bat` are start-server-only. Execute GUI verification with MCP runbook:
- `tests/gui_runbook_r1_find_shortcut.md`

## Inputs / Outputs
- inputs: none
- expected: GUI state assertions in MCP runbook
- outputs: supervisor-captured GUI evidence (screenshots/log references) should be saved under this run folder by the supervisor flow

## Acceptance Assertions
- Pressing `Ctrl+F` in WYSIWYG editor opens toolbar (`aria-hidden=false`).
- Pressing `Cmd+F` in WYSIWYG editor opens toolbar (`aria-hidden=false`).
- With no selection, toolbar opens without errors and input is interactable.
- With a multi-node selection, find input is prefilled with normalized plain text (NBSP/newline/extra whitespace normalized to single spaces, trimmed).
- After prefill, result count is indexed immediately (count reflects query, active index established when matches exist).
