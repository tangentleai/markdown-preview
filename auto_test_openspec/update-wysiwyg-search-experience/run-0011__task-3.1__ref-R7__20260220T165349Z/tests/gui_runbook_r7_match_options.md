# GUI MCP Runbook - R7 Match Options Linkage

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `3.1`
- Ref: `R7`
- Verification type: GUI via MCP only

## Preconditions
- Server started via `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区` and input exactly:
   - line 1: `Alpha alpha ALPHA`
   - line 2: `cat category scat cat`
   - line 3: `你好世界 你好`
5. Press `Ctrl+F` (or `Meta+F` on macOS) and set `查找文本` to `alpha`.
6. Assert `区分大小写` default state is off (`aria-pressed=false`) and counter is `匹配：0/3`.
7. Click `区分大小写` and assert counter updates to `匹配：0/1`.
8. Set `查找文本` to `cat`, click `整词匹配`, assert counter is `匹配：0/2`.
9. Set `查找文本` to `你好`, keep `整词匹配` on, assert counter is `匹配：0/2`.
10. Click `正则模式` and assert `整词匹配` becomes disabled and `aria-pressed=false`.

## Evidence To Capture
- Screenshot after step 6 (`01-case-default-off-0of3.png`)
- Screenshot after step 7 (`02-case-on-0of1.png`)
- Screenshot after step 8 (`03-whole-word-latin-0of2.png`)
- Screenshot after step 9 (`04-whole-word-non-latin-0of2.png`)
- Screenshot after step 10 (`05-regex-disables-whole-word.png`)

## Pass Criteria
- Case toggle behavior matches explicit on/off rules.
- Whole-word behavior applies Latin boundaries only.
- Enabling regex mode auto-disables whole-word mode.
