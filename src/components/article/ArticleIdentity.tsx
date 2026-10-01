import { categoryLabels } from '../../lib/labels.ts'
import { getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'
import { StockStatusBadge } from '../stock/StockStatusBadge.tsx'

type ArticleIdentityProps = {
  article: Article
}

export function ArticleIdentity({ article }: ArticleIdentityProps) {
  return (
    <div className="flex items-start gap-4">
      <ArticleIllustration illustration={article.illustration} />
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{article.name}</h1>
        <p className="mt-0.5 text-base text-muted">
          {categoryLabels[article.category]}
        </p>
        <div className="mt-1 md:mt-2">
          <StockStatusBadge status={getStockStatus(article)} />
        </div>
      </div>
    </div>
  )
}
