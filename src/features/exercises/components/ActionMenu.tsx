import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export interface ActionMenuItem {
  label: string
  onSelect: () => void
  destructive?: boolean
}

/** 18px "more" trigger opening a small popover menu (closes on outside click / Escape). */
export function ActionMenu({ items, label = 'More actions' }: { items: ActionMenuItem[]; label?: string }) {
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
    <div ref={ref} className="relative flex shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-md text-muted transition-colors after:absolute after:-inset-2.5 hover:text-ink"
      >
        <Icon name="more" size={18} />
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute top-full right-0 z-30 mt-1.5 min-w-[140px] overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_12px_24px_rgba(17,19,24,0.08)]"
        >
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  item.onSelect()
                }}
                className={cn(
                  'block w-full px-3.5 py-2 text-left text-body hover:bg-pearl',
                  item.destructive ? 'text-cta' : 'text-ink',
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
