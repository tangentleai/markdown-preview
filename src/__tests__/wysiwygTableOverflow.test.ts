import { syncOverflowTableScrollviews } from '../utils/wysiwygTableOverflow'

const defineSize = (target: object, key: 'clientWidth' | 'scrollWidth', value: number) => {
  Object.defineProperty(target, key, {
    configurable: true,
    value
  })
}

const defineScrollLeft = (target: object, value: number) => {
  Object.defineProperty(target, 'scrollLeft', {
    configurable: true,
    writable: true,
    value
  })
}

describe('syncOverflowTableScrollviews', () => {
  it('wraps table in horizontal scroll container when table overflows editor width', () => {
    const editor = document.createElement('div')
    const table = document.createElement('table')
    defineSize(editor, 'clientWidth', 640)
    defineSize(table, 'scrollWidth', 980)
    editor.append(table)

    syncOverflowTableScrollviews(editor)

    const wrapper = table.parentElement
    expect(wrapper).not.toBeNull()
    expect(wrapper?.getAttribute('data-table-scrollview')).toBe('true')
    expect(wrapper?.classList.contains('wysiwyg-table-scrollview')).toBe(true)
  })

  it('keeps table unwrapped when table does not overflow editor width', () => {
    const editor = document.createElement('div')
    const table = document.createElement('table')
    defineSize(editor, 'clientWidth', 640)
    defineSize(table, 'scrollWidth', 620)
    editor.append(table)

    syncOverflowTableScrollviews(editor)

    expect(editor.querySelector('[data-table-scrollview="true"]')).toBeNull()
    expect(table.parentElement).toBe(editor)
  })

  it('unwraps previously wrapped table after overflow is gone', () => {
    const editor = document.createElement('div')
    const table = document.createElement('table')
    defineSize(editor, 'clientWidth', 640)
    defineSize(table, 'scrollWidth', 980)
    editor.append(table)

    syncOverflowTableScrollviews(editor)

    const wrapper = editor.querySelector('[data-table-scrollview="true"]') as HTMLElement
    expect(wrapper).not.toBeNull()
    defineSize(wrapper, 'clientWidth', 640)
    defineSize(table, 'scrollWidth', 600)

    syncOverflowTableScrollviews(editor)

    expect(editor.querySelector('[data-table-scrollview="true"]')).toBeNull()
    expect(table.parentElement).toBe(editor)
  })

  it('does not nest duplicate wrappers when called repeatedly', () => {
    const editor = document.createElement('div')
    const table = document.createElement('table')
    defineSize(editor, 'clientWidth', 640)
    defineSize(table, 'scrollWidth', 980)
    editor.append(table)

    syncOverflowTableScrollviews(editor)
    syncOverflowTableScrollviews(editor)

    expect(editor.querySelectorAll('[data-table-scrollview="true"]').length).toBe(1)
  })

  it('adds icon hint and updates hint state while horizontal scrolling', () => {
    const editor = document.createElement('div')
    const table = document.createElement('table')
    defineSize(editor, 'clientWidth', 320)
    defineSize(table, 'scrollWidth', 860)
    editor.append(table)

    syncOverflowTableScrollviews(editor)

    const wrapper = editor.querySelector('[data-table-scrollview="true"]') as HTMLElement
    expect(wrapper).not.toBeNull()

    defineSize(wrapper, 'clientWidth', 320)
    defineSize(wrapper, 'scrollWidth', 860)
    defineScrollLeft(wrapper, 0)

    syncOverflowTableScrollviews(editor)
    expect(wrapper.getAttribute('data-table-scroll-hint-state')).toBe('start')
    expect(wrapper.querySelector('[data-table-scroll-hint="true"]')).not.toBeNull()

    wrapper.scrollLeft = 240
    wrapper.dispatchEvent(new Event('scroll'))
    expect(wrapper.getAttribute('data-table-scroll-hint-state')).toBe('middle')

    wrapper.scrollLeft = 540
    wrapper.dispatchEvent(new Event('scroll'))
    expect(wrapper.getAttribute('data-table-scroll-hint-state')).toBe('end')
  })
})
