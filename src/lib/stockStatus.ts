import { compareLastStockCheck } from './dates.ts'
import { formatQuantity } from './labels.ts'
import type { Article } from '../types/article.ts'
import type { StockStatus } from '../types/stock.ts'

export type StockSummary = {
  ok: number
  bajo: number
  sinStock: number
}

const attentionOrder: Record<StockStatus, number> = {
  'sin-stock': 0,
  bajo: 1,
  ok: 2,
}

export function getStockStatus(
  article: Pick<Article, 'currentStock' | 'minimumStock'>,
): StockStatus {
  if (article.currentStock <= 0) {
    return 'sin-stock'
  }

  if (article.currentStock <= article.minimumStock) {
    return 'bajo'
  }

  return 'ok'
}

export function formatMinimumGap(
  article: Pick<Article, 'currentStock' | 'minimumStock' | 'unit'>,
): string {
  if (getStockStatus(article) === 'sin-stock') {
    return 'No quedan unidades disponibles'
  }

  const missing = article.minimumStock - article.currentStock

  if (missing > 0) {
    return `Faltan ${formatQuantity(missing, article.unit)} para alcanzar el mínimo`
  }

  if (missing === 0) {
    return 'Está en el mínimo recomendado'
  }

  return `Tiene ${formatQuantity(article.currentStock - article.minimumStock, article.unit)} por encima del mínimo`
}

export function summarizeStock(articles: readonly Article[]): StockSummary {
  const summary: StockSummary = { ok: 0, bajo: 0, sinStock: 0 }

  for (const article of articles) {
    const status = getStockStatus(article)

    if (status === 'ok') {
      summary.ok += 1
    } else if (status === 'bajo') {
      summary.bajo += 1
    } else {
      summary.sinStock += 1
    }
  }

  return summary
}

export function compareArticlesByStatusAndName(
  left: Article,
  right: Article,
): number {
  const byStatus =
    attentionOrder[getStockStatus(left)] - attentionOrder[getStockStatus(right)]

  if (byStatus !== 0) {
    return byStatus
  }

  return left.name.localeCompare(right.name, 'es')
}

export function articlesNeedingAttention(
  articles: readonly Article[],
): Article[] {
  return articles
    .filter((article) => getStockStatus(article) !== 'ok')
    .sort(compareArticlesByStatusAndName)
}

export function articlesPendingReview(
  articles: readonly Article[],
  limit = 3,
): Article[] {
  return [...articles]
    .sort((left, right) =>
      compareLastStockCheck(left.lastStockCheckAt, right.lastStockCheckAt),
    )
    .slice(0, limit)
}
