import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { CategoryMark } from '../components/stock/CategoryMark.tsx'
import { ShipmentConfirmPanel } from '../components/shipments/ShipmentConfirmPanel.tsx'
import { ShipmentNotFound } from '../components/shipments/ShipmentNotFound.tsx'
import { ShipmentSlip } from '../components/shipments/ShipmentSlip.tsx'
import { ShipmentStatusBadge } from '../components/shipments/ShipmentStatusBadge.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { formatDateTime } from '../lib/dates.ts'
import { formatSpokenQuantity } from '../lib/labels.ts'
import {
  branchName,
  resultingStockForShipmentItem,
  shipmentConfirmError,
  shipmentItemLabel,
} from '../lib/shipments.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function ShipmentDetailPage() {
  const { id } = useParams()
  const { articles, branches, movements, shipments, confirmShipment } = useStockDemo()
  const shipment = shipments.find((item) => item.id === id) ?? null
  const [asking, setAsking] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  usePageTitle(shipment ? 'Envío' : 'Envío no encontrado')

  if (!shipment) {
    return <ShipmentNotFound />
  }

  const currentShipment = shipment
  const confirmError =
    shipment.status === 'draft'
      ? shipmentConfirmError(shipment, articles, branches)
      : null

  function confirm() {
    const result = confirmShipment(currentShipment.id)

    if (!result.ok) {
      setMessage(result.message)
      setAsking(false)
      return
    }

    setMessage(null)
    setAsking(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-5xl">
      <Link to="/envios" className={buttonClassName('secondary')}>
        <ArrowLeft aria-hidden="true" size={18} />
        Volver a Envíos
      </Link>
      <header className="rounded-surface border border-line bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg font-semibold">
            {branchName(branches, shipment.originBranchId)}
            {' → '}
            {branchName(branches, shipment.destinationBranchId)}
          </h1>
          <ShipmentStatusBadge status={shipment.status} />
        </div>
        <dl className="mt-3 flex flex-col gap-1 text-sm">
          <div>
            <dt className="inline text-muted">Creado: </dt>
            <dd className="inline">{formatDateTime(shipment.createdAt)}</dd>
          </div>
          {shipment.confirmedAt ? (
            <div>
              <dt className="inline text-muted">Confirmado: </dt>
              <dd className="inline">{formatDateTime(shipment.confirmedAt)}</dd>
            </div>
          ) : null}
        </dl>
        {shipment.note ? <p className="mt-3 text-sm">{shipment.note}</p> : null}
      </header>

      {shipment.status === 'confirmed' ? (
        <p className="rounded-surface border border-line bg-white px-4 py-3 text-sm text-ink">
          Este envío ya fue confirmado y descontado del stock.
        </p>
      ) : null}

      <section aria-labelledby="articulos-envio">
        <h2 id="articulos-envio" className="text-lg font-semibold">
          Artículos
        </h2>
        <ul className="mt-3 overflow-hidden rounded-surface border border-line bg-white">
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
                className="flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0"
              >
                {article ? <CategoryMark category={article.category} /> : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {shipmentItemLabel(articles, item.articleId)}
                  </p>
                  {article ? null : (
                    <p className="text-[13px] text-muted">
                      No se puede confirmar hasta quitarlo.
                    </p>
                  )}
                  {resulting !== null && article ? (
                    <p className="truncate text-[13px] text-muted">
                      Stock resultante:{' '}
                      {formatSpokenQuantity(resulting, article.unit)}
                    </p>
                  ) : null}
                </div>
                {article ? (
                  <p className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatSpokenQuantity(item.quantity, article.unit)}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>

      {shipment.status === 'draft' ? (
        <div className="flex flex-col gap-3">
          {confirmError ? <p className="text-sm text-alert">{confirmError}</p> : null}
          {message ? <p className="text-sm text-alert">{message}</p> : null}
          {asking ? (
            <ShipmentConfirmPanel
              pending={false}
              onConfirm={confirm}
              onCancel={() => {
                setAsking(false)
              }}
            />
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to={`/envios/nuevo?borrador=${shipment.id}`}
                className={buttonClassName('secondary')}
              >
                Continuar editando
              </Link>
              <button
                type="button"
                className={buttonClassName('primary')}
                disabled={confirmError !== null}
                onClick={() => {
                  setAsking(true)
                  setMessage(null)
                }}
              >
                Confirmar envío
              </button>
            </div>
          )}
        </div>
      ) : null}

      <ShipmentSlip
        shipment={shipment}
        articles={articles}
        branches={branches}
        movements={movements}
      />
    </div>
  )
}
