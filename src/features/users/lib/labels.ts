import type { Goal, InjuryZone, PlanTier, Subscription } from '../types'

export const GOAL_LABELS: Record<Goal, string> = {
  loseWeight: 'Lose Weight',
  buildMuscle: 'Build Muscle',
  stayFit: 'Stay Fit',
}

/** Goal dot colours from Figma (coral / ink / lime-dark). */
export const GOAL_COLORS: Record<Goal, string> = {
  loseWeight: '#ff654f',
  buildMuscle: '#111318',
  stayFit: '#b5d334',
}

export const SUBSCRIPTION_LABELS: Record<Subscription, string> = {
  proMonthly: 'Pro · Monthly',
  proQuarterly: 'Pro · Quarterly',
  proAnnual: 'Pro · Annual',
  trial: 'Free Trial',
  inactive: 'Inactive',
}

export const INJURY_LABELS: Record<InjuryZone, string> = {
  neck: 'Neck',
  shoulders: 'Shoulders',
  lowerBack: 'Lower Back',
  elbows: 'Elbows',
  wrists: 'Wrists',
  hips: 'Hips',
  knees: 'Knees',
  ankles: 'Ankles',
}

export function planOf(subscription: Subscription): PlanTier {
  if (subscription === 'trial') return 'trial'
  if (subscription === 'inactive') return 'inactive'
  return 'pro'
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

/** "2026-09-12" → "Sep 12, 2026" */
export function formatJoined(iso: string) {
  return dateFmt.format(new Date(`${iso}T00:00:00`))
}

export const formatCount = (n: number) => n.toLocaleString('en-US')
