import logoMark from '@/assets/logo-mark.svg'
import { cn } from '@/lib/cn'

/** Figma "Logo/Wordmark": 45×30 mark + "Milon" (30/34 extra-bold). */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img src={logoMark} alt="" width={45} height={30} className="block h-[30px] w-[45px]" />
      <span className="text-[30px] leading-[34px] font-extrabold text-ink">Milon</span>
    </div>
  )
}
