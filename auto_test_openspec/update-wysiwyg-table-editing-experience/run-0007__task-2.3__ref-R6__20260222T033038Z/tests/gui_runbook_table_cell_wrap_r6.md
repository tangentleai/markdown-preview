# GUI MCP Runbook - R6 Table Cell Wrap Readability

## Target

- URL: `http://127.0.0.1:33100/`
- Editor selector: `[aria-label="WYSIWYG 编辑区"]`
- Markdown input selector (dual-pane): `textarea[aria-label="Markdown 输入"]`

## Setup

1. Start server via this bundle `run.sh` / `run.bat`.
2. Switch to dual-pane mode.
3. Replace markdown input with the seed content from `task.md` (Inputs section).
4. Switch to WYSIWYG mode.

## Verification Steps

1. Locate the rendered table and confirm long Chinese text, long URL, and inline code are visible inside cells.
2. Inspect any table cell (`th`/`td`) computed styles and confirm:
   - `overflow-wrap: anywhere`
   - `word-break: break-word`
3. Visually verify the long URL wraps to multiple lines within its cell and does not force the column to expand beyond the table width.
4. Visually verify the long inline code wraps within its cell and remains readable.
5. Capture Screenshot A: table with long URL wrapped inside a cell.
6. Capture Screenshot B: table with long inline code wrapped inside a cell.

## Evidence To Capture

- Screenshot A: long URL wrapping within table cell.
- Screenshot B: long inline code wrapping within table cell.
- Optional devtools snapshot: computed styles showing `overflow-wrap` and `word-break` on a cell.
