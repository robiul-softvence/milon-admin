import { useEffect, useRef, useState } from 'react'

/** Open/close state for a popover that closes on outside click or Escape. */
export function usePopover<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return { open, setOpen, ref }
}

export const POPOVER_MENU =
  'absolute top-full right-0 z-30 mt-1.5 min-w-full overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_12px_24px_rgba(17,19,24,0.08)]'
