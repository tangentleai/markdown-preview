# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `1.3`
- Ref ID: `R3`
- Run: `0003`
- Timestamp (UTC): `20260221T170724Z`
- Scope: `MIXED`

## Task Objective

Implement and verify table alignment/delete behavior for WYSIWYG table toolbar:

1. Left/center/right alignment is mutually exclusive.
2. Alignment persists as `<!-- table:align=left|center|right -->` and can be restored on reload.
3. Deleting table also removes associated alignment marker and restores focus to valid editable context.
4. Undo restores table + marker as one structural transaction.

## Preconditions

1. Dependencies are installed in repo root (`npm install`).
2. Port `33100` is available.

## Inputs

- Seed markdown: `inputs/table_align_delete_seed.md`
- Expected markdown after explicit right-align: `expected/markdown_after_right_align.md`
- Expected markdown after table delete: `expected/markdown_after_delete.md`

## How To Run

- Start app server only (GUI/MIXED path):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0003__task-1.3__ref-R3__20260221T170724Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0003__task-1.3__ref-R3__20260221T170724Z\run.bat`
- Run CLI validation script:
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0003__task-1.3__ref-R3__20260221T170724Z/tests/test_cli_table_alignment_r3.sh`

## CLI Validation

- Script: `tests/test_cli_table_alignment_r3.sh`
- Coverage:
  1. Marker parse and hidden-in-editor rendering (`data-table-align` mapping).
  2. Marker serialization and round-trip restore.
  3. Delete linkage at model layer: deleting table block also removes marker in serialized markdown.
- Output log: `outputs/cli-table-alignment.log`

## GUI Validation (MCP only)

- Follow: `tests/gui_runbook_table_align_delete_r3.md`
- `run.sh` / `run.bat` only starts local service.
- GUI verification is manual via MCP runbook (no browser automation script in this bundle).

## Acceptance Checklist

1. Toolbar alignment buttons are mutually exclusive (`aria-pressed` reflects single active state).
2. Setting alignment writes `<!-- table:align=... -->` above target table.
3. Re-entering WYSIWYG restores alignment button state from markdown marker.
4. Deleting table removes both table and alignment marker.
5. Focus after delete lands on previous editable block end, or a new empty paragraph if none.
6. Undo restores table and alignment marker together.
