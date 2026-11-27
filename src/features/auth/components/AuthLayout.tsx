import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { BrandHeader, BrandPanel } from './BrandPanel'

/**
 * Full-page auth frame (Figma "Admin Auth 0x"): brand panel on the left,
 * centred 420px form column + security note on the right.
 * Responsive: xl = Figma (680px panel); lg = narrower panel; below lg the panel
 * becomes a short photo header band and the form takes the full width.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-stretch bg-white lg:flex-row lg:items-start">
      <BrandPanel />
      <BrandHeader />
      <main className="flex min-w-0 flex-1 flex-col items-center justify-start px-4 pt-8 pb-10 min-[400px]:px-5 sm:justify-center sm:px-6 sm:py-12 lg:min-h-screen lg:px-12 lg:py-10 xl:px-[120px]">
        <div className="flex w-full max-w-[420px] flex-col items-start gap-6 xl:w-[420px]">{children}</div>
        <div className="h-8 w-px shrink-0 sm:h-10" />
        <p className="flex w-full max-w-[420px] items-center justify-center gap-2 text-center text-caption font-medium text-muted xl:w-[420px]">
          <Icon name="auth-shield-sm" size={14} className="shrink-0" />
          Admin access only · Protected by 2-step verification
        </p>
      </main>
    </div>
  )
}
