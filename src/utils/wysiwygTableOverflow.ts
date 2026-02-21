const TABLE_SCROLLVIEW_ATTR = 'data-table-scrollview'
const TABLE_SCROLLVIEW_CLASS = 'wysiwyg-table-scrollview'
const OVERFLOW_EPSILON_PX = 1

const getCellBasedWidth = (table: HTMLTableElement): number => {
  const rowWidths = Array.from(table.rows).map((row) =>
    Array.from(row.cells).reduce((sum, cell) => sum + Math.max(cell.scrollWidth, cell.clientWidth), 0)
  )
  return rowWidths.length > 0 ? Math.max(...rowWidths) : 0
}

const getTableContentWidth = (table: HTMLTableElement): number => {
  const rectWidth = table.getBoundingClientRect().width
  return Math.max(table.scrollWidth, rectWidth, getCellBasedWidth(table))
}

const isOverflowTable = (table: HTMLTableElement, viewportWidth: number): boolean => {
  if (viewportWidth <= 0) {
    return false
  }
  return getTableContentWidth(table) > viewportWidth + OVERFLOW_EPSILON_PX
}

const unwrapTable = (wrapper: HTMLElement): void => {
  const table = wrapper.querySelector(':scope > table')
  if (!table) {
    return
  }
  wrapper.replaceWith(table)
}

const wrapTable = (table: HTMLTableElement): void => {
  if (table.parentElement?.getAttribute(TABLE_SCROLLVIEW_ATTR) === 'true') {
    return
  }
  const wrapper = document.createElement('div')
  wrapper.className = TABLE_SCROLLVIEW_CLASS
  wrapper.setAttribute(TABLE_SCROLLVIEW_ATTR, 'true')
  table.before(wrapper)
  wrapper.append(table)
}

export const syncOverflowTableScrollviews = (editor: HTMLElement): void => {
  const editorViewportWidth = editor.clientWidth
  if (editorViewportWidth <= 0) {
    return
  }

  const wrappers = Array.from(editor.querySelectorAll(`[${TABLE_SCROLLVIEW_ATTR}="true"]`)) as HTMLElement[]
  wrappers.forEach((wrapper) => {
    const table = wrapper.querySelector(':scope > table') as HTMLTableElement | null
    if (!table) {
      return
    }
    const wrapperViewportWidth = wrapper.clientWidth > 0 ? wrapper.clientWidth : editorViewportWidth
    if (!isOverflowTable(table, wrapperViewportWidth)) {
      unwrapTable(wrapper)
    }
  })

  const tables = Array.from(editor.querySelectorAll('table')) as HTMLTableElement[]
  tables.forEach((table) => {
    if (table.parentElement?.getAttribute(TABLE_SCROLLVIEW_ATTR) === 'true') {
      return
    }
    if (isOverflowTable(table, editorViewportWidth)) {
      wrapTable(table)
    }
  })
}
