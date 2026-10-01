import { Minus, Plus } from 'lucide-react'
import {
  allowsDecimalQuantity,
  quantityInputError,
  stepRealQuantity,
} from '../../lib/quantityInput.ts'
import type { Unit } from '../../types/article.ts'

type ShipmentQuantityControlProps = {
  inputId: string
  unit: Unit
  value: string
  label: string
  onChange: (value: string) => void
}

export function ShipmentQuantityControl({
  inputId,
  unit,
  value,
  label,
  onChange,
}: ShipmentQuantityControlProps) {
  const error = quantityInputError(value, unit)

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-cream"
          aria-label={`Disminuir ${label}`}
          onClick={() => {
            onChange(stepRealQuantity(value, unit, -1))
          }}
        >
          <Minus aria-hidden="true" size={18} />
        </button>
        <input
          id={inputId}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          inputMode={allowsDecimalQuantity(unit) ? 'decimal' : 'numeric'}
          autoComplete="off"
          aria-invalid={error !== null}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="h-11 w-full rounded-lg border border-line bg-white text-center text-sm font-semibold text-ink tabular-nums outline-none"
        />
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-cream"
          aria-label={`Aumentar ${label}`}
          onClick={() => {
            onChange(stepRealQuantity(value, unit, 1))
          }}
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
