import { ClipboardCheck, PackagePlus } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'

type StockHeaderProps = {
  countLabel: string
}

export function StockHeader({ countLabel }: StockHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight max-md:sr-only md:text-[28px] md:leading-9">
          Stock
        </h1>
        <p className="text-sm text-muted" aria-live="polite">
          {countLabel}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to="/stock/actualizar" className={buttonClassName('primary')}>
          <ClipboardCheck aria-hidden="true" size={18} />
          Actualizar stock
        </Link>
        <Link
          to="/movimientos/nuevo?tipo=entrada"
          className={buttonClassName('secondary')}
        >
          <PackagePlus aria-hidden="true" size={18} />
          Entrada
        </Link>
      </div>
    </header>
  )
}
