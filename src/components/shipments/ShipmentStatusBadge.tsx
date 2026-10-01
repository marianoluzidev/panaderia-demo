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
        'inline-flex h-5 shrink-0 items-center gap-1.5 rounded-md px-1.5 text-xs font-medium whitespace-nowrap',
        statusClassName[status],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {shipmentStatusLabels[status]}
    </span>
  )
}
