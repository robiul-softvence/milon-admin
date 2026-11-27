import { cn } from '@/lib/cn'

/**
 * Renders a Figma-exported SVG from `src/assets/icons` with its hard-coded
 * stroke/fill colours swapped for `currentColor`, so icons follow the
 * surrounding text colour (e.g. active nav items turn CTA red).
 */
const rawIcons = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const icons: Record<string, string> = {}
for (const [path, svg] of Object.entries(rawIcons)) {
  const name = path.split('/').pop()!.replace('.svg', '')
  icons[name] = svg
    .replace(/(stroke|fill)="#[0-9A-Fa-f]{3,8}"/g, '$1="currentColor"')
    .replace(/ style="display: block;"/, '')
}

export type IconName = string

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className }: IconProps) {
  const svg = icons[name]
  if (!svg && import.meta.env.DEV) console.warn(`[Icon] missing icon "${name}"`)
  return (
    <span
      aria-hidden
      className={cn('inline-flex shrink-0 [&>svg]:block [&>svg]:size-full', className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg ?? '' }}
    />
  )
}
