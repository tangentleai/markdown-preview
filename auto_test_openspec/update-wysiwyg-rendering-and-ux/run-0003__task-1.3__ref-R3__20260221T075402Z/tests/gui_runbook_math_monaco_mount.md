# MCP GUI Runbook: R3 Math Monaco Mount Lifecycle

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0003__task-1.3__ref-R3__20260221T075402Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0003__task-1.3__ref-R3__20260221T075402Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Click `双栏模式`.
3. Fill textarea `在这里输入 Markdown 文本...` with:

```markdown
\[
\text{MOM}_{i,t} = \frac{P_{i,t-1}}{P_{i,t-1-N}} - 1
\]

\[
x^2 + y^2 = z^2
\]
```

4. Click `WYSIWYG 模式`.
5. Click the first `.math-block` formula.
6. Assert exactly one `[data-math-editor="true"]` exists and it is inserted before the clicked `.math-block`.
7. In `数学公式编辑区`, append ` + \alpha` and wait ~300ms.
8. Assert clicked formula now has `data-tex` containing `\alpha` and rendered block updates.
9. Click the second `.math-block` formula.
10. Assert still exactly one `[data-math-editor="true"]` exists (single-instance behavior) and it moved above second formula.
11. In `数学公式编辑区`, append ` + 1` and press `Escape`.
12. Assert `[data-math-editor="true"]` no longer exists and second formula `data-tex` includes `+ 1`.
13. Click the first formula again to reopen editor; type ` + \beta`.
14. Click empty area in editor container (outside `[data-math-editor="true"]`).
15. Assert editor unmounted and first formula `data-tex` contains `\beta`.
16. Click first formula again; type ` + \gamma`; switch mode via `双栏模式`.
17. Assert dual-pane textarea markdown includes `\gamma` (dismiss by mode switch writes back latest value).
18. Capture screenshots:
    - `outputs/screenshots/01-r3-mounted-first-formula.png` (after step 6)
    - `outputs/screenshots/02-r3-single-instance-second-formula.png` (after step 10)
    - `outputs/screenshots/03-r3-dismiss-outside-click.png` (after step 15)
    - `outputs/screenshots/04-r3-writeback-after-mode-switch.png` (after step 17)

## Evidence Checklist

- Screenshots listed above.
- Optional MCP console/network exports under `logs/`.
