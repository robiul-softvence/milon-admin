import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPromoCode,
  deletePromoCode,
  fetchPlanStats,
  fetchPromoCodes,
  updatePromoCode,
} from '../api/subscriptions.api'
import type { PromoCodeInput } from '../types'

const PROMO_KEY = ['subscriptions', 'promo-codes'] as const

export function usePlanStats() {
  return useQuery({ queryKey: ['subscriptions', 'plans'], queryFn: fetchPlanStats })
}

export function usePromoCodes() {
  return useQuery({ queryKey: PROMO_KEY, queryFn: fetchPromoCodes })
}

function useInvalidatePromos() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: PROMO_KEY })
}

export function useCreatePromoCode() {
  const onSuccess = useInvalidatePromos()
  return useMutation({ mutationFn: (input: PromoCodeInput) => createPromoCode(input), onSuccess })
}

export function useUpdatePromoCode() {
  const onSuccess = useInvalidatePromos()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PromoCodeInput> }) => updatePromoCode(id, patch),
    onSuccess,
  })
}

export function useDeletePromoCode() {
  const onSuccess = useInvalidatePromos()
  return useMutation({ mutationFn: (id: string) => deletePromoCode(id), onSuccess })
}
