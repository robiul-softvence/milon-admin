import type { CSSProperties, ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface DialogHeaderProps {
  titleId: string
  title: ReactNode
  description?: ReactNode
  /** 52px leading tile (icon or avatar). */
  leading: ReactNode
  leadingClassName?: string
  leadingStyle?: CSSProperties
  onClose: () => void
}

/** Figma "Delete User Modal" header: 52px tile · title 22/28 + body copy · 36px round close. */
export function DialogHeader({ titleId, title, description, leading, leadingClassName, leadingStyle, onClose }: DialogHeaderProps) {
  return (
    <div className="flex w-full items-start gap-3.5">
      <div className={cn('flex size-[52px] shrink-0 items-center justify-center rounded-2xl', leadingClassName)} style={leadingStyle}>
        {leading}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 id={titleId} className="text-[22px] leading-7 font-bold text-ink">
          {title}
        </h2>
        {description && <p className="text-body text-muted">{description}</p>}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex size-9 shrink-0 items-center justify-center rounded-[18px] bg-pearl text-ink transition-colors hover:bg-line"
      >
        <Icon name="x" size={18} />
      </button>
    </div>
  )
}
