import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Cell, TableRow } from '@/components/ui/Table'
import { formatDate, formatRedemptions, PROMO_STATUS, promoOffer, promoStatus, redemptionRatio } from '../lib/promo'
import type { PromoCode } from '../types'
import { ProgressBar } from './ProgressBar'
import { PromoRowMenu } from './PromoRowMenu'

/** Column widths shared by the header and rows (Figma "Cell/*"). */
export const COL = {
  code: 'w-[190px]',
  offer: 'min-w-0 flex-1',
  redemptions: 'w-[180px]',
  validUntil: 'w-[130px]',
  status: 'w-[140px]',
  actions: 'w-[76px]',
}

interface PromoCodeRowProps {
  promo: PromoCode
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}

export function PromoCodeRow({ promo, onEdit, onToggle, onDelete }: PromoCodeRowProps) {
  const [copied, setCopied] = useState(false)
  const status = PROMO_STATUS[promoStatus(promo)]

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const copy = () => {
    void navigator.clipboard?.writeText(promo.code).catch(() => {})
    setCopied(true)
  }

  return (
    <TableRow className="gap-3">
      <Cell className={`${COL.code} gap-2`}>
        <span className="rounded-lg bg-pearl px-2.5 py-1.5 text-body font-bold whitespace-nowrap text-ink">
          {promo.code}
        </span>
        {copied ? (
          <span className="text-caption font-semibold text-success">Copied</span>
        ) : (
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${promo.code}`}
            title="Copy code"
            className="text-subtle transition-colors hover:text-ink"
          >
            <Icon name="copy" size={14} />
          </button>
        )}
      </Cell>
      <Cell className={COL.offer}>
        <span className="truncate text-body text-ink">{promoOffer(promo)}</span>
      </Cell>
      <Cell className={COL.redemptions}>
        <div className="flex w-full flex-col gap-1.5">
          <span className="text-caption font-semibold text-ink">{formatRedemptions(promo)}</span>
          <ProgressBar
            value={redemptionRatio(promo)}
            barClassName={promoStatus(promo) === 'limit' ? 'bg-warning' : 'bg-coral'}
          />
        </div>
      </Cell>
      <Cell className={`${COL.validUntil} text-body whitespace-nowrap text-muted`}>{formatDate(promo.validUntil)}</Cell>
      <Cell className={COL.status}>
        <Pill tone={status.tone} dot>
          {status.label}
        </Pill>
      </Cell>
      <Cell className={`${COL.actions} gap-1.5`}>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${promo.code}`}
          title="Edit"
          className="flex size-8 items-center justify-center rounded-lg bg-pearl text-ink transition-colors hover:bg-line"
        >
          <Icon name="edit" size={16} />
        </button>
        <PromoRowMenu code={promo.code} enabled={promo.enabled} onToggle={onToggle} onCopy={copy} onDelete={onDelete} />
      </Cell>
    </TableRow>
  )
}
