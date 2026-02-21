# MCP GUI Runbook: R2 Math Rendering

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0002__task-1.2__ref-R2__20260221T073206Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence output targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0002__task-1.2__ref-R2__20260221T073206Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. `playwright_browser_navigate` to `http://127.0.0.1:33100/`.
2. Click mode switch button named `双栏模式`.
3. Fill textarea (`在这里输入 Markdown 文本...`) with:

```markdown
\\[
\\text{MOM}_{i,t} = \\frac{P_{i,t-1}}{P_{i,t-1-N}} - 1
\\]

行内示例：\\(r_t = \\frac{P_t}{P_{t-1}} - 1\\)

\\[
\\frac{1}{
\\]

尾部文本保持可编辑。
```

4. Click mode switch button named `WYSIWYG 模式`.
5. Capture screenshot as `outputs/screenshots/01-math-desktop-render.png`.
6. Assert in snapshot/evaluate:
   - At least one `.math-block .katex` exists (benchmark formula rendered).
   - At least one `.math-inline .katex` exists (inline formula rendered).
   - One `.math-block` contains raw text `\\frac{1}{` and does not contain `.katex` (failure fallback path).
   - Editor still contains text `尾部文本保持可编辑。`.
7. Resize viewport to mobile width (e.g., 390x844).
8. Capture screenshot as `outputs/screenshots/02-math-mobile-render.png`.
9. Assert in snapshot/evaluate:
   - Benchmark block formula remains visible in editor flow.
   - Invalid formula fallback text remains visible and adjacent paragraph is still present.

## Evidence Checklist

- Screenshot artifacts:
  - `outputs/screenshots/01-math-desktop-render.png`
  - `outputs/screenshots/02-math-mobile-render.png`
- Optional MCP console/network exports can be recorded under `logs/`.
