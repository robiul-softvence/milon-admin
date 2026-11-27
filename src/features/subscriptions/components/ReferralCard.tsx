import { Icon } from '@/components/ui/Icon'
import { formatNumber } from '../lib/promo'
import type { ReferralStats } from '../types'

/** Figma "Referral Stats": coral gradient card with key referral numbers. */
export function ReferralCard({ stats }: { stats: ReferralStats }) {
  const rows = [
    { label: 'Invites sent', value: formatNumber(stats.invitesSent) },
    { label: 'Friends joined', value: formatNumber(stats.friendsJoined) },
    { label: 'Free days granted', value: formatNumber(stats.freeDaysGranted) },
    { label: 'On referral credit', value: `${formatNumber(stats.onReferralCredit)} users` },
  ]
  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-3 rounded-[20px] p-5 text-white"
      style={{ backgroundImage: 'linear-gradient(212.2deg, #ff654f 41.18%, #c93b28 112.99%)' }}
    >
      <div className="flex w-full items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-cta">
          <Icon name="gift" size={18} />
        </div>
        <p className="text-body font-bold">Referral Program</p>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex w-full items-center justify-between whitespace-nowrap">
          <span className="text-caption font-medium">{r.label}</span>
          <span className="text-body font-bold">{r.value}</span>
        </div>
      ))}
      <p className="text-caption font-medium whitespace-nowrap">
        {stats.daysPerFriend} days per friend · max {stats.maxDays} days
      </p>
    </div>
  )
}
