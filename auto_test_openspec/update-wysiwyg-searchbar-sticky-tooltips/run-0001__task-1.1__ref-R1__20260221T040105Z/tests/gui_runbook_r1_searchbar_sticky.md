# GUI MCP Runbook - R1 Sticky Searchbar Anchored To Editor Container

## Scope
- Change: `update-wysiwyg-searchbar-sticky-tooltips`
- Task: `1.1`
- Ref: `R1`
- Verification type: GUI via MCP only

## Preconditions
- Server started with `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## MCP Steps
1. Resize viewport to `1280x720`.
2. Navigate to `http://127.0.0.1:33100/`.
3. Click `WYSIWYG 模式`.
4. Focus `WYSIWYG 编辑区`, replace content with 140 lines (`line-001` ... `line-140`) and include `alpha` on lines 2, 60, 100, 135.
5. Execute `window.scrollTo(0, 0)`.
6. Press `Ctrl+F` (or `Meta+F` on macOS), input `alpha` into `查找文本`.
7. Evaluate and record sticky baseline:
   - find toolbar `position === "sticky"`.
   - find toolbar `top` computed value is `16px`.
   - toolbar top is approximately `container.top + 16` before scroll (allow +-2px).
8. Scroll page with `window.scrollTo(0, document.body.scrollHeight * 0.5)`.
9. Evaluate sticky-on-scroll:
   - toolbar rect still intersects viewport (`bottom > 0` and `top < innerHeight`).
   - `window.scrollY > 0`.
10. Evaluate layout constraints on editor and container:
    - editor computed `overflow-y` is neither `auto` nor `scroll`.
    - editor computed `max-height` is `none`.
    - container computed `overflow-y` is neither `auto` nor `scroll`.

## Evidence To Capture
- Screenshot after step 7: `01-sticky-baseline-before-scroll.png`
- Screenshot after step 9: `02-sticky-visible-after-long-scroll.png`
- Screenshot after step 10: `03-natural-layout-no-internal-scroll.png`

## Pass Criteria
- Searchbar remains sticky and visible after long page scrolling.
- Sticky offset aligns with editor container top context.
- No fixed-height/internal-scroll container pattern is introduced for the editor.
