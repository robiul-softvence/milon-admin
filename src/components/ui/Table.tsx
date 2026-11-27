import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Flex-based table rows matching the Figma tables:
 * header = pearl bar, 12px radius, 16×10 padding, 11px overline labels;
 * rows = 16×14 padding with a bottom "line" border. Give cells fixed widths
 * (e.g. `w-[240px] shrink-0`) or `flex-1 min-w-0` exactly as in Figma.
 */
export function TableHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="row"
      className={cn(
        'flex w-full items-center gap-4 rounded-xl bg-pearl px-4 py-2.5 text-overline text-muted',
        className,
      )}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="row"
      className={cn('flex w-full items-center gap-4 border-b border-line px-4 py-3.5', className)}
      {...props}
    />
  )
}

export function Cell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="cell" className={cn('flex shrink-0 items-center', className)} {...props} />
}

/**
 * Horizontal scroll wrapper for tables on narrow screens. On desktop the table
 * fills the panel exactly as in Figma; below `minWidth` it scrolls sideways.
 */
export function TableScroll({
  minWidth = 960,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { minWidth?: number }) {
  return (
    <div className={cn('relative -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sm:mx-0 sm:w-full sm:px-0', className)} {...props}>
      <div role="table" className="flex w-full flex-col" style={{ minWidth }}>
        {children}
      </div>
    </div>
  )
}
