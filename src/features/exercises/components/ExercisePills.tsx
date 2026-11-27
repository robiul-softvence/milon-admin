import { Pill } from '@/components/ui/Pill'
import { cn } from '@/lib/cn'
import { bodyAreaLabel, type BodyArea, type Exercise } from '../types'

interface ExercisePillsProps {
  exercise: Exercise
  /** Areas whose injury rule is switched off — their pills render muted. */
  inactiveAreas?: Set<BodyArea>
  className?: string
}

/** "Excluded · Wrist" (peach/cta), "Caution · Knee" (warning) and positive tags (success/info). */
export function ExercisePills({ exercise, inactiveAreas, className }: ExercisePillsProps) {
  const { contraindications, tags } = exercise
  if (!contraindications.length && !tags.length) return null
  return (
    <div className={cn('flex w-full flex-wrap items-center gap-1.5', className)}>
      {contraindications.map((c) => {
        const inactive = inactiveAreas?.has(c.area)
        return (
          <Pill
            key={c.area}
            tone={inactive ? 'neutral' : c.level === 'excluded' ? 'cta' : 'warning'}
            className={cn(inactive && 'line-through')}
          >
            {c.level === 'excluded' ? 'Excluded' : 'Caution'} · {bodyAreaLabel(c.area)}
          </Pill>
        )
      })}
      {tags.map((t) => (
        <Pill key={t.label} tone={t.tone}>
          {t.label}
        </Pill>
      ))}
    </div>
  )
}
