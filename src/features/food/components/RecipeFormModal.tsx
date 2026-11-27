import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { CATEGORIES, DIETARY_TAGS } from '../constants'
import { Chip } from './Chip'
import type { DietaryTag, MealCategory, Recipe, RecipeInput } from '../types'

const num = (max: number, label: string) =>
  z
    .number({ error: `Enter ${label}` })
    .min(0, `${label[0].toUpperCase()}${label.slice(1)} can't be negative`)
    .max(max, `Max ${max}`)

const schema = z.object({
  nameEn: z.string().trim().min(2, 'Enter the English name'),
  nameFr: z.string().trim(),
  category: z.enum(CATEGORIES.map((c) => c.value) as [MealCategory, ...MealCategory[]]),
  kcal: num(3000, 'calories').int('Whole number'),
  protein: num(500, 'protein'),
  carbs: num(500, 'carbs'),
  fat: num(500, 'fat'),
  cost: num(100, 'a cost'),
  tags: z.array(z.enum(DIETARY_TAGS.map((t) => t.value) as [DietaryTag, ...DietaryTag[]])),
  photo: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface RecipeFormModalProps {
  open: boolean
  /** Recipe being edited, or null to add a new one. */
  recipe: Recipe | null
  saving: boolean
  onClose: () => void
  onSubmit: (input: RecipeInput) => void
}

/** Add / edit recipe form — no Figma frame; built in the admin modal language. */
export function RecipeFormModal({ open, recipe, saving, onClose, onSubmit }: RecipeFormModalProps) {
  const titleId = useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="max-w-[560px]">
      {open && (
        <RecipeForm
          key={recipe?.id ?? 'new'}
          titleId={titleId}
          recipe={recipe}
          saving={saving}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  )
}

function RecipeForm({
  titleId,
  recipe,
  saving,
  onClose,
  onSubmit,
}: Omit<RecipeFormModalProps, 'open'> & { titleId: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: recipe
      ? {
          nameEn: recipe.name.en,
          nameFr: recipe.name.fr ?? '',
          category: recipe.category,
          kcal: recipe.kcal,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fat: recipe.fat,
          cost: recipe.cost,
          tags: recipe.tags,
          photo: recipe.photo,
        }
      : { nameEn: '', nameFr: '', category: 'breakfast', tags: [] },
  })
  const photo = watch('photo')

  const pickPhoto = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setValue('photo', String(reader.result), { shouldDirty: true })
    reader.readAsDataURL(file)
  }

  const submit = (v: FormValues) =>
    onSubmit({
      name: { en: v.nameEn, fr: v.nameFr || undefined },
      category: v.category,
      photo: v.photo,
      kcal: v.kcal,
      protein: v.protein,
      carbs: v.carbs,
      fat: v.fat,
      cost: Math.round(v.cost * 100) / 100,
      tags: v.tags,
    })

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex max-h-[calc(100vh-32px)] flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 id={titleId} className="text-[20px] leading-7 font-bold text-ink sm:text-[22px]">
            {recipe ? 'Edit Recipe' : 'Add New Recipe / Food'}
          </h2>
          <p className="text-body text-muted">
            Both names appear in the MILON app — English and French.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-pearl text-ink transition-colors hover:bg-line"
        >
          <Icon name="x" size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2 sm:px-6">
        <div className="flex items-center gap-4">
          {photo ? (
            <img src={photo} alt="" className="size-[72px] shrink-0 rounded-2xl object-cover" />
          ) : (
            <span className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl bg-pearl text-subtle">
              <Icon name="food" size={28} />
            </span>
          )}
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button className="px-3.5 py-2" onClick={() => fileRef.current?.click()}>
                {photo ? 'Change photo' : 'Upload photo'}
              </Button>
              {photo && (
                <Button
                  variant="ghost"
                  className="px-3.5 py-2 text-muted"
                  onClick={() => setValue('photo', undefined, { shouldDirty: true })}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-caption text-subtle">JPG or PNG, square works best.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              pickPhoto(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name (English)" error={errors.nameEn?.message}>
            <input
              {...register('nameEn')}
              placeholder="e.g. Salmon Rice Bowl"
              className={inputClass(!!errors.nameEn)}
            />
          </Field>
          <Field label="Name (Français)" hint="Optional — can be translated later">
            <input
              {...register('nameFr')}
              placeholder="ex. Bol de riz au saumon"
              className={inputClass(false)}
            />
          </Field>
        </div>

        <Field label="Category" group>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2.5">
                {CATEGORIES.map((c) => (
                  <Chip
                    key={c.value}
                    selected={field.value === c.value}
                    onClick={() => field.onChange(c.value)}
                  >
                    {c.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Calories" error={errors.kcal?.message}>
            <NumberInput suffix="kcal" invalid={!!errors.kcal} {...register('kcal', { valueAsNumber: true })} />
          </Field>
          <Field label="Protein" error={errors.protein?.message}>
            <NumberInput suffix="g" invalid={!!errors.protein} {...register('protein', { valueAsNumber: true })} />
          </Field>
          <Field label="Carbs" error={errors.carbs?.message}>
            <NumberInput suffix="g" invalid={!!errors.carbs} {...register('carbs', { valueAsNumber: true })} />
          </Field>
          <Field label="Fat" error={errors.fat?.message}>
            <NumberInput suffix="g" invalid={!!errors.fat} {...register('fat', { valueAsNumber: true })} />
          </Field>
          <Field label="Est. cost" error={errors.cost?.message}>
            <NumberInput
              suffix="€"
              step="0.05"
              invalid={!!errors.cost}
              {...register('cost', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field label="Dietary tags" group>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2.5">
                {DIETARY_TAGS.map((t) => {
                  const selected = field.value.includes(t.value)
                  return (
                    <Chip
                      key={t.value}
                      selected={selected}
                      onClick={() =>
                        field.onChange(
                          selected
                            ? field.value.filter((v) => v !== t.value)
                            : [...field.value, t.value],
                        )
                      }
                    >
                      {t.label}
                    </Chip>
                  )
                })}
              </div>
            )}
          />
        </Field>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-line px-5 py-4 sm:px-6 sm:py-5">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : recipe ? 'Save Changes' : 'Add Recipe'}
        </Button>
      </div>
    </form>
  )
}

const inputClass = (invalid: boolean) =>
  cn(
    'w-full min-w-0 rounded-xl border bg-white px-3.5 py-[11px] text-body text-ink outline-none placeholder:text-subtle focus:border-subtle',
    invalid ? 'border-cta focus:border-cta' : 'border-line',
  )

function Field({
  label,
  hint,
  error,
  group = false,
  children,
}: {
  label: string
  hint?: string
  error?: string
  /** Render as a non-label wrapper (for chip groups, so clicks don't hit the first chip). */
  group?: boolean
  children: ReactNode
}) {
  const Wrapper = group ? 'div' : 'label'
  return (
    <Wrapper className="flex min-w-0 flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">{label}</span>
      {children}
      {error ? (
        <span className="text-caption text-cta">{error}</span>
      ) : (
        hint && <span className="text-caption text-subtle">{hint}</span>
      )}
    </Wrapper>
  )
}

function NumberInput({
  suffix,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { suffix: string; invalid: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 rounded-xl border bg-white px-3 py-[11px] focus-within:border-subtle',
        invalid ? 'border-cta focus-within:border-cta' : 'border-line',
      )}
    >
      <input
        type="number"
        inputMode="decimal"
        min={0}
        placeholder="0"
        className="w-full min-w-0 bg-transparent text-body text-ink outline-none placeholder:text-subtle [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      <span className="shrink-0 text-caption font-semibold text-subtle">{suffix}</span>
    </span>
  )
}
