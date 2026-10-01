import { cn } from '../../lib/cn.ts'
import { formatSpokenQuantity } from '../../lib/labels.ts'
import { nextStockAfterMovement } from '../../lib/movementForm.ts'
import type { Unit } from '../../types/article.ts'
import type { ManualMovementType } from '../../types/movement.ts'

const amountClassName: Record<ManualMovementType, string> = {
  entrada: 'text-ok',
  salida: 'text-alert',
}

type MovementPreviewProps = {
  type: ManualMovementType
  current: number
  quantity: number
  unit: Unit
}

export function MovementPreview({
  type,
  current,
  quantity,
  unit,
}: MovementPreviewProps) {
  const next = nextStockAfterMovement(current, type, quantity)
  const changeLabel = type === 'entrada' ? 'Ingresan' : 'Salen'

  return (
    <div
      aria-live="polite"
      className="rounded-surface border border-line bg-white p-4 text-sm"
    >
      <p>Stock actual: {formatSpokenQuantity(current, unit)}</p>
      <p className={cn('mt-1 font-semibold', amountClassName[type])}>
        {changeLabel}: {formatSpokenQuantity(quantity, unit)}
      </p>
      <p className="mt-3 font-semibold">
        Nuevo stock: {formatSpokenQuantity(next, unit)}
      </p>
    </div>
  )
}
