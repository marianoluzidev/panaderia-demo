import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { formatDateTime } from '../../lib/dates.ts'
import { formatQuantity, movementTypeLabels } from '../../lib/labels.ts'
import type { MovementGroup } from '../../lib/movementList.ts'
import { formatMovementListChange } from '../../lib/movements.ts'
import { movementIcon, movementTone } from '../../lib/movementVisuals.ts'
import type { Unit } from '../../types/article.ts'
import type { StockMovement } from '../../types/movement.ts'

type MovementListProps = {
  groups: readonly MovementGroup[]
}

export function MovementList({ groups }: MovementListProps) {
  return (
    <div className="flex flex-col gap-3 md:gap-6">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`dia-${group.key}`}>
          <h2
            id={`dia-${group.key}`}
            className="text-sm font-semibold text-muted md:text-base"
          >
            {group.label}
          </h2>
          <ol className="mt-1 flex flex-col gap-2 md:mt-3 md:gap-3">
            {group.movements.map((item) => (
              <li key={item.movement.id}>
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
  const tone = movementTone[movement.type]

  return (
    <Link
      to={`/stock/${articleId}`}
      className="flex items-start gap-2.5 rounded-3xl bg-white p-2 shadow-card ring-1 ring-line transition hover:ring-wheat-strong active:bg-cream md:gap-3 md:p-4 lg:items-center"
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-2xl md:size-11',
          tone.icon,
        )}
      >
        <Icon aria-hidden="true" size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold leading-tight">{name}</span>
          <span className="flex shrink-0 items-center gap-0.5 lg:hidden">
            <span className={cn('text-sm font-semibold leading-tight', tone.amount)}>
              {formatMovementListChange(movement, unit)}
            </span>
            <ChevronRight aria-hidden="true" className="text-muted" size={16} />
          </span>
        </span>
        <span className="block text-sm leading-tight text-muted">
          {movementTypeLabels[movement.type]}
        </span>
        <time
          dateTime={movement.date}
          className="block text-sm leading-tight text-muted"
        >
          {formatDateTime(movement.date)}
        </time>
        <span className="block text-sm leading-tight text-muted lg:hidden">
          Stock resultante: {formatQuantity(movement.resultingStock, unit)}
        </span>
        {movement.note ? (
          <span className="block text-sm leading-tight">{movement.note}</span>
        ) : null}
      </span>
      <span className="hidden shrink-0 text-right lg:block">
        <span className={cn('block font-semibold', tone.amount)}>
          {formatMovementListChange(movement, unit)}
        </span>
        <span className="block text-sm text-muted">
          Stock resultante: {formatQuantity(movement.resultingStock, unit)}
        </span>
      </span>
    </Link>
  )
}
