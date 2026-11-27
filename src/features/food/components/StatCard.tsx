import { Card } from '@/components/ui/Card'

interface StatCardProps {
  label: string
  value: string
  /** Tailwind background class for the 8px dot. */
  dotClassName: string
}

/** Figma "Stat/*": 8px dot + 14px muted label, 24/30 bold number. */
export function StatCard({ label, value, dotClassName }: StatCardProps) {
  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-1.5 p-5">
      <div className="flex items-center gap-2">
        <span className={`size-2 shrink-0 rounded-full ${dotClassName}`} />
        <p className="text-body whitespace-nowrap text-muted">{label}</p>
      </div>
      <p className="text-num-m whitespace-nowrap text-ink">{value}</p>
    </Card>
  )
}
