import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatDateTime } from '../../lib/dates.ts'
import {
  branchName,
  formatArticleLineCount,
  recentConfirmedShipments,
} from '../../lib/shipments.ts'
import { useStockDemo } from '../../state/useStockDemo.ts'
import { Card } from '../ui/Card.tsx'

export function RecentShipments() {
  const { branches, shipments } = useStockDemo()
  const latest = recentConfirmedShipments(shipments)

  return (
    <section aria-labelledby="ultimos-envios">
      <div className="flex items-center justify-between gap-3">
        <h2 id="ultimos-envios" className="text-lg font-semibold">
          Últimos envíos
        </h2>
        <Link
          to="/envios"
          className="text-sm font-semibold text-wheat-strong underline-offset-2 hover:underline"
        >
          Ver todos
        </Link>
      </div>
      <Card className="mt-4">
        {latest.length === 0 ? (
          <p className="text-base text-muted">Todavía no hay envíos confirmados.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {latest.map((shipment) => (
              <li key={shipment.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                <Link
                  to={`/envios/${shipment.id}`}
                  className="flex items-center gap-3 rounded-2xl hover:bg-wheat-soft"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      {branchName(branches, shipment.destinationBranchId)}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {formatDateTime(shipment.confirmedAt ?? shipment.createdAt)}
                    </span>
                    <span className="block text-sm">
                      {formatArticleLineCount(shipment.items.length)}
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" className="shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  )
}
