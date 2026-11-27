import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/** Full-width 16/20 bold button, 16px radius, 24×16 padding (Figma "Button" in auth frames). */
export function AuthButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn('w-full rounded-2xl px-6 py-4 text-[16px] leading-5', className)}
      {...props}
    />
  )
}
