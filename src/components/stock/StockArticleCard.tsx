import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatReviewedAgo } from '../../lib/dates.ts'
import { formatQuantity } from '../../lib/labels.ts'
import { getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'
import { CategoryMark } from './CategoryMark.tsx'
import { StockStatusBadge } from './StockStatusBadge.tsx'

type StockArticleCardProps = {
  article: Article
}

export function StockArticleCard({ article }: StockArticleCardProps) {
  const status = getStockStatus(article)
  const review =
    article.lastStockCheckAt === null
      ? 'Sin revisar'
      : formatReviewedAgo(article.lastStockCheckAt)

  return (
    <Link
      to={`/stock/${article.id}`}
      className="flex min-h-14 items-center gap-3 px-3 hover:bg-cream lg:grid lg:grid-cols-[minmax(0,1.7fr)_7.5rem_7.5rem_10rem_7.5rem_1.25rem] lg:gap-3"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <CategoryMark category={article.category} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{article.name}</span>
          <span className="block text-[13px] text-muted tabular-nums lg:hidden">
            {formatQuantity(article.currentStock, article.unit)}
          </span>
        </span>
      </span>
      <span className="hidden text-sm font-semibold tabular-nums lg:block">
        {formatQuantity(article.currentStock, article.unit)}
      </span>
      <span className="hidden text-sm text-muted tabular-nums lg:block">
        {formatQuantity(article.minimumStock, article.unit)}
      </span>
      <span className="hidden truncate text-sm text-muted lg:block">{review}</span>
      <StockStatusBadge status={status} />
      <ChevronRight aria-hidden="true" size={16} className="shrink-0 text-muted" />
    </Link>
  )
}
