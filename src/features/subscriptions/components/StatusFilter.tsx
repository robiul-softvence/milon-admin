import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { POPOVER_MENU, usePopover } from '../hooks/usePopover'
import { PROMO_STATUS } from '../lib/promo'
import type { PromoStatus, PromoStatusFilter } from '../types'

const OPTIONS: { value: PromoStatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...(Object.keys(PROMO_STATUS) as PromoStatus[]).map((s) => ({ value: s, label: PROMO_STATUS[s].label })),
]

interface StatusFilterProps {
  value: PromoStatusFilter
  onChange: (value: PromoStatusFilter) => void
  /** Number of codes per status, shown in the menu. */
  counts: Partial<Record<PromoStatusFilter, number>>
}

/** Figma "Row" filter trigger: 40px, filter icon + 14 semibold label + chevron. */
export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  const { open, setOpen, ref } = usePopover()
  const selected = OPTIONS.find((o) => o.value === value)
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-[9px] text-body font-semibold whitespace-nowrap text-ink transition-colors hover:bg-pearl',
          value === 'all' ? 'border-line' : 'border-ink',
        )}
      >
        <Icon name="filter" size={16} />
        {selected?.label}
        <Icon name="chevD-sm" size={14} className="text-muted" />
      </button>
      {open && (
        <ul role="listbox" className={cn(POPOVER_MENU, 'right-auto left-0 max-w-[calc(100vw-2rem)] sm:right-0 sm:left-auto')}>
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-6 px-3.5 py-2 text-left text-body whitespace-nowrap hover:bg-pearl',
                  o.value === value ? 'font-semibold text-cta' : 'text-ink',
                )}
              >
                {o.label}
                <span className="text-caption font-medium text-subtle">{counts[o.value] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
