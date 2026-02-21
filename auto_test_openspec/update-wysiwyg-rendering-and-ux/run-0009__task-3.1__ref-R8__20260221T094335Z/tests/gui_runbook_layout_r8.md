# MCP GUI Runbook: R8 Outline Edge + 68% Centered Editor Layout

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0009__task-3.1__ref-R8__20260221T094335Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence output targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0009__task-3.1__ref-R8__20260221T094335Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. `playwright_browser_navigate` to `http://127.0.0.1:33100/`.
2. Resize viewport to desktop baseline: `playwright_browser_resize` with `width=1440`, `height=900`.
3. Ensure `WYSIWYG 模式` is active.
4. Capture screenshot as `outputs/screenshots/01-r8-layout-desktop.png`.
5. Evaluate and assert left-edge alignment:
   - Locate `[aria-label="标题大纲"]` and read `getBoundingClientRect().left`.
   - Assert `left <= 1`.
6. Evaluate and assert width ratio:
   - Locate `[aria-label="编辑区布局容器"]`.
   - Compute `ratio = rect.width / parentElement.getBoundingClientRect().width`.
   - Assert `ratio >= 0.66 && ratio <= 0.70`.
7. Evaluate and assert centering:
   - For `[aria-label="编辑区布局容器"]`, compute `leftGap = rect.left - parentRect.left`, `rightGap = parentRect.right - rect.right`.
   - Assert `Math.abs(leftGap - rightGap) <= 2`.
8. Capture screenshot as `outputs/screenshots/02-r8-layout-centered-check.png`.

## Evidence Checklist

- Screenshot artifacts:
  - `outputs/screenshots/01-r8-layout-desktop.png`
  - `outputs/screenshots/02-r8-layout-centered-check.png`
- Optional MCP console/network exports can be recorded under `logs/`.
