import { useId, type ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { formatJoined, initialsOf } from '../lib/labels'
import type { User } from '../types'
import { DialogHeader } from './DialogHeader'
import { GoalLabel } from './GoalLabel'
import { InjuryPills } from './InjuryPills'
import { SubscriptionPill } from './SubscriptionPill'

interface UserDetailsModalProps {
  user: User | null
  onClose: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onToggleSuspend: (user: User) => void
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <span className="text-body text-muted">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center justify-end">{children}</div>
    </div>
  )
}

export function UserDetailsModal({ user, onClose, onEdit, onDelete, onToggleSuspend }: UserDetailsModalProps) {
  const titleId = useId()
  return (
    <Modal
      open={!!user}
      onClose={onClose}
      labelledBy={titleId}
      className="max-w-[480px] drop-shadow-none shadow-[0px_24px_56px_0px_rgba(17,19,24,0.2)]"
    >
      {user && (
        <div className="flex flex-col gap-[18px] p-5 sm:p-7">
          <DialogHeader
            titleId={titleId}
            title={user.name}
            description={`${user.email} · ID #${user.id}`}
            leading={<span className="text-base font-bold text-white">{initialsOf(user.name)}</span>}
            leadingClassName="rounded-full"
            leadingStyle={{ backgroundColor: user.avatarColor }}
            onClose={onClose}
          />

          <div className="flex flex-col rounded-2xl bg-pearl px-4">
            <Row label="Primary goal">
              <GoalLabel goal={user.goal} />
            </Row>
            <Row label="Subscription">
              <SubscriptionPill subscription={user.subscription} />
            </Row>
            <Row label="Injury flags">
              <InjuryPills injuries={user.injuries} />
            </Row>
            <Row label="Joined">
              <span className="text-body text-ink">{formatJoined(user.joinedAt)}</span>
            </Row>
            <Row label="Account status">
              <span className={user.suspended ? 'text-body font-semibold text-cta' : 'text-body font-semibold text-success'}>
                {user.suspended ? 'Suspended' : 'Active'}
              </span>
            </Row>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 sm:flex-nowrap">
            <button
              type="button"
              onClick={() => onToggleSuspend(user)}
              className="rounded-[14px] border border-line px-4 py-3.5 text-body font-bold text-ink transition-colors hover:bg-pearl"
            >
              {user.suspended ? 'Reactivate' : 'Suspend'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(user)}
              className="rounded-[14px] px-4 py-3.5 text-body font-bold text-[#c9332b] transition-colors hover:bg-[#fde4e0]"
            >
              Delete
            </button>
            <div className="hidden flex-1 sm:block" />
            <button
              type="button"
              onClick={() => onEdit(user)}
              className="w-full rounded-[14px] bg-ink px-5 sm:w-auto py-3.5 text-body font-bold text-white transition-colors hover:bg-[#2a2d33]"
            >
              Edit User
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
