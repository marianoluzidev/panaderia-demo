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
    <div className="flex flex-col gap-4 md:gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Envíos</h1>
            <Link
              to="/envios/nuevo"
              className={cn(
                buttonClassName('primary'),
                'max-md:min-h-11! max-md:px-3! max-md:text-sm md:hidden!',
              )}
            >
              <Plus aria-hidden="true" size={18} />
              Nuevo envío
            </Link>
          </div>
          <p className="mt-0.5 max-w-2xl text-sm leading-tight text-muted md:mt-1 md:text-base">
            Mercadería enviada desde Central
          </p>
        </div>
        <Link
          to="/envios/nuevo"
          className={cn(buttonClassName('primary'), 'max-md:hidden! shrink-0')}
        >
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
