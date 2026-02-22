import {
  TABLE_MAX_COLS,
  TABLE_MAX_ROWS,
  getTableSize,
  normalizeTargetTableSize,
  resizeTableTo,
  shrinkWillTrimNonEmptyContent
} from '../utils/wysiwygTableResize'

const createTable = (): HTMLTableElement => {
  const table = document.createElement('table')
  const thead = table.createTHead()
  const header = thead.insertRow()
  ;['H1', 'H2', 'H3'].forEach((value) => {
    const th = document.createElement('th')
    th.textContent = value
    header.append(th)
  })

  const tbody = table.createTBody()
  const row1 = tbody.insertRow()
  row1.insertCell().textContent = 'A1'
  row1.insertCell().textContent = 'A2'
  row1.insertCell().textContent = 'A3'

  const row2 = tbody.insertRow()
  row2.insertCell().textContent = 'B1'
  row2.insertCell().textContent = ''
  row2.insertCell().textContent = ''

  return table
}

describe('wysiwygTableResize utils', () => {
  it('normalizes target size with configured limits', () => {
    expect(normalizeTargetTableSize(0, 0)).toEqual({ rows: 1, cols: 1 })
    expect(normalizeTargetTableSize(TABLE_MAX_ROWS + 5, TABLE_MAX_COLS + 2)).toEqual({
      rows: TABLE_MAX_ROWS,
      cols: TABLE_MAX_COLS
    })
  })

  it('resizes table rows/cols while keeping structure', () => {
    const table = createTable()

    resizeTableTo(table, { rows: 3, cols: 2 })
    const size = getTableSize(table)
    expect(size).toEqual({ rows: 3, cols: 2 })

    expect(table.tHead?.rows[0].cells.length).toBe(2)
    expect(table.tBodies[0].rows.length).toBe(3)
    expect(table.tBodies[0].rows[2].cells.length).toBe(2)
  })

  it('detects non-empty content trimming on shrink', () => {
    const table = createTable()
    const current = getTableSize(table)
    expect(current).toEqual({ rows: 2, cols: 3 })

    expect(shrinkWillTrimNonEmptyContent(table, current, { rows: 2, cols: 2 })).toBe(true)
    expect(shrinkWillTrimNonEmptyContent(table, current, { rows: 1, cols: 3 })).toBe(true)
    expect(shrinkWillTrimNonEmptyContent(table, current, { rows: 2, cols: 3 })).toBe(false)
  })
})
