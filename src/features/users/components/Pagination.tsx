import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatCount } from '../lib/labels'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

type Item = number | 'gap'

/** 1 2 3 … N (Figma) — sliding window around the current page. */
function pageItems(page: number, pages: number): Item[] {
  if (pages <= 6) return Array.from({ length: pages }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, 'gap', pages]
  if (page >= pages - 2) return [1, 'gap', pages - 2, pages - 1, pages]
  return [1, 'gap', page, 'gap', pages]
}

const box =
  'inline-flex h-9 items-center justify-center rounded-[10px] border text-body font-semibold transition-colors'

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)

  return (
    <nav aria-label="Pagination" className="flex w-full flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
      <p className="text-body text-muted">
        Showing {formatCount(from)}–{formatCount(to)} of {formatCount(total)} users
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(box, 'w-9 border-line bg-white text-ink hover:bg-pearl disabled:cursor-not-allowed disabled:opacity-40')}
        >
          <Icon name="chevL" size={16} />
        </button>
        {pageItems(page, pages).map((item, i) =>
          item === 'gap' ? (
            <span key={`gap-${i}`} className={cn(box, 'border-line bg-white px-3 text-ink')}>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                box,
                'min-w-9 px-3',
                item === page ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:bg-pearl',
              )}
            >
              {formatCount(item)}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className={cn(box, 'w-9 border-line bg-white text-ink hover:bg-pearl disabled:cursor-not-allowed disabled:opacity-40')}
        >
          <Icon name="users-chevR" size={16} />
        </button>
      </div>
    </nav>
  )
}
