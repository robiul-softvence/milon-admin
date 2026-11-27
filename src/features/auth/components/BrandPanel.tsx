import brandPhoto from '@/assets/auth/brand-panel.jpg'
import logoMark from '@/assets/logo-mark.svg'
import { cn } from '@/lib/cn'

const STATS = [
  { value: '12,480', label: 'active users' },
  { value: '4,320', label: 'Pro members' },
  { value: '1,890', label: 'AI plans today' },
]

function Logo() {
  return (
    <div className="relative flex items-center gap-2">
      <img src={logoMark} alt="" width={45} height={30} className="block h-[30px] w-[45px]" />
      <span className="text-[30px] leading-[34px] font-extrabold text-white">Milon</span>
      <span className="rounded-full bg-white/18 px-2.5 py-1 text-overline text-white">ADMIN</span>
    </div>
  )
}

function Photo({ imgClassName }: { imgClassName?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <img src={brandPhoto} alt="" className={cn('absolute inset-0 size-full object-cover', imgClassName)} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,24,0.38)_0%,rgba(17,19,24,0.05)_22%,rgba(17,19,24,0.1)_60%,rgba(17,19,24,0.82)_100%)]" />
    </div>
  )
}

/**
 * Figma "Brand Panel": 680px photo column with logo + glass card (shared by all auth frames).
 * Shown from lg (narrower 440px column until xl); below lg see `BrandHeader`.
 */
export function BrandPanel() {
  return (
    <aside className="sticky top-0 hidden h-screen min-h-[640px] w-[440px] shrink-0 flex-col items-start justify-between overflow-hidden p-10 lg:flex xl:w-[680px] xl:p-14">
      <Photo />
      <Logo />

      <div className="relative flex w-full flex-col gap-5 rounded-[28px] border border-white/18 bg-[rgba(17,19,24,0.35)] p-7 text-white backdrop-blur-[10px]">
        <p className="text-overline text-lime">MILON ADMIN CONSOLE</p>
        <h2 className="font-brand text-[44px] leading-[48px] font-normal">
          Every day,
          <br />
          stronger.
        </h2>
        <p className="text-[16px] leading-6">
          Manage members, content, subscriptions and AI safety — all in one place.
        </p>
        <div className="flex w-full gap-2.5">
          {STATS.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-2xl bg-white/12 p-3.5">
              <span className="text-[20px] leading-6 font-bold tracking-[-0.2px]">{s.value}</span>
              <span className="text-caption font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

/** Below lg: short photo band with the logo, above the full-width form column. */
export function BrandHeader() {
  return (
    <header className="relative flex h-[120px] w-full shrink-0 items-end overflow-hidden px-4 pb-5 min-[400px]:px-5 sm:h-[160px] sm:px-6 sm:pb-6 lg:hidden">
      <Photo imgClassName="object-[center_22%]" />
      <Logo />
    </header>
  )
}
