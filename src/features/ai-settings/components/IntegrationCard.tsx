import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Pill, type PillTone } from '@/components/ui/Pill'
import { useToggleIntegration } from '../hooks/useAiSettings'
import type { Integration, IntegrationStatus } from '../types'
import { formatLatency, formatUsage } from '../utils'
import { ApiKeyField } from './ApiKeyField'
import { Toggle } from './Toggle'

const STATUS: Record<IntegrationStatus, { label: string; tone: PillTone; bar: string }> = {
  connected: { label: 'Connected', tone: 'success', bar: 'bg-coral' },
  degraded: { label: 'Degraded', tone: 'warning', bar: 'bg-warning' },
  down: { label: 'Down', tone: 'cta', bar: 'bg-cta' },
  disabled: { label: 'Disabled', tone: 'neutral', bar: 'bg-subtle' },
}

interface IntegrationCardProps {
  integration: Integration
  onConfigure: (integration: Integration) => void
}

/** Figma "API/*" card: header, monthly usage bar, two metric tiles, key, enable + configure. */
export function IntegrationCard({ integration: it, onConfigure }: IntegrationCardProps) {
  const toggle = useToggleIntegration()
  const enabled = toggle.isPending ? toggle.variables.enabled : it.enabled
  const status = STATUS[toggle.isPending ? (enabled ? 'connected' : 'disabled') : it.status]
  const pct = Math.min(100, (it.usage.used / it.usage.limit) * 100)

  return (
    <Card className="flex w-full min-w-0 flex-col gap-4 p-4 sm:p-5">
      <div className="flex w-full items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: it.color }}
        >
          <span className="text-[18px] leading-6 font-extrabold text-white">{it.initial}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body font-bold text-ink">{it.name}</p>
          <p className="text-caption font-medium text-muted">{it.description}</p>
        </div>
        <Pill tone={status.tone} dot>
          {status.label}
        </Pill>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between text-caption whitespace-nowrap">
          <span className="font-medium text-muted">Monthly usage</span>
          <span className="font-bold text-ink">{formatUsage(it.usage)}</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-[4px] bg-pearl"
          role="progressbar"
          aria-label={`${it.name} monthly usage`}
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={`h-2 rounded-[4px] transition-[width] ${status.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex w-full gap-2 whitespace-nowrap">
        <Metric label="Avg latency" value={formatLatency(it.latencyMs)} />
        {it.model !== undefined ? (
          <Metric label="Model" value={it.model} />
        ) : (
          <Metric label="Error rate" value={`${it.errorRate ?? 0}%`} />
        )}
      </div>

      <ApiKeyField maskedKey={it.maskedKey} apiKey={it.apiKey} name={it.name} />

      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Toggle
            checked={enabled}
            label={`Enable ${it.name}`}
            disabled={toggle.isPending}
            onChange={(next) => toggle.mutate({ id: it.id, enabled: next })}
          />
          <span className="text-caption font-semibold text-ink">{enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <button
          type="button"
          onClick={() => onConfigure(it)}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-line px-3.5 py-2 text-body font-semibold text-ink transition-colors hover:bg-pearl"
        >
          Configure
          <Icon name="chevR" size={14} className="text-muted" />
        </button>
      </div>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl bg-pearl p-2.5">
      <p className="text-caption font-medium text-muted">{label}</p>
      <p className="text-body font-bold text-ink">{value}</p>
    </div>
  )
}
