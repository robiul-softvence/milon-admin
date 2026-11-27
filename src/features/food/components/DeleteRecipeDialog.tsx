import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatInt } from '../constants'
import type { Recipe } from '../types'

interface DeleteRecipeDialogProps {
  recipe: Recipe | null
  /** Name shown in the title (follows the selected content language). */
  displayName: string
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

/** Figma "Admin Modal 03 · Delete Recipe Confirm" (Dialog/Confirm, destructive). */
export function DeleteRecipeDialog({
  recipe,
  displayName,
  loading,
  onClose,
  onConfirm,
}: DeleteRecipeDialogProps) {
  const plans = recipe?.activeMealPlans ?? 0
  const usage =
    plans > 0
      ? `It's used in ${formatInt(plans)} active meal plan${plans === 1 ? '' : 's'}. Those members will automatically get a similar recipe instead.`
      : "It isn't used in any active meal plans."

  return (
    <ConfirmDialog
      open={recipe !== null}
      onClose={onClose}
      onConfirm={onConfirm}
      tone="destructive"
      icon="food-trash-lg"
      iconTileClassName="bg-[#fde4e0] text-[#c9332b]"
      confirmClassName="bg-[#c9332b] hover:bg-[#b12a23]"
      title={`Delete “${displayName}”?`}
      description={`${usage} The English and French versions will both be removed.`}
      confirmLabel={loading ? 'Deleting…' : 'Delete Recipe'}
      loading={loading}
    />
  )
}
