import { Search } from 'lucide-react'
import { useState } from 'react'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'
import { categoryLabels, formatSpokenQuantity } from '../../lib/labels.ts'
import { parseRealQuantity } from '../../lib/quantityInput.ts'
import {
  insufficientStockMessage,
  mergeShipmentQuantity,
} from '../../lib/shipments.ts'
import { normalizeSearchText } from '../../lib/stockList.ts'
import type { Article } from '../../types/article.ts'
import type { ShipmentItem } from '../../types/shipment.ts'
import { ShipmentQuantityControl } from './ShipmentQuantityControl.tsx'

type ShipmentArticlePickerProps = {
  articles: readonly Article[]
  items: readonly ShipmentItem[]
  onItemsChange: (items: readonly ShipmentItem[], error: string | null) => void
}

export function ShipmentArticlePicker({
  articles,
  items,
  onItemsChange,
}: ShipmentArticlePickerProps) {
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(
    null,
  )
  const query = normalizeSearchText(search.trim())
  const visible = articles
    .filter(
      (article) => query === '' || normalizeSearchText(article.name).includes(query),
    )
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))

  function addArticle(article: Article) {
    const raw = quantities[article.id] ?? '1'
    const parsed = parseRealQuantity(raw, article.unit)

    if (parsed === null || parsed <= 0) {
      setRowError({ id: article.id, message: 'Ingresá una cantidad mayor a cero.' })
      return
    }

    if (parsed > article.currentStock) {
      setRowError({
        id: article.id,
        message: insufficientStockMessage(
          article.name,
          article.currentStock,
          article.unit,
        ),
      })
      return
    }

    const result = mergeShipmentQuantity(items, article, parsed)
    setRowError(result.error ? { id: article.id, message: result.error } : null)
    if (!result.error) {
      onItemsChange(result.items, null)
    }
  }

  return (
    <section aria-labelledby="envio-articulos">
      <h2 id="envio-articulos" className="text-lg font-semibold">
        2. Agregar artículos
      </h2>
      <form
        className="mt-3"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="envio-buscar" className="relative block">
          <span className="sr-only">Buscar un artículo</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            id="envio-buscar"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
            }}
            placeholder="Buscar un artículo"
            autoComplete="off"
            className="min-h-12 w-full rounded-2xl bg-white pr-4 pl-12 text-base text-ink ring-1 ring-line placeholder:text-muted focus-visible:ring-2 focus-visible:ring-wheat-strong"
          />
        </label>
      </form>
      {visible.length === 0 ? (
        <p className="mt-4 text-base text-muted">
          No encontramos artículos con esa búsqueda.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {visible.map((article) => {
            const selected = items.find((item) => item.articleId === article.id)
            const message = rowError?.id === article.id ? rowError.message : null

            return (
              <li
                key={article.id}
                className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-line"
              >
                <div className="flex items-start gap-3">
                  <ArticleIllustration illustration={article.illustration} />
                  <div className="min-w-0">
                    <p className="font-semibold break-words">{article.name}</p>
                    <p className="text-sm text-muted">
                      {categoryLabels[article.category]}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Disponible:{' '}
                      {formatSpokenQuantity(article.currentStock, article.unit)}
                    </p>
                    {selected ? (
                      <p className="text-sm text-muted">
                        En este envío:{' '}
                        {formatSpokenQuantity(selected.quantity, article.unit)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3">
                  <ShipmentQuantityControl
                    inputId={`envio-cantidad-${article.id}`}
                    unit={article.unit}
                    label="Cantidad"
                    value={quantities[article.id] ?? '1'}
                    onChange={(value) => {
                      setQuantities((current) => ({ ...current, [article.id]: value }))
                      setRowError(null)
                    }}
                  />
                </div>
                {message ? (
                  <p className="mt-2 text-sm text-alert">{message}</p>
                ) : null}
                <button
                  type="button"
                  className="mt-3 min-h-12 w-full rounded-2xl bg-wheat-strong px-4 text-base font-semibold text-white hover:bg-wheat-deep active:bg-wheat-deep disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={article.currentStock <= 0}
                  onClick={() => {
                    addArticle(article)
                  }}
                >
                  Agregar
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
