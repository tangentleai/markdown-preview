# Validation Bundle - update-wysiwyg-search-experience R3 (Run 0005)

- change-id: `update-wysiwyg-search-experience`
- run#: `0005`
- task-id: `1.3`
- ref-id: `R3`
- scope: `GUI`

## Task
Fix Esc-close caret placement after find toolbar closes.

Required behavior after Esc close from all three focus states (find input, replace input, editor):
- toolbar closes
- focus returns to editor
- caret is placed at end of editor content so typing appends at tail

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0005__task-1.3__ref-R3__20260220T153638Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r3_esc_close_focus_append_end.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r3_esc_close_focus_append_end.md`
- outputs: supervisor-captured screenshots/logs under this run folder

## Acceptance Assertions
- Esc from `查找文本` closes toolbar and returns focus to editor; typing `A` yields `StartA`.
- Esc from `替换文本` closes toolbar and returns focus to editor; typing `B` yields `StartAB`.
- Esc from editor focus closes toolbar with editor still focused; typing `C` yields `StartABC`.
- No prepend/interleaving regression (`AStart`, `BAStart`, `BAStartC` must not occur).
