## Context
目标是在现有 React + TypeScript 项目中交付 Typora 核心体验：在保留现有双栏模式的前提下新增所见即所得编辑模式，并保证 Markdown 语义可导入、可导出、可回归验证。该能力涉及编辑器内核、文档模型、输入规则、序列化、文件系统与交互一致性，属于跨模块变更。

## Goals / Non-Goals
- Goals:
  - 保留双栏模式并提供 WYSIWYG 模式开关，覆盖 MVP 核心 Markdown 语法。
  - 保证 Markdown <-> 文档模型 round-trip 结构等价。
  - 提供可预测、可撤销、IME 友好的输入规则与结构化编辑行为。
  - 提供文件打开/保存/另存为与大纲、图片拖拽引用等基础生产力能力。
- Non-Goals:
  - 本次不实现导出 PDF/Word、多标签协作、云同步。
  - 本次不实现完整 Typora 主题系统与全部高级语法扩展。
  - 本次不实现 Mermaid/PlantUML/数学公式等高级语法的 WYSIWYG 编辑能力。
  - 本次查找替换仅支持普通文本，不支持正则。

## Decisions
- Decision: 采用“结构化文档模型 + 输入规则插件 + Markdown 序列化器”的架构。
  - Rationale: 直接操作 `contenteditable` DOM 难以保证可维护性、撤销粒度与跨语法一致性。
- Decision: 保留当前双栏编辑预览架构，并新增模式切换开关；WYSIWYG 作为并行模式逐步替代核心编辑路径。
  - Rationale: 降低一次性替换风险，便于灰度验证与回滚。
- Decision: 以 CommonMark + GFM 子集作为语义基线，明确 MVP 支持边界。
  - Rationale: 兼容主流生态且可控，能覆盖标题、列表、引用、代码块、表格基础、链接与图片。
- Decision: 标记符可见性先落地“轻量弱化策略”，后续独立升级“离焦隐藏策略”。
  - Rationale: 先保证编辑稳定与可预测，再提升视觉拟真度。
- Decision: 所有自动结构转换作为单事务进入历史栈。
  - Rationale: 确保撤销/重做符合直觉，降低不可逆编辑风险。
- Decision: MVP 文件流程采用最小化方案（显式打开、保存/另存为），不引入复杂路径持久化与资源复制流程。
  - Rationale: 先保证结构正确与编辑稳定，降低文件系统耦合风险。
- Decision: 图片拖拽在 MVP 仅生成并维护有效 Markdown 图片引用，不执行自动复制到 `assets/`。
  - Rationale: 避免跨平台路径与权限差异导致不稳定行为。

## Alternatives Considered
- 方案 A：直接基于 `contenteditable` 自研。
  - Rejected: 光标映射、输入法、撤销粒度、跨块结构维护成本高。
- 方案 B：沿用双栏编辑 + 预览并强化联动。
  - Rejected: 无法实现“编辑与预览合一”的目标体验。

## Risks / Trade-offs
- 风险：Markdown 导入导出与编辑模型出现结构漂移。
  - Mitigation: 为标题、列表层级、代码块、表格建立 round-trip 断言集。
- 风险：大文档（>1MB）实时更新造成卡顿。
  - Mitigation: 大纲与部分解析异步更新，设置 300ms~800ms 可接受延迟窗口。
- 权衡：MVP 优先稳定与一致性，部分高级语法与高级视觉效果推迟到后续版本。
- 风险：双模式并存导致状态同步复杂度提升。
  - Mitigation: 统一以 Markdown 文本与文档模型作为单一语义来源，模式切换只改变交互层。

## Migration Plan
1. 引入编辑器内核最小可用版本与模型桥接层。
2. 实现 Markdown 导入、导出与 round-trip 测试基线。
3. 分批接入块级与行内输入规则及可逆交互行为。
4. 接入文件打开/保存、图片拖拽、大纲导航与快捷键。
5. 完成 DoD 用例回归，确认行为稳定后进入评审。

## Open Questions
- 编辑器内核未预选（ProseMirror/Tiptap、Lexical、Slate），将在任务 1.1 依据 round-trip、IME、输入规则与维护成本进行最终决策。
- HTML 粘贴转换作为 P1 能力，是否拆分为后续独立 change 由排期阶段决定。
