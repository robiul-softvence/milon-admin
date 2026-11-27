import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { ContentLanguage } from '../types'

const OPTIONS: { value: ContentLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
]

interface LanguageToggleProps {
  value: ContentLanguage
  onChange: (value: ContentLanguage) => void
}

/** Figma "Language Toggle": segmented control, active segment ink with a globe icon. */
export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Content language"
      className="flex shrink-0 items-center rounded-xl border border-line bg-white p-1"
    >
      {OPTIONS.map((o) => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-[9px] px-3.5 py-[7px] text-body font-semibold whitespace-nowrap transition-colors',
              selected ? 'bg-ink text-white' : 'text-muted hover:text-ink',
            )}
          >
            {selected && <Icon name="globe" size={14} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
