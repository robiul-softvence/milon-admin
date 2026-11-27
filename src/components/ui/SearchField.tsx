import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string
}

/** White search input: 18px search icon, 14px placeholder in "subtle", 12px radius. */
export function SearchField({ containerClassName, className, ...props }: SearchFieldProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-[11px] focus-within:border-subtle',
        containerClassName,
      )}
    >
      <Icon name="search" size={18} className="text-muted" />
      <input
        type="search"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden',
          className,
        )}
        {...props}
      />
    </label>
  )
}
