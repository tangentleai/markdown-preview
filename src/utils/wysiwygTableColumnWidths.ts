export interface ColumnWidthConstraints {
  min: number
  preferred: number
  max: number
}

export interface ColumnWidthMetricsOptions {
  minBreakRegex?: RegExp
  preferredRatio?: number
}

export type TextMeasure = (text: string) => number

const DEFAULT_MIN_BREAK_REGEX = /[\s/\\_-]+/g
const DEFAULT_PREFERRED_RATIO = 0.6
const EPSILON = 0.01

const normalizeText = (text: string): string => text.replace(/\s+/g, ' ').trim()

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

const maxSegmentWidth = (text: string, measure: TextMeasure, splitter: RegExp): number => {
  if (!text) {
    return 0
  }
  const segments = text.split(splitter).filter((segment) => segment.length > 0)
  if (segments.length === 0) {
    return 0
  }
  return segments.reduce((maxWidth, segment) => Math.max(maxWidth, measure(segment)), 0)
}

export const measureCellWidth = (
  text: string,
  measureText: TextMeasure,
  options: ColumnWidthMetricsOptions = {}
): ColumnWidthConstraints => {
  const normalized = normalizeText(text)
  const minBreakRegex = options.minBreakRegex ?? DEFAULT_MIN_BREAK_REGEX
  const preferredRatio = options.preferredRatio ?? DEFAULT_PREFERRED_RATIO
  const maxWidth = normalized.length > 0 ? measureText(normalized) : 0
  const minWidth = maxSegmentWidth(normalized, measureText, minBreakRegex)
  const preferredWidth = clamp(minWidth + (maxWidth - minWidth) * preferredRatio, minWidth, maxWidth)
  return {
    min: minWidth,
    preferred: preferredWidth,
    max: maxWidth
  }
}

export const measureColumnConstraints = (
  rows: string[][],
  measureText: TextMeasure,
  options: ColumnWidthMetricsOptions = {}
): ColumnWidthConstraints[] => {
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0)
  const columns: ColumnWidthConstraints[] = []

  for (let colIndex = 0; colIndex < columnCount; colIndex += 1) {
    let min = 0
    let preferred = 0
    let max = 0
    rows.forEach((row) => {
      const cellText = row[colIndex] ?? ''
      const metrics = measureCellWidth(cellText, measureText, options)
      min = Math.max(min, metrics.min)
      preferred = Math.max(preferred, metrics.preferred)
      max = Math.max(max, metrics.max)
    })
    columns.push({
      min,
      preferred: clamp(preferred, min, max),
      max: Math.max(max, min)
    })
  }

  return columns
}

const finalizeWidths = (widths: number[]): number[] =>
  widths.map((width) => Math.round(width * 100) / 100)

const distribute = (
  widths: number[],
  targets: number[],
  delta: number,
  direction: 'grow' | 'shrink'
): number[] => {
  let remaining = delta
  let iterations = 0

  while (remaining > EPSILON && iterations < 200) {
    iterations += 1
    const potentials = widths.map((width, index) => {
      if (direction === 'grow') {
        return Math.max(0, targets[index] - width)
      }
      return Math.max(0, width - targets[index])
    })
    const totalPotential = potentials.reduce((sum, value) => sum + value, 0)
    if (totalPotential <= EPSILON) {
      break
    }
    const beforeTotal = widths.reduce((sum, value) => sum + value, 0)
    widths = widths.map((width, index) => {
      const potential = potentials[index]
      if (potential <= EPSILON) {
        return width
      }
      const slice = Math.min(potential, (remaining * potential) / totalPotential)
      return direction === 'grow' ? width + slice : width - slice
    })
    const nextTotal = widths.reduce((sum, value) => sum + value, 0)
    const allocated = direction === 'grow' ? nextTotal - beforeTotal : beforeTotal - nextTotal
    remaining = Math.max(0, remaining - allocated)
    if (remaining <= EPSILON) {
      break
    }
  }

  return widths
}

export const allocateColumnWidths = (constraints: ColumnWidthConstraints[], budget: number): number[] => {
  if (constraints.length === 0) {
    return []
  }
  const widths = constraints.map((column) => clamp(column.preferred, column.min, column.max))
  const totalPreferred = widths.reduce((sum, value) => sum + value, 0)
  if (budget <= 0 || Math.abs(totalPreferred - budget) <= EPSILON) {
    return finalizeWidths(widths)
  }

  if (totalPreferred < budget) {
    const maxTargets = constraints.map((column) => column.max)
    const grown = distribute(widths, maxTargets, budget - totalPreferred, 'grow')
    return finalizeWidths(grown)
  }

  const minTargets = constraints.map((column) => column.min)
  const shrunk = distribute(widths, minTargets, totalPreferred - budget, 'shrink')
  return finalizeWidths(shrunk)
}
