import type { PillTone } from '@/components/ui/Pill'
import type { PromoCode, PromoStatus } from '../types'

export const PROMO_STATUS: Record<PromoStatus, { label: string; tone: PillTone }> = {
  active: { label: 'Active', tone: 'success' },
  scheduled: { label: 'Scheduled', tone: 'info' },
  limit: { label: 'Limit reached', tone: 'warning' },
  expired: { label: 'Expired', tone: 'neutral' },
  paused: { label: 'Paused', tone: 'violet' },
}

/** Today's local date as YYYY-MM-DD (comparable with stored ISO dates). */
export function todayIso() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function promoStatus(p: PromoCode, today = todayIso()): PromoStatus {
  if (!p.enabled) return 'paused'
  if (p.limit != null && p.redemptions >= p.limit) return 'limit'
  if (p.validUntil && p.validUntil < today) return 'expired'
  if (p.startsAt && p.startsAt > today) return 'scheduled'
  return 'active'
}

export function promoOffer(p: Pick<PromoCode, 'kind' | 'value' | 'appliesTo'>) {
  return p.kind === 'percent' ? `${p.value}% off ${p.appliesTo}` : `${p.value}-day free trial · ${p.appliesTo}`
}

const num = new Intl.NumberFormat('en-US')
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatNumber = (n: number) => num.format(n)

export function formatDate(iso: string | null) {
  return iso ? date.format(new Date(`${iso}T00:00:00`)) : 'No expiry'
}

export function formatRedemptions(p: PromoCode) {
  return `${num.format(p.redemptions)} / ${p.limit == null ? '∞' : num.format(p.limit)}`
}

/** Fill ratio for the redemption bar; unlimited codes show a short fixed stub. */
export function redemptionRatio(p: PromoCode) {
  if (p.limit == null) return 1 / 6
  return Math.min(1, p.redemptions / p.limit)
}
