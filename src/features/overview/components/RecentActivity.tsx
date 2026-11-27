import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { PanelHeader } from '@/components/ui/PanelHeader'
import { Pill, type PillTone } from '@/components/ui/Pill'
import { Cell, TableHeader, TableRow, TableScroll } from '@/components/ui/Table'
import type { ActivityEvent, ActivityItem, PlanTier } from '../types'

const EVENT: Record<ActivityEvent, { label: string; tone: PillTone }> = {
  registration: { label: 'New registration', tone: 'info' },
  upgrade: { label: 'Upgraded to Pro', tone: 'success' },
  aiChat: { label: 'AI Coach chat', tone: 'cta' },
  aiPlan: { label: 'AI plan generated', tone: 'lime' },
}

const PLAN: Record<PlanTier, { label: string; tone: PillTone; dot: boolean }> = {
  pro: { label: 'Pro', tone: 'ink', dot: false },
  trial: { label: 'Free Trial', tone: 'warning', dot: true },
  free: { label: 'Free', tone: 'neutral', dot: true },
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="flex w-full flex-col gap-5 p-4 sm:p-6">
      <PanelHeader title="Recent Platform Activity" subtitle="Live feed">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1.5 text-caption font-bold text-success">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-40" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          Live
        </span>
        <Link to="/users" className="text-body font-semibold text-cta hover:underline">
          View all
        </Link>
      </PanelHeader>

      <TableScroll minWidth={900}>
        <TableHeader>
          <Cell className="w-[240px]">User</Cell>
          <Cell className="w-[200px]">Event</Cell>
          <Cell className="min-w-0 flex-1">Details</Cell>
          <Cell className="w-[140px]">Plan</Cell>
          <Cell className="w-[110px]">Time</Cell>
        </TableHeader>
        {items.map((item) => {
          const event = EVENT[item.event]
          const plan = PLAN[item.plan]
          return (
            <TableRow key={item.id}>
              <Cell className="w-[240px] gap-2.5">
                <Avatar initials={item.user.initials} color={item.user.color} />
                <span className="text-body font-semibold text-ink">{item.user.name}</span>
              </Cell>
              <Cell className="w-[200px]">
                <Pill tone={event.tone} dot>
                  {event.label}
                </Pill>
              </Cell>
              <Cell className="min-w-0 flex-1">
                <span className="truncate text-body text-ink">{item.details}</span>
              </Cell>
              <Cell className="w-[140px]">
                <Pill tone={plan.tone} dot={plan.dot}>
                  {plan.label}
                </Pill>
              </Cell>
              <Cell className="w-[110px] text-caption font-medium text-muted">{item.time}</Cell>
            </TableRow>
          )
        })}
      </TableScroll>
    </Card>
  )
}
