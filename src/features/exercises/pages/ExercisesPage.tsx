import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconButton } from '@/components/ui/IconButton'
import { SearchField } from '@/components/ui/SearchField'
import { TableScroll } from '@/components/ui/Table'
import { Chip } from '../components/Chip'
import { ExerciseCard } from '../components/ExerciseCard'
import { ExerciseFormModal } from '../components/ExerciseFormModal'
import { ExerciseListRow } from '../components/ExerciseListRow'
import { ExercisePreviewModal } from '../components/ExercisePreviewModal'
import { FilterSelect } from '../components/FilterSelect'
import { InjuryRulesPanel } from '../components/InjuryRulesPanel'
import { RuleFormModal } from '../components/RuleFormModal'
import { ViewToggle } from '../components/ViewToggle'
import {
  useDeleteExercise,
  useDeleteInjuryRule,
  useExercises,
  useInjuryRules,
  useSaveExercise,
  useSaveInjuryRule,
  useToggleInjuryRule,
} from '../hooks/useExercises'
import {
  BODY_AREAS,
  EQUIPMENT,
  MUSCLE_GROUPS,
  type BodyArea,
  type Equipment,
  type Exercise,
  type ExerciseInput,
  type InjuryRule,
  type InjuryRuleInput,
  type LibraryView,
  type MuscleGroup,
} from '../types'

const PAGE_SIZE = 6
/** Chips shown in the Figma filter bar ("Full Body" is reachable via search). */
const CHIP_GROUPS = MUSCLE_GROUPS.filter((g) => g !== 'Full Body')

type ExerciseModal = { mode: 'create' } | { mode: 'edit'; exercise: Exercise } | null
type RuleModal = { mode: 'create' } | { mode: 'edit'; rule: InjuryRule } | null

export default function ExercisesPage() {
  const { data: exercises, isLoading, isError } = useExercises()
  const { data: rules } = useInjuryRules()
  const saveExercise = useSaveExercise()
  const deleteExercise = useDeleteExercise()
  const saveRule = useSaveInjuryRule()
  const toggleRule = useToggleInjuryRule()
  const deleteRule = useDeleteInjuryRule()

  const [view, setView] = useState<LibraryView>('grid')
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<MuscleGroup | null>(null)
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [contra, setContra] = useState<BodyArea | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const [exerciseModal, setExerciseModal] = useState<ExerciseModal>(null)
  const [preview, setPreview] = useState<Exercise | null>(null)
  const [toDelete, setToDelete] = useState<Exercise | null>(null)
  const [ruleModal, setRuleModal] = useState<RuleModal>(null)
  const [ruleToDelete, setRuleToDelete] = useState<InjuryRule | null>(null)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)

  // Any filter change starts the list from the first page again.
  const withReset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v)
      setVisible(PAGE_SIZE)
    }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (exercises ?? []).filter(
      (e) =>
        (!group || e.group === group) &&
        (!equipment || e.equipment === equipment) &&
        (!contra || e.contraindications.some((c) => c.area === contra)) &&
        (!q || [e.name, e.muscle, e.group, e.equipment].some((s) => s.toLowerCase().includes(q))),
    )
  }, [exercises, query, group, equipment, contra])

  const shown = filtered.slice(0, visible)
  const total = exercises?.length ?? 0

  const inactiveAreas = useMemo(
    () => new Set((rules ?? []).filter((r) => !r.enabled).map((r) => r.area)),
    [rules],
  )

  const suggestCounts = (area: BodyArea) => {
    const list = exercises ?? []
    return {
      excludedCount: list.filter((e) => e.contraindications.some((c) => c.area === area && c.level === 'excluded')).length,
      swapCount: list.filter((e) => e.tags.some((t) => t.tone === 'info')).length,
    }
  }

  const submitExercise = (input: ExerciseInput) => {
    const vars = exerciseModal?.mode === 'edit' ? { ...input, id: exerciseModal.exercise.id } : input
    saveExercise.mutate(vars, { onSuccess: () => setExerciseModal(null) })
  }

  const submitRule = (input: InjuryRuleInput) => {
    const vars = ruleModal?.mode === 'edit' ? { ...input, id: ruleModal.rule.id } : input
    saveRule.mutate(vars, {
      onSuccess: (rule) => {
        setSelectedRuleId(rule.id)
        setRuleModal(null)
      },
    })
  }

  const cardProps = (exercise: Exercise) => ({
    exercise,
    inactiveAreas,
    onPreview: () => setPreview(exercise),
    onEdit: () => setExerciseModal({ mode: 'edit', exercise }),
    onDelete: () => setToDelete(exercise),
  })

  return (
    <>
      <PageHeader
        title="Exercise Library & Injury Rules"
        subtitle="Every movement, its equipment, and when the AI must avoid it."
        actions={
          <>
            <IconButton icon="bell" label="Notifications" />
            <ViewToggle value={view} onChange={setView} />
            <Button variant="primary" icon="plus" onClick={() => setExerciseModal({ mode: 'create' })}>
              Add Exercise
            </Button>
          </>
        }
      />

      <div className="flex w-full flex-col gap-5 xl:flex-row xl:items-start">
        <Card className="flex min-w-0 flex-col gap-5 p-4 sm:p-6 xl:flex-1">
          <div className="flex w-full flex-wrap items-center gap-2.5">
            <SearchField
              placeholder={`Search ${total} exercises`}
              value={query}
              onChange={(e) => withReset(setQuery)(e.target.value)}
              containerClassName="w-full sm:w-[240px]"
              aria-label="Search exercises"
            />
            {/* Phones: chips scroll sideways in their own row; from sm the wrapper dissolves into the wrap row. */}
            <div className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] sm:contents">
              <Chip label="All" selected={!group} onClick={() => withReset(setGroup)(null)} />
              {CHIP_GROUPS.map((g) => (
                <Chip key={g} label={g} selected={group === g} onClick={() => withReset(setGroup)(group === g ? null : g)} />
              ))}
            </div>
            <FilterSelect
              placeholder="Equipment"
              allLabel="All equipment"
              value={equipment}
              options={EQUIPMENT.map((e) => ({ value: e, label: e }))}
              onChange={withReset(setEquipment)}
              className="w-full sm:w-auto"
            />
            <FilterSelect
              placeholder="Contraindication"
              allLabel="Any body area"
              icon="shield-sm"
              value={contra}
              options={BODY_AREAS}
              onChange={withReset(setContra)}
              className="w-full sm:w-auto"
            />
          </div>

          {isError && <p className="text-body text-cta">Couldn't load exercises. Please try again.</p>}

          {isLoading ? (
            <div className="grid w-full animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="h-[234px] rounded-[20px] bg-pearl" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="flex w-full flex-col items-center gap-2 rounded-[20px] border border-dashed border-line py-16 text-center">
              <p className="text-body font-bold text-ink">No exercises match these filters</p>
              <button
                type="button"
                className="text-body font-semibold text-cta hover:underline"
                onClick={() => {
                  setQuery('')
                  setGroup(null)
                  setEquipment(null)
                  setContra(null)
                  setVisible(PAGE_SIZE)
                }}
              >
                Clear filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((e) => (
                <ExerciseCard key={e.id} {...cardProps(e)} />
              ))}
            </div>
          ) : (
            <TableScroll minWidth={640}>
              {shown.map((e) => (
                <ExerciseListRow key={e.id} {...cardProps(e)} />
              ))}
            </TableScroll>
          )}

          <div className="flex w-full items-center justify-between gap-3 text-body whitespace-nowrap">
            <p className="text-muted">
              Showing {shown.length} of {filtered.length} exercises
            </p>
            {shown.length < filtered.length && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="font-semibold text-cta hover:underline"
              >
                Load more
              </button>
            )}
          </div>
        </Card>

        <InjuryRulesPanel
          rules={rules}
          selectedId={selectedRuleId}
          onSelect={setSelectedRuleId}
          onToggle={(rule, enabled) => toggleRule.mutate({ id: rule.id, enabled })}
          onEdit={(rule) => setRuleModal({ mode: 'edit', rule })}
          onNew={() => setRuleModal({ mode: 'create' })}
        />
      </div>

      <ExercisePreviewModal
        exercise={preview}
        inactiveAreas={inactiveAreas}
        onClose={() => setPreview(null)}
        onEdit={(exercise) => {
          setPreview(null)
          setExerciseModal({ mode: 'edit', exercise })
        }}
      />

      <ExerciseFormModal
        open={!!exerciseModal}
        exercise={exerciseModal?.mode === 'edit' ? exerciseModal.exercise : undefined}
        saving={saveExercise.isPending}
        onClose={() => setExerciseModal(null)}
        onSubmit={submitExercise}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() =>
          toDelete && deleteExercise.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }
        tone="destructive"
        icon="trash"
        title="Delete exercise?"
        description={
          <>
            <span className="font-semibold text-ink">{toDelete?.name}</span> will be removed from the library
            and from future AI-generated plans. This can't be undone.
          </>
        }
        confirmLabel="Delete exercise"
        loading={deleteExercise.isPending}
      />

      <RuleFormModal
        open={!!ruleModal}
        rule={ruleModal?.mode === 'edit' ? ruleModal.rule : undefined}
        exerciseNames={(exercises ?? []).map((e) => e.name)}
        suggestCounts={suggestCounts}
        saving={saveRule.isPending}
        onClose={() => setRuleModal(null)}
        onSubmit={submitRule}
        onDelete={(rule) => setRuleToDelete(rule)}
      />

      <ConfirmDialog
        open={!!ruleToDelete}
        onClose={() => setRuleToDelete(null)}
        onConfirm={() =>
          ruleToDelete &&
          deleteRule.mutate(ruleToDelete.id, {
            onSuccess: () => {
              setRuleToDelete(null)
              setRuleModal(null)
              setSelectedRuleId(null)
            },
          })
        }
        tone="destructive"
        icon="shield"
        title="Delete injury rule?"
        description={
          <>
            The AI planner will stop applying{' '}
            <span className="font-semibold text-ink">{ruleToDelete?.name}</span> exclusions and auto-swaps.
          </>
        }
        confirmLabel="Delete rule"
        loading={deleteRule.isPending}
      />
    </>
  )
}
