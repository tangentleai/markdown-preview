# GUI MCP Runbook - R5 Table Colgroup + Overflow Fallback

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

1. Locate the rendered table in WYSIWYG and assert a direct child `<colgroup>` exists.
2. Assert `<colgroup>` contains the same number of `<col>` elements as the header column count.
3. Capture Screenshot A: table in desktop width with visible colgroup-driven layout.
4. Resize viewport to a narrow width (for example 360px) and wait for layout to settle.
5. Assert the table is wrapped by `[data-table-scrollview="true"]` and a scroll hint element `[data-table-scroll-hint="true"]` exists.
6. Re-check `<colgroup>` still exists after resize and that each `<col>` has a width style value (px).
7. Capture Screenshot B: narrow viewport showing horizontal scroll fallback with hint.

## Evidence To Capture

- Screenshot A: desktop width table with colgroup applied.
- Screenshot B: narrow viewport with scroll fallback hint visible.
- Optional console snapshot: colgroup widths array before and after resize.
EOF~