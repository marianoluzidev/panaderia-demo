import { branchSucursal1Id, branchSucursal2Id } from '../data/branches.ts'
import type { Article } from '../types/article.ts'
import type { Branch } from '../types/branch.ts'
import type { StockMovement } from '../types/movement.ts'
import type { Shipment, ShipmentItem, ShipmentStatus } from '../types/shipment.ts'
import { daysSince } from './dates.ts'
import { formatSpokenQuantity } from './labels.ts'
import { maxRealQuantity, roundQuantity } from './quantityInput.ts'

export type ShipmentFilter =
  | 'todos'
  | 'confirmados'
  | 'borradores'
  | 'sucursal-1'
  | 'sucursal-2'

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  draft: 'Borrador',
  confirmed: 'Confirmado',
}

const destinationFilterIds: Partial<Record<ShipmentFilter, string>> = {
  'sucursal-1': branchSucursal1Id,
  'sucursal-2': branchSucursal2Id,
}

export function destinationBranches(branches: readonly Branch[]): Branch[] {
  return branches.filter((branch) => !branch.isCentral)
}

export function centralBranch(branches: readonly Branch[]): Branch | undefined {
  return branches.find((branch) => branch.isCentral)
}

export function branchName(
  branches: readonly Branch[],
  branchId: string,
): string {
  return branches.find((branch) => branch.id === branchId)?.name ?? 'Sucursal no disponible'
}

export function compareShipments(left: Shipment, right: Shipment): number {
  if (left.status !== right.status) {
    return left.status === 'draft' ? -1 : 1
  }

  const leftDate = left.confirmedAt ?? left.createdAt
  const rightDate = right.confirmedAt ?? right.createdAt
  return rightDate.localeCompare(leftDate)
}

export function filterShipments(
  shipments: readonly Shipment[],
  filter: ShipmentFilter,
): Shipment[] {
  const destinationId = destinationFilterIds[filter]

  return shipments
    .filter((shipment) => {
      if (filter === 'confirmados') {
        return shipment.status === 'confirmed'
      }

      if (filter === 'borradores') {
        return shipment.status === 'draft'
      }

      if (destinationId) {
        return shipment.destinationBranchId === destinationId
      }

      return true
    })
    .sort(compareShipments)
}

export function countRecentShipmentLines(
  shipments: readonly Shipment[],
  now = new Date(),
): number {
  return shipments.reduce((total, shipment) => {
    if (shipment.status !== 'confirmed' || !shipment.confirmedAt) {
      return total
    }

    const days = daysSince(shipment.confirmedAt, now)

    if (days === null || days < 0 || days > 7) {
      return total
    }

    return total + shipment.items.length
  }, 0)
}

export function recentConfirmedShipments(
  shipments: readonly Shipment[],
  limit = 2,
): Shipment[] {
  return shipments
    .filter((shipment) => shipment.status === 'confirmed')
    .sort((left, right) =>
      (right.confirmedAt ?? right.createdAt).localeCompare(
        left.confirmedAt ?? left.createdAt,
      ),
    )
    .slice(0, limit)
}

export function formatArticleLineCount(count: number): string {
  return count === 1 ? '1 artículo' : `${count} artículos`
}

export function shipmentItemLabel(
  articles: readonly Article[],
  articleId: string,
): string {
  return articles.find((article) => article.id === articleId)?.name ?? 'Artículo no disponible'
}

export function formatShipmentPreview(
  articles: readonly Article[],
  items: readonly ShipmentItem[],
): string {
  if (items.length === 0) {
    return 'Sin artículos'
  }

  const names = items.map((item) => shipmentItemLabel(articles, item.articleId))

  if (names.length === 1) {
    return names[0] ?? 'Sin artículos'
  }

  if (names.length === 2) {
    return `${names[0]} y ${names[1]}`
  }

  const extra = names.length - 2
  const suffix = extra === 1 ? '1 más' : `${extra} más`
  return `${names[0]}, ${names[1]} y ${suffix}`
}

export function resultingStockForShipmentItem(
  movements: readonly StockMovement[],
  shipmentId: string,
  articleId: string,
): number | null {
  const movement = movements.find(
    (item) =>
      item.referenceType === 'shipment' &&
      item.referenceId === shipmentId &&
      item.articleId === articleId &&
      item.type === 'salida',
  )

  return movement?.resultingStock ?? null
}

export function normalizeShipmentItems(
  items: readonly ShipmentItem[],
): ShipmentItem[] {
  return items.map((item) => ({
    articleId: item.articleId,
    quantity: roundQuantity(item.quantity),
  }))
}

export function shipmentHasDuplicateArticles(items: readonly ShipmentItem[]): boolean {
  const seen = new Set<string>()

  for (const item of items) {
    if (seen.has(item.articleId)) {
      return true
    }

    seen.add(item.articleId)
  }

  return false
}

export function shipmentDraftError(
  destinationBranchId: string,
  items: readonly ShipmentItem[],
  branches: readonly Branch[],
): string | null {
  const destination = branches.find((branch) => branch.id === destinationBranchId)

  if (!destination || destination.isCentral) {
    return 'Elegí una sucursal de destino.'
  }

  if (items.length === 0) {
    return 'Agregá al menos un artículo.'
  }

  if (shipmentHasDuplicateArticles(items)) {
    return 'Hay un artículo repetido en el envío.'
  }

  if (items.some((item) => !(item.quantity > 0) || item.quantity > maxRealQuantity)) {
    return 'Ingresá una cantidad mayor a cero.'
  }

  return null
}

export function shipmentConfirmError(
  shipment: Pick<Shipment, 'status' | 'destinationBranchId' | 'items'>,
  articles: readonly Article[],
  branches: readonly Branch[],
): string | null {
  if (shipment.status === 'confirmed') {
    return 'Este envío ya fue confirmado.'
  }

  const draftError = shipmentDraftError(
    shipment.destinationBranchId,
    shipment.items,
    branches,
  )

  if (draftError) {
    return draftError
  }

  for (const item of shipment.items) {
    const article = articles.find((candidate) => candidate.id === item.articleId)

    if (!article) {
      return 'Hay un artículo que ya no está disponible. Corregí el envío antes de confirmar.'
    }

    if (item.quantity > article.currentStock) {
      return insufficientStockMessage(article.name, article.currentStock, article.unit)
    }
  }

  return null
}

export function insufficientStockMessage(
  name: string,
  available: number,
  unit: Article['unit'],
): string {
  if (available <= 0) {
    return `No hay stock de ${name}.`
  }

  const adjective = available === 1 ? 'disponible' : 'disponibles'
  return `No hay suficiente stock de ${name}. Hay ${formatSpokenQuantity(available, unit)} ${adjective}.`
}

export function mergeShipmentQuantity(
  items: readonly ShipmentItem[],
  article: Article,
  quantity: number,
): { items: ShipmentItem[]; error: string | null } {
  const nextQuantity = roundQuantity(quantity)

  if (!(nextQuantity > 0) || nextQuantity > maxRealQuantity) {
    return { items: [...items], error: 'Ingresá una cantidad mayor a cero.' }
  }

  const current = items.find((item) => item.articleId === article.id)
  const total = roundQuantity((current?.quantity ?? 0) + nextQuantity)

  if (total > article.currentStock) {
    return {
      items: [...items],
      error: insufficientStockMessage(article.name, article.currentStock, article.unit),
    }
  }

  if (!current) {
    return {
      items: [...items, { articleId: article.id, quantity: total }],
      error: null,
    }
  }

  return {
    items: items.map((item) =>
      item.articleId === article.id ? { ...item, quantity: total } : item,
    ),
    error: null,
  }
}

export function replaceShipmentQuantity(
  items: readonly ShipmentItem[],
  article: Article,
  quantity: number,
): { items: ShipmentItem[]; error: string | null } {
  const nextQuantity = roundQuantity(quantity)

  if (!(nextQuantity > 0) || nextQuantity > maxRealQuantity) {
    return { items: [...items], error: 'Ingresá una cantidad mayor a cero.' }
  }

  if (nextQuantity > article.currentStock) {
    return {
      items: [...items],
      error: insufficientStockMessage(article.name, article.currentStock, article.unit),
    }
  }

  return {
    items: items.map((item) =>
      item.articleId === article.id ? { ...item, quantity: nextQuantity } : item,
    ),
    error: null,
  }
}
