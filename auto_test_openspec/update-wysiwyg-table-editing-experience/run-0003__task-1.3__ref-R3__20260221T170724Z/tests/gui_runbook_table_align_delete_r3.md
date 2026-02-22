# GUI MCP Runbook - R3 Table Alignment + Delete

## Target

- URL: `http://127.0.0.1:33100/`
- Editor selector: `[aria-label="WYSIWYG 编辑区"]`

## Setup

1. Start server with this bundle `run.sh` / `run.bat`.
2. Open app and switch to dual-pane mode.
3. Replace markdown input with `inputs/table_align_delete_seed.md` content.
4. Switch to WYSIWYG mode.

## Verification Steps

1. Click inside any table cell and confirm `[data-table-toolbar="true"]` is visible.
2. Click `表格居中对齐`, then `表格右对齐`:
   - Assert `表格右对齐` has `aria-pressed=true`.
   - Assert `表格居中对齐` and `表格左对齐` have `aria-pressed=false`.
3. Switch to dual-pane mode and verify markdown now includes:
   - `<!-- table:align=right -->` directly before table markdown.
4. Switch back to WYSIWYG mode, focus the same table, verify `表格右对齐` remains active (readback from marker).
5. Trigger `删除表格`:
   - If confirm dialog appears (`删除表格将移除其内容，可撤销；是否继续？`), choose confirm.
   - Assert table block is removed from editor.
6. Focus recovery assertion after delete:
   - If a preceding block exists, cursor lands at end of that block.
   - If no preceding block exists, an empty paragraph is created and focused.
7. Switch to dual-pane mode and confirm both table and `table:align` marker are removed.
8. Switch back to WYSIWYG and press `Cmd/Ctrl+Z` once.
9. Switch to dual-pane mode and confirm table markdown + alignment marker are restored together.

## Evidence To Capture

- Screenshot A: toolbar with alignment buttons and mutually exclusive pressed state.
- Screenshot B: dual-pane markdown showing `<!-- table:align=right -->` before table.
- Screenshot C: table deleted and focus placement state.
- Screenshot D: undo restored table + marker in markdown.
