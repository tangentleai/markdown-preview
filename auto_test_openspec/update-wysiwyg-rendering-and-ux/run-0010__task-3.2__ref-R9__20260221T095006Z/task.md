# Task Validation Bundle (RUN #10)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0010`
- task-id: `3.2`
- ref-id: `R9`
- scope: `GUI`

## Task Target

Implement only task `3.2 [#R9]`: enable draggable outline width in WYSIWYG mode, keep editor area width/position synchronized in real time during drag, and do not persist drag state in local storage.

## How To Run

- macOS/Linux (start service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0010__task-3.2__ref-R9__20260221T095006Z/run.sh`
- Windows (start service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0010__task-3.2__ref-R9__20260221T095006Z\run.bat`

## Test Assets

- GUI MCP runbook: `tests/gui_runbook_layout_r9_drag.md`
- startup log: `logs/worker_startup.txt`
- GUI evidence output target: `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - Built-in app content is enough for layout drag checks.
- Outputs:
  - Supervisor-captured screenshots under `outputs/screenshots/`.
  - Optional MCP notes under `logs/`.

## Expected Results (MCP Assertions)

- Dragging handle updates `--outline-width` in `aria-label="大纲与编辑区联动布局"` immediately on pointer move.
- Min/max clamps are enforced at `220px` and `420px`.
- Fast drag + release keeps final width stable (subsequent pointer move without active drag does not change it).
- Editor layout container remains centered (`left/right gap delta <= 2px`) after drag settles.
- Reload restores default width (`260px`), proving drag state is not locally persisted.

## Hard Rules

- `run.sh` and `run.bat` are start-server only for GUI scope.
- GUI verification must be executed through MCP runbook `tests/gui_runbook_layout_r9_drag.md`.
- No executable browser automation scripts are included in this bundle.
