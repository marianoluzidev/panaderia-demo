import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { SupplierList } from '../components/suppliers/SupplierList.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { cn } from '../lib/cn.ts'
import { listSuppliers } from '../lib/suppliers.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function SuppliersPage() {
  usePageTitle('Proveedores')

  const { articles, suppliers } = useStockDemo()
  const [search, setSearch] = useState('')
  const results = listSuppliers(suppliers, articles, search)
  const searching = search.trim() !== ''

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Proveedores</h1>
            <Link
              to="/proveedores/nuevo"
              className={cn(
                buttonClassName('primary'),
                'max-md:min-h-11! max-md:px-3! max-md:text-sm md:hidden!',
              )}
            >
              <Plus aria-hidden="true" size={18} />
              Nuevo proveedor
            </Link>
          </div>
          <p className="mt-0.5 max-w-2xl text-sm leading-tight text-muted md:mt-1 md:text-base">
            Contactos y artículos que comprás habitualmente
          </p>
        </div>
        <Link
          to="/proveedores/nuevo"
          className={cn(buttonClassName('primary'), 'max-md:hidden! shrink-0')}
        >
          <Plus aria-hidden="true" size={18} />
          Nuevo proveedor
        </Link>
      </header>

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="buscar-proveedor" className="relative block">
          <span className="sr-only">Buscar por nombre, contacto o artículo</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            id="buscar-proveedor"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
            }}
            placeholder="Buscar por nombre, contacto o artículo"
            autoComplete="off"
            className="min-h-11 w-full rounded-2xl bg-white pr-4 pl-12 text-base text-ink ring-1 ring-line placeholder:text-muted hover:ring-wheat focus-visible:ring-wheat-strong md:min-h-12"
          />
        </label>
      </form>

      {results.length === 0 ? (
        <Card>
          <p className="text-base">
            {searching
              ? 'No encontramos proveedores con esa búsqueda.'
              : 'Todavía no hay proveedores cargados.'}
          </p>
        </Card>
      ) : (
        <SupplierList suppliers={results} articles={articles} />
      )}
    </div>
  )
}
