# GUI MCP Runbook - R1 Table Floating Toolbar

## Target

- URL: `http://127.0.0.1:33100/`
- Editor selector: `[aria-label="WYSIWYG 编辑区"]`

## Setup

1. Start server via bundle `run.sh`/`run.bat`.
2. Open page in MCP browser session.
3. Ensure WYSIWYG editor is visible and ready.

## Verification Steps

1. In editor, create content with one markdown table and one plain paragraph below it.
2. Click inside a table cell.
3. Assert toolbar exists and is visible:
   - selector: `[data-table-toolbar="true"]`
   - `aria-hidden` is not `true`
4. Evaluate toolbar placement values:
   - `getBoundingClientRect()` for toolbar
   - `position` is `fixed`
   - rect is inside viewport bounds
5. Force top-edge case (scroll so table top is near viewport top), click table cell again, and assert:
   - `data-table-toolbar-placement` is either `top` or `bottom`
   - when top space is insufficient, placement flips to `bottom`
6. Keyboard focus path:
   - move caret with arrow keys/Tab so selection is still in table
   - assert toolbar remains visible
7. Outside-click close path:
   - click non-editor area (or a non-table control)
   - assert toolbar hidden (`aria-hidden="true"`)
8. Re-open toolbar by clicking table cell, then press `Escape`.
9. Assert toolbar hidden.
10. Re-open toolbar, then move selection to paragraph text outside table.
11. Assert toolbar hidden after non-table selection.

## Evidence To Capture

- Screenshot A: toolbar shown above table.
- Screenshot B: flipped/offset-safe placement near viewport top.
- Screenshot C: toolbar closed after outside click or `Esc`.
- Optional log of evaluated placement and rect values.
