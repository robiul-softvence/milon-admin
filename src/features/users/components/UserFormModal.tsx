import { useId } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { GOAL_COLORS, GOAL_LABELS, INJURY_LABELS, SUBSCRIPTION_LABELS } from '../lib/labels'
import type { Goal, InjuryZone, Subscription, User, UserInput } from '../types'
import { DialogHeader } from './DialogHeader'

const GOALS = Object.keys(GOAL_LABELS) as [Goal, ...Goal[]]
const SUBSCRIPTIONS = Object.keys(SUBSCRIPTION_LABELS) as [Subscription, ...Subscription[]]
const ZONES = Object.keys(INJURY_LABELS) as [InjuryZone, ...InjuryZone[]]

const schema = z.object({
  name: z.string().trim().min(2, 'Enter the member’s full name').max(60, 'Keep it under 60 characters'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  goal: z.enum(GOALS),
  subscription: z.enum(SUBSCRIPTIONS),
  injuries: z.array(z.enum(ZONES)),
})

type FormValues = z.infer<typeof schema>

interface UserFormModalProps {
  open: boolean
  /** When set, the form edits this user; otherwise it creates a new one. */
  user?: User | null
  /** Emails already in use (lower-case), to block duplicates. */
  takenEmails: string[]
  onClose: () => void
  onSubmit: (input: UserInput) => Promise<unknown>
}

export function UserFormModal(props: UserFormModalProps) {
  const titleId = useId()
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      labelledBy={titleId}
      className="max-w-[520px] drop-shadow-none shadow-[0px_24px_56px_0px_rgba(17,19,24,0.2)]"
    >
      {props.open && <UserForm key={props.user?.id ?? 'new'} titleId={titleId} {...props} />}
    </Modal>
  )
}

const fieldLabel = 'text-body font-semibold text-ink'
const inputBase =
  'w-full rounded-xl border-[1.5px] px-3.5 py-[13px] text-body text-ink outline-none placeholder:text-subtle'

function chip(active: boolean) {
  return cn(
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors',
    active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:bg-pearl',
  )
}

function UserForm({ user, takenEmails, onClose, onSubmit, titleId }: UserFormModalProps & { titleId: string }) {
  const isEdit = !!user
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      goal: user?.goal ?? 'loseWeight',
      subscription: user?.subscription ?? 'trial',
      injuries: user?.injuries ?? [],
    },
  })

  const submit = handleSubmit(async (values) => {
    if (takenEmails.includes(values.email) && values.email !== user?.email.toLowerCase()) {
      setError('email', { message: 'Another member already uses this email' })
      return
    }
    await onSubmit(values)
    onClose()
  })

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-[18px] p-5 sm:p-7">
      <DialogHeader
        titleId={titleId}
        title={isEdit ? 'Edit user' : 'Add a new user'}
        description={
          isEdit ? `Update ${user.name}'s profile and plan · ID #${user.id}` : 'Create a MILON member account. They’ll get an invite email to set a password.'
        }
        leading={<Icon name={isEdit ? 'edit' : 'plus'} size={24} />}
        leadingClassName="bg-peach text-cta"
        onClose={onClose}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="user-name" className={fieldLabel}>
          Full name
        </label>
        <input
          id="user-name"
          autoFocus
          placeholder="e.g. Camille Roux"
          aria-invalid={!!errors.name}
          className={cn(inputBase, errors.name ? 'border-[#c9332b]' : 'border-line focus:border-subtle')}
          {...register('name')}
        />
        {errors.name && <p className="text-caption font-medium text-[#c9332b]">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="user-email" className={fieldLabel}>
          Email
        </label>
        <input
          id="user-email"
          type="email"
          placeholder="name@example.com"
          aria-invalid={!!errors.email}
          className={cn(inputBase, errors.email ? 'border-[#c9332b]' : 'border-line focus:border-subtle')}
          {...register('email')}
        />
        {errors.email && <p className="text-caption font-medium text-[#c9332b]">{errors.email.message}</p>}
      </div>

      <Controller
        control={control}
        name="goal"
        render={({ field }) => (
          <fieldset className="flex flex-col gap-2">
            <legend className={cn(fieldLabel, 'mb-2')}>Primary goal</legend>
            <div className="flex flex-wrap gap-1.5">
              {GOALS.map((g) => (
                <button key={g} type="button" aria-pressed={field.value === g} onClick={() => field.onChange(g)} className={chip(field.value === g)}>
                  <span className="size-2 rounded-full" style={{ backgroundColor: GOAL_COLORS[g] }} />
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      />

      <Controller
        control={control}
        name="subscription"
        render={({ field }) => (
          <fieldset className="flex flex-col gap-2">
            <legend className={cn(fieldLabel, 'mb-2')}>Subscription</legend>
            <div className="flex flex-wrap gap-1.5">
              {SUBSCRIPTIONS.map((s) => (
                <button key={s} type="button" aria-pressed={field.value === s} onClick={() => field.onChange(s)} className={chip(field.value === s)}>
                  {SUBSCRIPTION_LABELS[s]}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      />

      <Controller
        control={control}
        name="injuries"
        render={({ field }) => (
          <fieldset className="flex flex-col gap-2">
            <legend className={cn(fieldLabel, 'mb-2')}>
              Injury flags <span className="font-normal text-muted">· optional</span>
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {ZONES.map((z) => {
                const on = field.value.includes(z)
                return (
                  <button
                    key={z}
                    type="button"
                    aria-pressed={on}
                    onClick={() => field.onChange(on ? field.value.filter((x) => x !== z) : [...field.value, z])}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors',
                      on ? 'border-peach bg-peach text-cta' : 'border-line bg-white text-ink hover:bg-pearl',
                    )}
                  >
                    {INJURY_LABELS[z]}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}
      />

      <div className="flex w-full items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-[14px] px-[18px] py-3.5 text-body font-bold text-ink transition-colors hover:bg-pearl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[14px] bg-cta px-5 py-3.5 text-body font-bold text-white transition-colors hover:bg-[#cc4330] disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add User'}
        </button>
      </div>
    </form>
  )
}
