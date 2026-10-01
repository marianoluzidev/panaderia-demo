import type { Article, Unit } from '../types/article.ts'
import { compareLastStockCheck, shouldReviewStockAgain } from './dates.ts'
import { formatSpokenQuantity } from './labels.ts'
import { normalizeSearchText } from './stockList.ts'
import { getStockStatus } from './stockStatus.ts'
import type { StockStatus } from '../types/stock.ts'

const statusRank: Record<StockStatus, number> = {
  'sin-stock': 0,
  bajo: 1,
  ok: 2,
}

export function compareArticlesForRealStockUpdate(
  left: Article,
  right: Article,
): number {
  const leftPending = shouldReviewStockAgain(left.lastStockCheckAt) ? 0 : 1
  const rightPending = shouldReviewStockAgain(right.lastStockCheckAt) ? 0 : 1

  if (leftPending !== rightPending) {
    return leftPending - rightPending
  }

  const byStatus = statusRank[getStockStatus(left)] - statusRank[getStockStatus(right)]

  if (byStatus !== 0) {
    return byStatus
  }

  const byDate = compareLastStockCheck(
    left.lastStockCheckAt,
    right.lastStockCheckAt,
  )

  if (byDate !== 0) {
    return byDate
  }

  return left.name.localeCompare(right.name, 'es')
}

export function articlesForRealStockUpdate(
  articles: readonly Article[],
  search: string,
): Article[] {
  const query = normalizeSearchText(search.trim())

  return articles
    .filter(
      (article) =>
        query === '' || normalizeSearchText(article.name).includes(query),
    )
    .sort(compareArticlesForRealStockUpdate)
}

export type StockUpdateOutcome = 'increase' | 'decrease' | 'same'

export function stockUpdateOutcome(
  current: number,
  found: number,
): StockUpdateOutcome {
  if (Math.abs(found - current) < 0.0005) {
    return 'same'
  }

  return found > current ? 'increase' : 'decrease'
}

export function stockUpdateMessage(
  current: number,
  found: number,
  unit: Unit,
): string {
  const outcome = stockUpdateOutcome(current, found)

  if (outcome === 'same') {
    return 'El stock ya coincide. No es necesario modificarlo.'
  }

  const difference = formatSpokenQuantity(Math.abs(found - current), unit)

  if (outcome === 'increase') {
    return `El stock aumentará en ${difference}`
  }

  return `El stock disminuirá en ${difference}`
}
