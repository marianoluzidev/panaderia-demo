import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { formatCompactDateTime } from '../../lib/dates.ts'
import { formatQuantity } from '../../lib/labels.ts'
import type { MovementGroup } from '../../lib/movementList.ts'
import { formatMovementListChange } from '../../lib/movements.ts'
import { movementIcon } from '../../lib/movementVisuals.ts'
import type { Unit } from '../../types/article.ts'
import type { MovementType, StockMovement } from '../../types/movement.ts'

const shortTypeLabels: Record<MovementType, string> = {
  entrada: 'Entrada',
  salida: 'Salida',
  conteo: 'Stock real',
  ajuste: 'Ajuste',
}

const amountClassName: Record<MovementType, string> = {
  entrada: 'text-ok',
  salida: 'text-alert',
  conteo: 'text-wheat-strong',
  ajuste: 'text-ink',
}

const columns =
  'lg:grid lg:grid-cols-[minmax(0,1.3fr)_6.5rem_8.5rem_8rem_8.5rem_minmax(0,1fr)_1.25rem] lg:items-center lg:gap-3'

type MovementListProps = {
  groups: readonly MovementGroup[]
}

export function MovementList({ groups }: MovementListProps) {
  return (
    <div className="overflow-hidden rounded-surface border border-line bg-white">
      <div
        className={cn(
          'hidden border-b border-line px-3 py-2 text-xs font-medium text-muted lg:grid',
          'lg:grid-cols-[minmax(0,1.3fr)_6.5rem_8.5rem_8rem_8.5rem_minmax(0,1fr)_1.25rem] lg:gap-3',
        )}
      >
        <span className="pl-11">Artículo</span>
        <span>Tipo</span>
        <span>Fecha</span>
        <span>Cambio</span>
        <span>Stock resultante</span>
        <span>Nota</span>
        <span className="sr-only">Abrir</span>
      </div>
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`dia-${group.key}`}>
          <h2
            id={`dia-${group.key}`}
            className="border-b border-line bg-cream px-3 py-1 text-xs font-medium text-muted"
          >
            {group.label}
          </h2>
          <ol>
            {group.movements.map((item) => (
              <li key={item.movement.id} className="border-b border-line last:border-b-0">
                <MovementRow
                  articleId={item.article.id}
                  name={item.article.name}
                  unit={item.article.unit}
                  movement={item.movement}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

type MovementRowProps = {
  articleId: string
  name: string
  unit: Unit
  movement: StockMovement
}

function MovementRow({ articleId, name, unit, movement }: MovementRowProps) {
  const Icon = movementIcon[movement.type]
  const change = formatMovementListChange(movement, unit)
  const when = formatCompactDateTime(movement.date)

  return (
    <Link
      to={`/stock/${articleId}`}
      className={cn('flex min-h-14 items-center gap-3 px-3 py-1.5 hover:bg-cream', columns)}
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line text-muted">
          <Icon aria-hidden="true" size={16} />
        </span>
        <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm leading-5 font-semibold">{name}</span>
          <span
            className={cn(
              'shrink-0 text-sm font-semibold whitespace-nowrap tabular-nums lg:hidden',
              amountClassName[movement.type],
            )}
          >
            {change}
          </span>
          <ChevronRight
            aria-hidden="true"
            size={16}
            className="shrink-0 text-muted lg:hidden"
          />
        </span>
        <span className="block truncate text-[13px] leading-4 text-muted lg:hidden">
          {shortTypeLabels[movement.type]}
          {' · '}
          <time dateTime={movement.date}>{when}</time>
        </span>
        {movement.note ? (
          <span className="block truncate text-[13px] leading-4 text-muted lg:hidden">{movement.note}</span>
        ) : null}
        </span>
      </span>
      <span className="hidden text-sm lg:block">{shortTypeLabels[movement.type]}</span>
      <time dateTime={movement.date} className="hidden text-sm text-muted lg:block">
        {when}
      </time>
      <span
        className={cn(
          'hidden text-sm font-semibold whitespace-nowrap tabular-nums lg:block',
          amountClassName[movement.type],
        )}
      >
        {change}
      </span>
      <span className="hidden text-sm text-muted tabular-nums lg:block">
        {formatQuantity(movement.resultingStock, unit)}
      </span>
      <span className="hidden truncate text-sm text-muted lg:block">
        {movement.note ?? '—'}
      </span>
      <ChevronRight aria-hidden="true" size={16} className="hidden shrink-0 text-muted lg:block" />
    </Link>
  )
}
