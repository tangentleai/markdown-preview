# Validation Bundle - Task 3.4 [#R11]

- change-id: `add-typora-wysiwyg-editor`
- run: `0012`
- task-id: `3.4`
- ref-id: `R11`
- scope: `GUI`

## Task

实现普通文本查找/替换（查找下一个、替换当前、全部替换）与基础编辑快捷键（加粗/斜体/行内代码）。

## HOW_TO_RUN

- start server only (GUI hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0012__task-3.4__ref-R11__20260219T101923Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0012__task-3.4__ref-R11__20260219T101923Z\run.bat`
- GUI verification entrypoint:
  - `tests/gui_runbook_find_replace_shortcuts.md`

## Inputs / Outputs

- Inputs: editor text containing repeated plain text tokens and selectable words for shortcut formatting.
- Outputs:
  - startup record: `logs/worker_startup.txt`
  - screenshot placeholders/evidence target: `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- start script constraints:
  - `run.sh` / `run.bat` only start local dev server and print `http://127.0.0.1:33100/`
- find/replace:
  - plain text `查找文本` + `替换文本` fields are available in WYSIWYG mode
  - `查找下一个` moves selection to the next plain text match
  - `替换当前` replaces active match only
  - `全部替换` replaces all remaining matches (non-regex only)
- shortcut behavior:
  - `Ctrl/Cmd+B` wraps selected text as bold (`<strong>`)
  - `Ctrl/Cmd+I` wraps selected text as italic (`<em>`)
  - `Ctrl/Cmd+E` wraps selected text as inline code (`<code>`)
- verification path:
  - Supervisor executes `tests/gui_runbook_find_replace_shortcuts.md` via playwright MCP only
