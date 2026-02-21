# GUI MCP Runbook - R9 Find/Replace Mode Reset (Run 0015)

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
4. Focus `WYSIWYG 编辑区` and input one line: `alpha beta alpha beta`.
5. Press `Ctrl+F` (or `Meta+F` on macOS).
   - Assert `查找文本` exists.
   - Assert `替换文本` does not exist.
   - Assert `替换当前` and `全部替换` do not exist.
6. Set `查找文本` to `alpha`.
7. Click `切换到替换模式`.
   - Assert `替换文本`, `替换当前`, and `全部替换` are visible.
8. Set `替换文本` to `ALPHA`.
9. Click `查找下一个`, then click `替换当前`.
   - Assert editor text becomes `ALPHA beta alpha beta`.
10. Click `全部替换`.
    - Assert editor text becomes `ALPHA beta ALPHA beta`.
11. Click `关闭`.
12. Reopen toolbar with `Ctrl+F` (or `Meta+F`).
    - Assert toolbar defaults to find mode again (`替换文本` absent).
    - Assert `切换到查找模式` is pressed and `切换到替换模式` is not pressed.

## Evidence To Capture
- `outputs/screenshots/01-default-find-mode-no-replace-controls.png` after step 5
- `outputs/screenshots/02-replace-mode-controls-visible.png` after step 7
- `outputs/screenshots/03-replace-actions-applied.png` after step 10
- `outputs/screenshots/04-close-reopen-reset-find-mode.png` after step 12

## Pass Criteria
- Toolbar defaults to find-only UI.
- Replace controls appear only in replace mode.
- Replace actions are operational in replace mode.
- Closing and reopening resets mode to find-only.
