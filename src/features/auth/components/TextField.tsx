import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  /** 18px leading icon name. */
  icon: string
  /** Right side of the label row (e.g. "Forgot password?"). */
  labelAction?: ReactNode
  /** Trailing slot inside the input (eye toggle, match check…). */
  trailing?: ReactNode
  /** Error caption; also turns the border CTA red. */
  error?: string
  /** Highlight the field red without a caption (e.g. after a failed sign-in). */
  invalid?: boolean
}

/**
 * Figma "Field/*": 14/20 semibold label, 8px gap, 48px input with 12px radius.
 * Borders are inset shadows so the 1px → 1.5px focus/error stroke never shifts layout
 * (matching Figma's inside strokes).
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, icon, labelAction, trailing, error, invalid, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hasError = Boolean(error) || invalid
  return (
    <div className={cn('flex w-full flex-col items-start gap-2', className)}>
      <div className="flex w-full items-center justify-between text-body font-semibold">
        <label htmlFor={inputId} className="text-ink">
          {label}
        </label>
        {labelAction}
      </div>
      <div
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl bg-white p-3.5 transition-shadow',
          hasError
            ? 'shadow-[inset_0_0_0_1.5px_var(--color-cta)]'
            : 'shadow-[inset_0_0_0_1px_var(--color-line)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
        )}
      >
        <Icon name={icon} size={18} className={hasError ? 'text-cta' : 'text-muted'} />
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-subtle"
          {...props}
        />
        {trailing}
      </div>
      {error && <p className="text-caption font-medium text-cta">{error}</p>}
    </div>
  )
})

/** Eye button that toggles a password field's visibility. */
export function RevealToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Hide password' : 'Show password'}
      aria-pressed={shown}
      className={cn('-m-1 rounded-md p-1 hover:text-ink', shown ? 'text-ink' : 'text-muted')}
    >
      <Icon name="auth-eye" size={18} />
    </button>
  )
}
