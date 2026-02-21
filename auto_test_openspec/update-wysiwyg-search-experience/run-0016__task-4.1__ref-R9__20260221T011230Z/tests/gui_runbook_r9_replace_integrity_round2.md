# GUI MCP Runbook - R9 Replace Integrity Round 2 (Run 0016)

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `4.1`
- Ref: `R9`
- Verification type: GUI via MCP only

## Preconditions
- Server started via `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区`, then clear existing content with `Ctrl/Meta + A` and `Backspace`.
5. Input exactly one line into editor: `alpha beta alpha beta`.
6. Press `Ctrl+F` (or `Meta+F` on macOS).
   - Assert `查找文本` exists.
   - Assert `替换文本` does not exist.
7. Set `查找文本` to `alpha`.
8. Ensure `正则模式` is not pressed.
9. Click `切换到替换模式`.
   - Assert `替换文本`, `替换当前`, and `全部替换` are visible.
10. Set `替换文本` to `ALPHA`.
11. Click `查找下一个`, then click `替换当前`.
    - Assert editor text is exactly `ALPHA beta alpha beta`.
12. Click `全部替换`.
    - Assert editor text is exactly `ALPHA beta ALPHA beta`.
13. Click `关闭`.
14. Reopen toolbar with `Ctrl+F` (or `Meta+F`).
    - Assert toolbar resets to find mode (`替换文本` absent).

## Evidence To Capture
- `outputs/screenshots/01-default-find-mode.png` after step 6
- `outputs/screenshots/02-replace-mode-visible.png` after step 9
- `outputs/screenshots/03-replace-current-exact-text.png` after step 11
- `outputs/screenshots/04-replace-all-exact-text.png` after step 12
- `outputs/screenshots/05-reopen-reset-find-mode.png` after step 14

## Pass Criteria
- Default find-mode and mode reset behavior remain correct.
- Replace-current mutates only target hit and preserves surrounding text.
- Replace-all produces exact final text without text corruption.
