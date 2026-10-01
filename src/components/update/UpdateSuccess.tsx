import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { formatSpokenQuantity } from '../../lib/labels.ts'
import type { Article } from '../../types/article.ts'
import { buttonClassName } from '../ui/buttonStyles.ts'
import { Card } from '../ui/Card.tsx'

type UpdateSuccessProps = {
  article: Article
  quantity: number
  onReviewAnother: () => void
}

export function UpdateSuccess({
  article,
  quantity,
  onReviewAnother,
}: UpdateSuccessProps) {
  return (
    <Card className="flex flex-col items-start gap-4" role="status">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-ok-soft text-ok">
        <CircleCheck aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-semibold">Stock actualizado</h2>
        <p className="mt-1 text-base">
          {article.name} ahora tiene{' '}
          {formatSpokenQuantity(quantity, article.unit)}
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
          onClick={onReviewAnother}
        >
          Revisar otro producto
        </button>
      </div>
    </Card>
  )
}
