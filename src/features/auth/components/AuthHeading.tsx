import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

interface AuthHeadingProps {
  title: string
  subtitle: ReactNode
  /** 24px icon shown in the 56px peach tile above the title. */
  icon?: string
}

/** Title stack: optional icon tile, 32/40 bold title, 16/24 muted subtitle (10px gaps). */
export function AuthHeading({ title, subtitle, icon }: AuthHeadingProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2.5">
      {icon && (
        <div className="flex size-14 items-center justify-center rounded-[18px] bg-peach text-cta">
          <Icon name={icon} size={24} />
        </div>
      )}
      <h1 className="text-[28px] leading-9 font-bold text-ink sm:text-[32px] sm:leading-10">{title}</h1>
      <p className="text-[16px] leading-6 text-muted">{subtitle}</p>
    </div>
  )
}

/** "‹ Back to sign in" link (Figma "Back Link"). */
export function BackLink({ to = '/sign-in', state }: { to?: string; state?: unknown }) {
  return (
    <Link
      to={to}
      state={state}
      className="flex items-center gap-1.5 text-body font-semibold text-ink hover:text-cta"
    >
      <Icon name="auth-chevL" size={16} />
      Back to sign in
    </Link>
  )
}
