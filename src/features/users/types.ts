export type Goal = 'loseWeight' | 'buildMuscle' | 'stayFit'

/** Subscription as shown in the "Subscription" column. */
export type Subscription = 'proMonthly' | 'proQuarterly' | 'proAnnual' | 'trial' | 'inactive'

/** Plan tier used by the filter chips. */
export type PlanTier = 'pro' | 'trial' | 'inactive'

/** Body zones from the onboarding injury step (short labels). */
export type InjuryZone =
  | 'neck'
  | 'shoulders'
  | 'lowerBack'
  | 'elbows'
  | 'wrists'
  | 'hips'
  | 'knees'
  | 'ankles'

export interface User {
  /** Numeric member ID, displayed as "ID #10480". */
  id: number
  name: string
  email: string
  goal: Goal
  subscription: Subscription
  injuries: InjuryZone[]
  /** ISO date (YYYY-MM-DD). */
  joinedAt: string
  suspended: boolean
  /** Avatar background colour. */
  avatarColor: string
}

export interface UserStats {
  newThisWeek: { value: number; trend: string }
  trialConversion: { value: number; trend: string }
  injuryFlags: { percent: number; users: number }
  suspended: number
}

export type UserInput = Pick<User, 'name' | 'email' | 'goal' | 'subscription' | 'injuries'>

export type PlanFilter = 'all' | 'pro' | 'trial'
export type SortKey = 'newest' | 'oldest' | 'nameAsc' | 'nameDesc'
export type InjuryFilter = 'any' | 'with' | 'without'
export type StatusFilter = 'any' | 'active' | 'inactive' | 'suspended'

export interface MoreFilters {
  goals: Goal[]
  injury: InjuryFilter
  status: StatusFilter
}
