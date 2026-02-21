export const TABLE_MAX_ROWS = 200
export const TABLE_MAX_COLS = 40

export interface TableSize {
  rows: number
  cols: number
}

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) {
    return min
  }
  return Math.min(max, Math.max(min, value))
}

const isCellNonEmpty = (cell: HTMLTableCellElement): boolean => {
  if (cell.querySelector('img, video, audio, iframe, object, embed')) {
    return true
  }
  return (cell.textContent ?? '').trim().length > 0
}

const ensureHeaderRow = (table: HTMLTableElement): HTMLTableRowElement => {
  let thead = table.tHead
  if (!thead) {
    thead = table.createTHead()
  }
  let headerRow = thead.rows[0]
  if (!headerRow) {
    headerRow = thead.insertRow()
  }
  return headerRow
}

const ensureBody = (table: HTMLTableElement): HTMLTableSectionElement => {
  let tbody = table.tBodies[0]
  if (!tbody) {
    tbody = table.createTBody()
  }
  return tbody
}

const adjustCellsToTarget = (row: HTMLTableRowElement, cellTag: 'th' | 'td', targetCols: number) => {
  while (row.cells.length > targetCols) {
    row.deleteCell(row.cells.length - 1)
  }
  while (row.cells.length < targetCols) {
    const newCell = document.createElement(cellTag)
    newCell.textContent = ''
    row.append(newCell)
  }
}

export const getTableSize = (table: HTMLTableElement): TableSize => {
  const bodyRows = table.tBodies[0]?.rows.length ?? 0
  const headerCols = table.tHead?.rows[0]?.cells.length ?? 0
  const bodyCols = Array.from(table.tBodies[0]?.rows ?? []).reduce((max, row) => Math.max(max, row.cells.length), 0)
  const cols = Math.max(1, headerCols, bodyCols)
  return {
    rows: Math.max(1, bodyRows),
    cols
  }
}

export const normalizeTargetTableSize = (rows: number, cols: number): TableSize => ({
  rows: clamp(rows, 1, TABLE_MAX_ROWS),
  cols: clamp(cols, 1, TABLE_MAX_COLS)
})

export const shrinkWillTrimNonEmptyContent = (
  table: HTMLTableElement,
  current: TableSize,
  target: TableSize
): boolean => {
  if (target.rows < current.rows) {
    const bodyRows = Array.from(table.tBodies[0]?.rows ?? [])
    const trimmedRows = bodyRows.slice(target.rows)
    if (trimmedRows.some((row) => Array.from(row.cells).some((cell) => isCellNonEmpty(cell)))) {
      return true
    }
  }

  if (target.cols < current.cols) {
    const allRows = [
      ...(table.tHead?.rows ? Array.from(table.tHead.rows) : []),
      ...(table.tBodies[0]?.rows ? Array.from(table.tBodies[0].rows) : [])
    ]

    if (
      allRows.some((row) => {
        const trimmedCells = Array.from(row.cells).slice(target.cols)
        return trimmedCells.some((cell) => isCellNonEmpty(cell))
      })
    ) {
      return true
    }
  }

  return false
}

export const resizeTableTo = (table: HTMLTableElement, target: TableSize) => {
  const headerRow = ensureHeaderRow(table)
  const tbody = ensureBody(table)

  adjustCellsToTarget(headerRow, 'th', target.cols)
  Array.from(tbody.rows).forEach((row) => {
    adjustCellsToTarget(row, 'td', target.cols)
  })

  while (tbody.rows.length > target.rows) {
    tbody.deleteRow(tbody.rows.length - 1)
  }

  while (tbody.rows.length < target.rows) {
    const nextRow = tbody.insertRow()
    for (let colIndex = 0; colIndex < target.cols; colIndex += 1) {
      const cell = document.createElement('td')
      cell.textContent = ''
      nextRow.append(cell)
    }
  }
}
