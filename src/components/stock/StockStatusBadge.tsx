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
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
        statusClassName[status],
      )}
    >
      {stockStatusLabels[status]}
    </span>
  )
}
