export type ShipmentStatus = 'draft' | 'confirmed'

export interface ShipmentItem {
  articleId: string
  quantity: number
}

export interface Shipment {
  id: string
  originBranchId: string
  destinationBranchId: string
  status: ShipmentStatus
  /** Fecha y hora local en ISO 8601, sin zona horaria. */
  createdAt: string
  /** Fecha y hora local de la confirmación. No existe en un borrador. */
  confirmedAt?: string
  note?: string
  items: ShipmentItem[]
}

export type ShipmentInput = {
  destinationBranchId: string
  note?: string
  items: ShipmentItem[]
}
