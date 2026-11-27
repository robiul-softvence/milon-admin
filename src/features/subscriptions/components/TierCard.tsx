import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { cn } from '@/lib/cn'
import { formatNumber } from '../lib/promo'
import type { PlanTier } from '../types'
import { ProgressBar } from './ProgressBar'

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

interface TierCardProps {
  tier: PlanTier
  /** This tier's share of total Pro MRR (0–1) — drives the bar. */
  mrrShare: number
}

/** Figma "Tier/*": white cards for Monthly/Quarterly, ink "featured" card for Annual. */
export function TierCard({ tier, mrrShare }: TierCardProps) {
  const dark = tier.badge === 'bestOffer'
  const Surface = dark ? 'div' : Card
  return (
    <Surface
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-3.5 p-5',
        dark && 'rounded-[20px] bg-ink text-white',
      )}
      title={`${tier.label}: ${Math.round(mrrShare * 100)}% of Pro MRR`}
    >
      <div className="flex w-full items-center justify-between">
        <p className={cn('text-overline uppercase', dark ? 'text-lime' : 'text-muted')}>{tier.label}</p>
        {dark ? (
          <Pill tone="lime">Best Offer</Pill>
        ) : (
          <Pill tone="success" dot>
            Active
          </Pill>
        )}
      </div>

      <div className="flex items-baseline gap-1 whitespace-nowrap">
        <span className={cn('text-num-m', !dark && 'text-ink')}>{tier.price}</span>
        <span className={cn('text-caption font-medium', !dark && 'text-muted')}>{tier.period}</span>
      </div>

      <div className={cn('h-px w-full', dark ? 'bg-white/15' : 'bg-line')} />

      <div className="flex w-full items-center justify-between whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className={cn('text-caption font-medium', !dark && 'text-muted')}>Subscribers</span>
          <span className={cn('text-h3', !dark && 'text-ink')}>{formatNumber(tier.subscribers)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className={cn('text-caption font-medium', !dark && 'text-muted')}>MRR</span>
          <span className={cn('text-h3', dark ? 'text-lime' : 'text-ink')}>{eur.format(tier.mrr)}</span>
        </div>
      </div>

      <ProgressBar
        value={mrrShare}
        trackClassName={dark ? 'bg-white/15' : 'bg-pearl'}
        barClassName={dark ? 'bg-lime' : 'bg-coral'}
      />

      <div className="flex w-full items-center justify-between whitespace-nowrap text-caption">
        <span className={cn('font-medium', !dark && 'text-muted')}>Churn {tier.churn}%</span>
        <span className={cn('font-bold', dark ? 'text-lime' : 'text-success')}>{tier.highlight}</span>
      </div>
    </Surface>
  )
}
