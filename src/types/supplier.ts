export interface Supplier {
  id: string
  name: string
  phone: string
  contactName?: string
  notes?: string
  /** Fecha y hora local de alta, en ISO 8601, sin zona horaria. */
  createdAt: string
}

export type SupplierInput = {
  name: string
  phone: string
  contactName?: string
  notes?: string
}
