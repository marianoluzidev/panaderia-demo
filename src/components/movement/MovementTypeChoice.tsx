import { PackageMinus, PackagePlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import type { ManualMovementType } from '../../types/movement.ts'

const options: readonly {
  type: ManualMovementType
  label: string
  icon: LucideIcon
  iconClassName: string
}[] = [
  {
    type: 'entrada',
    label: 'Entrada',
    icon: PackagePlus,
    iconClassName: 'text-ok',
  },
  {
    type: 'salida',
    label: 'Salida',
    icon: PackageMinus,
    iconClassName: 'text-alert',
  },
]

type MovementTypeChoiceProps = {
  onSelect: (type: ManualMovementType) => void
}

export function MovementTypeChoice({ onSelect }: MovementTypeChoiceProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon

        return (
          <button
            key={option.type}
            type="button"
            onClick={() => {
              onSelect(option.type)
            }}
            className="flex min-h-11 items-center gap-3 rounded-lg border border-line bg-white px-3 text-left text-sm font-semibold text-ink hover:bg-cream"
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-md border border-line',
                option.iconClassName,
              )}
            >
              <Icon aria-hidden="true" size={16} />
            </span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
