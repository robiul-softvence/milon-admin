import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PanelHeader } from '@/components/ui/PanelHeader'
import { Cell, TableHeader, TableScroll } from '@/components/ui/Table'
import { useCreatePromoCode, useDeletePromoCode, useUpdatePromoCode } from '../hooks/useSubscriptions'
import { formatNumber, promoOffer, promoStatus } from '../lib/promo'
import type { PromoCode, PromoStatusFilter } from '../types'
import { COL, PromoCodeRow } from './PromoCodeRow'
import { PromoCodeFormModal } from './PromoCodeFormModal'
import { StatusFilter } from './StatusFilter'

interface PromoCodesPanelProps {
  codes: PromoCode[]
  /** Free-text search from the page top bar. */
  query: string
}

type FormState = { mode: 'create' } | { mode: 'edit'; promo: PromoCode } | null

export function PromoCodesPanel({ codes, query }: PromoCodesPanelProps) {
  const [status, setStatus] = useState<PromoStatusFilter>('all')
  const [form, setForm] = useState<FormState>(null)
  const [toDelete, setToDelete] = useState<PromoCode | null>(null)

  const create = useCreatePromoCode()
  const update = useUpdatePromoCode()
  const remove = useDeletePromoCode()

  const totalRedemptions = codes.reduce((sum, c) => sum + c.redemptions, 0)

  const counts = useMemo(() => {
    const c: Partial<Record<PromoStatusFilter, number>> = { all: codes.length }
    for (const p of codes) {
      const s = promoStatus(p)
      c[s] = (c[s] ?? 0) + 1
    }
    return c
  }, [codes])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return codes.filter(
      (p) =>
        (status === 'all' || promoStatus(p) === status) &&
        (!q || p.code.toLowerCase().includes(q) || promoOffer(p).toLowerCase().includes(q)),
    )
  }, [codes, query, status])

  const existingCodes = useMemo(() => codes.map((c) => c.code), [codes])

  return (
    <Card className="flex w-full flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <PanelHeader
        title="Promo Codes"
        subtitle={`${codes.length} ${codes.length === 1 ? 'code' : 'codes'} · ${formatNumber(totalRedemptions)} total redemptions`}
      >
        <StatusFilter value={status} onChange={setStatus} counts={counts} />
        <Button variant="primary" icon="plus" className="w-full sm:w-auto" onClick={() => setForm({ mode: 'create' })}>
          Create Promo Code
        </Button>
      </PanelHeader>

      <TableScroll minWidth={960}>
        <TableHeader className="gap-3">
          <Cell className={COL.code}>Code</Cell>
          <Cell className={COL.offer}>Discount / Trial Days</Cell>
          <Cell className={COL.redemptions}>Redemptions</Cell>
          <Cell className={COL.validUntil}>Valid Until</Cell>
          <Cell className={COL.status}>Status</Cell>
          <Cell className={`${COL.actions} relative`}>
            <span className="sr-only">Actions</span>
          </Cell>
        </TableHeader>
        {visible.map((p) => (
          <PromoCodeRow
            key={p.id}
            promo={p}
            onEdit={() => setForm({ mode: 'edit', promo: p })}
            onToggle={() => update.mutate({ id: p.id, patch: { enabled: !p.enabled } })}
            onDelete={() => setToDelete(p)}
          />
        ))}
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-1 border-b border-line px-4 py-10 text-center">
            <p className="text-body font-semibold text-ink">No promo codes found</p>
            <p className="text-caption font-medium text-muted">Try a different search or status filter.</p>
          </div>
        )}
      </TableScroll>

      <PromoCodeFormModal
        open={form !== null}
        onClose={() => setForm(null)}
        promo={form?.mode === 'edit' ? form.promo : undefined}
        existingCodes={existingCodes}
        onSubmit={(input) =>
          form?.mode === 'edit'
            ? update.mutateAsync({ id: form.promo.id, patch: input })
            : create.mutateAsync(input)
        }
      />

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }}
        tone="destructive"
        icon="trash"
        iconTileClassName="bg-[#fde4e0] text-[#c9332b]"
        confirmClassName="bg-[#c9332b] hover:bg-[#b02a23]"
        title={`Delete “${toDelete?.code ?? ''}”?`}
        description={
          toDelete
            ? `It has been redeemed ${formatNumber(toDelete.redemptions)} times. Members who already redeemed it keep their offer, but the code can no longer be used.`
            : undefined
        }
        confirmLabel={remove.isPending ? 'Deleting…' : 'Delete Promo Code'}
        loading={remove.isPending}
      />
    </Card>
  )
}
