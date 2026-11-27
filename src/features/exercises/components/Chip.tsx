import { cn } from '@/lib/cn'

/** Figma "Chip": 13/18 semibold pill; Selected = ink fill, Outline = white + line border. */
export function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-3.5 py-2 text-[13px] leading-[18px] font-semibold transition-colors',
        selected ? 'bg-ink text-white' : 'border border-line bg-white text-ink hover:bg-pearl',
      )}
    >
      {label}
    </button>
  )
}
