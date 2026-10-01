import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'

export function SupplierNotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Proveedor no encontrado</h1>
      <p className="text-base text-muted">No encontramos ese proveedor.</p>
      <Link to="/proveedores" className={buttonClassName('primary')}>
        <ArrowLeft aria-hidden="true" size={18} />
        Volver a proveedores
      </Link>
    </div>
  )
}
