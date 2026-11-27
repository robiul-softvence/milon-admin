import { Pill } from '@/components/ui/Pill'
import { INJURY_LABELS } from '../lib/labels'
import type { InjuryZone } from '../types'

export function InjuryPills({ injuries }: { injuries: InjuryZone[] }) {
  if (injuries.length === 0) return <span className="text-body text-subtle">—</span>
  return (
    <div className="flex items-center gap-1.5">
      {injuries.map((z) => (
        <Pill key={z} tone="cta">
          {INJURY_LABELS[z]}
        </Pill>
      ))}
    </div>
  )
}
