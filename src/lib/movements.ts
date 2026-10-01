import type { Unit } from '../types/article.ts'
import type { StockMovement } from '../types/movement.ts'
import { formatAmount, formatQuantity } from './labels.ts'
import { roundQuantity } from './quantityInput.ts'

export function movementsForArticle(
  articleId: string,
  source: readonly StockMovement[],
): StockMovement[] {
  return source
    .filter((movement) => movement.articleId === articleId)
    .sort((left, right) => right.date.localeCompare(left.date))
}

export function formatMovementChange(
  movement: StockMovement,
  unit: Unit,
): string {
  if (movement.type === 'conteo') {
    return `Stock actualizado a ${formatQuantity(movement.resultingStock, unit)}`
  }

  const amount = formatQuantity(Math.abs(movement.quantity), unit)

  if (movement.quantity > 0) {
    return `+${amount}`
  }

  if (movement.quantity < 0) {
    return `−${amount}`
  }

  return amount
}

export function formatMovementListChange(
  movement: StockMovement,
  unit: Unit,
): string {
  if (movement.type !== 'conteo') {
    return formatMovementChange(movement, unit)
  }

  const previous = roundQuantity(movement.resultingStock - movement.quantity)
  return `De ${formatAmount(previous)} a ${formatQuantity(movement.resultingStock, unit)}`
}
