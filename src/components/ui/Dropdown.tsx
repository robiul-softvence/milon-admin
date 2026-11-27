import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  /** Optional leading icon name (18px), e.g. "cal". */
  icon?: string
  /** Render the trigger label; defaults to the selected option's label. */
  renderLabel?: (option: DropdownOption<T> | undefined) => ReactNode
  /** "md" = 44px top-bar trigger, "sm" = 32px panel trigger. */
  size?: 'md' | 'sm'
  align?: 'left' | 'right'
  className?: string
}

/** Select-like trigger with a popover menu. Closes on outside click / Escape. */
export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  icon,
  renderLabel,
  size = 'md',
  align = 'right',
  className,
}: DropdownProps<T>) {
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

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center whitespace-nowrap border border-line bg-white font-semibold text-ink transition-colors hover:bg-pearl',
          size === 'md'
            ? 'gap-2 rounded-xl px-3.5 py-[11px] text-body'
            : 'gap-1.5 rounded-[10px] px-3 py-2 text-caption',
          className,
        )}
      >
        {icon && <Icon name={icon} size={18} className="text-muted" />}
        {renderLabel ? renderLabel(selected) : selected?.label}
        <Icon
          name={size === 'md' ? 'chevD' : 'chevD-sm'}
          size={size === 'md' ? 16 : 14}
          className="text-muted"
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className={cn(
            'absolute top-full z-30 mt-1.5 min-w-full overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_12px_24px_rgba(17,19,24,0.08)]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
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
