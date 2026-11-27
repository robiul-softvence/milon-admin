import { useId, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { SUBSCRIPTION_LABELS, initialsOf, planOf } from '../lib/labels'
import type { User } from '../types'
import { DialogHeader } from './DialogHeader'

/** Figma "Admin Modal 02 · Delete User Confirm" (node 48:1934). */
const DANGER = '#c9332b'

interface DeleteUserDialogProps {
  user: User | null
  onClose: () => void
  onDelete: (user: User) => void
  onSuspend: (user: User) => void
  busy?: boolean
}

function refundLine(user: User) {
  switch (planOf(user.subscription)) {
    case 'pro':
      return `${SUBSCRIPTION_LABELS[user.subscription]} subscription is cancelled immediately`
    case 'trial':
      return 'Free trial ends now — nothing to refund'
    default:
      return 'No active subscription — nothing to refund'
  }
}

export function DeleteUserDialog({ user, onClose, onDelete, onSuspend, busy }: DeleteUserDialogProps) {
  const titleId = useId()
  return (
    <Modal
      open={!!user}
      onClose={onClose}
      labelledBy={titleId}
      className="max-w-[480px] drop-shadow-none shadow-[0px_24px_56px_0px_rgba(17,19,24,0.2)]"
    >
      {/* Keyed so the typed confirmation resets for every user. */}
      {user && <DeleteUserBody key={user.id} titleId={titleId} user={user} onClose={onClose} onDelete={onDelete} onSuspend={onSuspend} busy={busy} />}
    </Modal>
  )
}

function DeleteUserBody({
  user,
  titleId,
  onClose,
  onDelete,
  onSuspend,
  busy,
}: DeleteUserDialogProps & { user: User; titleId: string }) {
  const inputId = useId()
  const [typed, setTyped] = useState('')
  const matches = typed.trim().toLowerCase() === user.email.toLowerCase()

  return (
    <form
      className="flex flex-col gap-[18px] p-5 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault()
        if (matches && !busy) onDelete(user)
      }}
    >
      <DialogHeader
        titleId={titleId}
        title="Delete this user?"
        description="This permanently erases their account (GDPR erasure). It can't be undone."
        leading={<Icon name="trash" size={24} />}
        leadingClassName="bg-[#fde4e0] text-[#c9332b]"
        onClose={onClose}
      />

      <div className="flex w-full items-center gap-3 rounded-2xl bg-pearl p-3.5">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-caption font-medium text-white"
          style={{ backgroundColor: user.avatarColor }}
        >
          {initialsOf(user.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
          <span className="truncate text-body font-semibold text-ink">{user.name}</span>
          <span className="truncate text-caption font-medium text-muted">
            {user.email} · ID #{user.id}
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-caption font-medium text-muted">
          {user.suspended ? 'Suspended' : SUBSCRIPTION_LABELS[user.subscription]}
        </span>
      </div>

      <ul className="flex w-full flex-col gap-2.5">
        {[
          'Profile, health data, weight and check-ins are erased',
          'Workout history and AI Coach chats are erased',
          refundLine(user),
        ].map((line) => (
          <li key={line} className="flex items-center gap-2.5 text-body text-ink">
            <span className="size-1.5 shrink-0 rounded-[3px]" style={{ backgroundColor: DANGER }} />
            {line}
          </li>
        ))}
      </ul>

      <div className="flex w-full flex-col gap-2">
        <label htmlFor={inputId} className="text-body font-semibold text-ink">
          Type the user's email to confirm
        </label>
        <input
          id={inputId}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={user.email}
          className={cn(
            'w-full rounded-xl border-[1.5px] px-3.5 py-[13px] text-body text-ink outline-none placeholder:text-subtle',
            matches ? 'border-[#c9332b]' : 'border-line focus:border-subtle',
          )}
        />
      </div>

      <p className="flex items-center gap-2 text-caption font-medium text-muted">
        <Icon name="info" size={16} />
        This action is recorded in the audit log with your name and time.
      </p>

      <div className="flex w-full flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onSuspend(user)}
          disabled={busy || user.suspended}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-line px-4 py-3.5 text-body font-bold text-ink transition-colors hover:bg-pearl disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="ban" size={16} />
          {user.suspended ? 'Already Suspended' : 'Suspend Instead'}
        </button>
        <div className="flex items-center justify-end gap-2.5 sm:flex-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[14px] px-[18px] py-3.5 sm:flex-none text-body font-bold text-ink transition-colors hover:bg-pearl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!matches || busy}
            className="flex-1 rounded-[14px] bg-[#c9332b] sm:flex-none px-5 py-3.5 text-body font-bold text-white transition-colors hover:bg-[#b02a23] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Deleting…' : 'Delete User'}
          </button>
        </div>
      </div>
    </form>
  )
}
