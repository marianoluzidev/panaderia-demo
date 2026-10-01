import { PackageMinus, PackagePlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import type { ManualMovementType } from '../../types/movement.ts'

const options: readonly {
  type: ManualMovementType
  label: string
  icon: LucideIcon
  className: string
}[] = [
  {
    type: 'entrada',
    label: 'Entrada',
    icon: PackagePlus,
    className: 'bg-ok-soft text-ok ring-ok/30 hover:ring-ok',
  },
  {
    type: 'salida',
    label: 'Salida',
    icon: PackageMinus,
    className: 'bg-alert-soft text-alert ring-alert/30 hover:ring-alert',
  },
]

type MovementTypeChoiceProps = {
  onSelect: (type: ManualMovementType) => void
}

export function MovementTypeChoice({ onSelect }: MovementTypeChoiceProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon

        return (
          <button
            key={option.type}
            type="button"
            onClick={() => {
              onSelect(option.type)
            }}
            className={cn(
              'flex min-h-28 flex-col items-center justify-center gap-3 rounded-3xl px-4 py-6 text-xl font-semibold ring-1 transition focus-visible:ring-2 focus-visible:ring-wheat-strong',
              option.className,
            )}
          >
            <Icon aria-hidden="true" size={32} />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
