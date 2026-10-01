import { cn } from '../../lib/cn.ts'
import { stockStatusLabels } from '../../lib/labels.ts'
import type { StockStatus } from '../../types/stock.ts'

const statusClassName: Record<StockStatus, string> = {
  ok: 'bg-ok-soft text-ok',
  bajo: 'bg-low-soft text-low',
  'sin-stock': 'bg-alert-soft text-alert',
}

type StockStatusBadgeProps = {
  status: StockStatus
}

export function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1.5 rounded-md px-1.5 text-xs font-medium whitespace-nowrap',
        statusClassName[status],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {stockStatusLabels[status]}
    </span>
  )
}
