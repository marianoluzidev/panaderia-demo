import { formatDateTime } from '../../lib/dates.ts'
import { formatSpokenQuantity } from '../../lib/labels.ts'
import {
  branchName,
  resultingStockForShipmentItem,
  shipmentItemLabel,
  shipmentStatusLabels,
} from '../../lib/shipments.ts'
import type { Article } from '../../types/article.ts'
import type { Branch } from '../../types/branch.ts'
import type { StockMovement } from '../../types/movement.ts'
import type { Shipment } from '../../types/shipment.ts'

type ShipmentSlipProps = {
  shipment: Shipment
  articles: readonly Article[]
  branches: readonly Branch[]
  movements: readonly StockMovement[]
}

export function ShipmentSlip({
  shipment,
  articles,
  branches,
  movements,
}: ShipmentSlipProps) {
  return (
    <section
      aria-labelledby="comprobante-envio"
      className="rounded-surface border border-line bg-white p-4"
    >
      <p className="text-xs font-medium text-muted">Comprobante de envío</p>
      <h2 id="comprobante-envio" className="mt-1 text-lg font-semibold">
        {branchName(branches, shipment.originBranchId)} →{' '}
        {branchName(branches, shipment.destinationBranchId)}
      </h2>
      <p className="mt-2 text-sm">
        Estado: {shipmentStatusLabels[shipment.status]}
      </p>
      <p className="text-sm">Creado: {formatDateTime(shipment.createdAt)}</p>
      {shipment.confirmedAt ? (
        <p className="text-sm">Confirmado: {formatDateTime(shipment.confirmedAt)}</p>
      ) : null}
      {shipment.note ? <p className="mt-2 text-sm">Nota: {shipment.note}</p> : null}
      <ul className="mt-4 border-t border-line">
        {shipment.items.map((item) => {
          const article = articles.find((candidate) => candidate.id === item.articleId)
          const resulting = resultingStockForShipmentItem(
            movements,
            shipment.id,
            item.articleId,
          )

          return (
            <li
              key={item.articleId}
              className="flex items-start justify-between gap-3 border-b border-line py-2.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {shipmentItemLabel(articles, item.articleId)}
                </p>
                {resulting !== null && article ? (
                  <p className="text-[13px] text-muted">
                    Stock resultante:{' '}
                    {formatSpokenQuantity(resulting, article.unit)}
                  </p>
                ) : null}
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums">
                {article
                  ? formatSpokenQuantity(item.quantity, article.unit)
                  : `${item.quantity}`}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
