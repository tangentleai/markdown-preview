# Task Validation Bundle (RUN #6)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0006`
- task-id: `2.2`
- ref-id: `R6`
- scope: `GUI`

## Task Target

Implement only task `2.2 [#R6]`: add icon-based visual hint for horizontally scrollable overflow tables, and update hint state at initial, in-scroll, and scroll-end positions.

## How To Run

- macOS/Linux (start service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0006__task-2.2__ref-R6__20260221T084140Z/run.sh`
- Windows (start service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0006__task-2.2__ref-R6__20260221T084140Z\run.bat`

## Test Assets

- GUI MCP runbook: `tests/gui_runbook_table_scroll_hint.md`
- startup log: `logs/worker_startup.txt`
- GUI evidence output target: `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - Markdown table sample embedded in `tests/gui_runbook_table_scroll_hint.md`.
- Outputs:
  - Supervisor-captured screenshots under `outputs/screenshots/`.
  - Optional MCP notes under `logs/`.

## Expected Results (MCP Assertions)

- `div[data-table-scrollview="true"]` appears for overflow table.
- Hint icon host exists: `[data-table-scroll-hint="true"]`.
- Initial state is `data-table-scroll-hint-state="start"`.
- During horizontal scroll, state updates to `middle`.
- At far-right edge, state updates to `end`.

## Hard Rules

- `run.sh` and `run.bat` are start-server only for GUI scope.
- GUI verification must be executed through MCP runbook `tests/gui_runbook_table_scroll_hint.md`.
- No executable browser automation scripts are included in this bundle.
