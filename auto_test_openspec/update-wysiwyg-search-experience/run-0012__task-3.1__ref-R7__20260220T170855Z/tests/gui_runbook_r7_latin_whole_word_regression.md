# GUI MCP Runbook - R7 Latin Whole-Word Regression

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
   - line 1: `ALPHA`
   - line 2: `cat category scat cat`
5. Press `Ctrl+F` (or `Meta+F` on macOS) and set `查找文本` to `cat`.
6. Ensure `区分大小写` is off (`aria-pressed=false`).
7. Click `整词匹配` and assert counter is `匹配：0/2`.
8. Click `区分大小写` and assert counter remains `匹配：0/2` for this lowercase dataset.
9. Click `正则模式` and assert `整词匹配` becomes disabled and `aria-pressed=false`.

## Evidence To Capture
- Screenshot after step 7 (`01-latin-whole-word-0of2.png`)
- Screenshot after step 8 (`02-case-plus-whole-word-0of2.png`)
- Screenshot after step 9 (`03-regex-disables-whole-word.png`)

## Pass Criteria
- Whole-word Latin matching counts both standalone `cat` hits in `cat category scat cat`.
- Case toggle + whole-word combination remains consistent.
- Regex mode auto-disables whole-word.
