import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type PillTone =
  | 'success'
  | 'info'
  | 'warning'
  | 'cta'
  | 'lime'
  | 'ink'
  | 'neutral'
  | 'violet'

const toneClasses: Record<PillTone, { pill: string; dot: string }> = {
  success: { pill: 'bg-success-soft text-success', dot: 'bg-success' },
  info: { pill: 'bg-info-soft text-info', dot: 'bg-info' },
  warning: { pill: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  cta: { pill: 'bg-peach text-cta', dot: 'bg-cta' },
  lime: { pill: 'bg-lime text-ink', dot: 'bg-ink' },
  ink: { pill: 'bg-ink text-white', dot: 'bg-white' },
  neutral: { pill: 'bg-pearl text-muted', dot: 'bg-subtle' },
  violet: { pill: 'bg-[#efeafe] text-violet', dot: 'bg-violet' },
}

interface PillProps {
  tone?: PillTone
  dot?: boolean
  children: ReactNode
  className?: string
}

/** Rounded status pill (12/16 semibold) with optional 6px leading dot. */
export function Pill({ tone = 'neutral', dot = false, children, className }: PillProps) {
  const t = toneClasses[tone]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-caption font-semibold',
        t.pill,
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 shrink-0 rounded-full', t.dot)} />}
      {children}
    </span>
  )
}
