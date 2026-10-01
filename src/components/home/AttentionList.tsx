import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'
import { StockStatusBadge } from '../stock/StockStatusBadge.tsx'
import { cn } from '../../lib/cn.ts'
import { categoryLabels, formatQuantity } from '../../lib/labels.ts'
import { getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'

type AttentionListProps = {
  articles: readonly Article[]
  className?: string
}

export function AttentionList({ articles, className }: AttentionListProps) {
  return (
    <section className={cn('min-w-0', className)} aria-labelledby="atencion-titulo">
      <h2 id="atencion-titulo" className="text-lg font-semibold">
        Necesitan atención
      </h2>
      {articles.length === 0 ? (
        <p className="mt-4 text-base text-muted">Nada necesita atención.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {articles.map((article) => {
            const status = getStockStatus(article)

            return (
              <li key={article.id}>
                <Link
                  to={`/stock/${article.id}`}
                  className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line transition hover:ring-wheat-strong active:bg-cream"
                >
                  <ArticleIllustration illustration={article.illustration} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-semibold">{article.name}</span>
                      <StockStatusBadge status={status} />
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {categoryLabels[article.category]}
                    </span>
                    <span className="mt-2 block text-sm">
                      {formatQuantity(article.currentStock, article.unit)}{' '}
                      disponibles
                    </span>
                    <span className="block text-sm text-muted">
                      Mínimo {formatQuantity(article.minimumStock, article.unit)}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="shrink-0 text-muted"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
