import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { useConfigureIntegration } from '../hooks/useAiSettings'
import type { Integration } from '../types'

const MISTRAL_MODELS = ['mistral-large', 'mistral-medium', 'mistral-small'] as const

const schema = z.object({
  apiKey: z
    .string()
    .trim()
    .refine((v) => v === '' || v.length >= 12, 'Key must be at least 12 characters'),
  limit: z
    .number({ error: 'Enter a monthly limit' })
    .int('Use a whole number')
    .positive('Limit must be greater than 0'),
  model: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  integration: Integration | null
  onClose: () => void
}

/** Edit an integration's API key, monthly quota and (LLM only) model. */
export function ConfigureIntegrationModal({ integration, onClose }: Props) {
  const titleId = useId()
  const configure = useConfigureIntegration()
  const [showKey, setShowKey] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!integration) return
    reset({ apiKey: '', limit: integration.usage.limit, model: integration.model })
    setShowKey(false)
    configure.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integration, reset])

  if (!integration) return null
  const unit = integration.usage.unit

  const onSubmit = handleSubmit((values) =>
    configure.mutate(
      {
        id: integration.id,
        input: { apiKey: values.apiKey || undefined, limit: values.limit, model: values.model },
      },
      { onSuccess: onClose },
    ),
  )

  return (
    <Modal open onClose={onClose} labelledBy={titleId} className="max-w-[460px]">
      <form onSubmit={onSubmit} className="flex flex-col gap-5 p-5 sm:p-6" noValidate>
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: integration.color }}
          >
            <span className="text-[18px] leading-6 font-extrabold text-white">{integration.initial}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id={titleId} className="text-h3 text-ink">
              Configure {integration.name}
            </h2>
            <p className="text-caption font-medium text-muted">{integration.description}</p>
          </div>
        </div>

        <Field label="API key" hint={`Current: ${integration.maskedKey}`} error={errors.apiKey?.message}>
          <div className={inputBox(!!errors.apiKey)}>
            <Icon name="key" size={16} className="shrink-0 text-muted" />
            <input
              {...register('apiKey')}
              type={showKey ? 'text' : 'password'}
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste a new key to rotate"
              className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-subtle"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
              className="-m-1.5 inline-flex shrink-0 p-1.5 text-muted hover:text-ink"
            >
              <Icon name={showKey ? 'ai-eye-off' : 'eye'} size={16} />
            </button>
          </div>
        </Field>

        <Field label={`Monthly limit (${unit})`} error={errors.limit?.message}>
          <div className={inputBox(!!errors.limit)}>
            <input
              {...register('limit', { valueAsNumber: true })}
              type="number"
              min={1}
              step={1}
              className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none"
            />
            <span className="shrink-0 text-caption font-medium text-muted">{unit}</span>
          </div>
        </Field>

        {integration.model !== undefined && (
          <Field label="Model">
            <div className={inputBox(false)}>
              <select
                {...register('model')}
                className="min-w-0 flex-1 cursor-pointer bg-transparent text-body text-ink outline-none"
              >
                {MISTRAL_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        )}

        {configure.isError && (
          <p className="text-caption font-medium text-cta">Couldn't save the configuration. Try again.</p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end [&>button]:w-full sm:[&>button]:w-auto">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!isDirty || configure.isPending}>
            {configure.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function inputBox(invalid: boolean) {
  return cn(
    'flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-2.5 focus-within:border-ink',
    invalid ? 'border-cta' : 'border-line',
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">{label}</span>
      {children}
      {error ? (
        <span className="text-caption font-medium text-cta">{error}</span>
      ) : (
        hint && <span className="text-caption font-medium text-muted">{hint}</span>
      )}
    </label>
  )
}
