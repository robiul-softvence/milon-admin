import type { PillTone } from '@/components/ui/Pill'
import type { ContentLanguage, CostFilter, DietaryTag, MealCategory, Recipe } from './types'

export const CATEGORIES: { value: MealCategory; label: string; tone: PillTone }[] = [
  { value: 'breakfast', label: 'Breakfast', tone: 'warning' },
  { value: 'lunch', label: 'Lunch', tone: 'success' },
  { value: 'snack', label: 'Snack', tone: 'info' },
  { value: 'dinner', label: 'Dinner', tone: 'cta' },
]

export const CATEGORY_META = Object.fromEntries(CATEGORIES.map((c) => [c.value, c])) as Record<
  MealCategory,
  (typeof CATEGORIES)[number]
>

export const DIETARY_TAGS: { value: DietaryTag; label: string; tone: PillTone }[] = [
  { value: 'vegetarian', label: 'Vegetarian', tone: 'lime' },
  { value: 'vegan', label: 'Vegan', tone: 'lime' },
  { value: 'halal', label: 'Halal', tone: 'info' },
  { value: 'glutenFree', label: 'Gluten-Free', tone: 'neutral' },
  { value: 'lactoseFree', label: 'Lactose-Free', tone: 'neutral' },
]

export const TAG_META = Object.fromEntries(DIETARY_TAGS.map((t) => [t.value, t])) as Record<
  DietaryTag,
  (typeof DIETARY_TAGS)[number]
>

export const COST_FILTERS: { value: CostFilter; label: string; match: (cost: number) => boolean }[] =
  [
    { value: 'any', label: 'Any', match: () => true },
    { value: 'under2', label: 'Under €2', match: (c) => c < 2 },
    { value: '2to3', label: '€2 – €3', match: (c) => c >= 2 && c <= 3 },
    { value: 'over3', label: 'Over €3', match: (c) => c > 3 },
  ]

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
export const formatEur = (value: number) => eur.format(value)
export const formatInt = (value: number) => value.toLocaleString('en-US')

/** Primary/secondary dish names for the selected content language. */
export function dishNames(recipe: Recipe, language: ContentLanguage) {
  const fr = recipe.name.fr?.trim()
  if (language === 'fr') {
    return fr
      ? { primary: fr, secondary: `EN · ${recipe.name.en}`, missing: false }
      : { primary: recipe.name.en, secondary: 'FR · Translation missing', missing: true }
  }
  return fr
    ? { primary: recipe.name.en, secondary: `FR · ${fr}`, missing: false }
    : { primary: recipe.name.en, secondary: 'FR · Translation missing', missing: true }
}
