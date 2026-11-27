import { useId } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { BodyArea, Exercise } from '../types'
import { ExerciseMeta } from './ExerciseCard'
import { ExercisePills } from './ExercisePills'
import { ModalHeader } from './FormControls'

interface ExercisePreviewModalProps {
  exercise: Exercise | null
  inactiveAreas: Set<BodyArea>
  onClose: () => void
  onEdit: (exercise: Exercise) => void
}

/** Opened from the play button / name: large media + metadata. */
export function ExercisePreviewModal({ exercise, inactiveAreas, onClose, onEdit }: ExercisePreviewModalProps) {
  const titleId = useId()
  if (!exercise) return null
  return (
    <Modal open onClose={onClose} labelledBy={titleId} className="max-w-[560px]">
      <ModalHeader titleId={titleId} title={exercise.name} onClose={onClose} />
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-pearl">
          {exercise.image ? (
            <img src={exercise.image} alt={exercise.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-body font-semibold text-subtle">
              No demo media uploaded yet
            </div>
          )}
          <span className="absolute top-3 right-3 rounded-full border border-white/18 bg-[rgba(17,19,24,0.4)] px-2 py-[3px] text-caption font-bold text-white backdrop-blur-[10px]">
            {exercise.duration}
          </span>
        </div>
        <ExerciseMeta exercise={exercise} />
        <ExercisePills exercise={exercise} inactiveAreas={inactiveAreas} />
      </div>
      <div className="flex justify-end gap-3 border-t border-line px-4 py-4 sm:px-6">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button variant="dark" icon="edit" onClick={() => onEdit(exercise)}>
          Edit exercise
        </Button>
      </div>
    </Modal>
  )
}
