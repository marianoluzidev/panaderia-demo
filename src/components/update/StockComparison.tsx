import { cn } from '../../lib/cn.ts'
import { formatAmount, formatRegisteredBefore } from '../../lib/labels.ts'
import { stockUpdateMessage, stockUpdateOutcome } from '../../lib/updateStock.ts'
import type { Article } from '../../types/article.ts'

const outcomeClassName = {
  increase: 'bg-ok-soft text-ok ring-ok/30',
  decrease: 'bg-alert-soft text-alert ring-alert/30',
  same: 'bg-cream text-ink ring-line',
} as const

type StockComparisonProps = {
  article: Article
  found: number
}

export function StockComparison({ article, found }: StockComparisonProps) {
  const outcome = stockUpdateOutcome(article.currentStock, found)

  return (
    <div
      aria-live="polite"
      className={cn(
        'rounded-3xl p-4 ring-1',
        outcomeClassName[outcome],
      )}
    >
      <p>{formatRegisteredBefore(article.currentStock, article.unit)}</p>
      <p className="mt-1">Encontraste {formatAmount(found)}</p>
      <p className="mt-3 text-base font-semibold">
        {stockUpdateMessage(article.currentStock, found, article.unit)}
      </p>
    </div>
  )
}
