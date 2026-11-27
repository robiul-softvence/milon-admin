import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

type Variant = 'outline' | 'primary' | 'dark' | 'ghost'

const variants: Record<Variant, string> = {
  outline: 'border border-line bg-white text-ink hover:bg-pearl',
  primary: 'bg-cta text-white hover:bg-[#cc4330]',
  dark: 'bg-ink text-white hover:bg-[#2a2d33]',
  ghost: 'text-ink hover:bg-pearl',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Name of an icon in `src/assets/icons` rendered before the label (18px). */
  icon?: string
}

/** 14/20 bold button, 12px radius, 18×12 padding (Figma "Button/*"). */
export function Button({
  variant = 'outline',
  icon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-[18px] py-3 text-body font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
