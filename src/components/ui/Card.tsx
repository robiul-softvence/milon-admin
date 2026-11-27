import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** White surface with the 1px "line" border and 20px radius used by every panel. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[20px] border border-line bg-white', className)} {...props} />
}
