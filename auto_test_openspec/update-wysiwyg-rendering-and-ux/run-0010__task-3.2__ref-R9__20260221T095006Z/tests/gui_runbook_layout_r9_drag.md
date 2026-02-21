# MCP GUI Runbook: R9 Outline Width Drag + Live Editor Layout Sync

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0010__task-3.2__ref-R9__20260221T095006Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence output targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0010__task-3.2__ref-R9__20260221T095006Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. `playwright_browser_navigate` to `http://127.0.0.1:33100/`.
2. `playwright_browser_resize` to desktop baseline: `width=1440`, `height=900`.
3. Ensure `WYSIWYG 模式` is active.
4. Capture screenshot: `outputs/screenshots/01-r9-initial-layout.png`.
5. Evaluate initial values:
   - Locate `[aria-label="大纲与编辑区联动布局"]` and read inline CSS variable `--outline-width`.
   - Assert value is `260px`.
6. Min clamp assertion:
   - Dispatch pointer down on `[aria-label="拖拽调整大纲宽度"]` with `clientX=260`.
   - Dispatch pointer move to `clientX=120` and read `--outline-width`.
   - Assert value is `220px`.
7. Max clamp assertion:
   - With drag active, dispatch pointer move to `clientX=420` and read `--outline-width`.
   - Assert value is `420px`.
8. Fast drag + release stability:
   - Dispatch pointer move to `clientX=340`; assert `--outline-width` is `340px`.
   - Dispatch pointer up at `clientX=340`.
   - Dispatch extra pointer move to `clientX=260` without new pointer down.
   - Assert `--outline-width` remains `340px`.
9. Post-drag editor centering:
   - Locate `[aria-label="编辑区布局容器"]`, compute parent left/right gaps, assert `Math.abs(leftGap - rightGap) <= 2`.
10. Capture screenshot: `outputs/screenshots/02-r9-post-drag-stable.png`.
11. Non-persistence check:
   - Reload page (`playwright_browser_navigate` same URL).
   - Re-read `--outline-width` from `[aria-label="大纲与编辑区联动布局"]`.
   - Assert value returns to `260px`.
12. Capture screenshot: `outputs/screenshots/03-r9-after-reload-default-width.png`.

## Evidence Checklist

- Screenshot artifacts:
  - `outputs/screenshots/01-r9-initial-layout.png`
  - `outputs/screenshots/02-r9-post-drag-stable.png`
  - `outputs/screenshots/03-r9-after-reload-default-width.png`
- Optional MCP console/network exports can be recorded under `logs/`.
