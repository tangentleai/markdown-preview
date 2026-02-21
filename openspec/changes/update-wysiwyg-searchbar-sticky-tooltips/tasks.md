## 1. 搜索栏布局与状态重置
- [x] 1.1 将搜索栏改为顶部 sticky 并保持自然页面滚动 [#R1]
  - ACCEPT: 在长文档中滚动页面时，搜索栏固定在编辑器容器顶部可见；不引入编辑区固定高度或内部滚动容器。
  - TEST: SCOPE: GUI
    - 使用 GUI MCP runbook 验证文档滚动前后搜索栏均可见，且粘性锚点相对编辑器容器顶部。
    - 验证页面仍为自然展开滚动（非内部滚动容器）。
  - BUNDLE (RUN #1): R1 sticky find toolbar anchored to editor container top + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T040105Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #1): Supervisor executed GUI bundle and MCP runbook assertions for container-relative sticky anchor, persistent visibility after long scroll, and natural layout constraints without internal scrolling | VALIDATED: bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T040105Z/run.sh (server started on http://127.0.0.1:33100/); MCP verification result={baseline:{position:"sticky",top:"16px",delta:16},afterScroll:{visible:true,scrollY:2159.5},layout:{editorOverflowY:"visible",editorMaxHeight:"none",containerOverflowY:"visible",containerMaxHeight:"none"}} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T040105Z/outputs/screenshots/01-sticky-baseline-before-scroll.png, auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T040105Z/outputs/screenshots/02-sticky-visible-after-long-scroll.png, auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T040105Z/outputs/screenshots/03-natural-layout-no-internal-scroll.png

- [x] 1.2 关闭搜索栏时重置输入与按钮状态 [#R2]
  - ACCEPT: 点击关闭或按 Esc 退出后，查找词、替换词、模式按钮（区分大小写/整词/正则）、当前匹配索引与计数、错误提示、高亮状态、替换模式均回到默认状态；再次打开为初始态。
  - TEST: SCOPE: GUI
    - 使用 GUI MCP runbook 验证关闭前后状态对比，并确认再次打开不残留上次输入、按下态、错误提示和高亮。
  - BUNDLE (RUN #2): R2 reset find/replace state on close button and Esc (queries, toggles, counter, regex error, highlights, mode) + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0002__task-1.2__ref-R2__20260221T041359Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #2): Supervisor executed GUI bundle and MCP assertions for close-button and Esc reset paths, confirming full transient state reset after reopen | VALIDATED: bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0002__task-1.2__ref-R2__20260221T041359Z/run.sh (server started on http://127.0.0.1:33100/); MCP verification result={closeReset:{findVal:"",replaceVisible:false,casePressed:"false",wholePressed:"false",regexPressed:"false",counterText:"匹配：0/N",errorCount:0,highlightCount:0,pass:true},escReset:{findVal:"",replaceVisible:false,casePressed:"false",wholePressed:"false",regexPressed:"false",counterText:"匹配：0/N",errorCount:0,highlightCount:0,pass:true}} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0002__task-1.2__ref-R2__20260221T041359Z/outputs/screenshots/01-before-close-button-reset.png, auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0002__task-1.2__ref-R2__20260221T041359Z/outputs/screenshots/02-after-reopen-close-button-reset.png, auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0002__task-1.2__ref-R2__20260221T041359Z/outputs/screenshots/03-after-reopen-esc-reset.png

## 2. 图标化与提示统一
- [x] 2.1 将“正则模式”文本按钮替换为 iconfont 图标按钮 [#R3]
  - ACCEPT: 工具栏不再显示“正则模式”文本按钮，改为图标按钮；语义行为与原正则开关一致，可访问名称为“正则模式”。
  - TEST: SCOPE: GUI
    - 使用 GUI MCP runbook 验证图标渲染、按钮可点击切换、`aria-label` 可被识别。
  - BUNDLE (RUN #3): R3 replace regex text button with iconfont icon button while preserving regex toggle behavior and accessible label + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #3): Supervisor executed GUI bundle and MCP assertions for regex icon button a11y and behavior parity | VALIDATED: bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z/run.sh (server started on http://127.0.0.1:33102/); MCP verification result={exists:true,ariaLabel:"正则模式",pressed0:"false",hasTextLabel:false,iconCount:1,pressed1:"true",pressed2:"false",pass:true} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z/outputs/screenshots/01-regex-icon-default.png, auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z/outputs/screenshots/02-regex-icon-pressed.png, auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z/outputs/screenshots/03-regex-icon-unpressed.png
  - BUNDLE (RUN #3): R3 regex control switched from visible text button to iconfont icon button with preserved aria-label and toggle semantics + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z | HOW_TO_RUN: run.sh/run.bat

- [ ] 2.2 为所有 icon 按钮增加 hover 提示并统一样式 [#R4]
  - ACCEPT: 所有搜索栏 icon 按钮在鼠标 hover 与键盘 focus 时展示对应提示文本，移动端支持 long-press 触发提示；提示组件背景色、圆角、字号保持一致。
  - TEST: SCOPE: GUI
    - 使用 GUI MCP runbook 逐个 hover/focus icon 按钮，验证提示文案存在且视觉样式一致。
    - 使用 GUI MCP runbook 在移动端视口模拟 long-press 触发提示并验证可见性。
