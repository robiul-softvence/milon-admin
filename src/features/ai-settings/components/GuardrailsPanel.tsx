import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { PanelHeader } from '@/components/ui/PanelHeader'
import { cn } from '@/lib/cn'
import { useSaveGuardrails } from '../hooks/useAiSettings'
import type { Guardrail, GuardrailKey, GuardrailSettings } from '../types'
import { Toggle } from './Toggle'

const PROMPT_MAX = 1000

/** Figma "Guardrails" panel: rule toggles, system prompt and save button. */
export function GuardrailsPanel({ settings }: { settings: GuardrailSettings }) {
  const save = useSaveGuardrails()
  const [rules, setRules] = useState<Guardrail[]>(settings.rules)
  const [prompt, setPrompt] = useState(settings.systemPrompt)
  const [editing, setEditing] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Re-sync local draft when the server copy changes (after save/refetch).
  useEffect(() => {
    setRules(settings.rules)
    setPrompt(settings.systemPrompt)
  }, [settings])

  useEffect(() => {
    if (editing) textareaRef.current?.focus()
  }, [editing])

  // Hide the "Saved" confirmation after a moment.
  useEffect(() => {
    if (!savedAt) return
    const t = setTimeout(() => setSavedAt(null), 2500)
    return () => clearTimeout(t)
  }, [savedAt])

  const dirty =
    prompt.trim() !== settings.systemPrompt ||
    rules.some((r, i) => r.enabled !== settings.rules[i]?.enabled)
  const promptError = prompt.trim().length < 20 ? 'System prompt must be at least 20 characters.' : null

  const setRule = (key: GuardrailKey, enabled: boolean) =>
    setRules((rs) => rs.map((r) => (r.key === key ? { ...r, enabled } : r)))

  const onSave = () => {
    if (promptError) return
    save.mutate(
      { rules, systemPrompt: prompt },
      {
        onSuccess: () => {
          setEditing(false)
          setSavedAt(Date.now())
        },
      },
    )
  }

  return (
    <Card className="flex w-full shrink-0 flex-col gap-5 p-5 sm:p-6 xl:w-[380px]">
      <PanelHeader title="AI Coach Guardrails" subtitle="Safety & scope rules for every conversation" />

      <div className="flex w-full flex-col">
        {rules.map((rule) => (
          <div key={rule.key} className="flex w-full items-center gap-3 py-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-body font-bold text-ink">{rule.label}</p>
              <p className="text-caption font-medium text-muted">{rule.description}</p>
            </div>
            <Toggle checked={rule.enabled} label={rule.label} onChange={(v) => setRule(rule.key, v)} />
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2 rounded-[14px] bg-pearl p-3.5">
        <div className="flex w-full items-center justify-between">
          <p className="text-overline text-muted">SYSTEM PROMPT</p>
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            title={editing ? 'Lock prompt' : 'Unlock to edit'}
            aria-label={editing ? 'Lock system prompt' : 'Edit system prompt'}
            aria-pressed={editing}
            className={cn(
              'inline-flex items-center gap-1 text-caption font-medium transition-colors hover:text-ink',
              editing ? 'text-cta' : 'text-muted',
            )}
          >
            <Icon name="lock" size={12} />
            {editing ? 'Editing' : settings.promptVersion}
          </button>
        </div>
        {editing ? (
          <>
            <textarea
              ref={textareaRef}
              value={prompt}
              maxLength={PROMPT_MAX}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-lg border border-line bg-white p-2 text-caption font-medium text-ink outline-none focus:border-ink"
            />
            <div className="flex justify-between text-caption font-medium">
              <span className="text-cta">{promptError}</span>
              <span className="text-muted">
                {prompt.length}/{PROMPT_MAX}
              </span>
            </div>
          </>
        ) : (
          <p className="w-full text-caption font-medium break-words text-ink">{prompt}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={save.isPending || !!promptError}
        className="w-full rounded-xl bg-cta py-3 text-body font-bold text-white transition-colors hover:bg-[#cc4330] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {save.isPending ? 'Saving…' : savedAt && !dirty ? 'Saved' : 'Save Guardrails'}
      </button>
      {save.isError && (
        <p className="-mt-3 text-caption font-medium text-cta">Couldn't save guardrails. Try again.</p>
      )}
    </Card>
  )
}
