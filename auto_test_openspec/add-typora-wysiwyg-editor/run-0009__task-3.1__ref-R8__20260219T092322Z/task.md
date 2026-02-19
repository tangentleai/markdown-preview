# Validation Bundle - Task 3.1 [#R8]

- change-id: `add-typora-wysiwyg-editor`
- run: `0009`
- task-id: `3.1`
- ref-id: `R8`
- scope: `MIXED`

## Task

实现打开/保存/另存为与未保存状态提示：支持 `.md/.markdown` 打开与保存流程、`Ctrl/Cmd+S` 快捷保存，以及准确的保存状态文案更新。

## How to run

- start server only (GUI/MIXED hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0009__task-3.1__ref-R8__20260219T092322Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0009__task-3.1__ref-R8__20260219T092322Z\run.bat`
- CLI checks (separate command; not in run.sh/run.bat):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0009__task-3.1__ref-R8__20260219T092322Z/tests/test_cli_file_io_and_encoding.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0009__task-3.1__ref-R8__20260219T092322Z\tests\test_cli_file_io_and_encoding.bat`

## Inputs / Outputs

- Inputs: repository test fixtures and mocked file picker handles in Jest tests
- Outputs:
  - `logs/worker_startup.txt` startup ritual record
  - CLI output log: `outputs/cli-file-io-and-encoding.txt`
  - GUI evidence (Supervisor): `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- start script constraints:
  - `run.sh` / `run.bat` only start the dev server and print `http://127.0.0.1:33100/`
- CLI checks must pass:
  - `decodeUtf8Markdown` can decode UTF-8 markdown in test runtime without global `TextDecoder`
  - markdown open/save picker helpers enforce `.md/.markdown` and write closeable blobs
  - editing content sets dirty status text to `未保存更改`
  - `Ctrl/Cmd+S` triggers save picker flow and updates status to `已保存：<filename>`
- GUI checks must pass via MCP runbook:
  - open button flow works for markdown files
  - save/save-as buttons and `Ctrl/Cmd+S` flow are available
  - status line transitions between unsaved and saved states correctly

## GUI MCP runbook entrypoint

- `tests/gui_runbook_file_open_save.md`
