import {
  allocateColumnWidths,
  measureCellWidth,
  type ColumnWidthConstraints,
  type ColumnWidthMetricsOptions,
  type TextMeasure
} from './wysiwygTableColumnWidths'
import {
  TABLE_MANUAL_WIDTH_ATTR,
  normalizeManualColumnWidths,
  parseManualColumnWidths,
  type ManualColumnWidths
} from './wysiwygTableManualColumnWidths'

const DEFAULT_CHAR_WIDTH = 8

const normalizeCellText = (value: string): string => value.replace(/\s+/g, ' ').trim()

const parsePixels = (value: string): number => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const getCellPadding = (cell: HTMLTableCellElement): number => {
  if (typeof window === 'undefined') {
    return 0
  }
  const style = window.getComputedStyle(cell)
  return parsePixels(style.paddingLeft) + parsePixels(style.paddingRight)
}

const resolveFont = (reference: HTMLElement, computed?: CSSStyleDeclaration): string => {
  if (computed?.font) {
    return computed.font
  }
  const fontStyle = computed?.fontStyle || 'normal'
  const fontVariant = computed?.fontVariant || 'normal'
  const fontWeight = computed?.fontWeight || '400'
  const fontSize = computed?.fontSize || '14px'
  const fontFamily = computed?.fontFamily || 'sans-serif'
  return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`
}

const createTextMeasurer = (reference: HTMLElement): TextMeasure => {
  if (typeof document === 'undefined') {
    return (text) => text.length * DEFAULT_CHAR_WIDTH
  }
  if (typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom')) {
    return (text) => text.length * DEFAULT_CHAR_WIDTH
  }
  const canvas = document.createElement('canvas')
  let context: CanvasRenderingContext2D | null = null
  try {
    context = canvas.getContext('2d')
  } catch (error) {
    context = null
  }
  if (!context) {
    return (text) => text.length * DEFAULT_CHAR_WIDTH
  }
  const computed = typeof window !== 'undefined' ? window.getComputedStyle(reference) : undefined
  context.font = resolveFont(reference, computed)
  return (text) => {
    if (!text) {
      return 0
    }
    return context.measureText(text).width || text.length * DEFAULT_CHAR_WIDTH
  }
}

export const collectTableColumnConstraints = (
  table: HTMLTableElement,
  options: ColumnWidthMetricsOptions = {}
): ColumnWidthConstraints[] => {
  const rows = Array.from(table.rows).map((row) => Array.from(row.cells))
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0)
  const measureText = createTextMeasurer(table)
  const constraints: ColumnWidthConstraints[] = []

  for (let colIndex = 0; colIndex < columnCount; colIndex += 1) {
    let min = 0
    let preferred = 0
    let max = 0
    rows.forEach((row) => {
      const cell = row[colIndex]
      const text = cell ? normalizeCellText(cell.textContent ?? '') : ''
      const padding = cell ? getCellPadding(cell) : 0
      const metrics = measureCellWidth(text, measureText, options)
      min = Math.max(min, metrics.min + padding)
      preferred = Math.max(preferred, metrics.preferred + padding)
      max = Math.max(max, metrics.max + padding)
    })
    constraints.push({
      min,
      preferred: Math.min(Math.max(preferred, min), Math.max(max, min)),
      max: Math.max(max, min)
    })
  }

  return constraints
}

const sumPreferredWidths = (constraints: ColumnWidthConstraints[], manualWidths: ManualColumnWidths): number =>
  constraints.reduce((sum, column, index) => {
    const manual = manualWidths[index]
    if (typeof manual === 'number') {
      return sum + manual
    }
    return sum + column.preferred
  }, 0)

const computeTableColumnWidthsFromConstraints = (
  constraints: ColumnWidthConstraints[],
  budget: number,
  manualWidths?: ManualColumnWidths
): number[] => {
  const normalizedManualWidths = manualWidths ? normalizeManualColumnWidths(manualWidths, constraints.length) : []
  if (normalizedManualWidths.length === 0 || normalizedManualWidths.every((value) => value === null)) {
    return allocateColumnWidths(constraints, budget)
  }

  const manualTotal = normalizedManualWidths.reduce<number>((sum, value) => sum + (value ?? 0), 0)
  const autoIndices = constraints.map((_, index) => index).filter((index) => normalizedManualWidths[index] === null)
  if (autoIndices.length === 0) {
    return normalizedManualWidths.map((value) => value ?? 0)
  }

  const autoConstraints = autoIndices.map((index) => constraints[index])
  const remainingBudget = Math.max(0, budget - manualTotal)
  const autoWidths =
    remainingBudget > 0 ? allocateColumnWidths(autoConstraints, remainingBudget) : autoConstraints.map((column) => column.min)

  let autoCursor = 0
  return constraints.map((_, index) => {
    const manual = normalizedManualWidths[index]
    if (manual !== null && manual !== undefined) {
      return manual
    }
    const width = autoWidths[autoCursor] ?? 0
    autoCursor += 1
    return width
  })
}

export const computeTableColumnWidths = (
  table: HTMLTableElement,
  budget: number,
  options: ColumnWidthMetricsOptions = {},
  manualWidths?: ManualColumnWidths
): number[] => {
  const constraints = collectTableColumnConstraints(table, options)
  return computeTableColumnWidthsFromConstraints(constraints, budget, manualWidths)
}

const resolveTableBudget = (editor: HTMLElement, table: HTMLTableElement): number => {
  const wrapper = table.parentElement
  const wrapperWidth = wrapper?.clientWidth ?? 0
  const editorWidth = editor.clientWidth ?? 0
  const budget = wrapperWidth > 0 ? wrapperWidth : editorWidth
  return Math.max(0, budget)
}

const applyColgroup = (table: HTMLTableElement, widths: number[]): void => {
  let colgroup = table.querySelector(':scope > colgroup')
  if (!colgroup) {
    colgroup = document.createElement('colgroup')
    table.prepend(colgroup)
  }
  while (colgroup.firstChild) {
    colgroup.removeChild(colgroup.firstChild)
  }
  widths.forEach((width) => {
    const col = document.createElement('col')
    col.style.width = `${width}px`
    colgroup?.append(col)
  })
}

export const syncTableColgroupWidths = (editor: HTMLElement): void => {
  const tables = Array.from(editor.querySelectorAll('table')) as HTMLTableElement[]
  tables.forEach((table) => {
    const budget = resolveTableBudget(editor, table)
    if (budget <= 0) {
      return
    }
    const constraints = collectTableColumnConstraints(table, {})
    const manualWidths = parseManualColumnWidths(table.getAttribute(TABLE_MANUAL_WIDTH_ATTR))
    const normalizedManualWidths = normalizeManualColumnWidths(manualWidths, constraints.length)
    const preferredTotal = sumPreferredWidths(constraints, normalizedManualWidths)
    const targetBudget = Math.max(budget, preferredTotal)
    const widths = computeTableColumnWidthsFromConstraints(constraints, targetBudget, normalizedManualWidths)
    if (widths.length === 0) {
      return
    }
    applyColgroup(table, widths)
  })
}
