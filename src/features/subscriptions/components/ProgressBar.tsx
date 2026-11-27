import { cn } from '@/lib/cn'

interface ProgressBarProps {
  /** 0–1 */
  value: number
  trackClassName?: string
  barClassName?: string
}

/** 6px rounded bar (Figma "Row" track + "Rect" fill, 3px radius). */
export function ProgressBar({ value, trackClassName = 'bg-pearl', barClassName = 'bg-coral' }: ProgressBarProps) {
  return (
    <div className={cn('flex h-1.5 w-full items-center overflow-hidden rounded-[3px]', trackClassName)}>
      <div
        className={cn('h-1.5 rounded-[3px] transition-[width] duration-300', barClassName)}
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
      />
    </div>
  )
}
