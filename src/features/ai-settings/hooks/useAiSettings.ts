import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  configureIntegration,
  fetchAiSettings,
  refreshIntegrationStatus,
  saveGuardrails,
  setIntegrationEnabled,
} from '../api/aiSettings.api'
import type { GuardrailSettings, IntegrationConfigInput, IntegrationId } from '../types'

const KEY = ['ai-settings'] as const

export function useAiSettings() {
  return useQuery({ queryKey: KEY, queryFn: fetchAiSettings })
}

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: KEY })
}

export function useToggleIntegration() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, enabled }: { id: IntegrationId; enabled: boolean }) =>
      setIntegrationEnabled(id, enabled),
    onSettled: invalidate,
  })
}

export function useConfigureIntegration() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, input }: { id: IntegrationId; input: IntegrationConfigInput }) =>
      configureIntegration(id, input),
    onSuccess: invalidate,
  })
}

export function useSaveGuardrails() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: Omit<GuardrailSettings, 'promptVersion'>) => saveGuardrails(input),
    onSuccess: invalidate,
  })
}

export function useRefreshStatus() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: refreshIntegrationStatus, onSuccess: invalidate })
}
