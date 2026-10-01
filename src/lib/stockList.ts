import type { Article, ArticleCategory } from '../types/article.ts'
import type { StockStatus } from '../types/stock.ts'
import { compareArticlesByStatusAndName, getStockStatus } from './stockStatus.ts'

export type CategoryFilter = 'todos' | ArticleCategory
export type StatusFilter = 'todos' | StockStatus

export type StockListQuery = {
  search: string
  category: CategoryFilter
  status: StatusFilter
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function hasActiveStockFilters(query: StockListQuery): boolean {
  return (
    query.search.trim() !== '' ||
    query.category !== 'todos' ||
    query.status !== 'todos'
  )
}

export function filterStockArticles(
  articles: readonly Article[],
  query: StockListQuery,
): Article[] {
  const normalizedQuery = normalizeSearchText(query.search.trim())

  const matches = articles.filter((article) => {
    if (query.category !== 'todos' && article.category !== query.category) {
      return false
    }

    if (query.status !== 'todos' && getStockStatus(article) !== query.status) {
      return false
    }

    if (
      normalizedQuery !== '' &&
      !normalizeSearchText(article.name).includes(normalizedQuery)
    ) {
      return false
    }

    return true
  })

  return matches.sort(compareArticlesByStatusAndName)
}

export function formatArticleCount(count: number, filtered: boolean): string {
  const noun = count === 1 ? 'artículo' : 'artículos'

  if (!filtered) {
    return `${count} ${noun}`
  }

  const found = count === 1 ? 'encontrado' : 'encontrados'
  return `${count} ${noun} ${found}`
}
