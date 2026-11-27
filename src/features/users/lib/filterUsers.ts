import type { MoreFilters, PlanFilter, SortKey, User } from '../types'
import { planOf } from './labels'

export const DEFAULT_MORE_FILTERS: MoreFilters = { goals: [], injury: 'any', status: 'any' }

export function countActiveMoreFilters(f: MoreFilters) {
  return (f.goals.length ? 1 : 0) + (f.injury !== 'any' ? 1 : 0) + (f.status !== 'any' ? 1 : 0)
}

/** Search (name / email / ID) + "More filters" — everything except the plan chip. */
export function applyBaseFilters(users: User[], query: string, f: MoreFilters) {
  const q = query.trim().toLowerCase().replace(/^#/, '')
  return users.filter((u) => {
    if (q) {
      const hit =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.id).includes(q)
      if (!hit) return false
    }
    if (f.goals.length && !f.goals.includes(u.goal)) return false
    if (f.injury === 'with' && u.injuries.length === 0) return false
    if (f.injury === 'without' && u.injuries.length > 0) return false
    if (f.status === 'suspended' && !u.suspended) return false
    if (f.status === 'active' && (u.suspended || u.subscription === 'inactive')) return false
    if (f.status === 'inactive' && u.subscription !== 'inactive') return false
    return true
  })
}

export function planCounts(users: User[]) {
  let pro = 0
  let trial = 0
  for (const u of users) {
    const p = planOf(u.subscription)
    if (p === 'pro') pro++
    else if (p === 'trial') trial++
  }
  return { all: users.length, pro, trial }
}

export function applyPlan(users: User[], plan: PlanFilter) {
  return plan === 'all' ? users : users.filter((u) => planOf(u.subscription) === plan)
}

export function sortUsers(users: User[], sort: SortKey) {
  const list = [...users]
  switch (sort) {
    case 'newest':
      return list.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt) || b.id - a.id)
    case 'oldest':
      return list.sort((a, b) => a.joinedAt.localeCompare(b.joinedAt) || a.id - b.id)
    case 'nameAsc':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case 'nameDesc':
      return list.sort((a, b) => b.name.localeCompare(a.name))
  }
}
