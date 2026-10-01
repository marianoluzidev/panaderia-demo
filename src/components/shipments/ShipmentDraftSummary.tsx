import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'
import { formatSpokenQuantity } from '../../lib/labels.ts'
import { parseRealQuantity } from '../../lib/quantityInput.ts'
import { replaceShipmentQuantity, shipmentItemLabel } from '../../lib/shipments.ts'
import type { Article } from '../../types/article.ts'
import type { ShipmentItem } from '../../types/shipment.ts'
import { ShipmentQuantityControl } from './ShipmentQuantityControl.tsx'

type ShipmentDraftSummaryProps = {
  articles: readonly Article[]
  items: readonly ShipmentItem[]
  quantities: Record<string, string>
  onQuantitiesChange: (articleId: string, value: string) => void
  onItemsChange: (items: readonly ShipmentItem[], error: string | null) => void
}

export function ShipmentDraftSummary({
  articles,
  items,
  quantities,
  onQuantitiesChange,
  onItemsChange,
}: ShipmentDraftSummaryProps) {
  return (
    <section aria-labelledby="envio-resumen">
      <h2 id="envio-resumen" className="text-lg font-semibold">
        3. Resumen del envío
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-base text-muted">Todavía no agregaste artículos.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((item) => {
            const article = articles.find((candidate) => candidate.id === item.articleId)

            if (!article) {
              return (
                <li
                  key={item.articleId}
                  className="rounded-3xl bg-white p-4 ring-1 ring-line"
                >
                  <p className="font-semibold">Artículo no disponible</p>
                  <button
                    type="button"
                    className="mt-3 min-h-11 text-sm font-semibold text-alert underline-offset-2 hover:underline"
                    onClick={() => {
                      onItemsChange(
                        items.filter((current) => current.articleId !== item.articleId),
                        null,
                      )
                    }}
                  >
                    Quitar
                  </button>
                </li>
              )
            }

            const raw = quantities[item.articleId] ?? String(item.quantity)

            return (
              <li
                key={item.articleId}
                className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-line"
              >
                <div className="flex items-center gap-3">
                  <ArticleIllustration illustration={article.illustration} />
                  <div className="min-w-0">
                    <p className="font-semibold break-words">
                      {shipmentItemLabel(articles, item.articleId)}
                    </p>
                    <p className="text-sm text-muted">
                      Disponible:{' '}
                      {formatSpokenQuantity(article.currentStock, article.unit)}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <ShipmentQuantityControl
                    inputId={`envio-resumen-${item.articleId}`}
                    unit={article.unit}
                    label="Cantidad"
                    value={raw}
                    onChange={(value) => {
                      onQuantitiesChange(item.articleId, value)
                      const parsed = parseRealQuantity(value, article.unit)
                      if (parsed === null) {
                        return
                      }
                      if (parsed <= 0) {
                        onItemsChange(items, 'Ingresá una cantidad mayor a cero.')
                        return
                      }
                      const result = replaceShipmentQuantity(items, article, parsed)
                      onItemsChange(result.items, result.error)
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 min-h-11 text-sm font-semibold text-wheat-strong underline-offset-2 hover:underline"
                  onClick={() => {
                    onItemsChange(
                      items.filter((current) => current.articleId !== item.articleId),
                      null,
                    )
                  }}
                >
                  Quitar
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
