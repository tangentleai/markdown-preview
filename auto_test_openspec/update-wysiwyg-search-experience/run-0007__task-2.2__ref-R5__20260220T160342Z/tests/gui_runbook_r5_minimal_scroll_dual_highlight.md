# GUI MCP Runbook - R5 Minimal Scroll + Dual Highlight

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `2.2`
- Ref: `R5`
- Verification type: GUI via MCP only

## Preconditions
- Server started with `run.sh` or `run.bat`
- Target URL: `http://127.0.0.1:33100/`

## Test Content (Long Document)
Use this exact text in WYSIWYG editor so some hits are initially in viewport and others are off-screen:

```text
alpha row 001
alpha row 002
alpha row 003
alpha row 004
alpha row 005
alpha row 006
alpha row 007
alpha row 008
alpha row 009
alpha row 010
alpha row 011
alpha row 012
alpha row 013
alpha row 014
alpha row 015
alpha row 016
alpha row 017
alpha row 018
alpha row 019
alpha row 020
alpha row 021
alpha row 022
alpha row 023
alpha row 024
alpha row 025
alpha row 026
alpha row 027
alpha row 028
alpha row 029
alpha row 030
```

## MCP Steps
1. Navigate to `http://127.0.0.1:33100/`.
2. Click `WYSIWYG 模式`.
3. Focus `WYSIWYG 编辑区` and paste the long text above.
4. Press `Ctrl+F` (or `Meta+F` on macOS), input `alpha` in `查找文本`.
5. Assert there are multiple light highlights (`.wysiwyg-find-hit`) and no strong highlight (`.wysiwyg-find-hit-active`) before first navigation.
6. Click `查找下一个` once, assert:
   - counter becomes `匹配：1/30`
   - exactly one strong highlight exists
   - strong highlight element also has `.wysiwyg-find-hit`
7. Without scrolling the page manually, click `查找下一个` repeatedly while target remains near top viewport (for example up to `匹配：3/30`), assert page/editor scroll position does not change.
8. Continue clicking `查找下一个` until target would move off-screen; assert scroll position changes only when hit becomes non-visible, and current hit is brought into view.
9. Click `查找上一个` once, assert strong highlight moves to previous hit index and remains unique.
10. Repeat previous/next toggles for several steps, assert at every step:
    - only one `.wysiwyg-find-hit-active`
    - total `.wysiwyg-find-hit` count remains 30
    - active index and counter stay consistent.

## Evidence To Capture
- Screenshot after step 5 (`01-all-light-before-navigation.png`)
- Screenshot after step 6 (`02-first-active-strong-highlight.png`)
- Screenshot after step 7 (`03-no-scroll-while-visible.png`)
- Screenshot after step 8 (`04-scroll-only-when-offscreen.png`)
- Screenshot after step 10 (`05-active-highlight-remains-unique.png`)

## Pass Criteria
- Match switch uses minimal-scroll policy: no scroll while visible; scroll when target not visible.
- All matches keep light highlight.
- Current match keeps strong highlight and is unique after every navigation step.
