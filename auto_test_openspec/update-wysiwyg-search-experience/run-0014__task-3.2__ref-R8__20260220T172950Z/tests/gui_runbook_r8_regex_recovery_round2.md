# GUI MCP Runbook - R8 Regex Replace/Recovery (Run 0014)

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `3.2`
- Ref: `R8`
- Verification type: GUI via MCP only

## Preconditions
- Server started via `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## Regex Query Semantics Used In This Runbook
- The runbook uses slash-wrapped form: `/pattern/flags`.
- Equivalent raw form without wrapping is also supported by implementation, but this runbook uses wrapped form for determinism.
- `i/m` are valid flags; global behavior is controlled by find flow.

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区` and input exactly one line: `alpha-42 alpha-7 alpha-11`.
5. Press `Ctrl+F` (or `Meta+F` on macOS).
6. Click `正则模式` (assert `aria-pressed=true`).
7. Set `查找文本` to `/([a-z]+)-(\d+)/`, and set `替换文本` to `$2:$1`.
8. Click `查找下一个`, then click `替换当前`.
   - Assert editor text is exactly `42:alpha alpha-7 alpha-11`.
9. Set `查找文本` to invalid regex `/[a-/`.
   - Assert `查找错误提示` appears and starts with `正则表达式无效`.
   - Assert `查找上一个` / `查找下一个` / `替换当前` / `全部替换` are disabled.
   - Record current editor text snapshot.
10. Click `全部替换` once while invalid regex remains.
    - Assert editor text equals snapshot from step 9 (no mutation).
11. Correct `查找文本` to `/alpha-(\d+)/`.
    - Assert `查找错误提示` disappears.
    - Assert `查找下一个` becomes enabled.
12. Click `查找下一个` and assert counter displays `匹配：1/2`.

## Evidence To Capture
- `outputs/screenshots/01-replace-current-exact-single-target.png` after step 8
- `outputs/screenshots/02-invalid-regex-error-and-disabled-actions.png` after step 9
- `outputs/screenshots/03-invalid-regex-no-mutation.png` after step 10
- `outputs/screenshots/04-valid-regex-recovery-and-next-enabled.png` after step 12

## Pass Criteria
- Replace-current in regex mode mutates only one selected match and preserves remaining content.
- Invalid regex disables actions and keeps editor content unchanged.
- Fixing query to valid regex clears error and restores next-navigation with non-zero match state.
