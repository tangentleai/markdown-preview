# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `1.2`
- Ref ID: `R2`
- Run: `0002`
- Timestamp (UTC): `20260221T165555Z`
- Scope: `MIXED`

## Task Objective

Validate table row/column grid resize in WYSIWYG with preview + confirm behavior, `200x40` limit enforcement, one-time shrink confirmation for non-empty trimmed content, and undo/redo restoration as one atomic operation.

## Preconditions

1. Dependencies are installed in repo root (`npm install`).
2. Port `33100` is available.

## Inputs

- Markdown seed sample: `inputs/table_resize_seed.md`
- Expected markdown shape after resize apply: `expected/markdown_after_resize.md`

## How To Run

- Start app server only (required for GUI/MIXED bundles):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0002__task-1.2__ref-R2__20260221T165555Z\run.bat`
- Run CLI validation script (separate from server start):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/tests/test_cli_table_resize_r2.sh`

## CLI Validation

- Script: `tests/test_cli_table_resize_r2.sh`
- Assertions:
  1. table resize limit normalization clamps to `rows<=200` and `cols<=40`
  2. resize keeps row/column structure consistent
  3. shrink detection marks non-empty trimmed cells as requiring confirm
- Output log: `outputs/cli-table-resize.log`

## GUI Validation (MCP only)

- Follow: `tests/gui_runbook_table_resize_r2.md`
- `run.sh` / `run.bat` MUST only start local service.
- GUI verification MUST be performed via MCP (no browser automation scripts in bundle).

## Expected Results

1. Table toolbar exposes a size control panel with grid preview and explicit apply action.
2. Grid keyboard interactions work (`Arrow` keys change preview, `Enter` applies, `Esc` closes panel).
3. Size apply respects upper bound `200x40`.
4. Shrink with non-empty trimmed content shows one confirmation prompt per apply action.
5. Undo/redo restores and reapplies the same resize result in one operation.
6. Markdown table remains structurally valid (header row / separator row / aligned columns).
