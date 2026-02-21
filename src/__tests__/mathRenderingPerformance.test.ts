import {
  MATH_LONG_TASK_THRESHOLD_MS,
  MATH_PREVIEW_DEBOUNCE_MS,
  measureBlockMathRenderDurations,
  resetMathRenderCachesForTest,
  simulateDebouncedRenderCount
} from '../utils/mathRendering'

describe('math rendering performance safeguards', () => {
  afterEach(() => {
    resetMathRenderCachesForTest()
  })

  it('should debounce continuous formula edits into fewer render passes', () => {
    const updates = 60
    const renderCount = simulateDebouncedRenderCount(updates, 16, MATH_PREVIEW_DEBOUNCE_MS)

    expect(renderCount).toBeLessThan(updates)
    expect(renderCount).toBe(1)
  })

  it('should keep block math render tasks below the long-task threshold', () => {
    const samples = Array.from({ length: 40 }, (_, index) => {
      return String.raw`\text{MOM}_{i,t} = \frac{P_{i,t-1}}{P_{i,t-1-${(index % 12) + 1}}} - 1 + ${index}`
    })

    const metrics = measureBlockMathRenderDurations(samples)

    expect(metrics.durationsMs).toHaveLength(samples.length)
    expect(metrics.maxDurationMs).toBeLessThan(MATH_LONG_TASK_THRESHOLD_MS)
  })
})
