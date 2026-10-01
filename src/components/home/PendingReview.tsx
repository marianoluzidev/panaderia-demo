import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'
import { Card } from '../ui/Card.tsx'
import { cn } from '../../lib/cn.ts'
import { formatRelativeDays, formatReviewDate } from '../../lib/dates.ts'
import type { Article } from '../../types/article.ts'

type PendingReviewProps = {
  articles: readonly Article[]
  className?: string
}

export function PendingReview({ articles, className }: PendingReviewProps) {
  return (
    <section className={cn('min-w-0', className)} aria-labelledby="pendiente-titulo">
      <h2 id="pendiente-titulo" className="text-lg font-semibold">
        Stock pendiente de revisar
      </h2>
      <Card className="mt-4">
        {articles.length === 0 ? (
          <p className="text-base text-muted">
            Todo el stock fue revisado hace poco.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {articles.map((article) => (
              <li
                key={article.id}
                className="flex flex-col gap-3 border-b border-line pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{article.name}</p>
                  {article.lastStockCheckAt === null ? (
                    <p className="mt-1 text-sm font-medium text-ink">
                      Nunca revisado
                    </p>
                  ) : (
                    <>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {formatRelativeDays(article.lastStockCheckAt)}
                      </p>
                      <p className="text-sm text-muted">
                        Última revisión:{' '}
                        {formatReviewDate(article.lastStockCheckAt)}
                      </p>
                    </>
                  )}
                </div>
                <Link
                  to={`/stock/${article.id}`}
                  className={cn(buttonClassName('secondary'), 'shrink-0')}
                >
                  Revisar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  )
}
