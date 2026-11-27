import { cn } from '@/lib/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

/** Figma "Toggle/On|Off": 44×26 pill, success green when on, line grey when off. */
export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[26px] w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        checked ? 'bg-success' : 'bg-line',
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] left-[3px] size-5 rounded-full bg-white transition-transform',
          checked && 'translate-x-[18px]',
        )}
      />
    </button>
  )
}
