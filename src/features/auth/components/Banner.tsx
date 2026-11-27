import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Tone = 'error' | 'info' | 'success'

const tones: Record<Tone, { box: string; icon: string; iconClass: string; title: string }> = {
  error: { box: 'bg-[#fde4e0]', icon: 'auth-alert', iconClass: 'text-cta', title: 'text-cta' },
  info: { box: 'bg-pearl', icon: 'auth-info', iconClass: 'text-info', title: 'text-ink' },
  success: { box: 'bg-success-soft', icon: 'auth-check18', iconClass: 'text-success', title: 'text-success' },
}

interface BannerProps {
  tone: Tone
  title?: string
  children?: ReactNode
}

/** Figma "Error Banner" / info row: 14px padding, 14px radius, 18px icon. */
export function Banner({ tone, title, children }: BannerProps) {
  const t = tones[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex w-full items-start gap-2.5 rounded-[14px] p-3.5', t.box)}>
      <Icon name={t.icon} size={18} className={t.iconClass} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <p className={cn('text-body font-bold', t.title)}>{title}</p>}
        {children && <p className="text-caption font-medium text-ink">{children}</p>}
      </div>
    </div>
  )
}
