import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { BODY_AREAS, type BodyArea, type InjuryRule, type InjuryRuleInput } from '../types'
import { Field, ModalHeader, Select, TextInput } from './FormControls'
import { Toggle } from './Toggle'

const count = z.number({ error: 'Enter a number' }).int().min(0, 'Must be 0 or more')

const schema = z.object({
  name: z.string().trim().min(2, 'Enter a rule name'),
  area: z.enum(BODY_AREAS.map((a) => a.value) as [BodyArea, ...BodyArea[]]),
  enabled: z.boolean(),
  excludedCount: count,
  swapCount: count,
  swaps: z.array(
    z.object({
      from: z.string().trim().min(1, 'Required'),
      to: z.string().trim().min(1, 'Required'),
    }),
  ),
})
type FormValues = z.infer<typeof schema>

interface RuleFormModalProps {
  open: boolean
  rule?: InjuryRule
  /** Exercise names offered as suggestions for swap pairs. */
  exerciseNames: string[]
  /** Prefill counts for a new rule from the library. */
  suggestCounts: (area: BodyArea) => { excludedCount: number; swapCount: number }
  saving: boolean
  onClose: () => void
  onSubmit: (input: InjuryRuleInput) => void
  onDelete?: (rule: InjuryRule) => void
}

export function RuleFormModal(props: RuleFormModalProps) {
  if (!props.open) return null
  return <RuleForm key={props.rule?.id ?? 'new'} {...props} />
}

function RuleForm({ rule, exerciseNames, suggestCounts, saving, onClose, onSubmit, onDelete }: RuleFormModalProps) {
  const titleId = useId()
  const listId = useId()
  const initialArea: BodyArea = rule?.area ?? 'wrist'
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: rule
      ? { ...rule }
      : { name: '', area: initialArea, enabled: true, swaps: [], ...suggestCounts(initialArea) },
  })
  const swaps = useFieldArray({ control, name: 'swaps' })
  const enabled = watch('enabled')

  return (
    <Modal open onClose={onClose} labelledBy={titleId} className="max-w-[520px]">
      <form onSubmit={handleSubmit((v) => onSubmit(v))} className="flex flex-col">
        <ModalHeader
          titleId={titleId}
          title={rule ? 'Edit Injury Rule' : 'New Injury Rule'}
          subtitle="The AI planner excludes contraindicated moves and swaps in safe alternatives."
          onClose={onClose}
        />
        <div className="flex max-h-[64vh] flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Rule name" error={errors.name?.message}>
              <TextInput placeholder="e.g. Wrists & Hands" {...register('name')} />
            </Field>
            <Field label="Body area">
              <Select
                {...register('area', {
                  onChange: (e) => {
                    if (rule) return
                    const c = suggestCounts(e.target.value as BodyArea)
                    setValue('excludedCount', c.excludedCount)
                    setValue('swapCount', c.swapCount)
                  },
                })}
              >
                {BODY_AREAS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Excluded exercises" error={errors.excludedCount?.message}>
              <TextInput type="number" min={0} {...register('excludedCount', { valueAsNumber: true })} />
            </Field>
            <Field label="Auto-swaps" error={errors.swapCount?.message}>
              <TextInput type="number" min={0} {...register('swapCount', { valueAsNumber: true })} />
            </Field>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-pearl px-3.5 py-3">
            <div className="flex flex-1 flex-col">
              <span className="text-body font-bold text-ink">Apply automatically</span>
              <span className="text-caption font-medium text-muted">
                When off, the AI planner ignores this rule.
              </span>
            </div>
            <Toggle
              checked={enabled}
              onChange={(v) => setValue('enabled', v, { shouldDirty: true })}
              label="Apply automatically"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-caption font-semibold text-muted">Example auto-swaps</span>
            <datalist id={listId}>
              {exerciseNames.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            {swaps.fields.map((f, i) => (
              <div key={f.id} className="flex items-start gap-2">
                <TextInput
                  list={listId}
                  placeholder="Avoid…"
                  aria-label="Exercise to avoid"
                  aria-invalid={!!errors.swaps?.[i]?.from}
                  className="min-w-0 flex-1 aria-invalid:border-cta"
                  {...register(`swaps.${i}.from`)}
                />
                <Icon name="arrowR" size={16} className="mt-3.5 shrink-0 text-muted" />
                <TextInput
                  list={listId}
                  placeholder="Swap to…"
                  aria-label="Safe alternative"
                  aria-invalid={!!errors.swaps?.[i]?.to}
                  className="min-w-0 flex-1 aria-invalid:border-cta"
                  {...register(`swaps.${i}.to`)}
                />
                <button
                  type="button"
                  onClick={() => swaps.remove(i)}
                  aria-label="Remove swap"
                  className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-pearl hover:text-cta"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => swaps.append({ from: '', to: '' })}
              className="flex items-center gap-1.5 self-start text-body font-semibold text-cta hover:underline"
            >
              <Icon name="plus-sm" size={16} />
              Add swap
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-4 sm:flex-nowrap sm:px-6">
          {rule && onDelete && (
            <Button variant="ghost" icon="trash" className="w-full text-cta hover:bg-peach sm:w-auto" onClick={() => onDelete(rule)}>
              Delete rule
            </Button>
          )}
          <div className="hidden flex-1 sm:block" />
          <Button variant="ghost" className="flex-1 sm:flex-none" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1 sm:flex-none" disabled={saving}>
            {rule ? 'Save rule' : 'Create rule'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
