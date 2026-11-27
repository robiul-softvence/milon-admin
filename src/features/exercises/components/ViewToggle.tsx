import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { LibraryView } from '../types'

const OPTIONS: { value: LibraryView; icon: string; label: string }[] = [
  { value: 'grid', icon: 'ex-grid', label: 'Grid view' },
  { value: 'list', icon: 'list', label: 'List view' },
]

/** Figma "View Toggle": white segmented control, ink active segment. */
export function ViewToggle({ value, onChange }: { value: LibraryView; onChange: (v: LibraryView) => void }) {
  return (
    <div role="radiogroup" aria-label="Library view" className="flex shrink-0 items-center rounded-xl border border-line bg-white p-1">
      {OPTIONS.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex items-center rounded-[9px] px-2.5 py-[7px] transition-colors',
              active ? 'bg-ink text-white' : 'text-muted hover:text-ink',
            )}
          >
            <Icon name={o.icon} size={16} />
          </button>
        )
      })}
    </div>
  )
}
