import { ClipboardCheck, PackageMinus, PackagePlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import type { MovementSummary } from '../../lib/movementList.ts'

type SummaryItem = {
  label: string
  count: number
  icon: LucideIcon
  tone: string
}

type MovementSummaryCardsProps = {
  summary: MovementSummary
}

export function MovementSummaryCards({ summary }: MovementSummaryCardsProps) {
  const items: SummaryItem[] = [
    {
      label: 'Entradas',
      count: summary.entradas,
      icon: PackagePlus,
      tone: 'bg-ok-soft text-ok',
    },
    {
      label: 'Salidas',
      count: summary.salidas,
      icon: PackageMinus,
      tone: 'bg-alert-soft text-alert',
    },
    {
      label: 'Actualizaciones de stock real',
      count: summary.actualizaciones,
      icon: ClipboardCheck,
      tone: 'bg-wheat-soft text-wheat-strong',
    },
  ]

  return (
    <section aria-labelledby="resumen-movimientos">
      <h2 id="resumen-movimientos" className="sr-only">
        Resumen de movimientos
      </h2>
      <ul className="grid grid-cols-3 gap-2 md:gap-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.label}>
              <article
                className={cn(
                  'flex h-full flex-col justify-center gap-0.5 rounded-2xl px-2 py-1.5 md:gap-2 md:rounded-3xl md:p-5',
                  item.tone,
                )}
              >
                <Icon aria-hidden="true" className="max-md:hidden" size={22} />
                <p className="text-lg font-semibold leading-none md:text-3xl">
                  {item.count}
                </p>
                <h3 className="text-[11px] font-semibold leading-[1.15] md:text-sm md:leading-tight">
                  {item.label}
                </h3>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
