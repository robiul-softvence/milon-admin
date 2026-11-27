import { Cell, TableRow } from '@/components/ui/Table'
import type { BodyArea, Exercise } from '../types'
import { ActionMenu } from './ActionMenu'
import { ExerciseMeta } from './ExerciseCard'
import { ExercisePills } from './ExercisePills'
import { ExerciseThumb } from './ExerciseThumb'

interface ExerciseListRowProps {
  exercise: Exercise
  inactiveAreas: Set<BodyArea>
  onPreview: () => void
  onEdit: () => void
  onDelete: () => void
}

/** Compact list-view row (used when the "list" view toggle is active). */
export function ExerciseListRow({ exercise, inactiveAreas, onPreview, onEdit, onDelete }: ExerciseListRowProps) {
  return (
    <TableRow className="px-2 py-3">
      <Cell className="min-w-0 flex-1 gap-3">
        <button type="button" onClick={onPreview} aria-label={`Preview ${exercise.name}`}>
          <ExerciseThumb exercise={exercise} variant="row" />
        </button>
        <div className="flex min-w-0 flex-col gap-1">
          <button
            type="button"
            onClick={onPreview}
            className="truncate text-left text-body font-bold text-ink hover:underline"
          >
            {exercise.name}
          </button>
          <ExerciseMeta exercise={exercise} />
        </div>
      </Cell>
      <Cell className="w-[280px]">
        <ExercisePills exercise={exercise} inactiveAreas={inactiveAreas} />
      </Cell>
      <Cell className="w-[44px] justify-end text-caption font-bold text-muted">{exercise.duration}</Cell>
      <Cell className="w-[18px]">
        <ActionMenu
          label={`Actions for ${exercise.name}`}
          items={[
            { label: 'Preview', onSelect: onPreview },
            { label: 'Edit', onSelect: onEdit },
            { label: 'Delete', onSelect: onDelete, destructive: true },
          ]}
        />
      </Cell>
    </TableRow>
  )
}
