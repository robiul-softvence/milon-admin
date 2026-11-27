import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { promoOffer } from '../lib/promo'
import type { PromoCode, PromoCodeInput, PromoKind } from '../types'

function makeSchema(takenCodes: string[], minLimit: number) {
  return z
    .object({
      code: z
        .string()
        .trim()
        .min(3, 'At least 3 characters')
        .max(20, 'At most 20 characters')
        .regex(/^[A-Za-z0-9_-]+$/, 'Letters, numbers, - and _ only')
        .refine((c) => !takenCodes.includes(c.toUpperCase()), 'This code already exists'),
      kind: z.enum(['percent', 'trial']),
      value: z.string().regex(/^\d+$/, 'Enter a whole number'),
      appliesTo: z.string().trim().min(2, 'Describe who or what this applies to').max(40, 'Keep it short'),
      limit: z
        .string()
        .regex(/^\d*$/, 'Enter a whole number')
        .refine((v) => v === '' || Number(v) >= Math.max(1, minLimit), {
          message: minLimit > 0 ? `Must be at least ${minLimit} (already redeemed)` : 'Must be at least 1',
        }),
      startsAt: z.string(),
      validUntil: z.string(),
      enabled: z.boolean(),
    })
    .superRefine((v, ctx) => {
      const n = Number(v.value)
      if (v.value && v.kind === 'percent' && (n < 1 || n > 100))
        ctx.addIssue({ code: 'custom', path: ['value'], message: 'Between 1 and 100%' })
      if (v.value && v.kind === 'trial' && (n < 1 || n > 90))
        ctx.addIssue({ code: 'custom', path: ['value'], message: 'Between 1 and 90 days' })
      if (v.startsAt && v.validUntil && v.validUntil < v.startsAt)
        ctx.addIssue({ code: 'custom', path: ['validUntil'], message: 'Must be after the start date' })
    })
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>

function toFormValues(p?: PromoCode): FormValues {
  return {
    code: p?.code ?? '',
    kind: p?.kind ?? 'percent',
    value: p ? String(p.value) : '',
    appliesTo: p?.appliesTo ?? '',
    limit: p?.limit != null ? String(p.limit) : '',
    startsAt: p?.startsAt ?? '',
    validUntil: p?.validUntil ?? '',
    enabled: p?.enabled ?? true,
  }
}

function toInput(v: FormValues): PromoCodeInput {
  return {
    code: v.code.trim().toUpperCase(),
    kind: v.kind,
    value: Number(v.value),
    appliesTo: v.appliesTo.trim(),
    limit: v.limit === '' ? null : Number(v.limit),
    startsAt: v.startsAt || null,
    validUntil: v.validUntil || null,
    enabled: v.enabled,
  }
}

const KINDS: { value: PromoKind; label: string }[] = [
  { value: 'percent', label: '% Discount' },
  { value: 'trial', label: 'Free trial' },
]

const inputClass =
  'w-full rounded-xl border border-line bg-white px-3.5 py-[11px] text-body text-ink outline-none placeholder:text-subtle focus:border-subtle aria-[invalid=true]:border-cta'

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-caption font-semibold text-muted">{label}</span>
      {children}
      {error ? (
        <span className="text-caption font-medium text-cta">{error}</span>
      ) : (
        hint && <span className="text-caption font-medium text-subtle">{hint}</span>
      )}
    </label>
  )
}

interface PromoCodeFormModalProps {
  open: boolean
  onClose: () => void
  /** Present when editing. */
  promo?: PromoCode
  existingCodes: string[]
  onSubmit: (input: PromoCodeInput) => Promise<unknown>
}

export function PromoCodeFormModal({ open, onClose, promo, existingCodes, onSubmit }: PromoCodeFormModalProps) {
  const titleId = useId()
  const [serverError, setServerError] = useState<string | null>(null)
  const schema = useMemo(
    () => makeSchema(existingCodes.filter((c) => c !== promo?.code), promo?.redemptions ?? 0),
    [existingCodes, promo],
  )
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(promo) })

  useEffect(() => {
    if (open) {
      reset(toFormValues(promo))
      setServerError(null)
    }
  }, [open, promo, reset])

  const kind = watch('kind')
  const value = watch('value')
  const appliesTo = watch('appliesTo')
  const enabled = watch('enabled')
  const preview = value && appliesTo ? promoOffer({ kind, value: Number(value), appliesTo }) : null

  const submit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      await onSubmit(toInput(values))
      onClose()
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  })

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="max-w-[520px]">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id={titleId} className="text-[22px] leading-7 font-bold text-ink">
              {promo ? 'Edit Promo Code' : 'Create Promo Code'}
            </h2>
            <p className="text-body text-muted">
              {promo ? `${promo.redemptions.toLocaleString('en-US')} redemptions so far` : 'Discounts and free trials for MILON Pro.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-pearl sm:mt-0 sm:mr-0 sm:size-8"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <Field label="Code" error={errors.code?.message}>
          <input
            {...register('code')}
            placeholder="e.g. SPRING27"
            autoFocus
            aria-invalid={!!errors.code}
            className={cn(inputClass, 'font-bold tracking-wide uppercase')}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-caption font-semibold text-muted">Offer type</span>
          <div className="flex gap-1 rounded-xl bg-pearl p-1">
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                aria-pressed={kind === k.value}
                onClick={() => setValue('kind', k.value, { shouldValidate: !!value })}
                className={cn(
                  'flex-1 rounded-[10px] py-2 text-body font-semibold transition-colors',
                  kind === k.value ? 'bg-white text-ink shadow-[0_1px_2px_rgba(17,19,24,0.08)]' : 'text-muted hover:text-ink',
                )}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Field label={kind === 'percent' ? 'Discount (%)' : 'Trial length (days)'} error={errors.value?.message}>
            <input
              {...register('value')}
              inputMode="numeric"
              placeholder={kind === 'percent' ? '25' : '14'}
              aria-invalid={!!errors.value}
              className={inputClass}
            />
          </Field>
          <Field label="Applies to" error={errors.appliesTo?.message}>
            <input
              {...register('appliesTo')}
              placeholder={kind === 'percent' ? 'Annual plan' : 'new users'}
              aria-invalid={!!errors.appliesTo}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Field label="Redemption limit" error={errors.limit?.message} hint="Leave empty for unlimited">
            <input
              {...register('limit')}
              inputMode="numeric"
              placeholder="Unlimited"
              aria-invalid={!!errors.limit}
              className={inputClass}
            />
          </Field>
          <Field label="Starts on" error={errors.startsAt?.message} hint="Empty = immediately">
            <input type="date" {...register('startsAt')} className={inputClass} />
          </Field>
          <Field label="Valid until" error={errors.validUntil?.message} hint="Empty = no expiry">
            <input
              type="date"
              {...register('validUntil')}
              aria-invalid={!!errors.validUntil}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-pearl px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-body font-semibold text-ink">Enabled</span>
            <span className="text-caption font-medium text-muted">
              {preview ? `Preview: ${preview}` : 'Paused codes cannot be redeemed.'}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Enabled"
            onClick={() => setValue('enabled', !enabled)}
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full transition-colors',
              enabled ? 'bg-success' : 'bg-subtle',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform',
                enabled && 'translate-x-5',
              )}
            />
          </button>
        </div>

        {serverError && <p className="text-caption font-semibold text-cta">{serverError}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : promo ? 'Save Changes' : 'Create Promo Code'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
