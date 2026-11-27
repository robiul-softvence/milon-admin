import { Card } from '@/components/ui/Card'
import type { AiStat } from '../types'

/** Figma "Stat/*": label + 24px number with a small caption suffix. */
export function StatCard({ stat }: { stat: AiStat }) {
  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-1.5 p-5 whitespace-nowrap">
      <p className="text-body text-muted">{stat.label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-num-m text-ink">{stat.value}</p>
        <p className="text-caption font-semibold text-muted">{stat.suffix}</p>
      </div>
    </Card>
  )
}
