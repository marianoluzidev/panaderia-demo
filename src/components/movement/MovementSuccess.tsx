import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { formatSpokenQuantity } from '../../lib/labels.ts'
import type { Article } from '../../types/article.ts'
import type { ManualMovementType } from '../../types/movement.ts'
import { buttonClassName } from '../ui/buttonStyles.ts'
import { Card } from '../ui/Card.tsx'

type MovementSuccessProps = {
  article: Article
  type: ManualMovementType
  quantity: number
  onRegisterAnother: () => void
}

export function MovementSuccess({
  article,
  type,
  quantity,
  onRegisterAnother,
}: MovementSuccessProps) {
  const title = type === 'entrada' ? 'Entrada registrada' : 'Salida registrada'

  return (
    <Card className="flex flex-col items-start gap-4" role="status">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-ok-soft text-ok">
        <CircleCheck aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-base">
          {article.name} ahora tiene {formatSpokenQuantity(quantity, article.unit)}
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link
          to={`/stock/${article.id}`}
          className={buttonClassName('primary')}
        >
          Volver al artículo
        </Link>
        <button
          type="button"
          className={buttonClassName('secondary')}
          onClick={onRegisterAnother}
        >
          Registrar otro movimiento
        </button>
      </div>
    </Card>
  )
}
