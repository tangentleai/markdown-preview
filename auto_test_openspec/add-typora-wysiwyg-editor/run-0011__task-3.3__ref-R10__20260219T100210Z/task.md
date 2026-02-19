# Validation Bundle - Task 3.3 [#R10]

- change-id: `add-typora-wysiwyg-editor`
- run: `0011`
- task-id: `3.3`
- ref-id: `R10`
- scope: `GUI`

## Task

实现标题大纲实时生成与定位跳转：根据文档 H1-H6 实时生成大纲，点击大纲项后定位到对应标题块。

## HOW_TO_RUN

- start server only (GUI hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0011__task-3.3__ref-R10__20260219T100210Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0011__task-3.3__ref-R10__20260219T100210Z\run.bat`
- GUI verification entrypoint:
  - `tests/gui_runbook_outline_navigation.md`

## Inputs / Outputs

- Inputs: multi-level markdown with H1-H6 headings.
- Outputs:
  - startup record: `logs/worker_startup.txt`
  - GUI screenshots path (Supervisor evidence): `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- start script constraints:
  - `run.sh` / `run.bat` only start local dev server and print `http://127.0.0.1:33100/`
- outline generation:
  - outline contains headings parsed from markdown lines matching `#` to `######`
  - outline updates after heading add/remove/edit operations in WYSIWYG mode
- jump behavior:
  - clicking an outline item scrolls to corresponding heading block in editor
  - caret is positioned at the start of the selected heading block
- GUI verification path:
  - Supervisor executes `tests/gui_runbook_outline_navigation.md` via playwright MCP
