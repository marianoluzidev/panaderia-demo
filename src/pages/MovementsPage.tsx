import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { MovementFilters } from '../components/movements/MovementFilters.tsx'
import { MovementList } from '../components/movements/MovementList.tsx'
import { MovementSummaryCards } from '../components/movements/MovementSummaryCards.tsx'
import { Button } from '../components/ui/Button.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { cn } from '../lib/cn.ts'
import {
  groupMovementsByDay,
  hasActiveMovementFilters,
  listMovements,
  movementEmptyDetail,
  summarizeMovements,
  type MovementDateFilter,
  type MovementTypeFilter,
} from '../lib/movementList.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function MovementsPage() {
  usePageTitle('Movimientos')

  const { articles, movements } = useStockDemo()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<MovementTypeFilter>('todos')
  const [date, setDate] = useState<MovementDateFilter>('todos')
  const query = { search, type, date }
  const listed = listMovements(movements, articles, query)
  const groups = groupMovementsByDay(listed)
  const summary = summarizeMovements(movements)
  const filtered = hasActiveMovementFilters(query)

  function clearFilters() {
    setSearch('')
    setType('todos')
    setDate('todos')
  }

  return (
    <div className="flex flex-col gap-2 md:gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Movimientos</h1>
            <Link
              to="/movimientos/nuevo"
              className={cn(
                buttonClassName('primary'),
                'max-md:min-h-11! max-md:px-3! max-md:text-sm md:hidden!',
              )}
            >
              <Plus aria-hidden="true" size={18} />
              Nuevo movimiento
            </Link>
          </div>
          <p className="mt-0.5 max-w-2xl text-sm leading-tight text-muted md:mt-1 md:text-base">
            Revisá las entradas, salidas y actualizaciones de stock
          </p>
        </div>
        <Link
          to="/movimientos/nuevo"
          className={cn(buttonClassName('primary'), 'max-md:hidden! shrink-0')}
        >
          <Plus aria-hidden="true" size={18} />
          Nuevo movimiento
        </Link>
      </header>

      {movements.length === 0 ? (
        <Card className="flex flex-col items-start gap-4">
          <p className="text-base text-ink">Todavía no hay movimientos registrados</p>
          <Link to="/movimientos/nuevo" className={buttonClassName('primary')}>
            <Plus aria-hidden="true" size={18} />
            Registrar primer movimiento
          </Link>
        </Card>
      ) : (
        <>
          <MovementSummaryCards summary={summary} />
          <MovementFilters
            search={search}
            type={type}
            date={date}
            onSearchChange={setSearch}
            onTypeChange={setType}
            onDateChange={setDate}
          />
          {filtered && listed.length > 0 ? (
            <Button
              variant="secondary"
              className="self-start max-md:min-h-11!"
              onClick={clearFilters}
            >
              Limpiar filtros
            </Button>
          ) : null}
          {listed.length === 0 ? (
            <Card className="flex flex-col items-start gap-3">
              <div>
                <p className="text-base font-semibold">No encontramos movimientos</p>
                <p className="mt-1 text-base text-muted">{movementEmptyDetail(query)}</p>
              </div>
              {filtered ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              ) : null}
            </Card>
          ) : (
            <MovementList groups={groups} />
          )}
        </>
      )}
    </div>
  )
}
