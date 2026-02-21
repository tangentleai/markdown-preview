# GUI MCP Runbook - R4 Icon Tooltip Coverage

## Scope
- Verify find-toolbar icon tooltip behavior for hover, keyboard focus, and mobile long-press.
- Verify tooltip style consistency via shared class and computed style tokens.

## Preconditions
1. Start app using bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0004__task-2.2__ref-R4__20260221T043151Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0004__task-2.2__ref-R4__20260221T043151Z\run.bat`
2. Open `http://127.0.0.1:33100/`.
3. Switch to `WYSIWYG 模式`.
4. Focus editor and trigger find toolbar with `Ctrl+F` (or `Cmd+F` on macOS).

## Target Buttons and Tooltip Text
- `关闭查找替换工具栏` -> `关闭查找替换工具栏`
- `区分大小写` -> `区分大小写`
- `查找整个单词` -> `查找整个单词`
- `正则模式` -> `正则模式`
- `查找上一个` -> `查找上一个`
- `查找下一个` -> `查找下一个`
- Toggle `替换` mode, then:
  - `替换当前` -> `替换当前`
  - `替换全部` -> `替换全部`

## MCP Steps - Hover and Focus
1. For each button listed above:
   - Hover button; assert a visible element with `role="tooltip"` and exact text.
   - Capture screenshot to `outputs/screenshots/hover-<button-id>.png`.
2. For each button listed above:
   - Focus button via keyboard navigation/tab or direct focus action.
   - Assert `role="tooltip"` is visible with exact text.
   - Capture screenshot to `outputs/screenshots/focus-<button-id>.png`.

## MCP Steps - Mobile Long-Press
1. Set viewport to a mobile size (example: 390x844).
2. On a non-disabled icon button (recommended: `关闭查找替换工具栏`), perform long-press:
   - trigger `touchstart`
   - wait at least 450ms
   - assert tooltip with exact text becomes visible
3. Capture screenshot `outputs/screenshots/mobile-long-press-tooltip.png`.
4. Release touch and assert tooltip hides.

## MCP Steps - Style Consistency
1. When each tooltip is visible, capture computed style for:
   - `background-color`
   - `border-radius`
   - `font-size`
2. Verify all values are identical across buttons.
3. Verify tooltip element has class `wysiwyg-find-icon-tooltip` in all checks.
4. Save style observations to `logs/tooltip-style-observations.txt`.

## Evidence to Capture
- Screenshots in `outputs/screenshots/` for hover/focus/long-press.
- Optional log entries in `logs/` with per-button assertion notes.
