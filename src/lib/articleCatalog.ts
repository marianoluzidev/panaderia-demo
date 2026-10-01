import type { Article, ArticleCategory } from '../types/article.ts'
import { normalizeSearchText } from './stockList.ts'

export type ArticleCategoryFilter = 'todos' | ArticleCategory

export type ArticleListQuery = {
  search: string
  category: ArticleCategoryFilter
}

export function hasActiveArticleFilters(query: ArticleListQuery): boolean {
  return query.search.trim() !== '' || query.category !== 'todos'
}

export function listArticles(
  articles: readonly Article[],
  query: ArticleListQuery,
): Article[] {
  const search = normalizeSearchText(query.search.trim())

  return articles
    .filter((article) => {
      const matchesCategory =
        query.category === 'todos' || article.category === query.category
      const matchesSearch =
        search === '' || normalizeSearchText(article.name).includes(search)

      return matchesCategory && matchesSearch
    })
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))
}

export function articleEmptyDetail(query: ArticleListQuery): string {
  if (query.search.trim() !== '') {
    return 'Ningún artículo coincide con esa búsqueda.'
  }

  return 'No hay artículos en esta categoría.'
}
