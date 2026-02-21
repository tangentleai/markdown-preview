# Task Validation Bundle (RUN #8)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0008`
- task-id: `3.1`
- ref-id: `R8`
- scope: `GUI`

## Task Target

Implement only task `3.1 [#R8]`: make the left outline panel flush to the left edge of the WYSIWYG workspace, and set the editor area to a default target width of about `68%` with centered rendering behavior.

## How To Run

- macOS/Linux (start service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0008__task-3.1__ref-R8__20260221T092505Z/run.sh`
- Windows (start service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0008__task-3.1__ref-R8__20260221T092505Z\run.bat`

## Test Assets

- GUI MCP runbook: `tests/gui_runbook_layout_r8.md`
- startup log: `logs/worker_startup.txt`
- GUI evidence output target: `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - Built-in sample markdown content from app boot state is sufficient for layout verification.
- Outputs:
  - Supervisor-captured screenshots under `outputs/screenshots/`.
  - Optional MCP assertion notes under `logs/`.

## Expected Results (MCP Assertions)

- Outline panel left edge is effectively flush with the workspace left edge (`<= 1px` offset tolerance).
- In desktop viewport, editor layout wrapper width ratio is approximately `68%` (`0.66` to `0.70` acceptance band).
- Editor wrapper remains horizontally centered in the available right column (`left/right gap delta <= 2px`).

## Hard Rules

- `run.sh` and `run.bat` are start-server only for GUI scope.
- GUI verification must be executed through MCP runbook `tests/gui_runbook_layout_r8.md`.
- No executable browser automation scripts are included in this bundle.
