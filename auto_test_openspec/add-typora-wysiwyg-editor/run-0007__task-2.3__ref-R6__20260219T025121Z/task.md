# Validation Bundle - Task 2.3 [#R6]

- change-id: `add-typora-wysiwyg-editor`
- run: `0007`
- task-id: `2.3`
- ref-id: `R6`
- scope: `GUI`

## Task

实现列表/引用/代码块的回车与退格规则，聚焦 DoD 要求：空列表项回车退出列表、空引用回车退出引用、标题退格回段落。

## How to run

- start server only (GUI hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0007__task-2.3__ref-R6__20260219T025121Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0007__task-2.3__ref-R6__20260219T025121Z\run.bat`

## Inputs / Outputs

- Inputs: none (interactive GUI regression via MCP runbook)
- Outputs:
  - server startup logs from terminal
  - `logs/worker_startup.txt` startup ritual trace
  - supervisor GUI evidence under `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- `run.sh` / `run.bat` are start-server-only and print `http://127.0.0.1:33100/`
- GUI MCP assertions (via runbook):
  - empty list item + `Enter` exits list and creates paragraph block
  - empty blockquote paragraph + `Enter` exits quote and creates paragraph block
  - heading at caret start + `Backspace` converts to paragraph and preserves text
  - existing block input/inline style behavior remains usable after these interactions

## GUI MCP runbook entrypoint

- `tests/gui_runbook_enter_backspace_rules.md`
