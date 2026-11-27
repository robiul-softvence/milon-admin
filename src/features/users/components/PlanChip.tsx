import { cn } from '@/lib/cn'
import { formatCount } from '../lib/labels'

interface PlanChipProps {
  label: string
  count: number
  active: boolean
  onClick: () => void
}

/** Figma "Filter/*": pill chip with a count badge; active = ink fill + coral badge. */
export function PlanChip({ label, count, active, onClick }: PlanChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-[9px] text-body font-semibold whitespace-nowrap transition-colors',
        active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:bg-pearl',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-caption font-bold',
          active ? 'bg-coral text-white' : 'bg-pearl text-muted',
        )}
      >
        {formatCount(count)}
      </span>
    </button>
  )
}
