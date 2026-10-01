import { Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn.ts'
import { categoryLabels, formatSpokenQuantity } from '../../lib/labels.ts'
import { articlesForRealStockUpdate } from '../../lib/updateStock.ts'
import type { Article } from '../../types/article.ts'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'

type ArticlePickerProps = {
  articles: readonly Article[]
  selectedId: string | null
  onSelect: (articleId: string) => void
}

export function ArticlePicker({
  articles,
  selectedId,
  onSelect,
}: ArticlePickerProps) {
  const [search, setSearch] = useState('')
  const results = articlesForRealStockUpdate(articles, search)

  return (
    <section aria-labelledby="elegir-articulo">
      <h2 id="elegir-articulo" className="text-lg font-semibold">
        Elegí un artículo
      </h2>
      <form
        className="mt-3"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="actualizar-buscar" className="relative block">
          <span className="sr-only">Buscar un artículo</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            id="actualizar-buscar"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
            }}
            placeholder="Buscar un artículo"
            autoComplete="off"
            className="min-h-11 w-full rounded-2xl bg-white pr-4 pl-12 text-base text-ink ring-1 ring-line placeholder:text-muted"
          />
        </label>
      </form>
      {results.length === 0 ? (
        <p className="mt-4 text-base text-muted">
          No encontramos artículos con esa búsqueda.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {results.map((article) => {
            const selected = article.id === selectedId

            return (
              <button
                key={article.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  onSelect(article.id)
                }}
                className={cn(
                  'flex min-h-14 w-full items-center gap-3 rounded-2xl bg-white p-3 text-left ring-1 transition',
                  selected
                    ? 'ring-2 ring-wheat-strong'
                    : 'ring-line hover:ring-wheat',
                )}
              >
                <ArticleIllustration illustration={article.illustration} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{article.name}</span>
                  <span className="block text-sm text-muted">
                    {categoryLabels[article.category]}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold">
                  {formatSpokenQuantity(article.currentStock, article.unit)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
