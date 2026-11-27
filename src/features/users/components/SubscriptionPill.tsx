import { Pill, type PillTone } from '@/components/ui/Pill'
import { SUBSCRIPTION_LABELS, planOf } from '../lib/labels'
import type { PlanTier, Subscription } from '../types'

const TONES: Record<PlanTier, PillTone> = { pro: 'success', trial: 'warning', inactive: 'neutral' }

export function SubscriptionPill({ subscription }: { subscription: Subscription }) {
  return (
    <Pill tone={TONES[planOf(subscription)]} dot>
      {SUBSCRIPTION_LABELS[subscription]}
    </Pill>
  )
}
