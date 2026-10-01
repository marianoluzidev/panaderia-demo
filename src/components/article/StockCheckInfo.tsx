import { CircleCheck, TriangleAlert } from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import {
  formatLongDate,
  formatRelativeDays,
  shouldReviewStockAgain,
} from '../../lib/dates.ts'
import type { Article } from '../../types/article.ts'
import { Card } from '../ui/Card.tsx'

type StockCheckInfoProps = {
  article: Article
}

export function StockCheckInfo({ article }: StockCheckInfoProps) {
  if (article.lastStockCheckAt === null) {
    return (
      <Card className="p-3! md:p-5!">
        <h2 className="text-base font-semibold leading-tight">
          Última actualización del stock real
        </h2>
        <p className="mt-1 text-base md:mt-2">
          Todavía no se revisó el stock real
        </p>
      </Card>
    )
  }

  const checkedAt = new Date(article.lastStockCheckAt)
  const hasDate = !Number.isNaN(checkedAt.getTime())
  const needsReview = shouldReviewStockAgain(article.lastStockCheckAt)
  const StatusIcon = needsReview ? TriangleAlert : CircleCheck

  return (
    <Card className="p-3! md:p-5!">
      <h2 className="text-base font-semibold leading-tight">
        Última actualización del stock real
      </h2>
      <p className="mt-1 text-base md:mt-2">
        {hasDate ? formatLongDate(checkedAt) : 'Sin fecha'}
      </p>
      <p className="text-sm text-muted">
        {formatRelativeDays(article.lastStockCheckAt)}
      </p>
      <p
        className={cn(
          'mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold md:mt-3',
          needsReview ? 'bg-low-soft text-low' : 'bg-ok-soft text-ok',
        )}
      >
        <StatusIcon aria-hidden="true" size={16} />
        {needsReview
          ? 'Conviene volver a revisarlo'
          : 'Revisado recientemente'}
      </p>
    </Card>
  )
}
