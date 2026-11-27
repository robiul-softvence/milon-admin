import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createExercise,
  createInjuryRule,
  deleteExercise,
  deleteInjuryRule,
  fetchExercises,
  fetchInjuryRules,
  updateExercise,
  updateInjuryRule,
} from '../api/exercises.api'
import type { InjuryRule } from '../types'

const EXERCISES_KEY = ['exercises'] as const
const RULES_KEY = ['injury-rules'] as const

export function useExercises() {
  return useQuery({ queryKey: EXERCISES_KEY, queryFn: fetchExercises })
}

export function useSaveExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: Parameters<typeof updateExercise>[0] | Parameters<typeof createExercise>[0]) =>
      'id' in vars ? updateExercise(vars) : createExercise(vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXERCISES_KEY }),
  })
}

export function useDeleteExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXERCISES_KEY }),
  })
}

export function useInjuryRules() {
  return useQuery({ queryKey: RULES_KEY, queryFn: fetchInjuryRules })
}

export function useSaveInjuryRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: Parameters<typeof updateInjuryRule>[0] | Parameters<typeof createInjuryRule>[0]) =>
      'id' in vars ? updateInjuryRule(vars) : createInjuryRule(vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: RULES_KEY }),
  })
}

/** Optimistic on/off switch so the toggle reacts instantly. */
export function useToggleInjuryRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => updateInjuryRule({ id, enabled }),
    onMutate: async ({ id, enabled }) => {
      await qc.cancelQueries({ queryKey: RULES_KEY })
      const prev = qc.getQueryData<InjuryRule[]>(RULES_KEY)
      qc.setQueryData<InjuryRule[]>(RULES_KEY, (rules) =>
        rules?.map((r) => (r.id === id ? { ...r, enabled } : r)),
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(RULES_KEY, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: RULES_KEY }),
  })
}

export function useDeleteInjuryRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteInjuryRule,
    onSuccess: () => qc.invalidateQueries({ queryKey: RULES_KEY }),
  })
}
