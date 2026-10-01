import { PackagePlus } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { formatDateTime } from '../../lib/dates.ts'
import { formatQuantity, movementTypeLabels } from '../../lib/labels.ts'
import { formatMovementChange } from '../../lib/movements.ts'
import { movementIcon, movementTone } from '../../lib/movementVisuals.ts'
import type { Article } from '../../types/article.ts'
import type { StockMovement } from '../../types/movement.ts'
import { buttonClassName } from '../ui/buttonStyles.ts'
import { Card } from '../ui/Card.tsx'

type MovementHistoryProps = {
  article: Article
  movements: readonly StockMovement[]
}

export function MovementHistory({ article, movements }: MovementHistoryProps) {
  return (
    <section aria-labelledby="ultimos-movimientos">
      <h2 id="ultimos-movimientos" className="text-lg font-semibold">
        Últimos movimientos
      </h2>
      {movements.length === 0 ? (
        <Card className="mt-4 flex flex-col items-start gap-4">
          <p className="text-base text-muted">
            Todavía no hay movimientos registrados
          </p>
          <Link
            to={`/movimientos/nuevo?tipo=entrada&articulo=${encodeURIComponent(article.id)}`}
            className={buttonClassName('primary')}
          >
            <PackagePlus aria-hidden="true" size={18} />
            Registrar entrada
          </Link>
        </Card>
      ) : (
        <ol className="mt-4 flex flex-col gap-3">
          {movements.map((movement) => (
            <MovementItem
              key={movement.id}
              article={article}
              movement={movement}
            />
          ))}
        </ol>
      )}
    </section>
  )
}

type MovementItemProps = {
  article: Article
  movement: StockMovement
}

function MovementItem({ article, movement }: MovementItemProps) {
  const Icon = movementIcon[movement.type]
  const tone = movementTone[movement.type]

  return (
    <li>
      <article className="flex gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-2xl',
            tone.icon,
          )}
        >
          <Icon aria-hidden="true" size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold">{movementTypeLabels[movement.type]}</h3>
          <time
            dateTime={movement.date}
            className="mt-0.5 block text-sm text-muted"
          >
            {formatDateTime(movement.date)}
          </time>
          <p className={cn('mt-2 text-base font-semibold', tone.amount)}>
            {formatMovementChange(movement, article.unit)}
          </p>
          <p className="text-sm text-muted">
            Stock resultante: {formatQuantity(movement.resultingStock, article.unit)}
          </p>
          {movement.note ? (
            <p className="mt-2 text-sm">{movement.note}</p>
          ) : null}
        </div>
      </article>
    </li>
  )
}
