# GUI MCP Runbook - R4 Bidirectional Search Navigation

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `2.1`
- Ref: `R4`
- Verification type: GUI via MCP only

## Preconditions
- Server started with `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Navigate to `http://127.0.0.1:33100/`.
2. Click `WYSIWYG 模式`.
3. Focus `WYSIWYG 编辑区` and set content to `alpha beta alpha beta`.
4. Press `Ctrl+F` (or `Meta+F` on macOS) to open the toolbar.
5. In `查找文本`, input `alpha`.
6. Assert counter text is `匹配：0/2`.
7. Click `查找下一个`, assert counter `匹配：1/2`.
8. Click `查找下一个`, assert counter `匹配：2/2`.
9. Click `查找下一个`, assert counter wraps to `匹配：1/2`.
10. Click `查找上一个`, assert counter wraps backward to `匹配：2/2`.
11. Click `查找上一个`, assert counter becomes `匹配：1/2`.

## Evidence To Capture
- Screenshot after step 6 (`00-counter-initial-0of2.png`)
- Screenshot after step 8 (`01-next-reaches-2of2.png`)
- Screenshot after step 9 (`02-next-wraps-to-1of2.png`)
- Screenshot after step 10 (`03-prev-wraps-to-2of2.png`)
- Screenshot after step 11 (`04-prev-back-to-1of2.png`)

## Pass Criteria
- Both navigation buttons exist: `查找上一个` and `查找下一个`.
- Counter sequence exactly follows:
  - next path: `0/2 -> 1/2 -> 2/2 -> 1/2`
  - previous path: `1/2 -> 2/2 -> 1/2`
- No skipped index and no reversed direction in the observed sequence.
