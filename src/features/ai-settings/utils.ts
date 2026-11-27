import type { Integration } from './types'

function compact(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}k`
  return String(n)
}

/** "1.24M / 2M tokens" for the LLM, "48,210 / 100k calls" for REST APIs. */
export function formatUsage({ used, limit, unit }: Integration['usage']): string {
  const usedLabel = unit === 'tokens' ? compact(used) : used.toLocaleString('en-US')
  return `${usedLabel} / ${compact(limit)} ${unit}`
}

export function formatLatency(ms: number): string {
  return ms >= 1000 ? `${+(ms / 1000).toFixed(1)} s` : `${ms} ms`
}
