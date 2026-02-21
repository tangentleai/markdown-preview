# GUI MCP Runbook - R1 Horizontal Rule Rendering

Use playwright-mcp only. Do not use manual browser operations or executable browser scripts.

## Preconditions

1. Start local service with `run.sh` (macOS/Linux) or `run.bat` (Windows) from this run folder.
2. Open URL: `http://127.0.0.1:33100/`.
3. Switch to `WYSIWYG 模式` in app header.

## MCP Procedure

1. Focus the element with role `textbox` and label `WYSIWYG 编辑区`.
2. Clear existing content in editor.
3. Type exactly:
   - line 1: `---`
   - press `Space` once (block rule trigger)
4. Assert DOM now contains one `hr` element inside editor.
5. Press `Backspace` and then `Ctrl+Z` to validate undo/redo stability around the inserted block.
6. Switch to `双栏模式`.
7. Assert markdown textarea value contains `---` as a standalone block line.
8. Switch back to `WYSIWYG 模式` and assert `hr` still exists (round-trip semantics).

## Evidence Capture (Supervisor)

Save screenshots to `outputs/screenshots/`:

1. `01-wysiwyg-before-input.png`
2. `02-hr-rendered.png`
3. `03-markdown-roundtrip.png`
4. `04-hr-after-roundtrip.png`

Record screenshot index path in `logs/` when final validation is executed.
