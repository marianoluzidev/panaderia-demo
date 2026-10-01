import { normalizeArticleName } from './articleForm.ts'
import { normalizeSearchText } from './stockList.ts'
import type { Article } from '../types/article.ts'
import type { Supplier, SupplierInput } from '../types/supplier.ts'

export type SupplierFormValues = {
  name: string
  contactName: string
  phone: string
  notes: string
}

export type SupplierFormField = keyof SupplierFormValues

export type SupplierFormErrors = Partial<
  Record<Exclude<SupplierFormField, 'contactName' | 'notes'>, string>
>

export function isDuplicateSupplierName(
  name: string,
  suppliers: readonly Supplier[],
  exceptId?: string,
): boolean {
  const normalized = normalizeArticleName(name)

  if (normalized === '') {
    return false
  }

  return suppliers.some(
    (supplier) =>
      supplier.id !== exceptId && normalizeArticleName(supplier.name) === normalized,
  )
}

export function supplierPhoneError(phone: string): string | null {
  const trimmed = phone.trim()

  if (trimmed === '') {
    return 'Ingresá un teléfono.'
  }

  if (trimmed.length < 4) {
    return 'El teléfono es demasiado corto.'
  }

  return null
}

export function supplierFormErrors(
  values: SupplierFormValues,
  suppliers: readonly Supplier[],
  exceptId?: string,
): SupplierFormErrors {
  const errors: SupplierFormErrors = {}
  const name = values.name.trim()

  if (name === '') {
    errors.name = 'Ingresá un nombre.'
  } else if (isDuplicateSupplierName(name, suppliers, exceptId)) {
    errors.name = 'Ya existe un proveedor con ese nombre.'
  }

  const phoneError = supplierPhoneError(values.phone)

  if (phoneError) {
    errors.phone = phoneError
  }

  return errors
}

export function supplierInputFromValues(values: SupplierFormValues): SupplierInput {
  const contactName = values.contactName.trim()
  const notes = values.notes.trim()

  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    ...(contactName ? { contactName } : {}),
    ...(notes ? { notes } : {}),
  }
}

export function articlesForSupplier(
  articles: readonly Article[],
  supplierId: string,
): Article[] {
  return articles
    .filter((article) => article.preferredSupplierId === supplierId)
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))
}

export function formatAssociatedNames(names: readonly string[]): string {
  if (names.length === 0) {
    return 'Sin artículos asociados'
  }

  const visible = names.slice(0, 3)

  if (names.length <= 3) {
    if (visible.length === 1) {
      return visible[0] ?? ''
    }

    if (visible.length === 2) {
      return `${visible[0]} y ${visible[1]}`
    }

    return `${visible[0]}, ${visible[1]} y ${visible[2]}`
  }

  const extra = names.length - 3
  const suffix = extra === 1 ? '1 más' : `${extra} más`
  return `${visible[0]}, ${visible[1]}, ${visible[2]} y ${suffix}`
}

export function listSuppliers(
  suppliers: readonly Supplier[],
  articles: readonly Article[],
  search: string,
): Supplier[] {
  const query = normalizeSearchText(search.trim())

  return suppliers
    .filter((supplier) => {
      if (query === '') {
        return true
      }

      const articleNames = articlesForSupplier(articles, supplier.id)
        .map((article) => normalizeSearchText(article.name))
        .join(' ')
      const haystack = normalizeSearchText(
        `${supplier.name} ${supplier.contactName ?? ''} ${articleNames}`,
      )

      return haystack.includes(query)
    })
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))
}

export function formatArticleCount(count: number): string {
  return count === 1 ? '1 artículo habitual' : `${count} artículos habituales`
}
