export type Trend = { direction: 'up' | 'down'; value: string }

export type KpiKey = 'activeUsers' | 'proSubscribers' | 'mrr' | 'aiPlansToday'

export interface Kpi {
  key: KpiKey
  label: string
  value: string
  trend: Trend
  /** Small series for the inline sparkline (oldest → newest). */
  sparkline: number[]
}

export interface MonthlyPoint {
  month: string
  /** Monthly recurring revenue, EUR. */
  mrr: number
  activeUsers: number
}

export type GoalKey = 'weightLoss' | 'muscleGain' | 'stayFit'

export interface GoalSlice {
  key: GoalKey
  label: string
  users: number
}

export type ActivityEvent = 'registration' | 'upgrade' | 'aiChat' | 'aiPlan'
export type PlanTier = 'pro' | 'trial' | 'free'

export interface ActivityItem {
  id: string
  user: { name: string; initials: string; color: string }
  event: ActivityEvent
  details: string
  plan: PlanTier
  time: string
}

export type DateRange = '7d' | '30d' | '90d' | '12m'
export type ChartRange = '6m' | '12m'

export interface OverviewData {
  kpis: Kpi[]
  monthly: MonthlyPoint[]
  goals: GoalSlice[]
  activity: ActivityItem[]
}
