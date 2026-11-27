import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { SearchField } from '@/components/ui/SearchField'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { downloadCsv } from '@/lib/csv'
import { GoalDonut } from '../components/GoalDonut'
import { KpiCard } from '../components/KpiCard'
import { RecentActivity } from '../components/RecentActivity'
import { RevenueChart } from '../components/RevenueChart'
import { useOverview } from '../hooks/useOverview'
import type { DateRange } from '../types'

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '12m', label: 'Last 12 months' },
]

export default function OverviewPage() {
  const { user } = useAuth()
  const [range, setRange] = useState<DateRange>('30d')
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useOverview(range)

  const firstName = user?.name.split(' ')[0] ?? 'Alex'

  const exportCsv = () => {
    if (!data) return
    downloadCsv(
      'milon-overview.csv',
      data.monthly.map((m) => ({ month: m.month, mrr_eur: m.mrr, active_users: m.activeUsers })),
    )
  }

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`Welcome back, ${firstName} — here's what's happening across MILON today.`}
        actions={
          <>
            <SearchField
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              containerClassName="w-full sm:w-[260px]"
            />
            <IconButton icon="bell" label="Notifications" />
            <Dropdown icon="cal" value={range} options={RANGE_OPTIONS} onChange={setRange} />
            <Button icon="download" onClick={exportCsv} disabled={!data}>
              Export
            </Button>
          </>
        }
      />

      {isError && <p className="text-body text-cta">Couldn't load the overview. Please try again.</p>}

      {isLoading || !data ? (
        <OverviewSkeleton />
      ) : (
        <>
          <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex xl:items-center">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.key} kpi={kpi} />
            ))}
          </section>
          <section className="flex w-full flex-col items-stretch gap-4 sm:gap-5 xl:flex-row xl:items-start">
            <RevenueChart data={data.monthly} />
            <GoalDonut goals={data.goals} />
          </section>
          <RecentActivity items={data.activity} />
        </>
      )}
    </>
  )
}

function OverviewSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[166px] flex-1 rounded-[20px] bg-white" />
        ))}
      </div>
      <div className="flex flex-col gap-5 xl:flex-row">
        <div className="h-[408px] flex-1 rounded-[20px] bg-white" />
        <div className="h-[416px] rounded-[20px] bg-white xl:w-[400px]" />
      </div>
      <div className="h-[536px] rounded-[20px] bg-white" />
    </div>
  )
}
