# GUI MCP Runbook - R10 Responsive Consistency + Focus Style

## Preconditions

- Start service via `run.sh` or `run.bat` from this run bundle.
- Open `http://127.0.0.1:33100/` through MCP browser.

## MCP Assertions (Desktop)

1. Resize viewport to `1440x900`.
2. Confirm app is in `WYSIWYG 模式` (switch if needed).
3. Assert `aria-label="大纲与编辑区联动布局"` exists.
4. Assert desktop outline panel is visible with label `标题大纲`.
5. Assert editor container (`aria-label="编辑区布局容器"`) remains centered in right pane (left/right gap approximately equal).

## MCP Assertions (Mobile Drawer)

1. Resize viewport to `390x844`.
2. Assert there is a button with `aria-label="打开移动端大纲抽屉"`.
3. Click it and assert `aria-label="移动端标题大纲抽屉"` appears.
4. Verify drawer contains heading list area (`aria-label="标题大纲列表"`, if headings exist).
5. Click `aria-label="关闭移动端大纲抽屉"` and assert drawer disappears.

## MCP Assertions (Focus Visual)

1. With desktop or mobile viewport, focus the editor (`role="textbox"`, name `WYSIWYG 编辑区`).
2. Capture screenshot and verify focus uses subtle shadow emphasis (no bright blue ring border).
3. Confirm focused editor boundary remains clearly distinguishable from unfocused state.

## Evidence Capture

- Save screenshots to `outputs/screenshots/` with suggested names:
  - `01-r10-desktop-layout.png`
  - `02-r10-mobile-drawer-open.png`
  - `03-r10-mobile-drawer-closed.png`
  - `04-r10-focus-shadow-style.png`
