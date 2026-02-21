# Validation Bundle - update-wysiwyg-search-experience R3 (Run 0004)

- change-id: `update-wysiwyg-search-experience`
- run#: `0004`
- task-id: `1.3`
- ref-id: `R3`
- scope: `GUI`

## Task
Unify Esc close behavior for find toolbar in three focus states:
- find input focused
- replace input focused
- editor focused while toolbar is open

After Esc closes the toolbar, focus must return to the editor and allow immediate typing continuation.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0004__task-1.3__ref-R3__20260220T152615Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0004__task-1.3__ref-R3__20260220T152615Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r3_esc_close_focus.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points documented in `tests/gui_runbook_r3_esc_close_focus.md`
- outputs: supervisor-captured evidence (screenshots/logs) under this run folder

## Acceptance Assertions
- With toolbar open and focus on `查找文本`, pressing Esc closes toolbar and moves focus back to editor.
- With toolbar open and focus on `替换文本`, pressing Esc closes toolbar and moves focus back to editor.
- With toolbar open and focus on editor, pressing Esc closes toolbar and editor remains focused.
- After each close, typing into editor immediately appends content at caret without losing edit continuity.
