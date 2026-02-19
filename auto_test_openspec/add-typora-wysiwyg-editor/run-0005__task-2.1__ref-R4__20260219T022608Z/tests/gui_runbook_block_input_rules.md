# GUI MCP Runbook - Task 2.1 / R4

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
4. For each marker below, create a single line with only marker text at line start, place cursor at marker end, then press trigger key:
   - `#` + `Space` -> `<h1>`
   - `-` + `Space` -> `<ul><li>`
   - `1.` + `Space` -> `<ol><li>`
   - `>` + `Space` -> `<blockquote><p>`
   - `` ``` `` + `Enter` -> `<pre><code>`

5. After each transform, assert:
   - corresponding block structure appears in editor DOM
   - cursor remains inside transformed editable block (continue typing should append in that block)
6. Undo check:
   - produce `#` -> `Space` transform first
   - press `Ctrl/Cmd+Z` once
   - assert editor returns to pre-transform marker state (`#` as plain paragraph text)
7. Switch to `双栏模式` and assert textarea markdown stays synchronized with transformed/undone result.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots:
   - before transform marker state
   - each transformed block sample
   - undo restored marker state
   - dual-pane synchronized markdown state
2. Store screenshots under `outputs/screenshots/` and record index under `logs/`.
3. Record MCP assertions and outcomes in Supervisor EVIDENCE line.
