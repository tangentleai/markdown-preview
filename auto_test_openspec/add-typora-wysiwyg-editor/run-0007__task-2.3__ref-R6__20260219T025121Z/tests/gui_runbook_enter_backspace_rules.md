# GUI MCP Runbook - Task 2.3 / R6

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
4. Empty list item exit rule:
   - create a list block, ensure caret is in an empty `<li>`
   - press `Enter`
   - assert current empty list item exits list and a paragraph block appears after list
5. Empty blockquote exit rule:
   - create `<blockquote><p><br></p></blockquote>` with caret in empty quote paragraph
   - press `Enter`
   - assert quote exits and a normal paragraph block appears outside quote
6. Heading backspace-to-paragraph rule:
   - create heading text (for example `## 标题文本`)
   - place caret at the beginning of heading
   - press `Backspace`
   - assert heading converts to paragraph and text content remains unchanged
7. Regression sanity after rules:
   - type `#` then space and confirm heading input rule still works
   - type `**bold**` and confirm inline style rendering still works
8. Switch to `双栏模式` and verify markdown updates reflect the transformed structure.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots for:
   - empty list item exit result
   - empty blockquote exit result
   - heading to paragraph by backspace
   - dual-pane synced markdown after transformations
2. Store screenshots under `outputs/screenshots/` and record index in logs.
3. Record MCP assertions and outcomes in Supervisor bookkeeping.
