# GUI MCP Runbook (Task 1.2 / R2)

Use MCP tooling only (no manual browser scripting files). Start the app first:

- macOS/Linux: `bash run.sh`
- Windows: `run.bat`
- URL: `http://127.0.0.1:33100/`

## Flow A: Edit + Markdown Sync

1. Navigate to the URL.
2. Keep default `WYSIWYG 模式` and locate editor (`aria-label="WYSIWYG 编辑区"`).
3. Type or set content to include a heading and paragraph, for example: `# Core Migration` and `alpha beta`.
4. Click `双栏模式`.
5. Assert left textarea contains markdown heading form (`# Core Migration`) and paragraph text.
6. Capture screenshot to `outputs/gui-flow-a-edit-sync.png`.

## Flow B: Preview Path

1. Stay in `双栏模式`.
2. In textarea, input markdown with bold text and list.
3. Verify right panel (`预览效果`) shows rendered bold/list content.
4. Capture screenshot to `outputs/gui-flow-b-preview.png`.

## Flow C: Find/Replace Key Path

1. Switch to `WYSIWYG 模式`.
2. Ensure editor content includes duplicated token, such as `alpha beta alpha`.
3. Press `Ctrl/Cmd+F` to open find toolbar.
4. Fill find text: `alpha`; switch to replace mode; fill replace text: `ALPHA`.
5. Execute `替换当前` once, then `全部替换`.
6. Assert editor text reflects replacement (`ALPHA beta ALPHA`).
7. Switch back to `双栏模式` and assert textarea markdown also reflects replaced content.
8. Capture screenshot to `outputs/gui-flow-c-find-replace.png`.

## Evidence Notes

- Save any MCP console/network anomaly notes to `logs/gui_notes.txt`.
- Supervisor records final PASS/FAIL; this runbook does not declare verdict.
