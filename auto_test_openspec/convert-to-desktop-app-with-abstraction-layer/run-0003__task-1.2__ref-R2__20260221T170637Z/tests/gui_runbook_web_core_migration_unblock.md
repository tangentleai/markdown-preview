# GUI MCP Runbook (Task 1.2 / R2 / Unblock)

Use MCP only. Do not use executable browser scripts.

## 0) Preflight Unblock (mandatory)

1. If an old MCP browser session exists, close it first (MCP close current page/tab/context action).
2. If Playwright reports persistent context error (`正在现有的浏览器会话中打开`), close all Chrome windows for the test profile and re-open MCP browser context.
3. Start service:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
4. Confirm `http://127.0.0.1:33100/` is reachable before continuing.

## 1) Edit + Markdown Sync

1. Navigate to `http://127.0.0.1:33100/`.
2. In default `WYSIWYG 模式`, locate editor (`aria-label="WYSIWYG 编辑区"`).
3. Input content with heading + paragraph (example: `# Core Migration` and `alpha beta`).
4. Click `双栏模式`.
5. Assert left textarea contains `# Core Migration` and `alpha beta`.
6. Save screenshot: `outputs/gui-flow-a-edit-sync.png`.

## 2) Preview Path

1. Keep `双栏模式`.
2. In textarea, input markdown containing bold text and list.
3. Assert right `预览效果` panel renders bold and list correctly.
4. Save screenshot: `outputs/gui-flow-b-preview.png`.

## 3) Find/Replace Path

1. Switch to `WYSIWYG 模式`.
2. Ensure text includes repeated token, e.g. `alpha beta alpha`.
3. Press `Ctrl/Cmd+F`, fill find text `alpha`.
4. Switch replace mode, fill replacement `ALPHA`.
5. Run `替换当前` once, then `全部替换`.
6. Assert editor shows `ALPHA beta ALPHA`.
7. Switch to `双栏模式` and assert textarea markdown also shows replacement.
8. Save screenshot: `outputs/gui-flow-c-find-replace.png`.

## 4) Evidence Recording

- Save any GUI anomaly/block note in `logs/gui_notes.txt`.
- Supervisor writes final PASS/FAIL; this runbook does not declare verdict.
