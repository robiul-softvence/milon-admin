import { mockRequest } from '@/lib/api/client'
import type {
  AiSettingsData,
  GuardrailSettings,
  Integration,
  IntegrationConfigInput,
  IntegrationId,
} from '../types'
import { aiSettingsMock } from './aiSettings.mock'

// In-memory store so mutations persist for the session (mock backend).
const db: AiSettingsData = structuredClone(aiSettingsMock)

function findIntegration(id: IntegrationId): Integration {
  const it = db.integrations.find((i) => i.id === id)
  if (!it) throw new Error(`Unknown integration "${id}"`)
  return it
}

function maskKey(key: string): string {
  const prefix = key.includes('-') ? key.slice(0, key.indexOf('-') + 1) : ''
  return `${prefix}${'•'.repeat(12)}${key.slice(-4)}`
}

// TODO(api): GET /admin/ai-settings
export function fetchAiSettings(): Promise<AiSettingsData> {
  return mockRequest(db)
}

// TODO(api): PATCH /admin/integrations/:id { enabled }
export function setIntegrationEnabled(id: IntegrationId, enabled: boolean): Promise<Integration> {
  const it = findIntegration(id)
  it.enabled = enabled
  it.status = enabled ? (id === 'exercise' ? 'degraded' : 'connected') : 'disabled'
  return mockRequest(it)
}

// TODO(api): PUT /admin/integrations/:id/config
export function configureIntegration(id: IntegrationId, input: IntegrationConfigInput): Promise<Integration> {
  const it = findIntegration(id)
  if (input.apiKey) {
    it.apiKey = input.apiKey
    it.maskedKey = maskKey(input.apiKey)
  }
  it.usage.limit = input.limit
  if (input.model && it.model !== undefined) it.model = input.model
  return mockRequest(it, 400)
}

// TODO(api): PUT /admin/ai-coach/guardrails
export function saveGuardrails(input: Omit<GuardrailSettings, 'promptVersion'>): Promise<GuardrailSettings> {
  const promptChanged = input.systemPrompt.trim() !== db.guardrails.systemPrompt
  if (promptChanged) {
    const [major, minor] = db.guardrails.promptVersion.slice(1).split('.').map(Number)
    db.guardrails.promptVersion = `v${major}.${minor + 1}`
  }
  db.guardrails.rules = input.rules
  db.guardrails.systemPrompt = input.systemPrompt.trim()
  return mockRequest(db.guardrails, 400)
}

// TODO(api): POST /admin/integrations/health-check
export function refreshIntegrationStatus(): Promise<Integration[]> {
  for (const it of db.integrations) {
    if (!it.enabled) continue
    const jitter = 0.9 + Math.random() * 0.2
    it.latencyMs = Math.round((it.latencyMs * jitter) / 10) * 10
  }
  return mockRequest(db.integrations, 700)
}
