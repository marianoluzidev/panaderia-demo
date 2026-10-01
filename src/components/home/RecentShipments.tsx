import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatDateTime } from '../../lib/dates.ts'
import {
  branchName,
  formatArticleLineCount,
  recentConfirmedShipments,
} from '../../lib/shipments.ts'
import { useStockDemo } from '../../state/useStockDemo.ts'
import { ShipmentStatusBadge } from '../shipments/ShipmentStatusBadge.tsx'

export function RecentShipments() {
  const { branches, shipments } = useStockDemo()
  const latest = recentConfirmedShipments(shipments)

  return (
    <section aria-labelledby="envios-recientes">
      <div className="flex items-center justify-between gap-3">
        <h2 id="envios-recientes" className="text-lg font-semibold">
          Envíos recientes
        </h2>
        <Link
          to="/envios"
          className="text-sm font-semibold text-wheat-strong underline-offset-2 hover:underline"
        >
          Ver todos
        </Link>
      </div>
      {latest.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Todavía no hay envíos confirmados.</p>
      ) : (
        <ul className="mt-3 overflow-hidden rounded-surface border border-line bg-white">
          {latest.map((shipment) => (
            <li key={shipment.id} className="border-b border-line last:border-b-0">
              <Link
                to={`/envios/${shipment.id}`}
                className="flex min-h-14 items-center gap-3 px-3 hover:bg-cream"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {branchName(branches, shipment.destinationBranchId)}
                    </span>
                    <ShipmentStatusBadge status={shipment.status} />
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">
                    {formatArticleLineCount(shipment.items.length)}
                    {' · '}
                    {formatDateTime(shipment.confirmedAt ?? shipment.createdAt)}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" size={16} className="shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
