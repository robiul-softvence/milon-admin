import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { Exercise } from '../types'

interface ExerciseThumbProps {
  exercise: Exercise
  onPlay?: () => void
  /** "card" = 130px tall grid thumbnail with badges; "row" = small list thumbnail. */
  variant?: 'card' | 'row'
  className?: string
}

/** Figma "Video Thumbnail": photo + 12% ink scrim, glass duration badge, glass play button. */
export function ExerciseThumb({ exercise, onPlay, variant = 'card', className }: ExerciseThumbProps) {
  const isCard = variant === 'card'
  return (
    <div
      className={cn(
        'relative flex shrink-0 flex-col overflow-hidden',
        isCard ? 'h-[130px] w-full justify-between rounded-[14px] p-2.5' : 'h-12 w-[72px] rounded-[10px]',
        !exercise.image && 'bg-pearl',
        className,
      )}
    >
      {exercise.image ? (
        <>
          <img
            src={exercise.image}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(17,19,24,0.12)]" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-subtle">
          <Icon name="dumbbell" size={isCard ? 28 : 18} />
          {isCard && <span className="text-caption font-semibold">No media yet</span>}
        </div>
      )}

      {isCard && (
        <>
          <div className="relative flex w-full justify-end">
            <span className="rounded-full border border-white/18 bg-[rgba(17,19,24,0.4)] px-2 py-[3px] text-caption font-bold text-white backdrop-blur-[10px]">
              {exercise.duration}
            </span>
          </div>
          {exercise.image && (
            <div className="relative flex w-full justify-center">
              <button
                type="button"
                onClick={onPlay}
                aria-label={`Preview ${exercise.name}`}
                className="flex size-10 items-center justify-center rounded-[20px] border border-white/75 bg-white/40 text-white drop-shadow-[0px_8px_12px_rgba(17,19,24,0.08)] backdrop-blur-[12px] transition-transform hover:scale-105"
              >
                <Icon name="play" size={16} />
              </button>
            </div>
          )}
          <div className="size-px" />
        </>
      )}
    </div>
  )
}
