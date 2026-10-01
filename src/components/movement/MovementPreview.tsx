import { cn } from '../../lib/cn.ts'
import { formatSpokenQuantity } from '../../lib/labels.ts'
import { nextStockAfterMovement } from '../../lib/movementForm.ts'
import type { Unit } from '../../types/article.ts'
import type { ManualMovementType } from '../../types/movement.ts'

const previewClassName: Record<ManualMovementType, string> = {
  entrada: 'bg-ok-soft text-ok ring-ok/30',
  salida: 'bg-alert-soft text-alert ring-alert/30',
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
      className={cn('rounded-3xl p-4 ring-1', previewClassName[type])}
    >
      <p>Stock actual: {formatSpokenQuantity(current, unit)}</p>
      <p className="mt-1">
        {changeLabel}: {formatSpokenQuantity(quantity, unit)}
      </p>
      <p className="mt-3 text-base font-semibold">
        Nuevo stock: {formatSpokenQuantity(next, unit)}
      </p>
    </div>
  )
}
