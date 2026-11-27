import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRecipe, deleteRecipe, fetchFood, updateRecipe } from '../api/food.api'
import type { RecipeInput } from '../types'

const FOOD_KEY = ['food'] as const

export function useFood() {
  return useQuery({ queryKey: FOOD_KEY, queryFn: fetchFood })
}

export function useSaveRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: RecipeInput }) =>
      id ? updateRecipe(id, input) : createRecipe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: FOOD_KEY }),
  })
}

export function useDeleteRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => qc.invalidateQueries({ queryKey: FOOD_KEY }),
  })
}
