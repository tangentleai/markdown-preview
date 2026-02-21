# GUI MCP Runbook - R6 Zero/N and Disabled No-Match Actions

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `2.3`
- Ref: `R6`
- Verification type: GUI via MCP only

## Preconditions
- Server started with `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区` and input:
   - line 1: `alpha beta`
   - line 2: `gamma delta`
5. Press `Ctrl+F` (or `Meta+F` on macOS), then input `zzz_not_found` in `查找文本`.
6. Assert counter text is exactly `匹配：0/N`.
7. Assert button `查找上一个` has `disabled=true`.
8. Assert button `查找下一个` has `disabled=true`.
9. Assert button `替换当前` has `disabled=true`.
10. Assert button `全部替换` has `disabled=true`.

## Evidence To Capture
- Screenshot after step 6 (`01-counter-0-over-n.png`)
- Screenshot after step 10 (`02-all-actions-disabled-no-match.png`)

## Pass Criteria
- No-match state consistently shows `匹配：0/N`.
- The four no-op actions are all disabled in no-match state.
