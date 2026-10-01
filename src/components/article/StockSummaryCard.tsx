import { cn } from '../../lib/cn.ts'
import { formatQuantity } from '../../lib/labels.ts'
import { formatMinimumGap, getStockStatus } from '../../lib/stockStatus.ts'
import type { Article } from '../../types/article.ts'
import type { StockStatus } from '../../types/stock.ts'
import { Card } from '../ui/Card.tsx'

const summaryTone: Record<StockStatus, string> = {
  ok: 'bg-ok-soft/40 ring-ok/30',
  bajo: 'bg-low-soft/70 ring-low/30',
  'sin-stock': 'bg-alert-soft/80 ring-alert/30',
}

const gapTone: Record<StockStatus, string> = {
  ok: 'text-ok',
  bajo: 'text-low',
  'sin-stock': 'text-alert',
}

type StockSummaryCardProps = {
  article: Article
}

export function StockSummaryCard({ article }: StockSummaryCardProps) {
  const status = getStockStatus(article)

  return (
    <Card
      className={cn('p-3! ring-2 md:p-5!', summaryTone[status])}
      aria-label="Resumen de stock"
    >
      <p className="text-sm font-medium text-muted max-md:sr-only">
        Stock actual
      </p>
      <p className="text-3xl font-semibold leading-tight tracking-tight md:mt-2 lg:text-4xl">
        {formatQuantity(article.currentStock, article.unit)} disponibles
      </p>
      <p className="mt-2 text-base text-muted md:mt-3">
        Mínimo recomendado: {formatQuantity(article.minimumStock, article.unit)}
      </p>
      <p className={cn('mt-1 text-base font-semibold', gapTone[status])}>
        {formatMinimumGap(article)}
      </p>
    </Card>
  )
}
