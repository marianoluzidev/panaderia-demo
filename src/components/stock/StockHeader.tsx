import { ClipboardCheck, PackagePlus } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { buttonClassName } from '../ui/buttonStyles.ts'

type StockHeaderProps = {
  countLabel: string
}

const compactActionClassName =
  'inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-3 text-base font-semibold transition'

export function StockHeader({ countLabel }: StockHeaderProps) {
  return (
    <header className="flex flex-col gap-2 md:gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Stock</h1>
        <p className="mt-0.5 text-base text-muted md:hidden" aria-live="polite">
          {countLabel}
        </p>
        <p className="mt-1 hidden text-base text-muted md:block">
          Consultá las cantidades disponibles
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:hidden">
        <Link
          to="/stock/actualizar"
          aria-label="Actualizar stock real"
          className={cn(
            compactActionClassName,
            'bg-wheat-strong text-white hover:bg-wheat-deep active:bg-wheat-deep',
          )}
        >
          <ClipboardCheck aria-hidden="true" size={18} />
          Actualizar
        </Link>
        <Link
          to="/movimientos/nuevo?tipo=entrada"
          aria-label="Registrar entrada"
          className={cn(
            compactActionClassName,
            'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft',
          )}
        >
          <PackagePlus aria-hidden="true" size={18} />
          Entrada
        </Link>
      </div>
      <div className="hidden flex-col gap-3 sm:flex-row md:flex">
        <Link
          to="/stock/actualizar"
          className={cn(buttonClassName('primary'), 'w-full sm:w-auto')}
        >
          <ClipboardCheck aria-hidden="true" size={20} />
          Actualizar stock real
        </Link>
        <Link
          to="/movimientos/nuevo?tipo=entrada"
          className={cn(buttonClassName('secondary'), 'w-full sm:w-auto')}
        >
          <PackagePlus aria-hidden="true" size={20} />
          Registrar entrada
        </Link>
      </div>
    </header>
  )
}
