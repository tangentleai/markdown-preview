# GUI MCP Runbook - R1 Searchbar Sticky

## Scope
验证 WYSIWYG 查找栏 sticky 锚点与自然页面滚动行为：
- 查找栏相对编辑器容器顶部 sticky。
- 长文档滚动时查找栏保持可见。
- 页面保持自然展开滚动，不引入编辑区固定高度或内部滚动容器。

## Preconditions
1. Start service via bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T034157Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0001__task-1.1__ref-R1__20260221T034157Z\run.bat`
2. Open `http://127.0.0.1:33100/`.

## MCP Steps And Assertions
1. 切换到 `WYSIWYG` 模式。
2. 聚焦 `aria-label="WYSIWYG 编辑区"`，使用 `Ctrl+F` 或 `Cmd+F` 打开查找栏。
3. 断言查找栏元素 `aria-label="查找替换工具栏"` 可见，且 `aria-hidden="false"`。
4. 读取查找栏 `getComputedStyle(toolbar).position`，断言为 `sticky`。
5. 读取编辑器容器（查找栏父容器）与查找栏的 `getBoundingClientRect().top`：
   - 初始状态下，二者 top 接近（允许少量像素误差，<= 2px）。
6. 在编辑区写入长文档（例如 >= 120 行文本），确保页面产生纵向滚动。
7. 执行 `window.scrollTo(0, document.body.scrollHeight * 0.6)`。
8. 再次读取查找栏与编辑器容器 top：
   - 断言查找栏仍可见。
   - 断言查找栏 top 继续贴住容器顶部（误差 <= 2px）。
9. 检查编辑区 DOM 计算样式：
   - 不存在强制固定高度策略（例如 `height`/`max-height` 限制成固定滚动区域）。
   - 不存在内部滚动容器策略（例如 `overflow-y: auto|scroll` 用于承载主滚动）。
10. 断言 `window.scrollY > 0`，证明长文档场景下是页面自然滚动。

## Evidence To Capture (Supervisor)
- `outputs/screenshots/01-toolbar-visible-sticky-initial.png`
- `outputs/screenshots/02-toolbar-sticky-after-page-scroll.png`
- `outputs/screenshots/03-natural-page-scroll-no-inner-scroll.png`
