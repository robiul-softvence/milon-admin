import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import type { Kpi, KpiKey } from '../types'
import { Sparkline } from './Sparkline'

const KPI_STYLE: Record<KpiKey, { icon: string; tile: string; iconColor: string; line: string }> = {
  activeUsers: { icon: 'users', tile: 'bg-peach', iconColor: 'text-cta', line: '#e04d38' },
  proSubscribers: { icon: 'card', tile: 'bg-lime-soft', iconColor: 'text-success', line: '#25845c' },
  mrr: { icon: 'dollar', tile: 'bg-pearl', iconColor: 'text-ink', line: '#ff654f' },
  aiPlansToday: { icon: 'spark', tile: 'bg-info-soft', iconColor: 'text-info', line: '#3478c8' },
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const s = KPI_STYLE[kpi.key]
  const up = kpi.trend.direction === 'up'
  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
      <div className="flex w-full items-center justify-between">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${s.tile}`}>
          <Icon name={s.icon} className={s.iconColor} />
        </div>
        <Sparkline data={kpi.sparkline} color={s.line} />
        <Pill tone={up ? 'success' : 'cta'}>
          {up ? '↑' : '↓'} {kpi.trend.value}
        </Pill>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body text-muted">{kpi.label}</p>
        <p className="text-[28px] leading-9 font-bold tracking-[-0.56px] text-ink sm:text-num-l">{kpi.value}</p>
      </div>
    </Card>
  )
}
