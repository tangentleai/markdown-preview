import {
  MANUAL_COLUMN_WIDTH_MAX,
  MANUAL_COLUMN_WIDTH_MIN,
  clampManualColumnWidth,
  createManualColumnWidthState,
  reduceManualColumnWidthState
} from '../utils/wysiwygTableManualColumnWidths'

describe('wysiwyg table manual column width state', () => {
  it('clamps manual widths within configured bounds', () => {
    expect(clampManualColumnWidth(MANUAL_COLUMN_WIDTH_MIN - 10)).toBe(MANUAL_COLUMN_WIDTH_MIN)
    expect(clampManualColumnWidth(MANUAL_COLUMN_WIDTH_MAX + 20)).toBe(MANUAL_COLUMN_WIDTH_MAX)
    expect(clampManualColumnWidth(180)).toBe(180)
  })

  it('updates manual width during drag and preserves width after end', () => {
    let state = createManualColumnWidthState([null, null])
    state = reduceManualColumnWidthState(state, {
      type: 'start',
      columnIndex: 1,
      clientX: 100,
      currentWidth: 120
    })
    state = reduceManualColumnWidthState(state, { type: 'update', clientX: 160 })
    expect(state.widths[1]).toBe(180)

    state = reduceManualColumnWidthState(state, { type: 'update', clientX: -1000 })
    expect(state.widths[1]).toBe(MANUAL_COLUMN_WIDTH_MIN)

    state = reduceManualColumnWidthState(state, { type: 'end' })
    expect(state.mode).toBe('idle')
    expect(state.widths[1]).toBe(MANUAL_COLUMN_WIDTH_MIN)
  })

  it('ignores updates when idle and clamps to max width', () => {
    const idleState = createManualColumnWidthState([null])
    const unchanged = reduceManualColumnWidthState(idleState, { type: 'update', clientX: 200 })
    expect(unchanged).toBe(idleState)

    let state = createManualColumnWidthState([null])
    state = reduceManualColumnWidthState(state, {
      type: 'start',
      columnIndex: 0,
      clientX: 0,
      currentWidth: MANUAL_COLUMN_WIDTH_MAX - 10
    })
    state = reduceManualColumnWidthState(state, { type: 'update', clientX: 200 })
    expect(state.widths[0]).toBe(MANUAL_COLUMN_WIDTH_MAX)
  })

  it('resets drag state with provided widths', () => {
    let state = createManualColumnWidthState([null, null])
    state = reduceManualColumnWidthState(state, {
      type: 'start',
      columnIndex: 0,
      clientX: 10,
      currentWidth: 90
    })
    state = reduceManualColumnWidthState(state, { type: 'update', clientX: 20 })
    expect(state.mode).toBe('dragging')

    state = reduceManualColumnWidthState(state, { type: 'reset', widths: [120, null] })
    expect(state.mode).toBe('idle')
    expect(state.activeColumn).toBeNull()
    expect(state.widths).toEqual([120, null])
  })
})
