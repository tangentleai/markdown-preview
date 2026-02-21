# GUI MCP Runbook - R5 Minimal Scroll + Dual Highlight

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
3. Focus `WYSIWYG 编辑区` and set long content (at least 14 lines), for example:
   - `line01 alpha`
   - `line02 filler`
   - `line03 filler`
   - `line04 alpha`
   - `line05 filler`
   - `line06 filler`
   - `line07 filler`
   - `line08 filler`
   - `line09 filler`
   - `line10 alpha`
   - `line11 filler`
   - `line12 filler`
   - `line13 filler`
   - `line14 alpha`
4. Press `Ctrl+F` (or `Meta+F` on macOS), then input `alpha` into `查找文本`.
5. Record `editor.scrollTop` as `s0`; assert counter is `匹配：0/4`.
6. Click `查找下一个`; assert counter `匹配：1/4`, then record `editor.scrollTop` as `s1`.
7. Click `查找下一个`; assert counter `匹配：2/4`, then record `editor.scrollTop` as `s2`.
8. Assert `s2 === s1` (target remained visible, so no extra scroll).
9. Click `查找下一个`; assert counter `匹配：3/4`, then record `editor.scrollTop` as `s3`.
10. Assert `s3 > s2` (target was off-screen and scroll was triggered).
11. At steps 6, 7, and 9, evaluate DOM state:
    - Total `span[data-find-highlight="true"]` count is `4`.
    - Unique active index count from `.wysiwyg-find-hit-active[data-find-match-index]` is exactly `1`.
    - Every highlighted hit has `data-find-highlight-state` in `{all, active}`.

## Evidence To Capture
- Screenshot after step 5 (`00-counter-initial-0of4.png`)
- Screenshot after step 8 (`01-visible-navigation-no-scroll.png`)
- Screenshot after step 10 (`02-offscreen-navigation-scrolls.png`)
- Screenshot after step 11 (`03-dual-layer-highlight-state.png`)

## Pass Criteria
- Scroll is only triggered when navigating to an off-screen hit.
- All hits keep light highlight while current hit keeps strong highlight.
- Active highlight index is unique and changes with navigation.
