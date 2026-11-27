import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import { ConfigureIntegrationModal } from '../components/ConfigureIntegrationModal'
import { GuardrailsPanel } from '../components/GuardrailsPanel'
import { IntegrationCard } from '../components/IntegrationCard'
import { StatCard } from '../components/StatCard'
import { useAiSettings, useRefreshStatus } from '../hooks/useAiSettings'
import type { Integration } from '../types'

export default function AiSettingsPage() {
  const { data, isLoading, isError } = useAiSettings()
  const refresh = useRefreshStatus()
  const [configuring, setConfiguring] = useState<Integration | null>(null)

  return (
    <>
      <PageHeader
        title="AI Coach & API Settings"
        subtitle="Connection status, usage and safety guardrails for every integration."
        actions={
          <>
            <IconButton icon="bell" label="Notifications" />
            <Button
              icon="refresh"
              onClick={() => refresh.mutate()}
              disabled={refresh.isPending || !data}
              className={cn(refresh.isPending && '[&>span:first-child]:animate-spin')}
            >
              {refresh.isPending ? 'Refreshing…' : 'Refresh Status'}
            </Button>
          </>
        }
      />

      {isError && <p className="text-body text-cta">Couldn't load AI settings. Please try again.</p>}

      {isLoading || !data ? (
        <AiSettingsSkeleton />
      ) : (
        <>
          <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex">
            {data.stats.map((s) => (
              <StatCard key={s.key} stat={s} />
            ))}
          </section>

          <section className="flex w-full flex-col gap-5 xl:flex-row xl:items-start">
            {/* Two columns of cards, each column stacks independently (Figma "API Integrations"). */}
            <div className="grid w-full min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-5 xl:w-auto xl:flex-1">
              {data.integrations.map((it) => (
                <IntegrationCard key={it.id} integration={it} onConfigure={setConfiguring} />
              ))}
            </div>
            <GuardrailsPanel settings={data.guardrails} />
          </section>
        </>
      )}

      <ConfigureIntegrationModal integration={configuring} onClose={() => setConfiguring(null)} />
    </>
  )
}

function AiSettingsSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[98px] flex-1 rounded-[20px] bg-white" />
        ))}
      </div>
      <div className="flex flex-col gap-5 xl:flex-row">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[340px] rounded-[20px] bg-white" />
          ))}
        </div>
        <div className="h-[700px] w-full xl:w-[380px] rounded-[20px] bg-white" />
      </div>
    </div>
  )
}
