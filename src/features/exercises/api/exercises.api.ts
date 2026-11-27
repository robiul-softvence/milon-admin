import { mockRequest } from '@/lib/api/client'
import type { Exercise, ExerciseInput, InjuryRule, InjuryRuleInput } from '../types'
import { exercisesSeed, injuryRulesSeed } from './exercises.mock'

// In-memory "database" for the mock phase. Mutations edit these arrays so
// invalidated queries refetch the updated data.
let exercises: Exercise[] = [...exercisesSeed]
let rules: InjuryRule[] = [...injuryRulesSeed]

const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

// TODO(api): GET /admin/exercises
export function fetchExercises(): Promise<Exercise[]> {
  return mockRequest(exercises)
}

// TODO(api): POST /admin/exercises
export function createExercise(input: ExerciseInput): Promise<Exercise> {
  const exercise: Exercise = { ...input, id: newId('ex') }
  exercises = [exercise, ...exercises]
  return mockRequest(exercise)
}

// TODO(api): PATCH /admin/exercises/:id
export function updateExercise({ id, ...input }: Exercise): Promise<Exercise> {
  exercises = exercises.map((e) => (e.id === id ? { ...input, id } : e))
  return mockRequest({ ...input, id })
}

// TODO(api): DELETE /admin/exercises/:id
export function deleteExercise(id: string): Promise<void> {
  exercises = exercises.filter((e) => e.id !== id)
  return mockRequest(undefined)
}

// TODO(api): GET /admin/injury-rules
export function fetchInjuryRules(): Promise<InjuryRule[]> {
  return mockRequest(rules)
}

// TODO(api): POST /admin/injury-rules
export function createInjuryRule(input: InjuryRuleInput): Promise<InjuryRule> {
  const rule: InjuryRule = { ...input, id: newId('rule') }
  rules = [...rules, rule]
  return mockRequest(rule)
}

// TODO(api): PATCH /admin/injury-rules/:id
export function updateInjuryRule({ id, ...patch }: Partial<InjuryRule> & { id: string }) {
  rules = rules.map((r) => (r.id === id ? { ...r, ...patch } : r))
  return mockRequest(rules.find((r) => r.id === id)!)
}

// TODO(api): DELETE /admin/injury-rules/:id
export function deleteInjuryRule(id: string): Promise<void> {
  rules = rules.filter((r) => r.id !== id)
  return mockRequest(undefined)
}
