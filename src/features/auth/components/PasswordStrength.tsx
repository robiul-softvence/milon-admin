import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { PASSWORD_RULES } from '../schemas'

const LEVELS = [
  { label: 'Too weak', bar: 'bg-line', text: 'text-muted' },
  { label: 'Weak', bar: 'bg-cta', text: 'text-cta' },
  { label: 'Fair', bar: 'bg-warning', text: 'text-warning' },
  { label: 'Strong', bar: 'bg-success', text: 'text-success' },
  { label: 'Very strong', bar: 'bg-success', text: 'text-success' },
]

/** Figma "Strength" (4 × 6px bars + label) and "Rules" checklist. */
export function PasswordStrength({ password }: { password: string }) {
  const results = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(password) }))
  const score = results.filter((r) => r.ok).length
  const level = LEVELS[score]

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full gap-1.5">
          {PASSWORD_RULES.map((r, i) => (
            <div key={r.id} className={cn('h-1.5 flex-1 rounded-[3px]', i < score ? level.bar : 'bg-line')} />
          ))}
        </div>
        <div className="flex w-full items-center justify-between text-caption">
          <span className="font-medium text-muted">Password strength</span>
          <span className={cn('font-bold', level.text)} aria-live="polite">
            {level.label}
          </span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-2">
        {results.map((r) => (
          <li key={r.id} className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-[18px] shrink-0 items-center justify-center rounded-[9px]',
                r.ok ? 'bg-success' : 'bg-pearl text-muted',
              )}
            >
              <Icon name={r.ok ? 'auth-check10' : 'auth-x'} size={10} />
            </span>
            <span className={cn('text-caption font-medium', r.ok ? 'text-ink' : 'text-muted')}>
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
