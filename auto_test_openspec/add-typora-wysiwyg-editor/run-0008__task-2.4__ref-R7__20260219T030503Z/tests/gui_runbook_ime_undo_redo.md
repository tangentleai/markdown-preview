# GUI MCP Runbook - Task 2.4 / R7

## Preconditions

1. Start service with this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm URL is reachable: `http://127.0.0.1:33100/`

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Click `WYSIWYG 模式`.
3. Locate editable area:
   - role: `textbox`
   - name: `WYSIWYG 编辑区`
4. Chinese IME composition protection check:
   - enter a line that begins with `#` while Chinese IME composition is active (for example through pinyin candidate composition)
   - during composition commit/space selection, assert structural heading transform is not auto-triggered unexpectedly
   - verify editor keeps composed Chinese text as plain content unless explicit non-IME structural trigger is typed after composition ends
5. Structural undo/redo check on block transform:
   - type `#` then space (non-IME) to trigger heading conversion
   - press undo shortcut (`Ctrl/Cmd+Z`) and assert state returns to marker text form
   - press redo shortcut (`Ctrl/Cmd+Shift+Z` or `Ctrl/Cmd+Y`) and assert heading structure returns
6. Structural undo/redo check on heading backspace transform:
   - create heading text and place caret at start
   - press `Backspace` to convert heading to paragraph
   - undo then redo with shortcuts and assert two states are restored exactly
7. Regression sanity:
   - verify list/code block trigger and inline style trigger still work
8. Switch to `双栏模式` and verify markdown remains synchronized with final editor state.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots for:
   - IME composition stage with no accidental structural transform
   - undo restored marker/plain state
   - redo restored structural heading state
   - heading-backspace transform plus undo/redo states
   - dual-pane markdown synchronization result
2. Store screenshots under `outputs/screenshots/` and record index in logs.
3. Record MCP assertions and outcomes in Supervisor bookkeeping.
