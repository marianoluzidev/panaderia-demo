import { ClipboardCheck, Truck } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'

export function HomeHeader() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight max-md:sr-only md:text-[28px] md:leading-9">
          Resumen de operación
        </h1>
        <p className="text-sm text-muted md:mt-1">Estado general de Central</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to="/stock/actualizar" className={buttonClassName('primary')}>
          <ClipboardCheck aria-hidden="true" size={18} />
          Actualizar stock
        </Link>
        <Link to="/envios/nuevo" className={buttonClassName('secondary')}>
          <Truck aria-hidden="true" size={18} />
          Nuevo envío
        </Link>
      </div>
    </header>
  )
}
