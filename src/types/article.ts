export type ArticleCategory = 'materia-prima' | 'descartable'

export type Unit = 'kg' | 'g' | 'l' | 'ml' | 'unidad' | 'bolsa' | 'pack' | 'paquete'

export type IllustrationKey =
  | 'harina'
  | 'margarina'
  | 'azucar'
  | 'sal'
  | 'levadura'
  | 'aceite'
  | 'vasos'
  | 'bolsas'
  | 'cajas'
  | 'servilletas'
  | 'guantes'
  | 'generico'
  | 'generico-materia'
  | 'generico-descartable'

export interface Article {
  id: string
  name: string
  category: ArticleCategory
  unit: Unit
  minimumStock: number
  currentStock: number
  illustration: IllustrationKey
  /** Fecha y hora local de la última revisión del stock real, o null si todavía no se revisó. */
  lastStockCheckAt: string | null
  /** Proveedor al que se le compra este artículo habitualmente. */
  preferredSupplierId: string | null
  note?: string
}
