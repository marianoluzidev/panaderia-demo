import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatReviewedAgo } from '../../lib/dates.ts'
import { categoryLabels, formatQuantity } from '../../lib/labels.ts'
import { getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'
import { ArticleIllustration } from './ArticleIllustration.tsx'
import { StockStatusBadge } from './StockStatusBadge.tsx'

type StockArticleCardProps = {
  article: Article
}

export function StockArticleCard({ article }: StockArticleCardProps) {
  const status = getStockStatus(article)

  return (
    <Link
      to={`/stock/${article.id}`}
      className="flex items-start gap-3 rounded-3xl bg-white p-3 shadow-card ring-1 ring-line transition hover:ring-wheat-strong active:bg-cream md:items-center md:gap-4 md:p-4"
    >
      <ArticleIllustration illustration={article.illustration} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-3 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
        <span className="flex items-start justify-between gap-2 md:gap-3">
          <span className="min-w-0">
            <span className="block text-lg font-semibold">{article.name}</span>
            <span className="mt-0.5 block text-base text-muted">
              {categoryLabels[article.category]}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 lg:hidden">
            <StockStatusBadge status={status} />
            <ChevronRight
              aria-hidden="true"
              className="text-muted md:hidden"
            />
          </span>
        </span>
        <span>
          <span className="block text-xl font-semibold">
            {formatQuantity(article.currentStock, article.unit)} disponibles
          </span>
          <span className="mt-0.5 block text-base text-muted md:mt-1">
            Mínimo {formatQuantity(article.minimumStock, article.unit)}
          </span>
          <span className="block text-base text-muted">
            {article.lastStockCheckAt === null
              ? 'Stock real sin revisar'
              : formatReviewedAgo(article.lastStockCheckAt)}
          </span>
        </span>
        <span className="hidden lg:block">
          <StockStatusBadge status={status} />
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="hidden shrink-0 text-muted md:block"
      />
    </Link>
  )
}
