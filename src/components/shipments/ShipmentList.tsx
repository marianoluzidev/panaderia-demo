import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatDateTime } from '../../lib/dates.ts'
import {
  branchName,
  formatArticleLineCount,
  formatShipmentPreview,
} from '../../lib/shipments.ts'
import type { Article } from '../../types/article.ts'
import type { Branch } from '../../types/branch.ts'
import type { Shipment } from '../../types/shipment.ts'
import { ShipmentStatusBadge } from './ShipmentStatusBadge.tsx'

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
    <ul className="flex flex-col gap-3">
      {shipments.map((shipment) => {
        const when = shipment.confirmedAt ?? shipment.createdAt

        return (
          <li key={shipment.id}>
            <Link
              to={`/envios/${shipment.id}`}
              className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line transition hover:ring-wheat-strong active:bg-cream"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="block font-semibold">
                    {branchName(branches, shipment.destinationBranchId)}
                  </span>
                  <ShipmentStatusBadge status={shipment.status} />
                </span>
                <time
                  dateTime={when}
                  className="mt-1 block text-sm text-muted"
                >
                  {formatDateTime(when)}
                </time>
                <span className="mt-2 block text-sm font-semibold">
                  {formatArticleLineCount(shipment.items.length)}
                </span>
                <span className="mt-0.5 block text-sm break-words text-muted">
                  {formatShipmentPreview(articles, shipment.items)}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="shrink-0 text-muted" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
