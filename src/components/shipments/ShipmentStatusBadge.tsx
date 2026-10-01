import { cn } from '../../lib/cn.ts'
import { shipmentStatusLabels } from '../../lib/shipments.ts'
import type { ShipmentStatus } from '../../types/shipment.ts'

const statusClassName: Record<ShipmentStatus, string> = {
  draft: 'bg-low-soft text-low',
  confirmed: 'bg-ok-soft text-ok',
}

type ShipmentStatusBadgeProps = {
  status: ShipmentStatus
}

export function ShipmentStatusBadge({ status }: ShipmentStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
        statusClassName[status],
      )}
    >
      {shipmentStatusLabels[status]}
    </span>
  )
}
