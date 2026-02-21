# MCP GUI Runbook: R6 Table Horizontal Scroll Hint Icon

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0006__task-2.2__ref-R6__20260221T084140Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence output targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0006__task-2.2__ref-R6__20260221T084140Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. `playwright_browser_navigate` to `http://127.0.0.1:33100/`.
2. Click mode switch button named `双栏模式`.
3. Fill textarea (`在这里输入 Markdown 文本...`) with:

```markdown
| 指标 | 2025Q1 | 2025Q2 | 2025Q3 | 2025Q4 | 2026Q1 | 2026Q2 | 2026Q3 | 2026Q4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 收入(百万) | 101 | 109 | 117 | 125 | 132 | 139 | 145 | 151 |
| 净利润率(%) | 12.1 | 12.4 | 12.9 | 13.3 | 13.8 | 14.1 | 14.5 | 14.9 |
| 备注 | 用于验证横向隐藏列提示图标在初始态、滚动态、滚动到底状态下的更新行为 |  |  |  |  |  |  |  |
```

4. Click mode switch button named `WYSIWYG 模式`.
5. Capture screenshot as `outputs/screenshots/01-r6-initial-start-state.png`.
6. Evaluate and assert:
   - `div[data-table-scrollview="true"]` exists.
   - `div[data-table-scrollview="true"] [data-table-scroll-hint="true"]` exists.
   - Wrapper has `data-table-scroll-hint-state="start"`.
7. Evaluate wrapper horizontal scroll to middle (`scrollLeft = Math.floor((scrollWidth - clientWidth) / 2)`).
8. Capture screenshot as `outputs/screenshots/02-r6-middle-state.png`.
9. Evaluate and assert wrapper has `data-table-scroll-hint-state="middle"`.
10. Evaluate wrapper horizontal scroll to far right (`scrollLeft = scrollWidth`).
11. Capture screenshot as `outputs/screenshots/03-r6-end-state.png`.
12. Evaluate and assert wrapper has `data-table-scroll-hint-state="end"`.

## Evidence Checklist

- Screenshot artifacts:
  - `outputs/screenshots/01-r6-initial-start-state.png`
  - `outputs/screenshots/02-r6-middle-state.png`
  - `outputs/screenshots/03-r6-end-state.png`
- Optional MCP console/network exports can be recorded under `logs/`.
