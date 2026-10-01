import { createContext } from 'react'
import type { Article, ArticleCategory, Unit } from '../types/article.ts'
import type { Supplier, SupplierInput } from '../types/supplier.ts'
import type { Branch } from '../types/branch.ts'
import type { ManualMovementType, StockMovement } from '../types/movement.ts'
import type { Shipment, ShipmentInput } from '../types/shipment.ts'

export type RealStockUpdate = {
  articleId: string
  quantity: number
  note?: string
}

export type MovementDraft = {
  articleId: string
  type: ManualMovementType
  quantity: number
  note?: string
}

export type ArticleDraft = {
  name: string
  category: ArticleCategory
  unit: Unit
  minimumStock: number
  initialStock: number
  note?: string
  preferredSupplierId: string
}

export type ArticleUpdate = {
  id: string
  name: string
  category: ArticleCategory
  unit: Unit
  minimumStock: number
  note?: string
  preferredSupplierId: string
}

export type ShipmentSaveResult =
  | { ok: true; id: string }
  | { ok: false; message: string }

export type StockDemo = {
  articles: readonly Article[]
  movements: readonly StockMovement[]
  branches: readonly Branch[]
  shipments: readonly Shipment[]
  suppliers: readonly Supplier[]
  updateRealStock: (update: RealStockUpdate) => void
  registerMovement: (draft: MovementDraft) => void
  createArticle: (draft: ArticleDraft) => string | null
  updateArticle: (update: ArticleUpdate) => boolean
  createSupplier: (input: SupplierInput) => string | null
  updateSupplier: (id: string, input: SupplierInput) => boolean
  assignSupplierToArticle: (articleId: string, supplierId: string) => boolean
  createShipment: (input: ShipmentInput) => string | null
  updateShipment: (id: string, input: ShipmentInput) => boolean
  confirmShipment: (id: string) => ShipmentSaveResult
}

export const StockDemoContext = createContext<StockDemo | null>(null)
