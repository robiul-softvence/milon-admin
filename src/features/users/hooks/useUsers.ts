import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  fetchUserStats,
  fetchUsers,
  setUserSuspended,
  updateUser,
} from '../api/users.api'
import type { UserInput } from '../types'

const keys = {
  all: ['users'] as const,
  list: ['users', 'list'] as const,
  stats: ['users', 'stats'] as const,
}

export function useUsers() {
  return useQuery({ queryKey: keys.list, queryFn: fetchUsers })
}

export function useUserStats() {
  return useQuery({ queryKey: keys.stats, queryFn: fetchUserStats })
}

function useInvalidateUsers() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: keys.all })
}

export function useCreateUser() {
  const onSuccess = useInvalidateUsers()
  return useMutation({ mutationFn: (input: UserInput) => createUser(input), onSuccess })
}

export function useUpdateUser() {
  const onSuccess = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UserInput }) => updateUser(id, input),
    onSuccess,
  })
}

export function useDeleteUser() {
  const onSuccess = useInvalidateUsers()
  return useMutation({ mutationFn: (id: number) => deleteUser(id), onSuccess })
}

export function useSuspendUser() {
  const onSuccess = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, suspended }: { id: number; suspended: boolean }) => setUserSuspended(id, suspended),
    onSuccess,
  })
}
