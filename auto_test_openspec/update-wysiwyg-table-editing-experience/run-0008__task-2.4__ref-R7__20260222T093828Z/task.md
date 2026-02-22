# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `2.4`
- Ref ID: `R7`
- Run: `0008`
- Timestamp (UTC): `20260222T093828Z`
- Scope: `MIXED`

## Task Objective

Validate table column drag resizing with live width updates, clamp behavior (`48px-720px`), and session-only manual width overrides that reset on reload.

## Preconditions

1. Dependencies are installed in repo root (`npm install`).
2. Port `33100` is available.

## Inputs

- GUI seed markdown (used by MCP runbook):

```
| Key | Description | Notes |
| --- | --- | --- |
| Alpha | Short | 12345 |
| Beta | Longer content to observe auto width reflow | SomeExtraTextForSizing |
| Gamma | Mixed 中文 and URL https://example.com/path | Wrap test |
```

## How To Run

- Start app server only (required for GUI/MIXED bundles):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0008__task-2.4__ref-R7__20260222T093828Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0008__task-2.4__ref-R7__20260222T093828Z\run.bat`
- Run CLI validation script (separate from server start):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0008__task-2.4__ref-R7__20260222T093828Z/tests/test_cli_table_manual_widths_r7.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0008__task-2.4__ref-R7__20260222T093828Z\tests\test_cli_table_manual_widths_r7.bat`

## CLI Validation

- Script: `tests/test_cli_table_manual_widths_r7.sh` / `tests/test_cli_table_manual_widths_r7.bat`
- Assertions:
  1. Manual width state machine updates only during drag.
  2. Width updates clamp to configured min/max bounds.
  3. Reset action returns to idle with provided widths.
- Output log: `outputs/cli-table-manual-widths.log`

## GUI Validation (MCP only)

- Follow: `tests/gui_runbook_table_column_resize_r7.md`
- `run.sh` / `run.bat` MUST only start local service.
- GUI verification MUST be performed via MCP (no browser automation scripts in bundle).

## Expected Results

1. Column resize handles are visible on the active table and can be dragged.
2. Manual column width updates are applied in real time and clamped to `48px-720px`.
3. Non-manual columns continue to auto-allocate remaining width.
4. Reloading clears `data-table-manual-widths` and returns to automatic column widths.
EOF~