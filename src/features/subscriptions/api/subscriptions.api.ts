import { mockRequest } from '@/lib/api/client'
import type { PlanStats, PromoCode, PromoCodeInput } from '../types'
import { planStatsMock, promoCodesDb } from './subscriptions.mock'

// TODO(api): replace with `GET /admin/subscriptions/stats`.
export function fetchPlanStats(): Promise<PlanStats> {
  return mockRequest(planStatsMock)
}

// TODO(api): replace with `GET /admin/promo-codes`.
export function fetchPromoCodes(): Promise<PromoCode[]> {
  return mockRequest(promoCodesDb)
}

function assertUniqueCode(code: string, exceptId?: string) {
  if (promoCodesDb.some((p) => p.code === code && p.id !== exceptId)) {
    return Promise.reject(new Error(`Code "${code}" already exists.`))
  }
  return null
}

// TODO(api): `POST /admin/promo-codes`.
export function createPromoCode(input: PromoCodeInput): Promise<PromoCode> {
  const dup = assertUniqueCode(input.code)
  if (dup) return dup
  const created: PromoCode = { ...input, id: `p${Date.now()}`, redemptions: 0 }
  promoCodesDb.unshift(created)
  return mockRequest(created)
}

// TODO(api): `PATCH /admin/promo-codes/:id`.
export function updatePromoCode(id: string, patch: Partial<PromoCodeInput>): Promise<PromoCode> {
  const idx = promoCodesDb.findIndex((p) => p.id === id)
  if (idx === -1) return Promise.reject(new Error('Promo code not found.'))
  if (patch.code) {
    const dup = assertUniqueCode(patch.code, id)
    if (dup) return dup
  }
  promoCodesDb[idx] = { ...promoCodesDb[idx], ...patch }
  return mockRequest(promoCodesDb[idx])
}

// TODO(api): `DELETE /admin/promo-codes/:id`.
export function deletePromoCode(id: string): Promise<void> {
  const idx = promoCodesDb.findIndex((p) => p.id === id)
  if (idx !== -1) promoCodesDb.splice(idx, 1)
  return mockRequest(undefined)
}
