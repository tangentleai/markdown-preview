# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `1.1`
- Ref ID: `R1`
- Run: `0001`
- Timestamp (UTC): `20260221T164052Z`
- Scope: `GUI`

## Task Objective

Verify that focusing a table in WYSIWYG shows a floating table toolbar above the table, keeps positioning stable with viewport flip/offset protection, and closes on outside click, `Esc`, or moving selection outside the table.

## Preconditions

1. Install dependencies at repo root (`npm install`) if not already installed.
2. Ensure port `33100` is available.

## How To Run

- macOS/Linux:
  - `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0001__task-1.1__ref-R1__20260221T164052Z/run.sh`
- Windows:
  - `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0001__task-1.1__ref-R1__20260221T164052Z\run.bat`

## GUI Verification Method (MCP only)

- Follow: `tests/gui_runbook_table_toolbar_r1.md`
- `run.sh`/`run.bat` only start the app server and print URL.
- Do not use browser automation scripts in this bundle.

## Expected Assertions

1. On table click or keyboard selection inside table, `[data-table-toolbar="true"]` is visible.
2. Toolbar stays in viewport with valid fixed coordinates and placement flip (`data-table-toolbar-placement="top"|"bottom"`).
3. Clicking outside the editor table closes the toolbar.
4. Pressing `Esc` closes the toolbar.
5. Moving selection from table cell to non-table text closes the toolbar.

## Notes

- Toolbar icon assets are sourced via `iconfont-mcp` and stored in `src/assets/iconfont/`.
