import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  iconSize?: number
  label: string
}

/** 44×44 white square with line border (Figma "IconBox/*" in the top bar). */
export function IconButton({ icon, iconSize = 20, label, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink transition-colors hover:bg-pearl',
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  )
}
