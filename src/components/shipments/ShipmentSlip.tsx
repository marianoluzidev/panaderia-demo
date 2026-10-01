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
      className="rounded-3xl bg-white p-5 ring-2 ring-ink/15"
    >
      <p className="text-sm font-semibold tracking-wide text-muted uppercase">
        Comprobante de envío
      </p>
      <h2 id="comprobante-envio" className="mt-1 text-xl font-semibold">
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
      <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
        {shipment.items.map((item) => {
          const article = articles.find((candidate) => candidate.id === item.articleId)
          const resulting = resultingStockForShipmentItem(
            movements,
            shipment.id,
            item.articleId,
          )

          return (
            <li key={item.articleId} className="min-w-0">
              <p className="font-semibold break-words">
                {shipmentItemLabel(articles, item.articleId)}
              </p>
              <p className="text-sm">
                {article
                  ? formatSpokenQuantity(item.quantity, article.unit)
                  : `${item.quantity}`}
              </p>
              {resulting !== null && article ? (
                <p className="text-sm text-muted">
                  Stock resultante:{' '}
                  {formatSpokenQuantity(resulting, article.unit)}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
