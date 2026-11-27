import { mockRequest } from '@/lib/api/client'
import type { FoodData, Recipe, RecipeInput } from '../types'
import { foodMock } from './food.mock'

// Mutable copy so add / edit / delete persist for the session.
const db: FoodData = structuredClone(foodMock)

const hasFr = (r: Pick<Recipe, 'name'>) => Boolean(r.name.fr?.trim())

// TODO(api): GET /admin/food
export function fetchFood(): Promise<FoodData> {
  return mockRequest(db)
}

// TODO(api): POST /admin/food/recipes
export function createRecipe(input: RecipeInput): Promise<Recipe> {
  const recipe: Recipe = { ...input, id: `rcp_${Date.now()}`, activeMealPlans: 0 }
  db.recipes.unshift(recipe)
  db.stats.recipes += 1
  if (hasFr(recipe)) db.stats.translatedFr += 1
  return mockRequest(recipe)
}

// TODO(api): PATCH /admin/food/recipes/:id
export function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const index = db.recipes.findIndex((r) => r.id === id)
  if (index === -1) return Promise.reject(new Error('Recipe not found'))
  const prev = db.recipes[index]
  const next: Recipe = { ...prev, ...input }
  db.stats.translatedFr += Number(hasFr(next)) - Number(hasFr(prev))
  db.recipes[index] = next
  return mockRequest(next)
}

// TODO(api): DELETE /admin/food/recipes/:id
export function deleteRecipe(id: string): Promise<void> {
  const recipe = db.recipes.find((r) => r.id === id)
  if (recipe) {
    db.recipes = db.recipes.filter((r) => r.id !== id)
    db.stats.recipes -= 1
    if (hasFr(recipe)) db.stats.translatedFr -= 1
  }
  return mockRequest(undefined)
}
