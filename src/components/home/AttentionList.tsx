import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatQuantity } from '../../lib/labels.ts'
import { getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'
import { CategoryMark } from '../stock/CategoryMark.tsx'
import { StockStatusBadge } from '../stock/StockStatusBadge.tsx'

type AttentionListProps = {
  articles: readonly Article[]
}

export function AttentionList({ articles }: AttentionListProps) {
  return (
    <section aria-labelledby="alertas-titulo">
      <h2 id="alertas-titulo" className="text-lg font-semibold">
        Alertas de inventario
      </h2>
      {articles.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nada necesita atención.</p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-surface border border-line bg-white">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_8rem_8rem_7.5rem_1.25rem] gap-3 border-b border-line px-3 py-2 text-xs font-medium text-muted lg:grid">
            <span className="pl-11">Artículo</span>
            <span>Stock actual</span>
            <span>Stock mínimo</span>
            <span>Estado</span>
            <span className="sr-only">Abrir</span>
          </div>
          <ul>
            {articles.map((article) => {
              const status = getStockStatus(article)

              return (
                <li key={article.id} className="border-b border-line last:border-b-0">
                  <Link
                    to={`/stock/${article.id}`}
                    className="flex min-h-14 items-center gap-3 px-3 hover:bg-cream lg:grid lg:grid-cols-[minmax(0,1.6fr)_8rem_8rem_7.5rem_1.25rem]"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <CategoryMark category={article.category} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">
                            {article.name}
                          </span>
                          <span className="lg:hidden">
                            <StockStatusBadge status={status} />
                          </span>
                        </span>
                        <span className="block text-[13px] text-muted lg:hidden">
                          <span className="tabular-nums">
                            {formatQuantity(article.currentStock, article.unit)}
                          </span>
                          {' · mín. '}
                          <span className="tabular-nums">
                            {formatQuantity(article.minimumStock, article.unit)}
                          </span>
                        </span>
                      </span>
                    </span>
                    <span className="hidden text-sm font-semibold tabular-nums lg:block">
                      {formatQuantity(article.currentStock, article.unit)}
                    </span>
                    <span className="hidden text-sm text-muted tabular-nums lg:block">
                      {formatQuantity(article.minimumStock, article.unit)}
                    </span>
                    <span className="hidden lg:block">
                      <StockStatusBadge status={status} />
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      size={16}
                      className="shrink-0 text-muted"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
