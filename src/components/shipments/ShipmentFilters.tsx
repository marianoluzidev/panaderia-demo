import { cn } from '../../lib/cn.ts'
import type { ShipmentFilter } from '../../lib/shipments.ts'

const options: { value: ShipmentFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'confirmados', label: 'Confirmados' },
  { value: 'borradores', label: 'Borradores' },
  { value: 'sucursal-1', label: 'Sucursal 1' },
  { value: 'sucursal-2', label: 'Sucursal 2' },
]

type ShipmentFiltersProps = {
  value: ShipmentFilter
  onChange: (value: ShipmentFilter) => void
}

export function ShipmentFilters({ value, onChange }: ShipmentFiltersProps) {
  return (
    <div className="min-w-0">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:flex-wrap md:px-0">
        {options.map((option) => {
          const selected = option.value === value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                onChange(option.value)
              }}
              className={cn(
                'min-h-11 shrink-0 rounded-full px-4 text-base font-semibold transition',
                selected
                  ? 'bg-wheat-strong text-white hover:bg-wheat-deep active:bg-wheat-deep'
                  : 'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
