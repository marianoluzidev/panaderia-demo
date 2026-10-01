import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArticleIllustration } from '../components/stock/ArticleIllustration.tsx'
import { ShipmentConfirmPanel } from '../components/shipments/ShipmentConfirmPanel.tsx'
import { ShipmentNotFound } from '../components/shipments/ShipmentNotFound.tsx'
import { ShipmentSlip } from '../components/shipments/ShipmentSlip.tsx'
import { ShipmentStatusBadge } from '../components/shipments/ShipmentStatusBadge.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
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
      <header>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {branchName(branches, shipment.destinationBranchId)}
          </h1>
          <ShipmentStatusBadge status={shipment.status} />
        </div>
        <dl className="mt-3 flex flex-col gap-1 text-base">
          <div>
            <dt className="inline font-semibold">Origen: </dt>
            <dd className="inline">{branchName(branches, shipment.originBranchId)}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Destino: </dt>
            <dd className="inline">
              {branchName(branches, shipment.destinationBranchId)}
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold">Creado: </dt>
            <dd className="inline">{formatDateTime(shipment.createdAt)}</dd>
          </div>
          {shipment.confirmedAt ? (
            <div>
              <dt className="inline font-semibold">Confirmado: </dt>
              <dd className="inline">{formatDateTime(shipment.confirmedAt)}</dd>
            </div>
          ) : null}
        </dl>
        {shipment.note ? <p className="mt-3 text-base">{shipment.note}</p> : null}
      </header>

      {shipment.status === 'confirmed' ? (
        <p className="rounded-2xl bg-ok-soft px-4 py-3 text-sm font-semibold text-ok">
          Este envío ya fue confirmado y descontado del stock.
        </p>
      ) : null}

      <section aria-labelledby="articulos-envio">
        <h2 id="articulos-envio" className="text-lg font-semibold">
          Artículos
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {shipment.items.map((item) => {
            const article = articles.find((candidate) => candidate.id === item.articleId)
            const resulting = resultingStockForShipmentItem(
              movements,
              shipment.id,
              item.articleId,
            )

            return (
              <li key={item.articleId}>
                <Card className="flex items-start gap-3 p-4!">
                  {article ? (
                    <ArticleIllustration illustration={article.illustration} />
                  ) : null}
                  <div className="min-w-0">
                    <p className="font-semibold break-words">
                      {shipmentItemLabel(articles, item.articleId)}
                    </p>
                    {article ? (
                      <p className="mt-1 text-base">
                        {formatSpokenQuantity(item.quantity, article.unit)}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted">
                        No se puede confirmar hasta quitarlo.
                      </p>
                    )}
                    {resulting !== null && article ? (
                      <p className="text-sm text-muted">
                        Stock resultante:{' '}
                        {formatSpokenQuantity(resulting, article.unit)}
                      </p>
                    ) : null}
                  </div>
                </Card>
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
