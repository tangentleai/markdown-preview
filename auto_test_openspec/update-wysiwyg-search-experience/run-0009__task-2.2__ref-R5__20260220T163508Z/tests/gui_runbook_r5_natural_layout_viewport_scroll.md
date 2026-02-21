# GUI MCP Runbook - R5 Natural Layout Viewport Scroll

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `2.2`
- Ref: `R5`
- Verification type: GUI via MCP only

## Preconditions
- Server started with `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区` and set 120 lines of content:
   - line 2: `alpha`
   - line 6: `alpha`
   - line 90: `alpha`
   - line 110: `alpha`
   - all other lines: `filler`
5. Execute `window.scrollTo(0, 0)` and confirm `window.scrollY === 0`.
6. Press `Ctrl+F` (or `Meta+F` on macOS), input `alpha` in `查找文本`, assert counter is `匹配：0/4`.
7. Click `查找下一个`; assert counter `匹配：1/4`; record `window.scrollY` as `y1`.
8. Click `查找下一个`; assert counter `匹配：2/4`; record `window.scrollY` as `y2`.
9. Assert `Math.abs(y2 - y1) <= 1`.
10. Click `查找下一个`; assert counter `匹配：3/4`; record `window.scrollY` as `y3`.
11. Assert `y3 > y2`.
12. Assert highlight state:
    - `span[data-find-highlight="true"]` count is `4`.
    - `.wysiwyg-find-hit-active[data-find-match-index]` count is exactly `1`.
    - active node has `data-find-highlight-state="active"`.
    - non-active highlight nodes have `data-find-highlight-state="all"`.

## Evidence To Capture
- Screenshot after step 6 (`00-counter-initial-0of4.png`)
- Screenshot after step 9 (`01-visible-hit-no-page-scroll.png`)
- Screenshot after step 11 (`02-offscreen-hit-page-scroll.png`)
- Screenshot after step 12 (`03-dual-layer-highlight-unique-active.png`)

## Pass Criteria
- Verification is done on natural expansion layout (page-level scrolling, no internal editor scroll metric).
- Visible-hit navigation keeps page scroll unchanged.
- Offscreen-hit navigation increases page scroll.
- Dual-layer highlight remains correct with exactly one active hit.
