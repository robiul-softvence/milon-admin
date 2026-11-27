/**
 * Mock API client. Every feature `api/` module goes through `mockRequest`,
 * so swapping to real endpoints later only means replacing this file
 * (e.g. with a fetch/axios wrapper) and the per-feature calls.
 */
const MOCK_LATENCY_MS = 250

export function mockRequest<T>(data: T, latency = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), latency)
  })
}
