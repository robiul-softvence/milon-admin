import { Cell, Pie, PieChart } from 'recharts'
import { Card } from '@/components/ui/Card'
import { PanelHeader } from '@/components/ui/PanelHeader'
import type { GoalKey, GoalSlice } from '../types'

const GOAL_COLOR: Record<GoalKey, string> = {
  weightLoss: '#ff654f',
  muscleGain: '#111318',
  stayFit: '#d8f56a',
}

const num = new Intl.NumberFormat('en-US')

export function GoalDonut({ goals }: { goals: GoalSlice[] }) {
  const total = goals.reduce((sum, g) => sum + g.users, 0)
  return (
    <Card className="flex w-full shrink-0 flex-col gap-5 p-4 sm:p-6 xl:w-[400px]">
      <PanelHeader title="User Goal Breakdown" subtitle="All active users" />

      <div className="flex w-full items-center justify-center">
        <div className="relative size-[200px]">
          <PieChart width={200} height={200}>
            <Pie
              data={goals}
              dataKey="users"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              paddingAngle={1.5}
              stroke="none"
              isAnimationActive={false}
            >
              {goals.map((g) => (
                <Cell key={g.key} fill={GOAL_COLOR[g.key]} />
              ))}
            </Pie>
          </PieChart>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-num-m text-ink">{num.format(total)}</span>
            <span className="text-caption font-medium text-muted">active users</span>
          </div>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-3">
        {goals.map((g) => (
          <li key={g.key} className="flex w-full items-center gap-2.5">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: GOAL_COLOR[g.key] }} />
            <span className="min-w-0 flex-1 text-body text-ink">{g.label}</span>
            <span className="text-caption font-medium text-muted">{num.format(g.users)}</span>
            <span className="text-body font-bold text-ink">{Math.round((g.users / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
