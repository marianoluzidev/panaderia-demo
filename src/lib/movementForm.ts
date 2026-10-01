import type { Unit } from '../types/article.ts'
import type { ManualMovementType } from '../types/movement.ts'
import { formatSpokenQuantity } from './labels.ts'
import { parseRealQuantity, roundQuantity } from './quantityInput.ts'

export function movementQuantityError(
  raw: string,
  unit: Unit,
  type: ManualMovementType,
  available: number,
): string | null {
  if (type === 'salida' && available <= 0) {
    return 'No hay stock disponible. No se puede registrar una salida.'
  }

  const parsed = parseRealQuantity(raw, unit)

  if (parsed === null) {
    return null
  }

  if (parsed === 0) {
    return 'Ingresá una cantidad mayor a cero.'
  }

  if (type === 'salida' && parsed > available) {
    const adjective = available === 1 ? 'disponible' : 'disponibles'
    return `No hay suficiente stock. Hay ${formatSpokenQuantity(available, unit)} ${adjective}.`
  }

  return null
}

export function nextStockAfterMovement(
  current: number,
  type: ManualMovementType,
  quantity: number,
): number {
  const signed = type === 'entrada' ? quantity : -quantity
  return roundQuantity(current + signed)
}
