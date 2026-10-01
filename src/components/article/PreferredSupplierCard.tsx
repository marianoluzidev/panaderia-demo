import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'
import { Card } from '../ui/Card.tsx'
import type { Article } from '../../types/article.ts'
import type { Supplier } from '../../types/supplier.ts'

type PreferredSupplierCardProps = {
  article: Article
  supplier: Supplier | null
}

export function PreferredSupplierCard({ article, supplier }: PreferredSupplierCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <h2 className="text-sm font-semibold tracking-tight text-muted">Proveedor habitual</h2>
      {supplier ? (
        <>
          <p className="text-base font-semibold">{supplier.name}</p>
          <p className="text-sm text-muted">
            {supplier.contactName ? supplier.contactName : 'Sin contacto'}
          </p>
          <p className="text-sm text-muted">{supplier.phone}</p>
          <Link
            to={`/proveedores/${supplier.id}`}
            className={buttonClassName('secondary')}
          >
            Ver proveedor
          </Link>
        </>
      ) : (
        <>
          <p className="text-base">Sin proveedor asignado</p>
          <Link
            to={`/articulos/${article.id}/editar`}
            className={buttonClassName('secondary')}
          >
            Asignar proveedor
          </Link>
        </>
      )}
    </Card>
  )
}
