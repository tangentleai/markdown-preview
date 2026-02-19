# GUI MCP Runbook - Task 2.2 / R5

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
4. In the same paragraph, verify inline closing triggers render style nodes:
   - type `**bold**` and assert `<strong>bold</strong>` appears
   - type `*italic*` and assert `<em>italic</em>` appears
   - type `` `code` `` and assert `<code>code</code>` appears
   - type `[OpenAI](https://openai.com)` and assert `<a href="https://openai.com">OpenAI</a>` appears
5. Cursor boundary stability check:
   - place caret directly after each rendered inline node boundary
   - press `ArrowLeft` then `ArrowRight`
   - type `X` and assert content is inserted near expected boundary without breaking existing style node
6. Switch to `双栏模式` and assert textarea markdown keeps synchronized inline markdown syntax.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots:
   - each rendered inline style result
   - cursor boundary edit around at least one strong/em/code/link node
   - dual-pane synchronized markdown state
2. Store screenshots under `outputs/screenshots/` and record index under `logs/`.
3. Record MCP assertions and outcomes in Supervisor EVIDENCE line.
