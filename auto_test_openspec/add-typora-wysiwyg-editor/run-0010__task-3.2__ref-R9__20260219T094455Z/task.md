# Validation Bundle - Task 3.2 [#R9]

- change-id: `add-typora-wysiwyg-editor`
- run: `0010`
- task-id: `3.2`
- ref-id: `R9`
- scope: `MIXED`

## Task

实现本地图片拖拽插入：拖拽图片到 WYSIWYG 编辑区后，生成有效 Markdown 图片引用并在编辑区内联显示图片（MVP 不自动复制到 assets）。

## How to run

- start server only (GUI/MIXED hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0010__task-3.2__ref-R9__20260219T094455Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0010__task-3.2__ref-R9__20260219T094455Z\run.bat`
- CLI checks (separate command; not in run.sh/run.bat):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0010__task-3.2__ref-R9__20260219T094455Z/tests/test_cli_image_drag_drop_reference.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0010__task-3.2__ref-R9__20260219T094455Z\tests\test_cli_image_drag_drop_reference.bat`

## Inputs / Outputs

- Inputs: drag-and-drop local image file (example: `local image.png`)
- Outputs:
  - `logs/worker_startup.txt` startup ritual record
  - CLI output log: `outputs/cli-image-drag-drop-reference.txt`
  - GUI evidence (Supervisor): `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- start script constraints:
  - `run.sh` / `run.bat` only start the dev server and print `http://127.0.0.1:33100/`
- CLI checks must pass:
  - dropping local image into WYSIWYG inserts `<img>` with blob preview source
  - inserted image keeps `data-markdown-src` relative reference (`local%20image.png`)
  - markdown sync contains valid image reference `![local image](local%20image.png)`
- GUI checks must pass via MCP runbook:
  - drag-and-drop local image into WYSIWYG editor
  - inline image is visible in editor after drop
  - markdown text updates to image reference with relative path and no assets auto-copy

## GUI MCP runbook entrypoint

- `tests/gui_runbook_image_drag_drop.md`
