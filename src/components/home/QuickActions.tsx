import { ClipboardCheck, PackagePlus, Truck } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'

type QuickActionsProps = {
  className?: string
}

const actionClassName =
  'flex min-h-24 items-center gap-4 rounded-3xl px-5 py-4 text-left shadow-card ring-1 transition active:scale-[0.99]'

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <section className={className} aria-labelledby="acciones-titulo">
      <h2 id="acciones-titulo" className="text-lg font-semibold">
        Acciones rápidas
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/movimientos/nuevo?tipo=entrada"
          className={cn(
            actionClassName,
            'bg-wheat-strong text-white ring-transparent hover:bg-wheat-deep active:bg-wheat-deep',
          )}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <PackagePlus aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold">
              Registrar entrada
            </span>
            <span className="mt-1 block text-sm font-medium text-white/90">
              Compras y mercadería recibida
            </span>
          </span>
        </Link>
        <Link
          to="/stock/actualizar"
          className={cn(
            actionClassName,
            'bg-white text-ink ring-line hover:bg-wheat-soft active:bg-wheat-soft',
          )}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-wheat-soft text-wheat-strong">
            <ClipboardCheck aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold">
              Actualizar stock real
            </span>
            <span className="mt-1 block text-sm font-medium text-muted">
              Corregir cantidades después de revisar
            </span>
          </span>
        </Link>
        <Link
          to="/envios/nuevo"
          className={cn(
            actionClassName,
            'bg-white text-ink ring-line hover:bg-wheat-soft active:bg-wheat-soft',
          )}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-wheat-soft text-wheat-strong">
            <Truck aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold">Nuevo envío</span>
            <span className="mt-1 block text-sm font-medium text-muted">
              Registrar mercadería para otra sucursal
            </span>
          </span>
        </Link>
      </div>
    </section>
  )
}
