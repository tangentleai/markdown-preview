## ADDED Requirements

### Requirement: 跨平台核心能力抽象层
系统 SHALL 提供平台无关的核心能力抽象层，以复用 Markdown 文档模型、渲染与编辑相关逻辑。

#### Scenario: 前端版通过抽象层调用核心能力
- **WHEN** 前端版执行文档加载、编辑与渲染流程
- **THEN** 核心流程应通过统一 core 接口完成，且不直接依赖桌面端 API

#### Scenario: 桌面版通过抽象层调用核心能力
- **WHEN** 桌面版执行文档加载、编辑与渲染流程
- **THEN** 核心流程应复用同一 core 逻辑，仅通过平台 adapter 访问宿主能力

### Requirement: 平台适配器隔离
系统 SHALL 通过明确的平台适配器隔离 Web 与 Desktop 的宿主能力差异。

#### Scenario: 业务层不直接访问平台能力
- **WHEN** 业务逻辑需要文件读写、系统剪贴板或宿主窗口交互
- **THEN** 调用必须经过统一服务接口，由对应平台 adapter 提供实现

#### Scenario: 适配器契约可替换
- **WHEN** 在测试环境中使用 mock adapter 替换真实 adapter
- **THEN** core 层测试应保持通过，且无需修改业务逻辑代码

### Requirement: 桌面应用可用性
系统 SHALL 提供可运行的桌面应用形态，支持核心编辑与预览闭环。

#### Scenario: 桌面端完成文档编辑闭环
- **WHEN** 用户在桌面应用中打开 Markdown 文件并编辑后保存
- **THEN** 应用应成功写回文件，且重新打开后内容与用户保存结果一致

### Requirement: 桌面文件能力
系统 SHALL 在桌面端提供完整文件操作能力，包括打开、保存、另存为、最近文件与拖拽打开。

#### Scenario: 另存为成功
- **WHEN** 用户执行另存为并选择新路径
- **THEN** 系统应在新路径写入当前文档内容，并更新当前会话文件路径

#### Scenario: 最近文件可回放
- **WHEN** 用户在最近文件列表中选择某项
- **THEN** 系统应成功打开对应文件并载入内容

#### Scenario: 拖拽打开成功
- **WHEN** 用户将本地 Markdown 文件拖拽到应用窗口
- **THEN** 系统应打开该文件并渲染内容

#### Scenario: 文件操作失败提示
- **WHEN** 打开或保存因权限不足、文件不存在或写入失败而失败
- **THEN** 系统应向用户展示可理解的错误提示文案

### Requirement: Web/Desktop 一致性保障
系统 SHALL 保证 Web 与 Desktop 在核心渲染与编辑行为上的一致性。

#### Scenario: 同一输入双端渲染一致
- **WHEN** 相同 Markdown 输入分别在 Web 与 Desktop 端渲染
- **THEN** 关键渲染结构与语义结果应一致，偏差需有可审计说明

#### Scenario: 同一操作双端行为一致
- **WHEN** 用户在 Web 与 Desktop 端执行相同编辑与查找替换操作
- **THEN** 关键行为结果应一致，包括命中逻辑与文档内容变更

#### Scenario: 桌面端不降级现有 Web 编辑能力
- **WHEN** 用户在桌面端执行现有 Web 已支持的任一编辑能力
- **THEN** 桌面端行为与 Web 端一致，不得出现能力缺失

### Requirement: 首次渲染时间可观测
系统 SHALL 对 Web 与 Desktop 的首次渲染时间进行可审计采集，并纳入回归门禁。

#### Scenario: 采集并输出首次渲染耗时
- **WHEN** 执行标准化性能采集脚本
- **THEN** 应输出首渲染耗时记录，并可用于阈值或基线不退化判定
