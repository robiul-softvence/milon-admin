import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

/** Figma "Checkbox": 20px box (6px radius) — CTA fill + white check, or 1.5px line border. */
export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex w-full cursor-pointer items-center gap-2.5 text-body text-ink select-none">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40',
          checked ? 'bg-cta' : 'border-[1.5px] border-line bg-white',
        )}
      >
        {checked && <Icon name="auth-check" size={12} />}
      </span>
      {label}
    </label>
  )
}
