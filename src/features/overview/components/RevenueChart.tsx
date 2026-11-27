import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Dropdown } from '@/components/ui/Dropdown'
import { PanelHeader } from '@/components/ui/PanelHeader'
import type { ChartRange, MonthlyPoint } from '../types'

const MRR_MAX = 40_000
const USERS_MAX = 14_000
const Y_TICKS = ['€40k', '€30k', '€20k', '€10k', '€0']

const RANGE_OPTIONS: { value: ChartRange; label: string }[] = [
  { value: '12m', label: '12 months' },
  { value: '6m', label: '6 months' },
]

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className={`w-4 rounded-[2px] ${swatch}`} />
      <span className="text-caption font-semibold text-muted">{label}</span>
    </div>
  )
}

/** End-of-series marker: white dot with 3px coloured ring (last point only). */
function endDot(color: string, lastIndex: number) {
  return function EndDot(props: { index?: number; cx?: number; cy?: number }) {
    if (props.index !== lastIndex || props.cx == null || props.cy == null) return <g key={props.index} />
    return (
      <circle key={props.index} cx={props.cx} cy={props.cy} r={4.5} fill="#fff" stroke={color} strokeWidth={3} />
    )
  }
}

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-US')

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const [range, setRange] = useState<ChartRange>('12m')
  const points = useMemo(() => (range === '6m' ? data.slice(-6) : data), [data, range])
  const last = points.length - 1

  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6">
      <PanelHeader title="Monthly Revenue & User Growth" subtitle={range === '12m' ? 'Last 12 months' : 'Last 6 months'}>
        <LegendItem swatch="h-1 bg-coral" label="MRR" />
        <LegendItem swatch="h-0.5 bg-ink" label="Active users" />
        <Dropdown size="sm" value={range} options={RANGE_OPTIONS} onChange={setRange} />
      </PanelHeader>

      <div className="flex w-full items-start gap-3">
        <div className="flex h-[200px] shrink-0 flex-col justify-between text-caption font-medium text-subtle sm:h-[260px]">
          {Y_TICKS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="h-[200px] min-w-0 flex-1 sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <defs>
                <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff654f" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#ff654f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e7e8e4" strokeDasharray="4 4" />
              <YAxis yAxisId="mrr" hide domain={[0, MRR_MAX]} ticks={[0, 10_000, 20_000, 30_000, 40_000]} />
              <YAxis yAxisId="users" hide domain={[0, USERS_MAX]} />
              <Tooltip
                cursor={{ stroke: '#e7e8e4' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e7e8e4',
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 12,
                }}
                labelFormatter={(_, p) => p?.[0]?.payload?.month ?? ''}
                formatter={(value, name) =>
                  name === 'mrr' ? [eur.format(Number(value)), 'MRR'] : [num.format(Number(value)), 'Active users']
                }
              />
              <Area
                yAxisId="mrr"
                dataKey="mrr"
                type="monotone"
                stroke="#ff654f"
                strokeWidth={3}
                strokeLinecap="round"
                fill="url(#mrrFill)"
                dot={endDot('#ff654f', last)}
                activeDot={{ r: 4.5, fill: '#fff', stroke: '#ff654f', strokeWidth: 3 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="users"
                dataKey="activeUsers"
                type="monotone"
                stroke="#111318"
                strokeWidth={2.5}
                strokeDasharray="7 6"
                strokeLinecap="round"
                dot={endDot('#111318', last)}
                activeDot={{ r: 4.5, fill: '#fff', stroke: '#111318', strokeWidth: 3 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex w-full items-center justify-between pl-12 text-caption font-medium text-subtle max-sm:text-[10px] max-sm:[&>span:nth-child(even)]:invisible">
        {points.map((p) => (
          <span key={p.month}>{p.month}</span>
        ))}
      </div>
    </Card>
  )
}
