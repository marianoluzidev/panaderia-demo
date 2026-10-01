import type { Article, ArticleCategory, Unit } from '../types/article.ts'
import type { Supplier } from '../types/supplier.ts'
import { formatSpokenQuantity } from './labels.ts'
import { allowsDecimalQuantity, quantityInputError, parseRealQuantity } from './quantityInput.ts'
import { normalizeSearchText } from './stockList.ts'

export const controlUnits: readonly Unit[] = [
  'unidad',
  'kg',
  'g',
  'l',
  'ml',
  'bolsa',
  'pack',
  'paquete',
]

export const controlUnitLabels: Record<Unit, string> = {
  unidad: 'Unidad',
  kg: 'kg',
  g: 'g',
  l: 'Litro',
  ml: 'ml',
  bolsa: 'Bolsa',
  pack: 'Pack',
  paquete: 'Paquete',
}

export function normalizeArticleName(name: string): string {
  return normalizeSearchText(name.trim())
}

export function isDuplicateArticleName(
  name: string,
  articles: readonly Article[],
  exceptId?: string,
): boolean {
  const normalized = normalizeArticleName(name)

  if (normalized === '') {
    return false
  }

  return articles.some(
    (article) =>
      article.id !== exceptId && normalizeArticleName(article.name) === normalized,
  )
}

export function unitPreviewSentence(unit: Unit): string {
  const quantity = allowsDecimalQuantity(unit) ? 4.5 : 10
  return `El stock se mostrará como ${formatSpokenQuantity(quantity, unit)}`
}

export function quantityToInput(value: number, unit: Unit): string {
  if (!allowsDecimalQuantity(unit) || Number.isInteger(value)) {
    return String(Math.round(value))
  }

  return String(value).replace('.', ',')
}

export type ArticleFormValues = {
  name: string
  category: ArticleCategory | null
  unit: Unit | null
  minimum: string
  initial: string
  supplierId: string | null
  note: string
}

export type ArticleFormField = keyof ArticleFormValues

export type ArticleFormErrors = Partial<Record<Exclude<ArticleFormField, 'note'>, string>>

export function articleFormErrors(
  values: ArticleFormValues,
  articles: readonly Article[],
  suppliers: readonly Supplier[],
  mode: 'create' | 'edit',
  exceptId?: string,
): ArticleFormErrors {
  const errors: ArticleFormErrors = {}
  const name = values.name.trim()

  if (name === '') {
    errors.name = 'Ingresá un nombre.'
  } else if (isDuplicateArticleName(name, articles, exceptId)) {
    errors.name = 'Ya existe un artículo con ese nombre.'
  }

  if (values.category === null) {
    errors.category = 'Elegí una categoría.'
  }

  if (values.unit === null) {
    errors.unit = 'Elegí una unidad de control.'
  } else {
    const minimumError = stockAmountError(values.minimum, values.unit, 'mínimo')

    if (minimumError) {
      errors.minimum = minimumError
    }

    if (mode === 'create') {
      const initialError = stockAmountError(values.initial, values.unit, 'inicial')

      if (initialError) {
        errors.initial = initialError
      }
    }
  }

  if (
    !values.supplierId ||
    !suppliers.some((supplier) => supplier.id === values.supplierId)
  ) {
    errors.supplierId = 'Elegí un proveedor habitual.'
  }

  return errors
}

function stockAmountError(
  raw: string,
  unit: Unit,
  kind: 'mínimo' | 'inicial',
): string | null {
  if (raw.trim() === '') {
    return kind === 'mínimo' ? 'Ingresá el stock mínimo.' : 'Ingresá el stock inicial.'
  }

  return quantityInputError(raw, unit)
}

export function parsedStockAmount(raw: string, unit: Unit): number | null {
  return parseRealQuantity(raw, unit)
}
