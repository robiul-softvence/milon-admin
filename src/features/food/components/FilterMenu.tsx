import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface FilterMenuProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  /** Trigger content (label). */
  children: ReactNode
  /** Optional 16px leading icon name. */
  icon?: string
  /** Highlights the trigger when a non-default value is selected. */
  active?: boolean
}

/** Figma filter trigger in "Recipe Filters": 14/20 semibold, 14×9 padding, 14px chevron. */
export function FilterMenu<T extends string>({
  value,
  options,
  onChange,
  children,
  icon,
  active,
}: FilterMenuProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 whitespace-nowrap rounded-xl border bg-white px-3.5 py-[9px] text-body font-semibold text-ink transition-colors hover:bg-pearl',
          active ? 'border-ink' : 'border-line',
        )}
      >
        {icon && <Icon name={icon} size={16} />}
        {children}
        <Icon name="chevD-sm" size={14} className="text-muted" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-30 mt-1.5 max-w-[calc(100vw-2rem)] min-w-full overflow-hidden xl:right-0 xl:left-auto rounded-xl border border-line bg-white py-1 shadow-[0_12px_24px_rgba(17,19,24,0.08)]"
        >
          {options.map((o) => (
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
                  'block w-full whitespace-nowrap px-3.5 py-2 text-left text-body hover:bg-pearl',
                  o.value === value ? 'font-semibold text-cta' : 'text-ink',
                )}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
