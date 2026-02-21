# Task Validation Bundle (RUN #5)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0005`
- task-id: `2.1`
- ref-id: `R5`
- scope: `MIXED`

## Task Target

Implement only task `2.1 [#R5]`: auto-detect table overflow and wrap overflow tables in a horizontal scroll container without breaking vertical interactions inside table content.

## How To Run

- macOS/Linux (GUI service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0005__task-2.1__ref-R5__20260221T082617Z/run.sh`
- Windows (GUI service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0005__task-2.1__ref-R5__20260221T082617Z\run.bat`
- CLI validation script:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0005__task-2.1__ref-R5__20260221T082617Z/tests/test_cli_table_overflow.sh`

## Test Assets

- CLI test: `tests/test_cli_table_overflow.sh`
- GUI MCP runbook: `tests/gui_runbook_table_overflow.md`
- startup log: `logs/worker_startup.txt`
- CLI output log: `outputs/cli-table-overflow.log`
- GUI evidence target directory (Supervisor writes): `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - CLI: fixtures and DOM mocks embedded in `src/__tests__/wysiwygTableOverflow.test.ts`
  - GUI: markdown table text in `tests/gui_runbook_table_overflow.md`
- Outputs:
  - CLI: Jest output at `outputs/cli-table-overflow.log`
  - GUI: screenshots and notes written by Supervisor under `outputs/screenshots/` and `logs/`

## Expected Results (Machine-Decidable + MCP Assertions)

- CLI checks (`tests/test_cli_table_overflow.sh`) MUST verify:
  - `npm test -- wysiwygTableOverflow.test.ts` exits with code `0`
  - log contains test title `wraps table in horizontal scroll container when table overflows editor width`
  - log contains test title `unwraps previously wrapped table after overflow is gone`

- GUI checks MUST be executed only through MCP runbook:
  - `tests/gui_runbook_table_overflow.md`
  - Assertions include overflow table auto-wrapped by `div[data-table-scrollview="true"]`, horizontal scrolling available on wrapper, and table body vertical scrolling remains functional.

## Hard Rules

- For MIXED scope, `run.sh` and `run.bat` are start-server only and MUST NOT run validation commands.
- GUI verification must be MCP-driven from `tests/gui_runbook_table_overflow.md` (no executable browser automation scripts in this bundle).
