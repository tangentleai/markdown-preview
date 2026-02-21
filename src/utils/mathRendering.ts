import katex from 'katex'

export const MATH_PREVIEW_DEBOUNCE_MS = 200
export const MATH_LONG_TASK_THRESHOLD_MS = 50

const MATH_RENDER_CACHE_LIMIT = 128
const inlineRenderCache = new Map<string, string>()
const blockRenderCache = new Map<string, string>()

const readCached = (cache: Map<string, string>, tex: string): string | null => {
  const cached = cache.get(tex)
  if (cached === undefined) {
    return null
  }
  cache.delete(tex)
  cache.set(tex, cached)
  return cached
}

const writeCached = (cache: Map<string, string>, tex: string, html: string) => {
  cache.set(tex, html)
  if (cache.size <= MATH_RENDER_CACHE_LIMIT) {
    return
  }
  const oldestKey = cache.keys().next().value
  if (typeof oldestKey === 'string') {
    cache.delete(oldestKey)
  }
}

const renderMathWithFallback = (tex: string, displayMode: boolean): string => {
  try {
    return katex.renderToString(tex, { displayMode, throwOnError: true })
  } catch {
    return tex
  }
}

export const renderInlineMathWithFallback = (tex: string): string => {
  const cached = readCached(inlineRenderCache, tex)
  if (cached !== null) {
    return cached
  }
  const rendered = renderMathWithFallback(tex, false)
  writeCached(inlineRenderCache, tex, rendered)
  return rendered
}

export const renderBlockMathWithFallback = (tex: string): string => {
  const cached = readCached(blockRenderCache, tex)
  if (cached !== null) {
    return cached
  }
  const rendered = renderMathWithFallback(tex, true)
  writeCached(blockRenderCache, tex, rendered)
  return rendered
}

export const measureBlockMathRenderDurations = (samples: string[]) => {
  const durationsMs = samples.map((sample) => {
    const start = performance.now()
    renderBlockMathWithFallback(sample)
    return performance.now() - start
  })

  const maxDurationMs = durationsMs.length === 0 ? 0 : Math.max(...durationsMs)
  return {
    durationsMs,
    maxDurationMs
  }
}

export const simulateDebouncedRenderCount = (updates: number, inputIntervalMs: number, debounceMs: number): number => {
  if (updates <= 0) {
    return 0
  }
  if (debounceMs <= 0) {
    return updates
  }
  if (inputIntervalMs < debounceMs) {
    return 1
  }
  return updates
}

export const resetMathRenderCachesForTest = () => {
  inlineRenderCache.clear()
  blockRenderCache.clear()
}
