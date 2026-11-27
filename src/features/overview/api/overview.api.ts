import { mockRequest } from '@/lib/api/client'
import type { DateRange, OverviewData } from '../types'
import { overviewMock } from './overview.mock'

// TODO(api): replace with `GET /admin/overview?range=…` once the backend exists.
export function fetchOverview(_range: DateRange): Promise<OverviewData> {
  return mockRequest(overviewMock)
}
