import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { SearchField } from '@/components/ui/SearchField'
import { downloadCsv } from '@/lib/csv'
import { DeleteUserDialog } from '../components/DeleteUserDialog'
import { MoreFiltersPopover } from '../components/MoreFiltersPopover'
import { Pagination } from '../components/Pagination'
import { PlanChip } from '../components/PlanChip'
import { UserDetailsModal } from '../components/UserDetailsModal'
import { UserFormModal } from '../components/UserFormModal'
import { UserStatsRow } from '../components/UserStatsRow'
import { UsersTable } from '../components/UsersTable'
import {
  useCreateUser,
  useDeleteUser,
  useSuspendUser,
  useUpdateUser,
  useUserStats,
  useUsers,
} from '../hooks/useUsers'
import {
  DEFAULT_MORE_FILTERS,
  applyBaseFilters,
  applyPlan,
  planCounts,
  sortUsers,
} from '../lib/filterUsers'
import { GOAL_LABELS, INJURY_LABELS, SUBSCRIPTION_LABELS } from '../lib/labels'
import type { MoreFilters, PlanFilter, SortKey, User } from '../types'

const PAGE_SIZE = 8

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'nameAsc', label: 'Name A–Z' },
  { value: 'nameDesc', label: 'Name Z–A' },
]

type FormState = { mode: 'closed' } | { mode: 'add' } | { mode: 'edit'; user: User }

export default function UsersPage() {
  const { data: users, isLoading, isError } = useUsers()
  const { data: stats } = useUserStats()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const suspendUser = useSuspendUser()

  const [globalQuery, setGlobalQuery] = useState('')
  const [query, setQuery] = useState('')
  const [plan, setPlan] = useState<PlanFilter>('all')
  const [more, setMore] = useState<MoreFilters>(DEFAULT_MORE_FILTERS)
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)

  const [viewing, setViewing] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)
  const [form, setForm] = useState<FormState>({ mode: 'closed' })

  const base = useMemo(() => applyBaseFilters(users ?? [], query, more), [users, query, more])
  const counts = useMemo(() => planCounts(base), [base])
  const visible = useMemo(() => sortUsers(applyPlan(base, plan), sort), [base, plan, sort])

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const pageRows = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Any change to the result set goes back to page 1.
  const resetting =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v)
      setPage(1)
    }

  const exportCsv = () =>
    downloadCsv(
      'milon-users.csv',
      visible.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        primary_goal: GOAL_LABELS[u.goal],
        injury_flags: u.injuries.map((z) => INJURY_LABELS[z]).join('; '),
        subscription: SUBSCRIPTION_LABELS[u.subscription],
        status: u.suspended ? 'Suspended' : 'Active',
        joined: u.joinedAt,
      })),
    )

  // Keep modals in sync with the latest cached user after mutations.
  const fresh = (u: User | null) => (u ? (users?.find((x) => x.id === u.id) ?? u) : null)

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Search, filter and manage every MILON member."
        actions={
          <>
            <SearchField
              placeholder="Search…"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              containerClassName="w-full sm:w-[260px]"
            />
            <IconButton icon="bell" label="Notifications" />
            <Button icon="download" onClick={exportCsv} disabled={!users || visible.length === 0}>
              Export CSV
            </Button>
            <Button variant="primary" icon="plus" onClick={() => setForm({ mode: 'add' })}>
              Add User
            </Button>
          </>
        }
      />

      <UserStatsRow stats={stats} />

      <Card className="flex w-full flex-col gap-5 p-4 sm:p-6">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap">
          <SearchField
            placeholder="Search by name, email or ID"
            aria-label="Search users"
            value={query}
            onChange={(e) => resetting(setQuery)(e.target.value)}
            containerClassName="w-full sm:w-[340px] sm:shrink-0"
          />
          <div className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 xl:overflow-visible">
          <PlanChip label="All" count={counts.all} active={plan === 'all'} onClick={() => resetting(setPlan)('all')} />
          <PlanChip label="Pro" count={counts.pro} active={plan === 'pro'} onClick={() => resetting(setPlan)('pro')} />
          <PlanChip
            label="Free Trial"
            count={counts.trial}
            active={plan === 'trial'}
            onClick={() => resetting(setPlan)('trial')}
          />
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto xl:ml-0 xl:min-w-0 xl:flex-1 xl:flex-nowrap xl:justify-end">
            <MoreFiltersPopover value={more} onChange={resetting(setMore)} />
            <Dropdown
              value={sort}
              options={SORT_OPTIONS}
              onChange={resetting(setSort)}
              renderLabel={(o) => `Sort: ${o?.label}`}
              className="py-[9px] font-semibold"
            />
          </div>
        </div>

        {isError ? (
          <p className="py-10 text-center text-body text-cta">Couldn't load users. Please try again.</p>
        ) : (
          <UsersTable
            users={pageRows}
            loading={isLoading}
            onView={setViewing}
            onEdit={(user) => setForm({ mode: 'edit', user })}
            onDelete={setDeleting}
          />
        )}

        <Pagination page={currentPage} pageSize={PAGE_SIZE} total={visible.length} onPageChange={setPage} />
      </Card>

      <UserDetailsModal
        user={fresh(viewing)}
        onClose={() => setViewing(null)}
        onEdit={(user) => {
          setViewing(null)
          setForm({ mode: 'edit', user })
        }}
        onDelete={(user) => {
          setViewing(null)
          setDeleting(user)
        }}
        onToggleSuspend={(user) => suspendUser.mutate({ id: user.id, suspended: !user.suspended })}
      />

      <UserFormModal
        open={form.mode !== 'closed'}
        user={form.mode === 'edit' ? form.user : null}
        takenEmails={(users ?? []).map((u) => u.email.toLowerCase())}
        onClose={() => setForm({ mode: 'closed' })}
        onSubmit={(input) =>
          form.mode === 'edit'
            ? updateUser.mutateAsync({ id: form.user.id, input })
            : createUser.mutateAsync(input).then(() => {
                // Show the new member at the top of the list.
                setQuery('')
                setMore(DEFAULT_MORE_FILTERS)
                setPlan('all')
                setSort('newest')
                setPage(1)
              })
        }
      />

      <DeleteUserDialog
        user={fresh(deleting)}
        busy={deleteUser.isPending || suspendUser.isPending}
        onClose={() => setDeleting(null)}
        onDelete={(user) => deleteUser.mutate(user.id, { onSuccess: () => setDeleting(null) })}
        onSuspend={(user) =>
          suspendUser.mutate({ id: user.id, suspended: true }, { onSuccess: () => setDeleting(null) })
        }
      />
    </>
  )
}
