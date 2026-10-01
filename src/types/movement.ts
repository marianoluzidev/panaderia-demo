export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'conteo'

export type ManualMovementType = Exclude<MovementType, 'conteo' | 'ajuste'>

export type MovementReferenceType = 'shipment'

export interface StockMovement {
  id: string
  articleId: string
  type: MovementType
  /** Diferencia aplicada al stock. Positiva suma y negativa resta. */
  quantity: number
  /** Stock del artículo después del movimiento. */
  resultingStock: number
  /** Fecha y hora local en ISO 8601, sin zona horaria. */
  date: string
  note?: string
  /** Origen del movimiento, cuando nace de otra operación. */
  referenceType?: MovementReferenceType
  /** Id de la operación de origen, por ejemplo un envío. */
  referenceId?: string
}
