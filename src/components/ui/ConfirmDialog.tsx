import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  /** Icon name from `src/assets/icons` shown in the 56px icon tile (26px). */
  icon: string
  title: ReactNode
  description?: ReactNode
  /** Extra content between the description and the actions (e.g. a summary card). */
  children?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  /**
   * Figma "Dialog/Confirm": neutral = reversible actions (sign out),
   * destructive = irreversible (delete).
   */
  tone?: 'neutral' | 'destructive'
  loading?: boolean
  /** Override classes for the icon tile / confirm button when a screen differs. */
  iconTileClassName?: string
  confirmClassName?: string
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  icon,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'neutral',
  loading = false,
  iconTileClassName,
  confirmClassName,
}: ConfirmDialogProps) {
  const titleId = useId()
  const destructive = tone === 'destructive'
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="flex flex-col items-center gap-3 px-6 pt-7 pb-5">
        <div
          className={cn(
            'flex size-14 items-center justify-center rounded-[18px]',
            destructive ? 'bg-peach text-cta' : 'bg-pearl text-ink',
            iconTileClassName,
          )}
        >
          <Icon name={icon} size={26} />
        </div>
        <h2 id={titleId} className="w-full text-center text-[22px] leading-7 font-bold text-ink">
          {title}
        </h2>
        {description && <p className="w-full text-center text-body text-muted">{description}</p>}
        {children}
        <div className="h-1 w-2.5" />
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'w-full rounded-2xl py-4 text-base leading-5 font-bold text-white transition-colors disabled:opacity-60',
            destructive ? 'bg-cta hover:bg-[#cc4330]' : 'bg-ink hover:bg-[#2a2d33]',
            confirmClassName,
          )}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl py-3.5 text-base leading-5 font-bold text-ink transition-colors hover:bg-pearl"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  )
}
