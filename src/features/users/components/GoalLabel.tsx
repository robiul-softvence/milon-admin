import { GOAL_COLORS, GOAL_LABELS } from '../lib/labels'
import type { Goal } from '../types'

export function GoalLabel({ goal }: { goal: Goal }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-body text-ink">
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: GOAL_COLORS[goal] }} />
      {GOAL_LABELS[goal]}
    </span>
  )
}
