# GUI MCP Runbook - R8 Regex Error Recovery

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `3.2`
- Ref: `R8`
- Verification type: GUI via MCP only

## Preconditions
- Server started via `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区` and input exactly one line: `alpha-42 alpha-7 alpha-11`.
5. Press `Ctrl+F` (or `Meta+F` on macOS).
6. Click `正则模式` (ensure `aria-pressed=true`).
7. Set `查找文本` to `/([a-z]+)-(\d+)/`, and set `替换文本` to `$2:$1`.
8. Click `查找下一个`, then click `替换当前`.
   - Assert editor text contains `42:alpha alpha-7 alpha-11`.
9. Set `查找文本` to invalid regex `/[a-/`.
   - Assert `查找错误提示` appears and starts with `正则表达式无效`.
   - Assert `查找上一个` / `查找下一个` / `替换当前` / `全部替换` are disabled.
   - Record current editor text snapshot for non-mutation check.
10. Click `全部替换` once while invalid regex is still present.
    - Assert editor text is unchanged from step 9 snapshot.
11. Correct `查找文本` to `/alpha-(\d+)/`.
    - Assert `查找错误提示` disappears.
12. Click `查找下一个` and assert counter displays `匹配：1/2`.

## Evidence To Capture
- `outputs/screenshots/01-regex-replace-current.png` after step 8
- `outputs/screenshots/02-invalid-regex-error-and-disabled-actions.png` after step 9
- `outputs/screenshots/03-invalid-regex-no-mutation-after-replace-all.png` after step 10
- `outputs/screenshots/04-regex-recovery-and-next-navigation.png` after step 12

## Pass Criteria
- Valid regex query supports JS regex find + capture-group replacement behavior.
- Invalid regex shows explicit error, disables actions, and does not mutate editor text.
- Fixing regex clears error and restores normal find navigation.
