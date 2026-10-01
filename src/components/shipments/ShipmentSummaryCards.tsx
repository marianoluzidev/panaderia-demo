import { ClipboardPen, PackageCheck, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn.ts'

type SummaryItem = {
  label: string
  detail?: string
  count: number
  icon: LucideIcon
  tone: string
}

type ShipmentSummaryCardsProps = {
  confirmed: number
  drafts: number
  recentLines: number
}

export function ShipmentSummaryCards({
  confirmed,
  drafts,
  recentLines,
}: ShipmentSummaryCardsProps) {
  const items: SummaryItem[] = [
    {
      label: 'Envíos confirmados',
      count: confirmed,
      icon: PackageCheck,
      tone: 'bg-ok-soft text-ok',
    },
    {
      label: 'Borradores',
      count: drafts,
      icon: ClipboardPen,
      tone: 'bg-low-soft text-low',
    },
    {
      label: 'Artículos enviados',
      detail: 'Últimos 7 días',
      count: recentLines,
      icon: Truck,
      tone: 'bg-wheat-soft text-wheat-strong',
    },
  ]

  return (
    <section aria-labelledby="resumen-envios">
      <h2 id="resumen-envios" className="sr-only">
        Resumen de envíos
      </h2>
      <ul className="grid grid-cols-3 gap-2 md:gap-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.label}>
              <article
                className={cn(
                  'flex h-full flex-col justify-center gap-0.5 rounded-2xl px-2 py-2 md:gap-2 md:rounded-3xl md:p-5',
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
                {item.detail ? (
                  <p className="text-[11px] font-medium leading-tight md:text-sm">
                    {item.detail}
                  </p>
                ) : null}
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
