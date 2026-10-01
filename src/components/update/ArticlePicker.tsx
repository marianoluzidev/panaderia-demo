import { Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn.ts'
import { categoryLabels, formatSpokenQuantity } from '../../lib/labels.ts'
import { articlesForRealStockUpdate } from '../../lib/updateStock.ts'
import type { Article } from '../../types/article.ts'
import { CategoryMark } from '../stock/CategoryMark.tsx'

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
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            size={18}
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
            className="h-11 w-full rounded-lg border border-line bg-field pr-3 pl-10 text-sm text-ink placeholder:text-muted"
          />
        </label>
      </form>
      {results.length === 0 ? (
        <p className="mt-4 text-base text-muted">
          No encontramos artículos con esa búsqueda.
        </p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-surface border border-line bg-white">
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
                  'flex min-h-14 w-full items-center gap-3 border-b border-line px-3 text-left last:border-b-0',
                  selected ? 'bg-wheat-soft' : 'bg-white hover:bg-cream',
                )}
              >
                <CategoryMark category={article.category} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{article.name}</span>
                  <span className="block truncate text-[13px] text-muted">
                    {categoryLabels[article.category]}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
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
