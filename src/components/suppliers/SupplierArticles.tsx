import { Link } from 'react-router'
import { categoryLabels, formatQuantity } from '../../lib/labels.ts'
import { getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'
import { StockStatusBadge } from '../stock/StockStatusBadge.tsx'

type SupplierArticlesProps = {
  articles: readonly Article[]
}

export function SupplierArticles({ articles }: SupplierArticlesProps) {
  if (articles.length === 0) {
    return <p className="text-base text-muted">Todavía no tiene artículos habituales.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
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
                  <span className="block font-semibold">{article.name}</span>
                  <StockStatusBadge status={status} />
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {categoryLabels[article.category]}
                </span>
                <span className="mt-1 block text-sm">
                  Stock {formatQuantity(article.currentStock, article.unit)}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  Mínimo {formatQuantity(article.minimumStock, article.unit)}
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
