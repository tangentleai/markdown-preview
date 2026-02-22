import {
  collectTableColumnConstraints,
  computeTableColumnWidths,
  syncTableColgroupWidths
} from '../utils/wysiwygTableColgroup'

const defineSize = (target: object, key: 'clientWidth', value: number) => {
  Object.defineProperty(target, key, {
    configurable: true,
    value
  })
}

const createTable = (): HTMLTableElement => {
  const table = document.createElement('table')
  const thead = table.createTHead()
  const header = thead.insertRow()
  ;['Header A', 'Header B', 'Header C'].forEach((value) => {
    const th = document.createElement('th')
    th.textContent = value
    header.append(th)
  })

  const tbody = table.createTBody()
  const row1 = tbody.insertRow()
  row1.insertCell().textContent = 'Short'
  row1.insertCell().textContent = 'A bit longer cell text'
  row1.insertCell().textContent = '12345'

  const row2 = tbody.insertRow()
  row2.insertCell().textContent = 'Content A'
  row2.insertCell().textContent = 'Content B'
  row2.insertCell().textContent = 'VeryVeryLongWordWithoutSpaces'

  return table
}

const getColgroupWidths = (table: HTMLTableElement): number[] => {
  const colgroup = table.querySelector('colgroup')
  if (!colgroup) {
    return []
  }
  return Array.from(colgroup.querySelectorAll('col')).map((col) =>
    Number.parseFloat((col as HTMLElement).style.width || '0')
  )
}

describe('syncTableColgroupWidths', () => {
  it('writes colgroup and aligns widths with computed budget allocation', () => {
    const editor = document.createElement('div')
    const table = createTable()
    defineSize(editor, 'clientWidth', 360)
    editor.append(table)

    syncTableColgroupWidths(editor)

    const widths = getColgroupWidths(table)
    expect(widths.length).toBe(3)
    widths.forEach((width) => {
      expect(width).toBeGreaterThan(0)
    })

    const preferredTotal = collectTableColumnConstraints(table).reduce((sum, column) => sum + column.preferred, 0)
    const expectedBudget = Math.max(360, preferredTotal)
    const expected = computeTableColumnWidths(table, expectedBudget)
    expect(expected.length).toBe(3)
    expected.forEach((value, index) => {
      expect(widths[index]).toBeCloseTo(value, 2)
    })

    const totalWidth = widths.reduce((sum, value) => sum + value, 0)
    const expectedTotal = expected.reduce((sum, value) => sum + value, 0)
    if (expectedTotal <= expectedBudget + 0.5) {
      expect(totalWidth).toBeLessThanOrEqual(expectedBudget + 0.5)
    } else {
      expect(totalWidth).toBeGreaterThan(expectedBudget)
    }
  })

  it('keeps colgroup widths even when budget is below minimum total', () => {
    const editor = document.createElement('div')
    const table = createTable()
    defineSize(editor, 'clientWidth', 120)
    editor.append(table)

    syncTableColgroupWidths(editor)

    const widths = getColgroupWidths(table)
    const preferredTotal = collectTableColumnConstraints(table).reduce((sum, column) => sum + column.preferred, 0)
    const expectedBudget = Math.max(120, preferredTotal)
    const expected = computeTableColumnWidths(table, expectedBudget)
    expect(widths.length).toBe(expected.length)
    const totalWidth = widths.reduce((sum, value) => sum + value, 0)
    const expectedTotal = expected.reduce((sum, value) => sum + value, 0)
    expect(totalWidth).toBeCloseTo(expectedTotal, 2)
  })
})
