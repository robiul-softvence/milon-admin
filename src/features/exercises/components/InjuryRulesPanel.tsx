import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { PanelHeader } from '@/components/ui/PanelHeader'
import { Pill } from '@/components/ui/Pill'
import { bodyAreaLabel, type InjuryRule } from '../types'
import { Toggle } from './Toggle'

interface InjuryRulesPanelProps {
  rules: InjuryRule[] | undefined
  selectedId: string | null
  onSelect: (id: string) => void
  onToggle: (rule: InjuryRule, enabled: boolean) => void
  onEdit: (rule: InjuryRule) => void
  onNew: () => void
}

/** Figma "Injury Rules": 340px panel — rule list with switches, example auto-swap, New Rule. */
export function InjuryRulesPanel({ rules, selectedId, onSelect, onToggle, onEdit, onNew }: InjuryRulesPanelProps) {
  const selected = rules?.find((r) => r.id === selectedId) ?? rules?.[0]

  return (
    <Card className="flex w-full shrink-0 flex-col gap-5 p-4 sm:p-6 xl:w-[340px]">
      <PanelHeader title="Injury Rules Engine" subtitle="Applied automatically by the AI planner" />

      {!rules ? (
        <div className="flex w-full animate-pulse flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[50px] rounded-xl bg-pearl" />
          ))}
        </div>
      ) : (
        <ul className="flex w-full flex-col">
          {rules.map((rule) => {
            return (
              <li key={rule.id} className="flex w-full items-center gap-3 py-3">
                <button
                  type="button"
                  onClick={() => onSelect(rule.id)}
                  onDoubleClick={() => onEdit(rule)}
                  aria-pressed={rule.id === selected?.id}
                  title="Show example auto-swaps · double-click to edit"
                  className="group flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-peach text-cta">
                    <Icon name="shield" size={18} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                    <span className="truncate text-body font-bold text-ink group-hover:underline">
                      {rule.name}
                    </span>
                    <span className="text-caption font-medium text-muted">
                      {rule.excludedCount} excluded · {rule.swapCount} auto-swaps
                    </span>
                  </span>
                </button>
                <Toggle
                  checked={rule.enabled}
                  onChange={(v) => onToggle(rule, v)}
                  label={`${rule.name} rule ${rule.enabled ? 'on' : 'off'}`}
                />
              </li>
            )
          })}
        </ul>
      )}

      {selected && (
        <div className="flex w-full flex-col gap-2.5 rounded-2xl bg-pearl p-3.5">
          <div className="flex w-full items-center justify-between gap-2">
            <p className="text-overline text-muted uppercase">
              Example auto-swap · {bodyAreaLabel(selected.area)}
            </p>
            <button
              type="button"
              onClick={() => onEdit(selected)}
              className="text-caption font-semibold text-cta hover:underline"
            >
              Edit
            </button>
          </div>
          {selected.swaps.length ? (
            selected.swaps.map((s, i) => (
              <div key={i} className="flex w-full min-w-0 items-center gap-2">
                <Pill tone="cta">{s.from}</Pill>
                <Icon name="arrowR" size={16} className="text-muted" />
                <Pill tone="success" className="min-w-0 truncate">
                  {s.to}
                </Pill>
              </div>
            ))
          ) : (
            <p className="text-caption text-muted">No example swaps yet.</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onNew}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 text-body font-semibold text-ink transition-colors hover:bg-pearl"
      >
        <Icon name="plus-sm" size={16} />
        New Rule
      </button>
    </Card>
  )
}
