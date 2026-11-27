import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-caption font-semibold text-muted">{label}</span>
      {children}
      {error && <span className="text-caption font-medium text-cta">{error}</span>}
    </label>
  )
}

const control =
  'w-full rounded-xl border border-line bg-white px-3.5 py-[11px] text-body text-ink outline-none placeholder:text-subtle focus:border-subtle'

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(control, className)} {...props} />
  },
)

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <span className="relative flex">
        <select ref={ref} className={cn(control, 'appearance-none pr-9', className)} {...props}>
          {children}
        </select>
        <Icon
          name="chevD-sm"
          size={14}
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
        />
      </span>
    )
  },
)

/** Header row for the form modals: title + subtitle + close button. */
export function ModalHeader({ title, subtitle, titleId, onClose }: {
  title: string
  subtitle?: string
  titleId: string
  onClose: () => void
}) {
  return (
    <div className="flex items-start gap-3 px-4 pt-5 sm:px-6 sm:pt-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 id={titleId} className="text-[20px] leading-7 font-bold text-ink sm:text-[22px]">
          {title}
        </h2>
        {subtitle && <p className="text-body text-muted">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-pearl hover:text-ink"
      >
        <Icon name="x" size={18} />
      </button>
    </div>
  )
}
