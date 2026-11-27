import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  /** Right-aligned controls (search, bell, buttons) — 12px gap like the Figma "Top Bar". */
  actions?: ReactNode
}

/**
 * Figma "Top Bar": H1 26/32 bold + 14/20 muted subtitle, actions on the right.
 * Below xl the actions drop under the title and wrap.
 */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-[22px] leading-7 font-bold text-ink sm:text-h1">{title}</h1>
        {subtitle && <p className="text-body text-muted">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 xl:shrink-0 xl:flex-nowrap">
          {actions}
        </div>
      )}
    </header>
  )
}
