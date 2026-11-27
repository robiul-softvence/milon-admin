import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { SearchField } from '@/components/ui/SearchField'
import { downloadCsv } from '@/lib/csv'
import { PromoCodesPanel } from '../components/PromoCodesPanel'
import { ReferralCard } from '../components/ReferralCard'
import { TierCard } from '../components/TierCard'
import { usePlanStats, usePromoCodes } from '../hooks/useSubscriptions'
import { formatDate, PROMO_STATUS, promoOffer, promoStatus } from '../lib/promo'

export default function SubscriptionsPage() {
  const [query, setQuery] = useState('')
  const plans = usePlanStats()
  const promos = usePromoCodes()

  const totalMrr = plans.data?.tiers.reduce((sum, t) => sum + t.mrr, 0) ?? 0

  const exportCsv = () => {
    if (!promos.data) return
    downloadCsv(
      'milon-promo-codes.csv',
      promos.data.map((p) => ({
        code: p.code,
        offer: promoOffer(p),
        redemptions: p.redemptions,
        limit: p.limit ?? 'unlimited',
        starts_at: p.startsAt ?? '',
        valid_until: p.validUntil ? formatDate(p.validUntil) : 'No expiry',
        status: PROMO_STATUS[promoStatus(p)].label,
      })),
    )
  }

  return (
    <>
      <PageHeader
        title="Subscriptions & Promo Codes"
        subtitle="Tier performance, referral program and promotional offers."
        actions={
          <>
            <SearchField
              placeholder="Search…"
              aria-label="Search promo codes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              containerClassName="w-full sm:w-[240px]"
            />
            <IconButton icon="bell" label="Notifications" />
            <Button icon="download" onClick={exportCsv} disabled={!promos.data}>
              Export
            </Button>
          </>
        }
      />

      {(plans.isError || promos.isError) && (
        <p className="text-body text-cta">Couldn't load subscription data. Please try again.</p>
      )}

      {plans.data ? (
        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex xl:items-start">
          {plans.data.tiers.map((tier) => (
            <TierCard key={tier.key} tier={tier} mrrShare={totalMrr ? tier.mrr / totalMrr : 0} />
          ))}
          <ReferralCard stats={plans.data.referral} />
        </section>
      ) : (
        <div className="grid w-full animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[232px] flex-1 rounded-[20px] bg-white" />
          ))}
        </div>
      )}

      {promos.data ? (
        <PromoCodesPanel codes={promos.data} query={query} />
      ) : (
        <div className="h-[453px] w-full animate-pulse rounded-[20px] bg-white" />
      )}
    </>
  )
}
