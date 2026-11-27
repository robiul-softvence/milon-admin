export type IntegrationId = 'mistral' | 'nutrition' | 'recipe' | 'exercise'
export type IntegrationStatus = 'connected' | 'degraded' | 'down' | 'disabled'
export type UsageUnit = 'tokens' | 'calls'

export interface AiStat {
  key: 'apiCalls' | 'conversations' | 'offTopic' | 'cost'
  label: string
  value: string
  /** Small caption next to the number (trend or unit). */
  suffix: string
}

export interface Integration {
  id: IntegrationId
  name: string
  description: string
  /** Letter + colour of the 44px logo tile. */
  initial: string
  color: string
  status: IntegrationStatus
  usage: { used: number; limit: number; unit: UsageUnit }
  latencyMs: number
  /** Second metric tile: either the model name (LLM) or the error rate. */
  model?: string
  errorRate?: number
  /** Masked key as shown by default, e.g. `sk-••••••••••••4F2a`. */
  maskedKey: string
  /** Full key revealed on "show". Mock-only placeholder, never a real secret. */
  apiKey: string
  enabled: boolean
}

export type GuardrailKey =
  | 'restrictTopics'
  | 'declineOffTopic'
  | 'enforceInjuryRules'
  | 'medicalDisclaimer'
  | 'supplementAdvice'
  | 'conversationLogging'

export interface Guardrail {
  key: GuardrailKey
  label: string
  description: string
  enabled: boolean
}

export interface GuardrailSettings {
  rules: Guardrail[]
  systemPrompt: string
  promptVersion: string
}

export interface AiSettingsData {
  stats: AiStat[]
  integrations: Integration[]
  guardrails: GuardrailSettings
}

export interface IntegrationConfigInput {
  apiKey?: string
  limit: number
  model?: string
}
