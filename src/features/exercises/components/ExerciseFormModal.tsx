import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import {
  BODY_AREAS,
  EQUIPMENT,
  MUSCLE_GROUPS,
  type BodyArea,
  type Exercise,
  type ExerciseInput,
} from '../types'
import { Field, ModalHeader, Select, TextInput } from './FormControls'

const LEVELS = ['none', 'caution', 'excluded'] as const
type Level = (typeof LEVELS)[number]

const schema = z.object({
  name: z.string().trim().min(2, 'Enter an exercise name'),
  muscle: z.string().trim().min(2, 'Enter the primary muscle'),
  group: z.enum(MUSCLE_GROUPS as [string, ...string[]]),
  equipment: z.enum(EQUIPMENT as [string, ...string[]]),
  duration: z.string().trim().regex(/^\d{1,2}:[0-5]\d$/, 'Use m:ss, e.g. 0:45'),
  tags: z.string(),
  contra: z.object({
    wrist: z.enum(LEVELS),
    knee: z.enum(LEVELS),
    lowerBack: z.enum(LEVELS),
    shoulder: z.enum(LEVELS),
    neck: z.enum(LEVELS),
  }),
})
type FormValues = z.infer<typeof schema>

function toForm(ex?: Exercise): FormValues {
  const contra = Object.fromEntries(BODY_AREAS.map((a) => [a.value, 'none'])) as Record<BodyArea, Level>
  ex?.contraindications.forEach((c) => (contra[c.area] = c.level))
  return {
    name: ex?.name ?? '',
    muscle: ex?.muscle ?? '',
    group: ex?.group ?? 'Chest',
    equipment: ex?.equipment ?? 'Bodyweight',
    duration: ex?.duration ?? '0:40',
    tags: ex?.tags.map((t) => t.label).join(', ') ?? '',
    contra,
  }
}

function fromForm(v: FormValues, image: string | undefined): ExerciseInput {
  return {
    name: v.name,
    muscle: v.muscle,
    group: v.group as ExerciseInput['group'],
    equipment: v.equipment as ExerciseInput['equipment'],
    duration: v.duration,
    image,
    contraindications: BODY_AREAS.filter((a) => v.contra[a.value] !== 'none').map((a) => ({
      area: a.value,
      level: v.contra[a.value] as 'caution' | 'excluded',
    })),
    tags: v.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((label) => ({ label, tone: /swap/i.test(label) ? 'info' : 'success' })),
  }
}

interface ExerciseFormModalProps {
  open: boolean
  /** Exercise to edit; undefined = create. */
  exercise?: Exercise
  saving: boolean
  onClose: () => void
  onSubmit: (input: ExerciseInput) => void
}

export function ExerciseFormModal(props: ExerciseFormModalProps) {
  if (!props.open) return null
  // Keyed so the form resets whenever a different exercise is opened.
  return <ExerciseForm key={props.exercise?.id ?? 'new'} {...props} />
}

function ExerciseForm({ exercise, saving, onClose, onSubmit }: ExerciseFormModalProps) {
  const titleId = useId()
  const [image, setImage] = useState(exercise?.image)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toForm(exercise) })
  const contra = watch('contra')

  const onFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <Modal open onClose={onClose} labelledBy={titleId} className="max-w-[600px]">
      <form onSubmit={handleSubmit((v) => onSubmit(fromForm(v, image)))} className="flex flex-col">
        <ModalHeader
          titleId={titleId}
          title={exercise ? 'Edit Exercise' : 'Add Exercise'}
          subtitle="Movement details, demo media and injury contraindications."
          onClose={onClose}
        />

        <div className="flex max-h-[64vh] flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-[72px] w-[108px] sm:h-[84px] sm:w-[126px] shrink-0 overflow-hidden rounded-[14px] bg-pearl">
              {image ? (
                <img src={image} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-caption font-semibold text-subtle">
                  No media
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-caption font-semibold text-muted">Demo video thumbnail</span>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-xl border border-line px-3.5 py-2 text-caption font-bold text-ink hover:bg-pearl">
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => onFile(e.target.files?.[0])}
                  />
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(undefined)}
                    className="rounded-xl px-3.5 py-2 text-caption font-bold text-cta hover:bg-peach"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <Field label="Name" error={errors.name?.message}>
            <TextInput placeholder="e.g. Goblet Squat" {...register('name')} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Primary muscle" error={errors.muscle?.message}>
              <TextInput placeholder="e.g. Quadriceps" {...register('muscle')} />
            </Field>
            <Field label="Muscle group">
              <Select {...register('group')}>
                {MUSCLE_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </Select>
            </Field>
            <Field label="Equipment">
              <Select {...register('equipment')}>
                {EQUIPMENT.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </Select>
            </Field>
            <Field label="Video length" error={errors.duration?.message}>
              <TextInput placeholder="0:45" {...register('duration')} />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-caption font-semibold text-muted">Contraindications</span>
            <div className="flex flex-col rounded-2xl border border-line">
              {BODY_AREAS.map((a, i) => (
                <div
                  key={a.value}
                  className={cn(
                    'flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-2.5',
                    i > 0 && 'border-t border-line',
                  )}
                >
                  <span className="flex-1 text-body font-semibold text-ink">{a.label}</span>
                  <div className="flex rounded-[10px] bg-pearl p-0.5">
                    {LEVELS.map((level) => {
                      const active = contra[a.value] === level
                      return (
                        <button
                          key={level}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setValue(`contra.${a.value}`, level, { shouldDirty: true })}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-caption font-semibold capitalize transition-colors sm:py-1',
                            !active && 'text-muted hover:text-ink',
                            active && level === 'none' && 'bg-white text-ink shadow-sm',
                            active && level === 'caution' && 'bg-warning-soft text-warning',
                            active && level === 'excluded' && 'bg-peach text-cta',
                          )}
                        >
                          {level}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Field label="Safe tags (comma separated)">
            <TextInput placeholder="e.g. Wrist-safe, Swap target" {...register('tags')} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-4 py-4 sm:px-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {exercise ? 'Save changes' : 'Add Exercise'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
