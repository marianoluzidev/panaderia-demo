import {
  CircleCheck,
  PackageX,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import type { StockSummary } from '../../lib/stockStatus.ts'

type SummaryTone = 'ok' | 'low' | 'alert'

type SummaryItem = {
  label: string
  count: number
  icon: LucideIcon
  tone: SummaryTone
}

const toneClassName: Record<SummaryTone, string> = {
  ok: 'bg-ok-soft text-ok',
  low: 'bg-low-soft text-low',
  alert: 'bg-alert-soft text-alert',
}

type StockSummaryCardsProps = {
  summary: StockSummary
}

export function StockSummaryCards({ summary }: StockSummaryCardsProps) {
  const items: SummaryItem[] = [
    {
      label: 'Stock en orden',
      count: summary.ok,
      icon: CircleCheck,
      tone: 'ok',
    },
    {
      label: 'Stock bajo',
      count: summary.bajo,
      icon: TriangleAlert,
      tone: 'low',
    },
    {
      label: 'Sin stock',
      count: summary.sinStock,
      icon: PackageX,
      tone: 'alert',
    },
  ]

  return (
    <section aria-labelledby="resumen-stock">
      <h2 id="resumen-stock" className="sr-only">
        Resumen del stock
      </h2>
      <ul className="grid grid-cols-3 gap-2 sm:gap-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.label}>
              <article
                className={cn(
                  'flex h-full flex-col gap-2 rounded-3xl p-3 sm:gap-3 sm:p-5',
                  toneClassName[item.tone],
                )}
              >
                <Icon aria-hidden="true" size={22} />
                <p className="text-2xl font-semibold leading-none sm:text-3xl">
                  {item.count}
                </p>
                <h3 className="text-xs font-semibold leading-tight sm:text-sm">
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
