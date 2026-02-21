# MCP GUI Runbook: R7 Outline Long-Title Wrapping and Readability

## Preconditions

- Service started by:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0007__task-2.3__ref-R7__20260221T090742Z/run.sh`
  - URL: `http://127.0.0.1:33100/`
- Evidence output targets:
  - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0007__task-2.3__ref-R7__20260221T090742Z/outputs/screenshots/`

## MCP Procedure (playwright-mcp only)

1. `playwright_browser_navigate` to `http://127.0.0.1:33100/`.
2. Click mode switch button named `双栏模式`.
3. Fill textarea (`在这里输入 Markdown 文本...`) with:

```markdown
# 一级标题

正文段落。

## 二级标题用于验证左侧大纲在超长文本下能够自动换行并保持三行以内可读显示

补充段落。

### 三级标题用于验证层级缩进在多行文案情况下仍然清晰可辨并可准确定位

末尾段落。
```

4. Click mode switch button named `WYSIWYG 模式`.
5. Capture screenshot as `outputs/screenshots/01-r7-outline-wrapped-headings.png`.
6. Evaluate and assert:
   - Outline list exists: `[aria-label="标题大纲列表"]`.
   - Long H2 outline button exists by exact name text.
   - Inside long H2 button, text span computed style contains `-webkit-line-clamp: 3`.
   - Long H2 button computed style includes `line-height: 20px` and vertical padding (`6px` top/bottom via `py-1.5`).
7. Evaluate and assert indentation clarity by level:
   - H1 button `padding-left` is `12px`.
   - H2 button `padding-left` is `26px`.
   - H3 button `padding-left` is `40px`.
8. Click outline button named `三级标题用于验证层级缩进在多行文案情况下仍然清晰可辨并可准确定位`.
9. Capture screenshot as `outputs/screenshots/02-r7-outline-jump-target.png`.
10. Evaluate and assert jump correctness:
    - WYSIWYG editor contains `h3` with matching text.
    - Current selection/caret anchor node is inside the matched `h3` (or `h3` is scrolled into view when selection APIs are unavailable).

## Evidence Checklist

- Screenshot artifacts:
  - `outputs/screenshots/01-r7-outline-wrapped-headings.png`
  - `outputs/screenshots/02-r7-outline-jump-target.png`
- Optional MCP console/network exports can be recorded under `logs/`.
