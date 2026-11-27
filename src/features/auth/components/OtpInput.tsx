import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  /** Called once all digits are filled. */
  onComplete?: (value: string) => void
  length?: number
  invalid?: boolean
  autoFocus?: boolean
}

/**
 * Figma "OTP": six 60px cells, 10px gap, 14px radius.
 * Filled → white + 1px ink border · active → pearl + 2px CTA border + CTA caret · empty → pearl.
 * Supports auto-advance, backspace to previous, arrow keys and pasting the whole code.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  invalid,
  autoFocus,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [focused, setFocused] = useState<number | null>(null)
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')
  // Latest committed value: focus moves happen before the parent re-renders.
  const valueRef = useRef(value)
  valueRef.current = value

  const focus = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))]
    el?.focus()
    el?.select()
  }

  const commit = (next: string[]) => {
    const joined = next.join('').slice(0, length)
    valueRef.current = joined
    onChange(joined)
    if (joined.length === length && !joined.includes(' ')) onComplete?.(joined)
  }

  const fillFrom = (start: number, raw: string) => {
    const incoming = raw.replace(/\D/g, '')
    if (!incoming) return
    const next = [...digits]
    // Keep the string contiguous: never write past the first empty cell.
    let i = Math.min(start, value.length)
    for (const ch of incoming) {
      if (i >= length) break
      next[i++] = ch
    }
    commit(next)
    focus(i >= length ? length - 1 : i)
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...digits]
      if (next[i]) {
        // Remove this digit and shift the rest left so the value stays contiguous.
        next.splice(i, 1)
        next.push('')
        commit(next)
      } else if (i > 0) {
        next.splice(i - 1, 1)
        next.push('')
        commit(next)
        focus(i - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focus(i - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focus(Math.min(i + 1, value.length))
    }
  }

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    fillFrom(i, e.clipboardData.getData('text'))
  }

  return (
    <div className="flex w-full gap-2 sm:gap-2.5" role="group" aria-label="Verification code">
      {digits.map((d, i) => {
        const active = focused === i
        return (
          <div
            key={i}
            className={cn(
              'relative flex h-[52px] min-w-0 sm:h-[60px] flex-1 items-center justify-center rounded-[14px]',
              active
                ? cn('bg-pearl shadow-[inset_0_0_0_2px_var(--color-cta)]', d && 'bg-white')
                : d
                  ? invalid
                    ? 'bg-white shadow-[inset_0_0_0_1.5px_var(--color-cta)]'
                    : 'bg-white shadow-[inset_0_0_0_1px_var(--color-ink)]'
                  : 'bg-pearl',
            )}
          >
            <input
              ref={(el) => {
                refs.current[i] = el
              }}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              autoFocus={autoFocus && i === 0}
              maxLength={length}
              aria-label={`Digit ${i + 1}`}
              onFocus={(e) => {
                // Jump to the first empty cell so digits always stay in order.
                if (i > valueRef.current.length) return focus(valueRef.current.length)
                setFocused(i)
                e.currentTarget.select()
              }}
              onBlur={() => setFocused((f) => (f === i ? null : f))}
              onChange={(e) => fillFrom(i, e.target.value.replace(d, '') || e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              className="absolute inset-0 size-full rounded-[14px] bg-transparent text-center text-num-m text-ink caret-transparent outline-none selection:bg-transparent"
            />
            {active && !d && (
              <span aria-hidden className="pointer-events-none h-6 w-0.5 animate-pulse rounded-[1px] bg-cta" />
            )}
          </div>
        )
      })}
    </div>
  )
}
