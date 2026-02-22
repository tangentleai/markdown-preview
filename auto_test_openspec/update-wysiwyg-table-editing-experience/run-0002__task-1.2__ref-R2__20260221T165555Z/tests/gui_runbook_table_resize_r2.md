# GUI MCP Runbook - R2 Table Size Grid Resize

## Target

- URL: `http://127.0.0.1:33100/`
- Editor selector: `[aria-label="WYSIWYG 编辑区"]`

## Setup

1. Start server via this bundle `run.sh` / `run.bat`.
2. Open page and switch to dual-pane mode.
3. Replace markdown input with `inputs/table_resize_seed.md` content.
4. Switch to WYSIWYG mode.

## Verification Steps

1. Click inside a table cell and assert `[data-table-toolbar="true"]` is visible.
2. Click toolbar button `调整表格尺寸` and assert panel `[data-table-size-grid-panel="true"]` appears.
3. Assert panel shows preview text `预览 R x C` and limit text includes `200 x 40`.
4. Grid preview check:
   - Hover a larger grid cell (for example `3 行 3 列`) and assert preview text updates.
5. Keyboard check on `[data-table-size-grid="true"]`:
   - Focus grid, press `ArrowDown` + `ArrowRight` and assert preview increases.
   - Press `Enter` to apply.
6. Switch back to dual-pane mode and assert markdown table structure keeps aligned columns:
   - header row columns count equals separator columns count and data row columns count.
7. Return to WYSIWYG and reopen size panel.
8. Shrink confirmation check:
   - set columns smaller so a non-empty cell will be trimmed.
   - click `应用`; assert confirmation dialog text contains `缩小将裁剪表格内容`.
   - cancel once and confirm table stays unchanged.
   - repeat apply and accept once; assert shrink is applied.
9. Undo/redo check:
   - press `Ctrl/Cmd+Z` once; assert table size/content restored in one step.
   - press `Ctrl/Cmd+Shift+Z` (or `Ctrl/Cmd+Y`) once; assert resize reapplies.
10. Esc behavior:
   - focus grid and press `Esc`; assert size panel closes.

## Evidence To Capture

- Screenshot A: size grid panel open with preview text.
- Screenshot B: confirmation dialog shown during non-empty shrink.
- Screenshot C: markdown after apply with aligned table shape.
- Screenshot D: undo restored original size/content.
