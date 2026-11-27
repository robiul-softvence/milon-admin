import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about our custom type presets so `text-h1` is treated
// as a font-size (not a color) and never collides with `text-ink` etc.
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['h1', 'h3', 'body', 'caption', 'overline', 'num-l', 'num-m'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs))
}
