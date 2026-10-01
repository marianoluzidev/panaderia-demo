import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import {
  articlesForSupplier,
  formatArticleCount,
  formatAssociatedNames,
} from '../../lib/suppliers.ts'
import type { Article } from '../../types/article.ts'
import type { Supplier } from '../../types/supplier.ts'

type SupplierListProps = {
  suppliers: readonly Supplier[]
  articles: readonly Article[]
}

export function SupplierList({ suppliers, articles }: SupplierListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {suppliers.map((supplier) => {
        const associated = articlesForSupplier(articles, supplier.id)
        const names = associated.map((article) => article.name)

        return (
          <li key={supplier.id}>
            <Link
              to={`/proveedores/${supplier.id}`}
              aria-label={`Ver ${supplier.name}`}
              className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line transition hover:ring-wheat-strong active:bg-cream"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{supplier.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  {supplier.contactName ? supplier.contactName : 'Sin contacto'}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {supplier.phone}
                  {supplier.phone.startsWith('0000') ? ' · Dato de demostración' : ''}
                </span>
                <span className="mt-2 block text-sm font-semibold">
                  {formatArticleCount(associated.length)}
                </span>
                <span className="mt-0.5 block text-sm break-words text-muted">
                  {formatAssociatedNames(names)}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="shrink-0 text-muted" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
