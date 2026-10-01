import { formatSpokenQuantity } from '../../lib/labels.ts'
import { CategoryMark } from '../stock/CategoryMark.tsx'
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
        <ul className="mt-3 overflow-hidden rounded-surface border border-line bg-white">
          {items.map((item) => {
            const article = articles.find((candidate) => candidate.id === item.articleId)

            if (!article) {
              return (
                <li
                  key={item.articleId}
                  className="flex items-center justify-between gap-3 border-b border-line px-3 py-3 last:border-b-0"
                >
                  <p className="text-sm font-semibold">Artículo no disponible</p>
                  <button
                    type="button"
                    className="min-h-11 shrink-0 px-2 text-sm font-semibold text-alert"
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
                className="border-b border-line px-3 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <CategoryMark category={article.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {shipmentItemLabel(articles, item.articleId)}
                    </p>
                    <p className="truncate text-[13px] text-muted">
                      Disponible:{' '}
                      {formatSpokenQuantity(article.currentStock, article.unit)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="min-h-11 shrink-0 px-2 text-sm font-semibold text-wheat-strong"
                    onClick={() => {
                      onItemsChange(
                        items.filter((current) => current.articleId !== item.articleId),
                        null,
                      )
                    }}
                  >
                    Quitar
                  </button>
                </div>
                <div className="mt-2">
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
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
