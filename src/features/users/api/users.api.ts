import { mockRequest } from '@/lib/api/client'
import type { User, UserInput, UserStats } from '../types'
import { AVATAR_COLORS, userStatsSeed, usersSeed } from './users.mock'

// In-memory "database" so mutations persist for the session.
// TODO(api): replace each function with the real `/admin/users` endpoints.
let users: User[] = structuredClone(usersSeed)
const stats: UserStats = structuredClone(userStatsSeed)

export function fetchUsers(): Promise<User[]> {
  return mockRequest(users)
}

export function fetchUserStats(): Promise<UserStats> {
  return mockRequest(stats)
}

export function createUser(input: UserInput): Promise<User> {
  const id = Math.max(...users.map((u) => u.id), 10000) + 1
  const user: User = {
    ...input,
    id,
    joinedAt: new Date().toISOString().slice(0, 10),
    suspended: false,
    avatarColor: AVATAR_COLORS[id % AVATAR_COLORS.length],
  }
  users = [user, ...users]
  stats.newThisWeek.value += 1
  return mockRequest(user)
}

export function updateUser(id: number, input: UserInput): Promise<User> {
  users = users.map((u) => (u.id === id ? { ...u, ...input } : u))
  return mockRequest(users.find((u) => u.id === id)!)
}

export function deleteUser(id: number): Promise<void> {
  const target = users.find((u) => u.id === id)
  if (target?.suspended) stats.suspended -= 1
  users = users.filter((u) => u.id !== id)
  return mockRequest(undefined)
}

export function setUserSuspended(id: number, suspended: boolean): Promise<User> {
  const target = users.find((u) => u.id === id)
  if (target && target.suspended !== suspended) stats.suspended += suspended ? 1 : -1
  users = users.map((u) => (u.id === id ? { ...u, suspended } : u))
  return mockRequest(users.find((u) => u.id === id)!)
}
