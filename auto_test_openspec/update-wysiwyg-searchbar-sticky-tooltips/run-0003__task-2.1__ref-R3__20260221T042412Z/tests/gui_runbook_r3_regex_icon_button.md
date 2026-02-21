# GUI MCP Runbook - R3 Regex Icon Button

## Scope
- SCOPE: GUI
- Target: verify regex mode control is icon-based, keeps accessible name, and preserves toggle behavior.

## Preconditions
1. Start service via bundle script and keep it running.
2. Open `http://127.0.0.1:33100/`.
3. Switch to `WYSIWYG` mode.
4. Open find toolbar with `Ctrl+F`/`Cmd+F`.

## MCP Assertions
1. Locate button by role/name: `button[name="正则模式"]`.
2. Assert the button exists and has `aria-label="正则模式"`.
3. Assert initial `aria-pressed="false"`.
4. Assert button visible text content does not include `正则模式`.
5. Assert the button contains an icon image element (`img[aria-hidden="true"]`).
6. Capture screenshot: `outputs/screenshots/01-regex-icon-default.png`.
7. Click regex button once.
8. Assert `aria-pressed="true"`.
9. Capture screenshot: `outputs/screenshots/02-regex-icon-pressed.png`.
10. Click regex button again.
11. Assert `aria-pressed="false"`.
12. Capture screenshot: `outputs/screenshots/03-regex-icon-unpressed.png`.

## Evidence Notes
- Save screenshot paths and assertion outcomes into supervisor evidence chain.
- Do not execute browser automation scripts; run steps via MCP interactions only.
