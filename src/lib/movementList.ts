import type { Article } from '../types/article.ts'
import type { MovementType, StockMovement } from '../types/movement.ts'
import { calendarDayKey, daysSince, formatMovementDay } from './dates.ts'
import { normalizeSearchText } from './stockList.ts'

export type MovementTypeFilter = 'todos' | MovementType
export type MovementDateFilter = 'todos' | 'hoy' | '7-dias' | '30-dias'

export type MovementListQuery = {
  search: string
  type: MovementTypeFilter
  date: MovementDateFilter
}

export type ListedMovement = {
  movement: StockMovement
  article: Article
}

export type MovementGroup = {
  key: string
  label: string
  movements: ListedMovement[]
}

export type MovementSummary = {
  entradas: number
  salidas: number
  actualizaciones: number
}

export function hasActiveMovementFilters(query: MovementListQuery): boolean {
  return (
    query.search.trim() !== '' || query.type !== 'todos' || query.date !== 'todos'
  )
}

export function summarizeMovements(
  movements: readonly StockMovement[],
): MovementSummary {
  const summary: MovementSummary = {
    entradas: 0,
    salidas: 0,
    actualizaciones: 0,
  }

  for (const movement of movements) {
    if (movement.type === 'entrada') {
      summary.entradas += 1
    } else if (movement.type === 'salida') {
      summary.salidas += 1
    } else if (movement.type === 'conteo') {
      summary.actualizaciones += 1
    }
  }

  return summary
}

function matchesDate(
  isoDate: string,
  filter: MovementDateFilter,
  now: Date,
): boolean {
  if (filter === 'todos') {
    return true
  }

  const days = daysSince(isoDate, now)

  if (days === null || days < 0) {
    return false
  }

  if (filter === 'hoy') {
    return days === 0
  }

  if (filter === '7-dias') {
    return days <= 7
  }

  return days <= 30
}

export function listMovements(
  movements: readonly StockMovement[],
  articles: readonly Article[],
  query: MovementListQuery,
  now = new Date(),
): ListedMovement[] {
  const articlesById = new Map(articles.map((article) => [article.id, article]))
  const search = normalizeSearchText(query.search.trim())

  return movements
    .flatMap((movement) => {
      const article = articlesById.get(movement.articleId)

      if (!article) {
        return []
      }

      const matchesType = query.type === 'todos' || movement.type === query.type
      const matchesSearch =
        search === '' || normalizeSearchText(article.name).includes(search)

      if (!matchesType || !matchesSearch || !matchesDate(movement.date, query.date, now)) {
        return []
      }

      return [{ movement, article }]
    })
    .sort(
      (left, right) =>
        right.movement.date.localeCompare(left.movement.date) ||
        right.movement.id.localeCompare(left.movement.id),
    )
}

export function groupMovementsByDay(
  movements: readonly ListedMovement[],
  now = new Date(),
): MovementGroup[] {
  const groups: MovementGroup[] = []

  for (const item of movements) {
    const key = calendarDayKey(item.movement.date)
    const current = groups[groups.length - 1]

    if (current && current.key === key) {
      current.movements.push(item)
      continue
    }

    groups.push({
      key,
      label: formatMovementDay(item.movement.date, now),
      movements: [item],
    })
  }

  return groups
}

export function movementEmptyDetail(query: MovementListQuery): string {
  const search = query.search.trim() !== ''
  const type = query.type !== 'todos'
  const date = query.date !== 'todos'

  if (search && (type || date)) {
    return 'Ningún movimiento coincide con la búsqueda y los filtros.'
  }

  if (search) {
    return 'Ningún movimiento coincide con esa búsqueda.'
  }

  if (type && date) {
    return 'No hay movimientos de ese tipo en el período elegido.'
  }

  if (type) {
    return 'No hay movimientos de ese tipo.'
  }

  return 'No hay movimientos en el período elegido.'
}
