import { cn } from '@/lib/cn'

interface AvatarProps {
  initials: string
  /** Background colour (hex or CSS colour). */
  color?: string
  size?: number
  className?: string
}

/** Circular initials avatar. 36px / 13px text in tables, 40px / 14px in the sidebar. */
export function Avatar({ initials, color = '#111318', size = 36, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size >= 40 ? 14 : 13,
        lineHeight: size >= 40 ? '20px' : '16px',
      }}
    >
      {initials}
    </span>
  )
}
