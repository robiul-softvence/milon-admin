import { useQuery } from '@tanstack/react-query'
import { fetchOverview } from '../api/overview.api'
import type { DateRange } from '../types'

export function useOverview(range: DateRange) {
  return useQuery({
    queryKey: ['overview', range],
    queryFn: () => fetchOverview(range),
    placeholderData: (prev) => prev,
  })
}
