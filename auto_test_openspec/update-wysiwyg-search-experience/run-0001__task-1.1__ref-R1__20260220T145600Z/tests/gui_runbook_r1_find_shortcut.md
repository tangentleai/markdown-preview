# GUI MCP Runbook - R1 Find Shortcut Entry

## Scope
Validate `Ctrl+F` / `Cmd+F` find-bar entry behavior in WYSIWYG mode, including selection-seeded normalized query and immediate match indexing.

## Preconditions
1. Start service via bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z/run.sh`
   - Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0001__task-1.1__ref-R1__20260220T145600Z\\run.bat`
2. Open `http://127.0.0.1:33100/`.

## MCP Steps And Assertions
1. Switch to `WYSIWYG` mode.
2. Focus editor (`aria-label="WYSIWYG 编辑区"`).
3. Trigger `Ctrl+F` on focused editor.
   - Assert toolbar `aria-label="查找替换工具栏"` has `aria-hidden="false"`.
4. Press `Escape` to close toolbar.
   - Assert toolbar has `aria-hidden="true"`.
5. Trigger `Cmd+F` on focused editor.
   - Assert toolbar opens (`aria-hidden="false"`).
6. Prepare deterministic content in editor with three paragraphs:
   - Paragraph 1: `Alpha`
   - Paragraph 2: `beta`
   - Paragraph 3: `Alpha beta marker`
7. Create selection from start of paragraph 1 to end of paragraph 2 (cross-node selection, includes line break boundary).
8. Trigger `Ctrl+F` (or `Cmd+F`) while selection is active.
   - Assert find input (`aria-label="查找文本"`) value is `Alpha beta` (normalized single-space plain text).
   - Assert result counter (`aria-label="查找结果计数"`) reflects immediate indexing and shows `1/1`.
9. Clear selection (caret only), trigger shortcut again.
   - Assert toolbar still opens normally and find input remains editable.

## Evidence To Capture (Supervisor)
- Screenshot after Step 3 (toolbar open by Ctrl+F).
- Screenshot after Step 5 (toolbar open by Cmd+F).
- Screenshot after Step 8 (prefilled normalized query and `1/1` counter).
