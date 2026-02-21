# Task Validation Bundle (RUN #9)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0009`
- task-id: `3.1`
- ref-id: `R8`
- scope: `GUI`

## Task Target

Implement only task `3.1 [#R8]`: keep the outline panel flush to the left edge and ensure the editor layout container is rendered at a stable `~68%` width of its parent with centered alignment.

## How To Run

- macOS/Linux (start service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0009__task-3.1__ref-R8__20260221T094335Z/run.sh`
- Windows (start service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0009__task-3.1__ref-R8__20260221T094335Z\run.bat`

## Test Assets

- GUI MCP runbook: `tests/gui_runbook_layout_r8.md`
- startup log: `logs/worker_startup.txt`
- GUI evidence output target: `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - Built-in app markdown content is sufficient for layout geometry checks.
- Outputs:
  - Supervisor-captured screenshots under `outputs/screenshots/`.
  - Optional MCP notes under `logs/`.

## Expected Results (MCP Assertions)

- Outline panel left edge remains flush (`<= 1px` offset tolerance).
- `编辑区布局容器` width ratio stays within `0.66` to `0.70` against its immediate parent.
- `编辑区布局容器` left/right gap delta against its parent is `<= 2px`.

## Hard Rules

- `run.sh` and `run.bat` are start-server only for GUI scope.
- GUI verification must be executed through MCP runbook `tests/gui_runbook_layout_r8.md`.
- No executable browser automation scripts are included in this bundle.
