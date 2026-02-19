# GUI MCP Runbook - Task 3.4 / R11

## Preconditions

1. Start service with this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm URL is reachable: `http://127.0.0.1:33100/`

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Switch to `WYSIWYG 模式`.
3. In editor (`aria-label="WYSIWYG 编辑区"`), set a single paragraph text with repeated token, for example `alpha beta alpha beta`.
4. In toolbar (`aria-label="查找替换工具栏"`):
   - Fill `查找文本` with `alpha`
   - Fill `替换文本` with `ALPHA`
5. Click `查找下一个`; assert selection is on the first `alpha` match.
6. Click `替换当前`; assert only one match is replaced (`ALPHA beta alpha beta`).
7. Click `全部替换`; assert all remaining plain text matches are replaced (`ALPHA beta ALPHA beta`).
8. Verify shortcut formatting (selection-based):
   - select text `bold` then press `Ctrl/Cmd+B`, assert `<strong>bold</strong>` exists
   - select text `italic` then press `Ctrl/Cmd+I`, assert `<em>italic</em>` exists
   - select text `code` then press `Ctrl/Cmd+E`, assert `<code>code</code>` exists
9. Switch back to `双栏模式`; assert textarea markdown reflects replacements and inline formatting.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots for:
   - 查找替换工具栏 with filled fields
   - replace current result
   - replace all result
   - shortcut formatting result (strong/em/code)
   - dual-pane markdown sync after edits
2. Store screenshots under `outputs/screenshots/`.
3. Record MCP assertions and outcomes in Supervisor bookkeeping.
