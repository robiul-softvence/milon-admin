import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Same visual as the Figma filter "Chip" (Selected / Outline). */
export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border px-3.5 py-2 text-[13px] leading-[18px] font-semibold whitespace-nowrap transition-colors',
        selected ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:bg-pearl',
      )}
    >
      {children}
    </button>
  )
}
