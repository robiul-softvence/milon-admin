import { Icon } from '@/components/ui/Icon'
import type { BodyArea, Exercise } from '../types'
import { ActionMenu } from './ActionMenu'
import { ExercisePills } from './ExercisePills'
import { ExerciseThumb } from './ExerciseThumb'

interface ExerciseCardProps {
  exercise: Exercise
  inactiveAreas: Set<BodyArea>
  onPreview: () => void
  onEdit: () => void
  onDelete: () => void
}

/** Figma "Exercise/*" card: 10px padding, 20px radius, thumbnail + meta stack. */
export function ExerciseCard({ exercise, inactiveAreas, onPreview, onEdit, onDelete }: ExerciseCardProps) {
  return (
    <article className="flex min-w-0 flex-col gap-2.5 rounded-[20px] border border-line bg-white p-2.5">
      <ExerciseThumb exercise={exercise} onPlay={onPreview} />
      <div className="flex w-full flex-col gap-1.5 px-1">
        <div className="flex w-full items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="truncate text-left text-body font-bold text-ink hover:underline"
          >
            {exercise.name}
          </button>
          <ActionMenu
            label={`Actions for ${exercise.name}`}
            items={[
              { label: 'Preview', onSelect: onPreview },
              { label: 'Edit', onSelect: onEdit },
              { label: 'Delete', onSelect: onDelete, destructive: true },
            ]}
          />
        </div>
        <ExerciseMeta exercise={exercise} />
        <ExercisePills exercise={exercise} inactiveAreas={inactiveAreas} />
      </div>
    </article>
  )
}

/** "● Chest   ⟛ Bodyweight" caption row. */
export function ExerciseMeta({ exercise }: { exercise: Exercise }) {
  return (
    <div className="flex items-center gap-2 text-caption font-semibold text-muted">
      <span className="flex items-center gap-1 whitespace-nowrap">
        <span className="size-1.5 rounded-full bg-coral" />
        {exercise.muscle}
      </span>
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Icon name="dumbbell-sm" size={13} />
        {exercise.equipment}
      </span>
    </div>
  )
}
