const TABLE_SCROLLVIEW_ATTR = 'data-table-scrollview'
const TABLE_SCROLLVIEW_CLASS = 'wysiwyg-table-scrollview'
const TABLE_SCROLL_HINT_ATTR = 'data-table-scroll-hint'
const TABLE_SCROLL_HINT_STATE_ATTR = 'data-table-scroll-hint-state'
const TABLE_SCROLL_LISTENER_BOUND_ATTR = 'data-table-scroll-listener-bound'
const OVERFLOW_EPSILON_PX = 1

type TableScrollHintState = 'start' | 'middle' | 'end'

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

const resolveHintState = (wrapper: HTMLElement): TableScrollHintState => {
  const canScrollLeft = wrapper.scrollLeft > OVERFLOW_EPSILON_PX
  const rightEdge = wrapper.scrollLeft + wrapper.clientWidth
  const canScrollRight = rightEdge < wrapper.scrollWidth - OVERFLOW_EPSILON_PX

  if (canScrollLeft && canScrollRight) {
    return 'middle'
  }
  if (canScrollLeft) {
    return 'end'
  }
  return 'start'
}

const syncHintState = (wrapper: HTMLElement): void => {
  wrapper.setAttribute(TABLE_SCROLL_HINT_STATE_ATTR, resolveHintState(wrapper))
}

const ensureScrollHint = (wrapper: HTMLElement): void => {
  let hint = wrapper.querySelector(`:scope > [${TABLE_SCROLL_HINT_ATTR}="true"]`) as HTMLElement | null
  if (!hint) {
    hint = document.createElement('span')
    hint.className = 'wysiwyg-table-scroll-hint'
    hint.setAttribute(TABLE_SCROLL_HINT_ATTR, 'true')
    hint.setAttribute('aria-hidden', 'true')
    wrapper.append(hint)
  }

  syncHintState(wrapper)

  if (wrapper.getAttribute(TABLE_SCROLL_LISTENER_BOUND_ATTR) === 'true') {
    return
  }
  wrapper.addEventListener('scroll', () => {
    syncHintState(wrapper)
  })
  wrapper.setAttribute(TABLE_SCROLL_LISTENER_BOUND_ATTR, 'true')
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
      return
    }
    ensureScrollHint(wrapper)
  })

  const tables = Array.from(editor.querySelectorAll('table')) as HTMLTableElement[]
  tables.forEach((table) => {
    if (table.parentElement?.getAttribute(TABLE_SCROLLVIEW_ATTR) === 'true') {
      return
    }
    if (isOverflowTable(table, editorViewportWidth)) {
      wrapTable(table)
      const wrapper = table.parentElement as HTMLElement | null
      if (wrapper?.getAttribute(TABLE_SCROLLVIEW_ATTR) === 'true') {
        ensureScrollHint(wrapper)
      }
    }
  })
}
