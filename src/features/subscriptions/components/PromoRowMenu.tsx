import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { POPOVER_MENU, usePopover } from '../hooks/usePopover'

interface PromoRowMenuProps {
  code: string
  enabled: boolean
  onToggle: () => void
  onCopy: () => void
  onDelete: () => void
}

/** "More" (⋯) action menu for a promo code row. */
export function PromoRowMenu({ code, enabled, onToggle, onCopy, onDelete }: PromoRowMenuProps) {
  const { open, setOpen, ref } = usePopover()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<CSSProperties>()

  // The table sits in a horizontal scroll container (which also clips vertically),
  // so the menu is positioned against the viewport, anchored to the trigger's right
  // edge, and flips upward when there is no room below. Closes on scroll/resize.
  useLayoutEffect(() => {
    if (!open) return
    const r = triggerRef.current?.getBoundingClientRect()
    if (!r) return
    const MENU_H = 128
    const below = window.innerHeight - r.bottom >= MENU_H + 12
    setPos({
      position: 'fixed',
      right: Math.max(8, window.innerWidth - r.right),
      ...(below ? { top: r.bottom + 6 } : { top: 'auto', bottom: window.innerHeight - r.top + 6 }),
    })
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open, setOpen])

  const items = [
    { label: enabled ? 'Pause code' : 'Activate code', onClick: onToggle },
    { label: 'Copy code', onClick: onCopy },
    { label: 'Delete', onClick: onDelete, danger: true },
  ]
  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`More actions for ${code}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg bg-pearl text-ink transition-colors hover:bg-line',
          open && 'bg-line',
        )}
      >
        <Icon name="more" size={16} />
      </button>
      {open && pos && (
        <ul role="menu" style={pos} className={cn(POPOVER_MENU, 'mt-0 min-w-[160px]')}>
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
                className={cn(
                  'block w-full px-3.5 py-2 text-left text-body whitespace-nowrap hover:bg-pearl',
                  item.danger ? 'font-semibold text-cta' : 'text-ink',
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
