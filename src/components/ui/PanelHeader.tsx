import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PanelHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  className?: string
}

/** Panel title (18/24 bold) + caption subtitle, with optional right-side actions. */
export function PanelHeader({ title, subtitle, children, className }: PanelHeaderProps) {
  return (
    <div className={cn('flex w-full flex-wrap items-center gap-3', className)}>
      <div className="flex min-w-[180px] flex-1 flex-col gap-0.5">
        <h2 className="text-h3 text-ink">{title}</h2>
        {subtitle && <p className="text-caption font-medium text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
