import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { formatCompactDateTime } from '../../lib/dates.ts'
import {
  branchName,
  formatArticleLineCount,
  formatShipmentPreview,
} from '../../lib/shipments.ts'
import type { Article } from '../../types/article.ts'
import type { Branch } from '../../types/branch.ts'
import type { Shipment } from '../../types/shipment.ts'
import { ShipmentStatusBadge } from './ShipmentStatusBadge.tsx'

const columns =
  'lg:grid lg:grid-cols-[minmax(0,1fr)_9.5rem_7rem_7.5rem_minmax(0,1.3fr)_1.25rem] lg:items-center lg:gap-3'

type ShipmentListProps = {
  shipments: readonly Shipment[]
  articles: readonly Article[]
  branches: readonly Branch[]
}

export function ShipmentList({
  shipments,
  articles,
  branches,
}: ShipmentListProps) {
  return (
    <div className="overflow-hidden rounded-surface border border-line bg-white">
      <div
        className={cn(
          'hidden border-b border-line px-3 py-2 text-xs font-medium text-muted lg:grid',
          'lg:grid-cols-[minmax(0,1fr)_9.5rem_7rem_7.5rem_minmax(0,1.3fr)_1.25rem] lg:gap-3',
        )}
      >
        <span>Destino</span>
        <span>Fecha</span>
        <span>Artículos</span>
        <span>Estado</span>
        <span>Resumen</span>
        <span className="sr-only">Abrir</span>
      </div>
      <ul>
        {shipments.map((shipment) => {
          const when = shipment.confirmedAt ?? shipment.createdAt
          const destination = branchName(branches, shipment.destinationBranchId)
          const preview = formatShipmentPreview(articles, shipment.items)
          const count = formatArticleLineCount(shipment.items.length)

          return (
            <li key={shipment.id} className="border-b border-line last:border-b-0">
              <Link
                to={`/envios/${shipment.id}`}
                className={cn('flex items-center gap-3 px-3 py-2.5 hover:bg-cream', columns)}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{destination}</span>
                    <span className="lg:hidden">
                      <ShipmentStatusBadge status={shipment.status} />
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-muted lg:hidden">
                    <time dateTime={when}>{formatCompactDateTime(when)}</time>
                    {' · '}
                    {count}
                  </span>
                  <span className="block truncate text-[13px] text-muted lg:hidden">
                    {preview}
                  </span>
                </span>
                <time
                  dateTime={when}
                  className="hidden text-sm text-muted lg:block"
                >
                  {formatCompactDateTime(when)}
                </time>
                <span className="hidden text-sm lg:block">{count}</span>
                <span className="hidden lg:block">
                  <ShipmentStatusBadge status={shipment.status} />
                </span>
                <span className="hidden truncate text-sm text-muted lg:block">{preview}</span>
                <ChevronRight aria-hidden="true" size={16} className="shrink-0 text-muted" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
