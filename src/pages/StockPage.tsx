import { useState } from 'react'
import { StockFilters } from '../components/stock/StockFilters.tsx'
import { StockHeader } from '../components/stock/StockHeader.tsx'
import { StockList } from '../components/stock/StockList.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import {
  filterStockArticles,
  formatArticleCount,
  hasActiveStockFilters,
  type CategoryFilter,
  type StatusFilter,
} from '../lib/stockList.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function StockPage() {
  usePageTitle('Stock')

  const { articles } = useStockDemo()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('todos')
  const [status, setStatus] = useState<StatusFilter>('todos')

  const query = { search, category, status }
  const results = filterStockArticles(articles, query)
  const filtered = hasActiveStockFilters(query)

  function clearFilters() {
    setSearch('')
    setCategory('todos')
    setStatus('todos')
  }

  const emptyMessage =
    search.trim() === ''
      ? 'No hay artículos con estos filtros.'
      : 'No encontramos artículos con esa búsqueda.'

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <StockHeader countLabel={formatArticleCount(results.length, filtered)} />
      <StockFilters
        search={search}
        category={category}
        status={status}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />
      <div className="hidden flex-wrap items-center justify-between gap-3 md:flex">
        <p className="text-base font-medium text-ink" aria-live="polite">
          {formatArticleCount(results.length, filtered)}
        </p>
        {filtered && results.length > 0 ? (
          <Button variant="secondary" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>
      {filtered && results.length > 0 ? (
        <button
          type="button"
          className="min-h-11 self-start rounded-2xl bg-white px-4 text-base font-semibold text-ink ring-1 ring-line transition hover:bg-wheat-soft active:bg-wheat-soft md:hidden"
          onClick={clearFilters}
        >
          Limpiar filtros
        </button>
      ) : null}
      {results.length === 0 ? (
        <Card className="flex flex-col items-start gap-4">
          <p className="text-base text-ink">{emptyMessage}</p>
          <Button variant="secondary" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </Card>
      ) : (
        <StockList articles={results} />
      )}
    </div>
  )
}
