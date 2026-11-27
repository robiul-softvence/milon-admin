import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { formatCount } from '../lib/labels'
import type { UserStats } from '../types'

interface StatProps {
  label: string
  value: string
  note: string
  positive?: boolean
}

function Stat({ label, value, note, positive }: StatProps) {
  return (
    <Card className="flex min-w-0 flex-1 flex-col items-start gap-1.5 p-4 sm:p-5">
      <p className="text-body text-muted">{label}</p>
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="text-num-m text-ink">{value}</span>
        <span className={cn('text-caption font-bold', positive ? 'text-success' : 'text-muted')}>{note}</span>
      </div>
    </Card>
  )
}

export function UserStatsRow({ stats }: { stats?: UserStats }) {
  if (!stats) {
    return (
      <section className="grid w-full animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[98px] flex-1 rounded-[20px] bg-white" />
        ))}
      </section>
    )
  }
  return (
    <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex xl:items-center">
      <Stat label="New this week" value={formatCount(stats.newThisWeek.value)} note={`↑ ${stats.newThisWeek.trend}`} positive />
      <Stat label="Trial → Pro conversion" value={`${stats.trialConversion.value}%`} note={`↑ ${stats.trialConversion.trend}`} positive />
      <Stat
        label="Users with injury flags"
        value={`${stats.injuryFlags.percent}%`}
        note={`${formatCount(stats.injuryFlags.users)} users`}
      />
      <Stat label="Suspended" value={formatCount(stats.suspended)} note="—" />
    </section>
  )
}
