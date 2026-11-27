import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface FilterSelectProps<T extends string> {
  /** Trigger text when nothing is selected, e.g. "Equipment". */
  placeholder: string
  value: T | null
  options: { value: T; label: string }[]
  onChange: (value: T | null) => void
  /** Optional 16px leading icon. */
  icon?: string
  /** Label of the "clear" option at the top of the menu. */
  allLabel: string
  className?: string
}

/** Figma filter dropdown: 40px, 12px radius, 14/20 semibold, 14px chevron. Active = ink border. */
export function FilterSelect<T extends string>({
  placeholder,
  value,
  options,
  onChange,
  icon,
  allLabel,
  className,
}: FilterSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

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

  const choose = (v: T | null) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div ref={ref} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex w-full items-center gap-2 whitespace-nowrap rounded-xl border bg-white px-3.5 py-[9px] text-body font-semibold text-ink transition-colors hover:bg-pearl',
          selected ? 'border-ink' : 'border-line',
        )}
      >
        {icon && <Icon name={icon} size={16} />}
        <span className="min-w-0 flex-1 truncate text-left">
          {selected ? `${placeholder}: ${selected.label}` : placeholder}
        </span>
        <Icon name="chevD-sm" size={14} className="text-muted" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-30 mt-1.5 max-w-[calc(100vw-2rem)] min-w-full overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_12px_24px_rgba(17,19,24,0.08)]"
        >
          {[{ value: null, label: allLabel }, ...options].map((o) => (
            <li key={o.value ?? '__all'}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => choose(o.value as T | null)}
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
