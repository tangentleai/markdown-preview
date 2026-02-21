# WYSIWYG 模式下 Markdown 表格列宽技术方案

## 范围与目标
- 范围：仅面向 WYSIWYG 编辑模式的表格列宽计算、分配与渲染策略。
- 目标：
  - 根据实际内容计算并分配每列宽度，最大化利用可用空间且美观。
  - 当内容过宽时优雅降级：优先断行，必要时启用水平滚动兜底。
  - 与现有表格溢出滚动容器与提示机制无缝集成。

## 现状与问题
- 表格 HTML 生成：由文档模型直接输出标准 `<table>`，未包含 `<colgroup>` 与列宽提示，浏览器使用“自动表格布局”。
  - 位置：`src/utils/markdownDocumentModel.ts:452`
- 溢出处理：当表格超出编辑区宽度时，自动包裹水平滚动容器并显示左右滚动提示图标（已在 WYSIWYG 接入）。
  - 封装：`src/utils/wysiwygTableOverflow.ts:87`
  - 调用：`src/components/WysiwygEditor.tsx:1321`
- 样式：有表格基础样式与滚动容器样式，但单元格断词/换行策略偏保守，长链接/路径/代码易“撑列”。
  - 位置：`src/index.css:97`

痛点：
- 列宽完全依赖浏览器自动表格布局，遇到极端内容时要么浪费空间，要么被个别列“撑爆”。
- 目前只有横向滚动兜底，缺乏“按内容分配列宽”的主动优化。

## 总体设计
- 列宽模型（每列三种固有尺寸）：
  - min-content：该列中“最长不可断片段”的最大宽度（考虑分词/断词策略与内边距）。
  - preferred：更舒适的目标宽，建议取 `max(表头整段宽, 列宽度分位数 P75)`，再压入 `[min, max]`。
  - max-content：整段不换行时的最大宽度上限。
- 分配策略：
  - 初始化：`w_i = clamp(preferred_i, min_i, max_i)`；
  - 若 Σw_i < 容器宽 W：将剩余空间按“增长潜力” `(max_i - w_i)` 比例分配（可乘 `(max_i/min_i)` 风险系数）；
  - 若 Σw_i > W：按“可压缩空间” `(w_i - min_i)` 比例回收；若压至 min 仍不足 → 升级断词或启用水平滚动兜底。
- 应用方式：生成/更新 `<colgroup>` 写入 `<table>` 首部，维持 `table-layout: auto`，由 `colgroup` 提示浏览器分配。
- 与现有滚动兜底共存：保持 `syncOverflowTableScrollviews` 的检测与包裹流程。

## 列宽计算
- 尺寸定义：
  - min-content：对每个单元格取“最长不可断片段”的宽度，列取最大值；不可断片段按空格、斜杠、下划线、连字符等切分；必要时允许 `anywhere`。
  - max-content：对每个单元格整段文本测量（不换行），列取最大值。
  - preferred：`max(表头整段宽, P75)`，再 clamp 至 `[min-content, max-content]`。
- 文本度量：
  - 使用 Canvas 2D `measureText`，以单元格字体建立缓存键（`fontKey + text`）进行缓存。
  - 抽样控制成本：每列抽样若干单元格（表头优先，建议上限 40）；大表格采用增量补全。
- 特殊列（可选增强）：
  - 数字列（百分比/货币/纯数字为主）：较小 `max-content` 上限、右对齐。
  - 首列（常为名称/ID）：增长权重上调，提升可读性。

## 宽度分配
- 容器预算：`W = 容器 clientWidth - 列间 gap - 内边距`。
- 初始化：`w_i = clamp(preferred_i, min_i, max_i)`，计算 Σw_i。
- 扩展：如 Σw_i < W，余量 L 按 `(max_i - w_i) * (max_i / max(min_i,1))` 比例发放，分多轮直至收敛或到达 `max_i`。
- 收缩：如 Σw_i > W，缺口 S 按 `(w_i - min_i)` 比例回收；若 Σ(w_i - min_i) < S → 压到最小仍不够：升级断词或横向滚动兜底。
- 稳定性：
  - 四舍五入至整数 px；
  - 设定“粘性阈值”，容器小幅变动不重算；超过阈值/断点再重算，降低抖动。

## 断行与溢出策略
- 基线断行（样式增强）：
  - 单元格：`overflow-wrap: anywhere; word-break: break-word; hyphens: auto;`
  - 链接与代码：`word-break: break-all` 或 `overflow-wrap: anywhere`，避免长 URL/代码“撑列”。
- 溢出兜底（已实现）：
  - 当表格超出编辑区宽度时，包裹水平滚动容器与左右滚动提示。
  - 实现：`src/utils/wysiwygTableOverflow.ts:87`；编辑器接入：`src/components/WysiwygEditor.tsx:1321`。

## 工程集成
- 新增接口（建议）：在 `src/utils/wysiwygTableOverflow.ts` 增加列宽自适应函数：
  - `autoSizeTables(root: HTMLElement, options?: { sampling?: number; minColWidth?: number; maxColWidth?: number; gap?: number; tokenizer?: (s: string) => string[] })`
  - 行为：扫描 `root` 内 `<table>`，基于内容计算列宽并生成/更新 `<colgroup>`；必要时调用现有滚动提示增强。
- 调用时机（WYSIWYG）：
  - 初次挂载与 `markdown` 更新：在 `syncOverflowTableScrollviews(editorRef.current)` 之后调用 `autoSizeTables(editorRef.current)`。
    - 位置：`src/components/WysiwygEditor.tsx:1321`
  - 尺寸变化：沿用当前 `ResizeObserver`（`src/components/WysiwygEditor.tsx:1336`），节流后调用 `autoSizeTables` 与 `syncOverflowTableScrollviews`。
- DOM 写入：
  - 若表内已有 `<colgroup>` 则更新；否则创建并插入 `<table>` 开头；保持 `table-layout: auto`。

## 样式规范
- 在 `src/index.css` 基础上增强断行（建议紧邻 `:158-165`）：
  - `.markdown-preview td, .markdown-preview th { overflow-wrap: anywhere; word-break: break-word; hyphens: auto; }`
  - `.markdown-preview td code, .markdown-preview td a { word-break: break-all; }`
- 维持既有表格与滚动容器样式：`src/index.css:97`；滚动提示：`src/index.css:113`。

## 性能优化
- 缓存：`measureText` 结果以 `fontKey + text` 缓存；对列宽结果做粘性保留。
- 抽样：每列限制测量样本数（包含表头），大型表格逐步完善（空闲回调/任务切片）。
- 重新计算节流：窗口/容器轻微变化不重算；超过阈值或断点变更时触发。
- 收敛：增长/收缩采用权重比例，迭代数有限，控制在帧预算内。

## 测试策略
- 单元测试（纯函数）：
  - min/max/preferred 计算在固定输入下的确定性；增长/收缩路径与边界；极端长词/链接。
  - 分词器对 URL、下划线连接串、路径、代码片段的“最长不可断片段”识别。
- DOM 集成测试（JSDOM）：
  - 使用桩函数替代实际 `measureText`，渲染表格后断言 `<colgroup>` 与 `col` 宽度分配、总和与容器预算一致。
  - 容器缩放下的粘性阈值与重新计算行为。
- 端到端截图：典型表格（长链接/长代码/中英文混排/数字列/超宽列与小屏）对比断行与滚动体验。

## 可访问性与 UX
- 横向滚动容器保持现有左右提示与点击穿透；提示图标不抢焦点。
- 列宽更新不影响键盘焦点与 DOM 顺序；若未来加入“列宽拖拽”，参考已有大纲分隔条（`src/App.tsx:557`）添加 `role="separator"` 与 `aria-*`。

## 风险与兜底
- 字体测量误差：不同平台/缩放会有轻微偏差；通过 px 整数化与“粘性阈值”减弱抖动。
- 极端超宽：压至 `min-content` 仍不足时，升级断词或使用水平滚动容器；维持内容完整可读。
- 性能：大表首次计算耗时通过抽样/缓存控制；必要时使用空闲回调渐进完善。

## 迭代计划
1. 样式增强：补充单元格断行规则，立即改善长词/链接；保持滚动兜底（不改 JS）。
2. 列宽计算：新增 `autoSizeTables`，实现 min/preferred/max 与增长/收缩分配，创建/更新 `<colgroup>`；接入 WYSIWYG 渲染与 `ResizeObserver`。
3. 测试与调优：补齐单测与 DOM 集成测试；增加抽样与粘性策略；对大表格校准阈值。
4. 可选增强：数字列识别与右对齐、首列权重、按列宽记忆等。

## 关键代码定位
- 表格 HTML 生成：`src/utils/markdownDocumentModel.ts:452`
- 表格溢出滚动容器（检测/包裹/提示）：`src/utils/wysiwygTableOverflow.ts:87`
- 在 WYSIWYG 中的接入调用：`src/components/WysiwygEditor.tsx:1321`（监听与刷新见 `:1336`）
- 表格样式与滚动提示样式：`src/index.css:97`（滚动提示 `:113`；单元格样式 `:158`）

## 核心算法伪代码
```ts
type Measure = (text: string, font: string) => number

function computeColumnWidths(table: HTMLTableElement, containerWidth: number, opts) {
  const rows = extractStringMatrix(table)         // [[cellText]]
  const fonts = getComputedFontsForTable(table)   // 每列/单元格字体
  const tokenizer = opts.tokenizer ?? defaultTokenizer

  const min = [], max = [], pref = []
  for col in columns:
    const texts = sampleColumn(rows, col, opts.sampling)
    const head = getHeaderText(rows, col)
    const minContent = Math.max(
      ...texts.map(t => longestUnbreakable(tokenizer, t, s => measure(s, fonts[col]))),
      head ? measureLongestPiece(head) : 0
    )
    const maxContent = Math.max(...texts.map(t => measure(t, fonts[col])))
    const p75 = percentile(texts.map(t => measure(t, fonts[col])), 0.75)
    const headW = head ? measure(head, fonts[col]) : 0
    min[col]  = clamp(minContent + padding, opts.minColWidth, Infinity)
    max[col]  = Math.max(min[col], Math.min(maxContent + padding, opts.maxColWidth ?? Infinity))
    pref[col] = clamp(Math.max(p75, headW) + padding, min[col], max[col])

  const gap = opts.gap ?? 0
  const budget = containerWidth - gap * (columns - 1)
  let w = pref.slice(), sum = w.reduce((a,b)=>a+b,0)

  if (sum < budget) {
    let free = budget - sum
    while (free > 0.5) {
      const growth = w.map((wi,i)=>Math.max(0, max[i]-wi))
      const weights = growth.map((g,i)=> g * (max[i]/Math.max(min[i],1)))
      const total = weights.reduce((a,b)=>a+b,0); if (!total) break
      for (i in columns) { const inc = free * (weights[i]/total); w[i] = Math.min(max[i], w[i]+inc) }
      const newFree = budget - w.reduce((a,b)=>a+b,0); if (Math.abs(newFree-free) < 0.5) break; free = newFree
    }
  } else if (sum > budget) {
    let need = sum - budget
    while (need > 0.5) {
      const shrink = w.map((wi,i)=>Math.max(0, wi - min[i]))
      const total = shrink.reduce((a,b)=>a+b,0); if (!total) break
      for (i in columns) { const dec = need * (shrink[i]/total); w[i] = Math.max(min[i], w[i]-dec) }
      const newNeed = w.reduce((a,b)=>a+b,0) - budget; if (Math.abs(newNeed-need) < 0.5) break; need = newNeed
    }
  }
  return w.map(Math.round)
}

function applyColgroup(table: HTMLTableElement, widths: number[]) {
  let colgroup = table.querySelector(':scope > colgroup') as HTMLTableSectionElement | null
  if (!colgroup) { colgroup = document.createElement('colgroup'); table.insertBefore(colgroup, table.firstChild) }
  colgroup.innerHTML = ''
  widths.forEach(w => { const col = document.createElement('col'); col.style.width = `${w}px`; colgroup!.append(col) })
}
```

## 接口定义建议
```ts
export interface AutoSizeOptions {
  sampling?: number          // 每列抽样上限，默认 40
  minColWidth?: number       // 最小列宽，默认 48
  maxColWidth?: number       // 最大列宽，可选
  gap?: number               // 列间距（若需要）
  tokenizer?: (s: string) => string[] // 自定义分词
}

export function autoSizeTables(root: HTMLElement, options?: AutoSizeOptions): void
```

实现后，WYSIWYG 模式下表格列宽将由内容驱动，断行与滚动兜底协同工作，在保证可读性的同时最大化利用可用空间。
