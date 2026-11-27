/** Body areas the injury rules engine knows about (mirrors the mobile body map). */
export type BodyArea = 'wrist' | 'knee' | 'lowerBack' | 'shoulder' | 'neck'

export const BODY_AREAS: { value: BodyArea; label: string }[] = [
  { value: 'wrist', label: 'Wrist' },
  { value: 'knee', label: 'Knee' },
  { value: 'lowerBack', label: 'Lower Back' },
  { value: 'shoulder', label: 'Shoulder' },
  { value: 'neck', label: 'Neck' },
]

export const bodyAreaLabel = (area: BodyArea) =>
  BODY_AREAS.find((a) => a.value === area)?.label ?? area

/** Muscle groups used by the library filter chips. */
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Core' | 'Glutes' | 'Shoulders' | 'Full Body'

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Legs',
  'Core',
  'Glutes',
  'Shoulders',
  'Full Body',
]

export type Equipment =
  | 'Bodyweight'
  | 'Dumbbell'
  | 'Barbell'
  | 'Kettlebell'
  | 'Cable'
  | 'Machine'
  | 'Band'

export const EQUIPMENT: Equipment[] = [
  'Bodyweight',
  'Dumbbell',
  'Barbell',
  'Kettlebell',
  'Cable',
  'Machine',
  'Band',
]

/** "excluded" = never programmed for that injury, "caution" = allowed with lighter load / cues. */
export type ContraLevel = 'excluded' | 'caution'

export interface Contraindication {
  area: BodyArea
  level: ContraLevel
}

/** Positive labels shown on a card, e.g. "Wrist-safe" (success) or "Swap target" (info). */
export interface ExerciseTag {
  label: string
  tone: 'success' | 'info'
}

export interface Exercise {
  id: string
  name: string
  /** Primary muscle shown on the card, e.g. "Quadriceps". */
  muscle: string
  group: MuscleGroup
  equipment: Equipment
  /** Demo video length, "m:ss". */
  duration: string
  /** Thumbnail URL of the demo video (bundled asset or object URL); empty = no media yet. */
  image?: string
  contraindications: Contraindication[]
  tags: ExerciseTag[]
}

export type ExerciseInput = Omit<Exercise, 'id'>

export interface SwapPair {
  from: string
  to: string
}

export interface InjuryRule {
  id: string
  name: string
  area: BodyArea
  enabled: boolean
  excludedCount: number
  swapCount: number
  /** Example auto-swaps shown in the "Example auto-swap" box. */
  swaps: SwapPair[]
}

export type InjuryRuleInput = Omit<InjuryRule, 'id'>

export type LibraryView = 'grid' | 'list'
