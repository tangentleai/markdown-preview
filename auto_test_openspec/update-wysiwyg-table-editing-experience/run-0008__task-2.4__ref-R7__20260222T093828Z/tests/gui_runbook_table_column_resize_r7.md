# GUI MCP Runbook - R7 Table Column Drag Resize

## Target

- URL: `http://127.0.0.1:33100/`
- Editor selector: `[aria-label="WYSIWYG 编辑区"]`
- Markdown input selector (dual-pane): `textarea[aria-label="Markdown 输入"]`

## Setup

1. Start server via this bundle `run.sh` / `run.bat`.
2. Switch to dual-pane mode.
3. Replace markdown input with the seed content from `task.md` (Inputs section).
4. Switch to WYSIWYG mode.
5. Click inside the table so the toolbar and column resize handles appear.

## Verification Steps

1. Confirm table header cells show drag handles (`[data-table-resize-handle]`) and table has `data-table-resize-active="true"`.
2. Drag the first column handle to the right until the first column is visibly wider; confirm the colgroup width updates in real time.
3. Drag the first column handle further right beyond the max boundary and confirm the width clamps to `720px` (check `colgroup > col:nth-child(1)` width or `data-table-manual-widths` JSON value).
4. Drag the same handle left past the minimum boundary and confirm the width clamps to `48px`.
5. Verify automatic columns still reflow by checking other column widths adjust after the manual column change.
6. Reload the page and re-open the same table; confirm the table no longer has `data-table-manual-widths` and col widths revert to automatic allocation.
7. Capture Screenshot A: active table with resize handles visible.
8. Capture Screenshot B: colgroup style showing the manual column clamped to max.
9. Capture Screenshot C: after reload, no `data-table-manual-widths` attribute and column widths auto-allocated.

## Evidence To Capture

- Screenshot A: resize handles visible on header row.
- Screenshot B: colgroup width clamped to 720px.
- Screenshot C: after reload, manual widths cleared and auto allocation restored.
