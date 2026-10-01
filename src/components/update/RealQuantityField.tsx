import { Minus, Plus } from 'lucide-react'
import {
  allowsDecimalQuantity,
  quantityInputError,
  stepRealQuantity,
} from '../../lib/quantityInput.ts'
import { realQuantityQuestion } from '../../lib/labels.ts'
import type { Unit } from '../../types/article.ts'

type RealQuantityFieldProps = {
  unit: Unit
  value: string
  onChange: (value: string) => void
  question?: string
  extraError?: string | null
  unitLabel?: string
  disabled?: boolean
  inputId?: string
  decreaseLabel?: string
  increaseLabel?: string
}

export function RealQuantityField({
  unit,
  value,
  onChange,
  question = realQuantityQuestion(unit),
  extraError = null,
  unitLabel,
  disabled = false,
  inputId = 'cantidad-real',
  decreaseLabel = 'Disminuir cantidad',
  increaseLabel = 'Aumentar cantidad',
}: RealQuantityFieldProps) {
  const error = quantityInputError(value, unit) ?? extraError
  const errorId = `${inputId}-error`
  const unitId = `${inputId}-unidad`
  const describedBy = [
    error ? errorId : null,
    unitLabel ? unitId : null,
  ]
    .filter((id) => id !== null)
    .join(' ')

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-semibold">
        {question}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-cream disabled:opacity-60"
          aria-label={decreaseLabel}
          disabled={disabled}
          onClick={() => {
            onChange(stepRealQuantity(value, unit, -1))
          }}
        >
          <Minus aria-hidden="true" size={22} />
        </button>
        <input
          id={inputId}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          inputMode={allowsDecimalQuantity(unit) ? 'decimal' : 'numeric'}
          autoComplete="off"
          enterKeyHint="done"
          disabled={disabled}
          aria-invalid={error !== null}
          aria-describedby={describedBy || undefined}
          className="h-11 w-full rounded-lg border border-line bg-white text-center text-2xl font-semibold text-ink outline-none disabled:opacity-60"
        />
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-cream disabled:opacity-60"
          aria-label={increaseLabel}
          disabled={disabled}
          onClick={() => {
            onChange(stepRealQuantity(value, unit, 1))
          }}
        >
          <Plus aria-hidden="true" size={22} />
        </button>
      </div>
      {unitLabel ? (
        <p id={unitId} className="mt-2 text-center text-sm text-muted">
          {unitLabel}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
