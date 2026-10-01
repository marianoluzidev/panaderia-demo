import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { ShipmentFilters } from '../components/shipments/ShipmentFilters.tsx'
import { ShipmentList } from '../components/shipments/ShipmentList.tsx'
import { ShipmentSummaryCards } from '../components/shipments/ShipmentSummaryCards.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { cn } from '../lib/cn.ts'
import {
  countRecentShipmentLines,
  filterShipments,
  type ShipmentFilter,
} from '../lib/shipments.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function ShipmentsPage() {
  usePageTitle('Envíos')

  const { articles, branches, shipments } = useStockDemo()
  const [filter, setFilter] = useState<ShipmentFilter>('todos')
  const listed = filterShipments(shipments, filter)
  const confirmed = shipments.filter((shipment) => shipment.status === 'confirmed').length
  const drafts = shipments.filter((shipment) => shipment.status === 'draft').length

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight max-md:sr-only md:text-[28px] md:leading-9">
            Envíos
          </h1>
          <p className="text-sm text-muted md:mt-1">
            Salidas de mercadería desde Central
          </p>
        </div>
        <Link to="/envios/nuevo" className={cn(buttonClassName('primary'), 'shrink-0')}>
          <Plus aria-hidden="true" size={18} />
          Nuevo envío
        </Link>
      </header>

      <ShipmentSummaryCards
        confirmed={confirmed}
        drafts={drafts}
        recentLines={countRecentShipmentLines(shipments)}
      />
      <ShipmentFilters value={filter} onChange={setFilter} />

      {listed.length === 0 ? (
        <Card>
          <p className="text-base text-ink">
            {shipments.length === 0
              ? 'Todavía no hay envíos.'
              : 'No hay envíos con ese filtro.'}
          </p>
        </Card>
      ) : (
        <ShipmentList shipments={listed} articles={articles} branches={branches} />
      )}
    </div>
  )
}
