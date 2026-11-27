import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { Cell, TableHeader, TableRow, TableScroll } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import { formatJoined, initialsOf } from '../lib/labels'
import type { User } from '../types'
import { GoalLabel } from './GoalLabel'
import { InjuryPills } from './InjuryPills'
import { SubscriptionPill } from './SubscriptionPill'

/** Column widths from Figma (User column flexes). */
const COL = {
  user: 'min-w-0 flex-1',
  email: 'w-[184px]',
  goal: 'w-[120px]',
  injury: 'w-[164px]',
  subscription: 'w-[124px]',
  joined: 'w-[100px]',
  actions: 'w-[108px]',
}

interface UsersTableProps {
  users: User[]
  loading?: boolean
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ users, loading, onView, onEdit, onDelete }: UsersTableProps) {
  return (
    <TableScroll minWidth={1040} role="region" aria-label="Users" tabIndex={0}>
      <TableHeader className="gap-3">
        <Cell role="columnheader" className={COL.user}>User</Cell>
        <Cell role="columnheader" className={COL.email}>Email</Cell>
        <Cell role="columnheader" className={COL.goal}>Primary Goal</Cell>
        <Cell role="columnheader" className={COL.injury}>Injury Flags</Cell>
        <Cell role="columnheader" className={COL.subscription}>Subscription</Cell>
        <Cell role="columnheader" className={COL.joined}>Joined</Cell>
        <Cell role="columnheader" className={COL.actions}>Actions</Cell>
      </TableHeader>

      {loading &&
        Array.from({ length: 8 }).map((_, i) => (
          <TableRow key={i} className="h-[65px] animate-pulse gap-3">
            <div className="h-9 flex-1 rounded-lg bg-pearl" />
          </TableRow>
        ))}

      {!loading && users.length === 0 && (
        <div className="flex flex-col items-center gap-1 border-b border-line py-14 text-center">
          <p className="text-body font-semibold text-ink">No users match these filters</p>
          <p className="text-caption text-muted">Try a different search or reset the filters.</p>
        </div>
      )}

      {!loading &&
        users.map((u) => (
          <TableRow key={u.id} className="gap-3">
            <Cell className={COL.user}>
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar initials={initialsOf(u.name)} color={u.avatarColor} />
                <div className="flex min-w-0 flex-col whitespace-nowrap">
                  <span className="truncate text-body font-semibold text-ink">{u.name}</span>
                  <span className="text-caption font-medium text-subtle">
                    ID #{u.id}
                    {u.suspended && <span className="text-cta"> · Suspended</span>}
                  </span>
                </div>
              </div>
            </Cell>
            <Cell className={COL.email}>
              <span className="truncate text-[13px] leading-5 text-muted" title={u.email}>
                {u.email}
              </span>
            </Cell>
            <Cell className={COL.goal}>
              <GoalLabel goal={u.goal} />
            </Cell>
            <Cell className={COL.injury}>
              <InjuryPills injuries={u.injuries} />
            </Cell>
            <Cell className={COL.subscription}>
              <SubscriptionPill subscription={u.subscription} />
            </Cell>
            <Cell className={cn(COL.joined, 'text-body whitespace-nowrap text-muted')}>{formatJoined(u.joinedAt)}</Cell>
            <Cell className={cn(COL.actions, 'gap-1.5')}>
              <RowAction icon="eye" label={`View ${u.name}`} onClick={() => onView(u)} />
              <RowAction icon="edit" label={`Edit ${u.name}`} onClick={() => onEdit(u)} />
              <RowAction icon="ban" label={`Delete ${u.name}`} onClick={() => onDelete(u)} danger />
            </Cell>
          </TableRow>
        ))}
    </TableScroll>
  )
}

function RowAction({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: string
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg transition-colors',
        danger ? 'bg-peach text-cta hover:bg-[#ffd9ce]' : 'bg-pearl text-ink hover:bg-line',
      )}
    >
      <Icon name={icon} size={16} />
    </button>
  )
}
