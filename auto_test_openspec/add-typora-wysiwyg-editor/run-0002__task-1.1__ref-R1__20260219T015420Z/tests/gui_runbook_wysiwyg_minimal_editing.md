# GUI MCP Runbook - Task 1.1 / R1

## Preconditions

1. Start service with this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm page is reachable at `http://127.0.0.1:33100/`.

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Click `WYSIWYG 模式`.
3. Locate editable area by role/name:
   - role: `textbox`
   - accessible name: `WYSIWYG 编辑区`
4. In the same editable area, perform direct input:
   - place cursor at end
   - type the following content on new lines:

```text
内核最小集成验收
可直接编辑排版区域
```

5. In the same editable area, select `可直接编辑排版区域` and delete it (Backspace/Delete).
6. Type replacement text in place:

```text
基础输入与删除可用
```

7. Assert in WYSIWYG mode:
   - editable region remains focused/interactive after input+delete+replace
   - edited text is visible in rendered single-pane area
8. Click `双栏模式`.
9. Assert dual-pane remains unchanged structurally:
   - `Markdown 输入` section is visible
   - `预览效果` section is visible
10. Assert textarea content contains:
    - `内核最小集成验收`
    - `基础输入与删除可用`

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots at minimum:
   - WYSIWYG editable pane before edit
   - WYSIWYG pane after input/delete/replace
   - dual-pane after switching back with updated text reflected
2. Save screenshots under `outputs/screenshots/` and index file in `logs/`.
3. Record exact MCP assertions and outcomes in Supervisor evidence line.
