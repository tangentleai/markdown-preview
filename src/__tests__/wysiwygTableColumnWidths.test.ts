import {
  allocateColumnWidths,
  measureCellWidth,
  measureColumnConstraints
} from '../utils/wysiwygTableColumnWidths'

const monoMeasure = (text: string): number => text.length

describe('wysiwygTableColumnWidths', () => {
  it('computes min/preferred/max for long words', () => {
    const metrics = measureCellWidth('Supercalifragilisticexpialidocious', monoMeasure)
    expect(metrics).toEqual({
      min: 34,
      preferred: 34,
      max: 34
    })
  })

  it('computes min/preferred/max for long links', () => {
    const metrics = measureCellWidth('https://example.com/with-long-path', monoMeasure)
    expect(metrics.min).toBe(11)
    expect(metrics.max).toBe(34)
    expect(metrics.preferred).toBeCloseTo(22.5, 5)
  })

  it('keeps numeric columns unbroken', () => {
    const metrics = measureCellWidth('1234567890', monoMeasure)
    expect(metrics).toEqual({
      min: 10,
      preferred: 10,
      max: 10
    })
  })

  it('aggregates column constraints by max across cells', () => {
    const constraints = measureColumnConstraints(
      [
        ['short', '999'],
        ['longword', '12']
      ],
      monoMeasure
    )
    expect(constraints).toEqual([
      { min: 8, preferred: 8, max: 8 },
      { min: 3, preferred: 3, max: 3 }
    ])
  })

  it('distributes growth by available max space', () => {
    const widths = allocateColumnWidths(
      [
        { min: 4, preferred: 6, max: 10 },
        { min: 2, preferred: 4, max: 8 }
      ],
      16
    )
    expect(widths).toEqual([9, 7])
  })

  it('shrinks proportionally down to min limits', () => {
    const widths = allocateColumnWidths(
      [
        { min: 4, preferred: 10, max: 12 },
        { min: 6, preferred: 10, max: 12 }
      ],
      14
    )
    expect(widths[0]).toBeCloseTo(6.4, 2)
    expect(widths[1]).toBeCloseTo(7.6, 2)
  })

  it('stops shrinking when min widths still overflow budget', () => {
    const widths = allocateColumnWidths(
      [
        { min: 4, preferred: 10, max: 12 },
        { min: 6, preferred: 10, max: 12 }
      ],
      8
    )
    expect(widths).toEqual([4, 6])
  })
})
