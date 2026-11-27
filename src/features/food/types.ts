export type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner'

export type DietaryTag = 'vegetarian' | 'vegan' | 'halal' | 'glutenFree' | 'lactoseFree'

/** Which language is shown as the primary dish name. */
export type ContentLanguage = 'en' | 'fr'

export type CostFilter = 'any' | 'under2' | '2to3' | 'over3'

export interface Recipe {
  id: string
  name: { en: string; fr?: string }
  category: MealCategory
  /** Image URL (bundled asset or uploaded data URL). */
  photo?: string
  kcal: number
  /** Macros in grams. */
  protein: number
  carbs: number
  fat: number
  /** Estimated cost per serving, EUR. */
  cost: number
  tags: DietaryTag[]
  /** Active member meal plans that currently include this recipe. */
  activeMealPlans: number
}

export type RecipeInput = Omit<Recipe, 'id' | 'activeMealPlans'>

export interface FoodStats {
  recipes: number
  foodItems: number
  /** EUR */
  avgCostPerMeal: number
  pendingReview: number
  /** Recipes that have a French translation. */
  translatedFr: number
}

export interface FoodData {
  stats: FoodStats
  recipes: Recipe[]
}
