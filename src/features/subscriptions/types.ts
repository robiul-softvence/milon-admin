export type TierKey = 'monthly' | 'quarterly' | 'annual'

export interface PlanTier {
  key: TierKey
  label: string
  /** Price label — the app still shows "€ TBC" until pricing is final. */
  price: string
  period: string
  subscribers: number
  /** Monthly recurring revenue for this tier, EUR. */
  mrr: number
  /** Monthly churn, percent. */
  churn: number
  /** Footnote on the right of the churn row, e.g. "19% of Pro". */
  highlight: string
  badge: 'active' | 'bestOffer'
}

export interface ReferralStats {
  invitesSent: number
  friendsJoined: number
  freeDaysGranted: number
  onReferralCredit: number
  daysPerFriend: number
  maxDays: number
}

export interface PlanStats {
  tiers: PlanTier[]
  referral: ReferralStats
}

export type PromoKind = 'percent' | 'trial'

export interface PromoCode {
  id: string
  code: string
  kind: PromoKind
  /** Percent off (kind=percent) or free-trial days (kind=trial). */
  value: number
  /** What the offer applies to, e.g. "Annual plan" or "new users". */
  appliesTo: string
  redemptions: number
  /** null = unlimited. */
  limit: number | null
  /** ISO date (YYYY-MM-DD); null = starts immediately. */
  startsAt: string | null
  /** ISO date (YYYY-MM-DD); null = no expiry. */
  validUntil: string | null
  /** Manually paused codes are never redeemable. */
  enabled: boolean
}

export type PromoStatus = 'active' | 'scheduled' | 'limit' | 'expired' | 'paused'
export type PromoStatusFilter = 'all' | PromoStatus

export type PromoCodeInput = Omit<PromoCode, 'id' | 'redemptions'>
