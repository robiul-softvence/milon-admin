import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { DEFAULT_MORE_FILTERS, countActiveMoreFilters } from '../lib/filterUsers'
import { GOAL_COLORS, GOAL_LABELS } from '../lib/labels'
import type { Goal, InjuryFilter, MoreFilters, StatusFilter } from '../types'

const GOALS = Object.keys(GOAL_LABELS) as Goal[]
const INJURY_OPTIONS: { value: InjuryFilter; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'with', label: 'With flags' },
  { value: 'without', label: 'None' },
]
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

interface Props {
  value: MoreFilters
  onChange: (value: MoreFilters) => void
}

function Segment<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors',
            o.value === value ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:bg-pearl',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function MoreFiltersPopover({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = countActiveMoreFilters(value)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggleGoal = (g: Goal) =>
    onChange({ ...value, goals: value.goals.includes(g) ? value.goals.filter((x) => x !== g) : [...value.goals, g] })

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-[9px] text-body font-semibold whitespace-nowrap text-ink transition-colors hover:bg-pearl"
      >
        <Icon name="filter" size={16} />
        More filters
        {active > 0 && (
          <span className="rounded-full bg-coral px-1.5 text-caption font-bold text-white">{active}</span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="More filters"
          className="absolute top-full left-0 z-30 mt-1.5 flex w-[280px] max-w-[calc(100vw-2rem)] sm:right-0 sm:left-auto flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_12px_24px_rgba(17,19,24,0.08)]"
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-overline text-muted">Primary goal</legend>
            {GOALS.map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-2.5 text-body text-ink">
                <input
                  type="checkbox"
                  checked={value.goals.includes(g)}
                  onChange={() => toggleGoal(g)}
                  className="size-4 accent-[#e04d38]"
                />
                <span className="size-2 rounded-full" style={{ backgroundColor: GOAL_COLORS[g] }} />
                {GOAL_LABELS[g]}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-col gap-2">
            <p className="text-overline text-muted">Injury flags</p>
            <Segment options={INJURY_OPTIONS} value={value.injury} onChange={(injury) => onChange({ ...value, injury })} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-overline text-muted">Status</p>
            <Segment options={STATUS_OPTIONS} value={value.status} onChange={(status) => onChange({ ...value, status })} />
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <button
              type="button"
              onClick={() => onChange(DEFAULT_MORE_FILTERS)}
              disabled={active === 0}
              className="text-body font-semibold text-muted hover:text-ink disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-ink px-4 py-2 text-body font-bold text-white hover:bg-[#2a2d33]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
