export const TABLE_MANUAL_WIDTH_ATTR = 'data-table-manual-widths'

export const MANUAL_COLUMN_WIDTH_MIN = 48
export const MANUAL_COLUMN_WIDTH_MAX = 720

export type ManualColumnWidths = Array<number | null>

export const clampManualColumnWidth = (value: number): number => {
  if (!Number.isFinite(value)) {
    return MANUAL_COLUMN_WIDTH_MIN
  }
  return Math.min(MANUAL_COLUMN_WIDTH_MAX, Math.max(MANUAL_COLUMN_WIDTH_MIN, value))
}

export const parseManualColumnWidths = (value: string | null): ManualColumnWidths => {
  if (!value) {
    return []
  }
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.map((entry) =>
      typeof entry === 'number' && Number.isFinite(entry) ? clampManualColumnWidth(entry) : null
    )
  } catch {
    return []
  }
}

export const serializeManualColumnWidths = (widths: ManualColumnWidths): string => JSON.stringify(widths)

export const normalizeManualColumnWidths = (widths: ManualColumnWidths, columnCount: number): ManualColumnWidths => {
  const result: ManualColumnWidths = []
  for (let index = 0; index < columnCount; index += 1) {
    const value = widths[index]
    result.push(typeof value === 'number' ? clampManualColumnWidth(value) : null)
  }
  return result
}

export interface ManualColumnWidthState {
  mode: 'idle' | 'dragging'
  activeColumn: number | null
  startX: number
  startWidth: number
  widths: ManualColumnWidths
}

export type ManualColumnWidthAction =
  | { type: 'start'; columnIndex: number; clientX: number; currentWidth: number }
  | { type: 'update'; clientX: number }
  | { type: 'end' }
  | { type: 'reset'; widths?: ManualColumnWidths }

export const createManualColumnWidthState = (widths: ManualColumnWidths = []): ManualColumnWidthState => ({
  mode: 'idle',
  activeColumn: null,
  startX: 0,
  startWidth: 0,
  widths
})

const setManualWidthAt = (widths: ManualColumnWidths, columnIndex: number, value: number): ManualColumnWidths => {
  const next = widths.slice()
  while (next.length <= columnIndex) {
    next.push(null)
  }
  next[columnIndex] = clampManualColumnWidth(value)
  return next
}

export const reduceManualColumnWidthState = (
  state: ManualColumnWidthState,
  action: ManualColumnWidthAction
): ManualColumnWidthState => {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        mode: 'dragging',
        activeColumn: action.columnIndex,
        startX: action.clientX,
        startWidth: action.currentWidth
      }
    case 'update': {
      if (state.mode !== 'dragging' || state.activeColumn === null) {
        return state
      }
      const delta = action.clientX - state.startX
      const nextWidth = clampManualColumnWidth(state.startWidth + delta)
      return {
        ...state,
        widths: setManualWidthAt(state.widths, state.activeColumn, nextWidth)
      }
    }
    case 'end':
      if (state.mode !== 'dragging') {
        return state
      }
      return {
        ...state,
        mode: 'idle',
        activeColumn: null,
        startX: 0,
        startWidth: 0
      }
    case 'reset':
      return createManualColumnWidthState(action.widths ?? [])
    default:
      return state
  }
}
