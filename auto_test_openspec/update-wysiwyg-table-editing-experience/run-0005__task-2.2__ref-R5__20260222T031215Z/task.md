# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `2.2`
- Ref ID: `R5`
- Run: `0005`
- Timestamp (UTC): `20260222T031215Z`
- Scope: `MIXED`

## Task Objective

Validate `<colgroup>` is written/updated after WYSIWYG render and size changes, while overflow scroll fallback remains when the table still exceeds the available width after compression.

## Preconditions

1. Dependencies are installed in repo root (`npm install`).
2. Port `33100` is available.

## Inputs

- Markdown seed sample (paste into dual-pane Markdown input):

```
| Name | Description | Notes |
| --- | --- | --- |
| Alpha | Short | 12345 |
| Beta | Some long content for width distribution | VeryVeryLongWordWithoutSpacesToForceMinWidth |
| Gamma | Mixed 内容 with 中文 and URL https://example.com/very/long/path | Wrap test |
```

## How To Run

- Start app server only (required for GUI/MIXED bundles):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0005__task-2.2__ref-R5__20260222T031215Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0005__task-2.2__ref-R5__20260222T031215Z\run.bat`
- Run CLI validation script (separate from server start):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0005__task-2.2__ref-R5__20260222T031215Z/tests/test_cli_table_colgroup_r5.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0005__task-2.2__ref-R5__20260222T031215Z\tests\test_cli_table_colgroup_r5.bat`

## CLI Validation

- Script: `tests/test_cli_table_colgroup_r5.sh` / `tests/test_cli_table_colgroup_r5.bat`
- Assertions:
  1. `<colgroup>` is written with the expected number of `<col>` elements.
  2. Computed widths align with the table column width allocation logic.
  3. Width totals follow the budget/minimum relationship for the current container width.
- Output log: `outputs/cli-table-colgroup.log`

## GUI Validation (MCP only)

- Follow: `tests/gui_runbook_table_colgroup_r5.md`
- `run.sh` / `run.bat` MUST only start local service.
- GUI verification MUST be performed via MCP (no browser automation scripts in bundle).

## Expected Results

1. `<colgroup>` exists for WYSIWYG-rendered tables and is updated after viewport resize.
2. `<col>` count matches the table column count and each `<col>` has width styles.
3. When the table still exceeds the viewport at minimum widths, the horizontal scroll container and hint remain active.
