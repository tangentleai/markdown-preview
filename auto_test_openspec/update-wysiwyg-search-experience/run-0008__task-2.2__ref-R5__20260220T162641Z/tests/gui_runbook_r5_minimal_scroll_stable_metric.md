# GUI MCP Runbook - R5 Minimal Scroll (Stable Metric)

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `2.2`
- Ref: `R5`
- Verification type: GUI via MCP only

## Preconditions
- Server started with `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Navigate to `http://127.0.0.1:33100/`.
2. Click `WYSIWYG 模式`.
3. Focus `WYSIWYG 编辑区` and set content to 40 lines, with `alpha` at line 2, line 6, line 28, line 36; all other lines are `filler`.
4. Press `Ctrl+F` (or `Meta+F` on macOS), set `查找文本` to `alpha`.
5. Assert counter is `匹配：0/4`.
6. Evaluate and store editor container `scrollTop` as `s0` from `[aria-label="WYSIWYG 编辑区"]`.
7. Click `查找下一个`; assert counter `匹配：1/4`; store editor `scrollTop` as `s1`.
8. Click `查找下一个`; assert counter `匹配：2/4`; store editor `scrollTop` as `s2`.
9. Assert `s2 === s1` (second hit still visible, no scroll).
10. Click `查找下一个`; assert counter `匹配：3/4`; store editor `scrollTop` as `s3`.
11. Assert `s3 > s2` (third hit was offscreen, scroll triggered).
12. Evaluate highlight state:
    - `span[data-find-highlight="true"]` total count is `4`.
    - `.wysiwyg-find-hit-active[data-find-match-index]` total count is `1`.
    - Active node has `data-find-highlight-state="active"`.
    - Non-active highlighted nodes have `data-find-highlight-state="all"`.

## Evidence To Capture
- Screenshot after step 5 (`00-counter-initial-0of4.png`)
- Screenshot after step 9 (`01-visible-hit-no-scroll.png`)
- Screenshot after step 11 (`02-offscreen-hit-scrolls.png`)
- Screenshot after step 12 (`03-dual-layer-unique-active.png`)

## Pass Criteria
- Editor `scrollTop` is the only scroll metric and is deterministic for this runbook.
- Visible-hit navigation does not change `scrollTop`.
- Offscreen-hit navigation increases `scrollTop`.
- Dual-layer highlighting and unique active state remain correct after navigation.
