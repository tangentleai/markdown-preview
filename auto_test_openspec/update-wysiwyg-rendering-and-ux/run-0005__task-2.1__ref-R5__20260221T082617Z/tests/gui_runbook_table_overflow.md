# MCP GUI Runbook: R5 Table Overflow Scroll Container

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0005__task-2.1__ref-R5__20260221T082617Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence output targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0005__task-2.1__ref-R5__20260221T082617Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. `playwright_browser_navigate` to `http://127.0.0.1:33100/`.
2. Click mode switch button named `双栏模式`.
3. Fill textarea (`在这里输入 Markdown 文本...`) with:

```markdown
| 指标 | 2025Q1 | 2025Q2 | 2025Q3 | 2025Q4 | 2026Q1 | 2026Q2 | 2026Q3 | 2026Q4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 收入(百万) | 101 | 109 | 117 | 125 | 132 | 139 | 145 | 151 |
| 净利润率(%) | 12.1 | 12.4 | 12.9 | 13.3 | 13.8 | 14.1 | 14.5 | 14.9 |
| 自由现金流(百万) | 21 | 22 | 25 | 28 | 30 | 31 | 33 | 35 |
| 备注 | 该行用于验证超宽表格在编辑区内自动包裹横向滚动容器并可左右滚动查看末尾列数据 |  |  |  |  |  |  |  |
```

4. Click mode switch button named `WYSIWYG 模式`.
5. Capture screenshot as `outputs/screenshots/01-table-overflow-initial.png`.
6. Assert in snapshot/evaluate:
   - At least one `div[data-table-scrollview="true"]` exists inside editor.
   - The wrapper has horizontal overflow capability (`scrollWidth > clientWidth`).
7. Scroll the wrapper horizontally to far right via evaluate (`element.scrollLeft = element.scrollWidth`).
8. Capture screenshot as `outputs/screenshots/02-table-overflow-scrolled-right.png`.
9. Assert in evaluate:
   - Wrapper `scrollLeft > 0` after horizontal scroll.
10. In evaluate, set one body cell style to `maxHeight: 48px; overflowY: auto; display: block;` and inject multi-line text with at least 20 lines.
11. Scroll this target body cell vertically (`cell.scrollTop = cell.scrollHeight`).
12. Capture screenshot as `outputs/screenshots/03-table-inner-vertical-scroll.png`.
13. Assert in evaluate:
   - Target body cell `scrollTop > 0`.
   - Table wrapper remains present (`div[data-table-scrollview="true"]`) after vertical scroll interaction.

## Evidence Checklist

- Screenshot artifacts:
  - `outputs/screenshots/01-table-overflow-initial.png`
  - `outputs/screenshots/02-table-overflow-scrolled-right.png`
  - `outputs/screenshots/03-table-inner-vertical-scroll.png`
- Optional MCP console/network exports can be recorded under `logs/`.
