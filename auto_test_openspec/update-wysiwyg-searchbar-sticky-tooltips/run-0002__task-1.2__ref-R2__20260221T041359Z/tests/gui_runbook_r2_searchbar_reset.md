# GUI MCP Runbook - R2 Searchbar Reset

## Scope
- SCOPE: GUI
- Target: verify find/replace toolbar state reset after close-button close and Esc close.

## Preconditions
1. Start service via bundle script and keep it running.
2. Open `http://127.0.0.1:33100/`.
3. Switch to `WYSIWYG` mode.
4. Prepare editor content with at least two duplicate matches (example text: `alpha beta alpha`).

## MCP Assertions - Close Button Path
1. Open find toolbar with `Ctrl+F`/`Cmd+F`.
2. Set find query to `alpha` and replace query to `ALPHA`.
3. Switch to replace mode.
4. Toggle buttons to non-default states:
   - enable case-sensitive
   - enable whole-word
   - enable regex
5. Enter invalid regex query `(` to trigger regex error.
6. Trigger find-next once so match index is not default and highlight nodes are present.
7. Capture screenshot: `outputs/screenshots/01-before-close-button-reset.png`.
8. Click close toolbar button (`aria-label="关闭查找替换工具栏"`).
9. Reopen with `Ctrl+F`/`Cmd+F`.
10. Assert all reset points:
    - find query is empty
    - replace input hidden (find mode)
    - case-sensitive/whole-word/regex are all `aria-pressed=false`
    - counter text is `匹配：0/N`
    - regex error element (`aria-label="查找错误提示"`) absent
    - no highlight nodes: `span[data-find-highlight="true"]`
11. Capture screenshot: `outputs/screenshots/02-after-reopen-close-button-reset.png`.

## MCP Assertions - Esc Path
1. With toolbar open, re-seed non-default state (query/mode/toggles/highlight as above).
2. Press `Escape` while focus is in find input (or editor while toolbar visible).
3. Reopen with `Ctrl+F`/`Cmd+F`.
4. Re-assert all reset points from the close-button path.
5. Capture screenshot: `outputs/screenshots/03-after-reopen-esc-reset.png`.

## Evidence Notes
- Save screenshot paths and assertion outcomes into supervisor evidence chain.
- Do not execute browser automation scripts; run steps via MCP interactions only.
