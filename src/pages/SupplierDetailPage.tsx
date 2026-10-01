import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { SupplierArticles } from '../components/suppliers/SupplierArticles.tsx'
import { SupplierNotFound } from '../components/suppliers/SupplierNotFound.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { articlesForSupplier, formatArticleCount } from '../lib/suppliers.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function SupplierDetailPage() {
  const { id } = useParams()
  const { articles, suppliers } = useStockDemo()
  const supplier = suppliers.find((item) => item.id === id) ?? null

  usePageTitle(supplier ? supplier.name : 'Proveedor no encontrado')

  if (!supplier) {
    return <SupplierNotFound />
  }

  const associated = articlesForSupplier(articles, supplier.id)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-6">
      <header className="flex flex-col items-start gap-3">
        <Link to="/proveedores" className={buttonClassName('secondary')}>
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{supplier.name}</h1>
          <p className="mt-1 text-base text-muted">{formatArticleCount(associated.length)}</p>
        </div>
      </header>

      <Card className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted">Contacto</p>
        <p className="text-base">{supplier.contactName ? supplier.contactName : 'Sin contacto'}</p>
        <p className="text-sm font-semibold text-muted">Teléfono</p>
        <p className="text-base">
          {supplier.phone}
          {supplier.phone.startsWith('0000') ? (
            <span className="text-sm text-muted"> · Dato de demostración</span>
          ) : null}
        </p>
        <p className="text-sm font-semibold text-muted">Nota</p>
        <p className="text-base">{supplier.notes ? supplier.notes : 'Sin nota'}</p>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Artículos habituales</h2>
        <SupplierArticles articles={associated} />
      </section>

      <Link to={`/proveedores/${supplier.id}/editar`} className={buttonClassName('primary')}>
        Editar proveedor
      </Link>

      <Card className="bg-cream text-sm text-muted shadow-none" aria-disabled="true">
        Pedidos de compra se agregarán en el próximo paso.
      </Card>
    </div>
  )
}
