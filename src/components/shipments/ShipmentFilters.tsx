import { SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { cn } from '../../lib/cn.ts'
import type { ShipmentFilter } from '../../lib/shipments.ts'

const statusOptions: Array<{ value: ShipmentFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'confirmados', label: 'Confirmados' },
  { value: 'borradores', label: 'Borradores' },
]

const destinationOptions: Array<{ value: ShipmentFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'sucursal-1', label: 'Sucursal 1' },
  { value: 'sucursal-2', label: 'Sucursal 2' },
]

type ShipmentFiltersProps = {
  value: ShipmentFilter
  onChange: (value: ShipmentFilter) => void
}

export function ShipmentFilters({ value, onChange }: ShipmentFiltersProps) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const statusValue: ShipmentFilter =
    value === 'confirmados' || value === 'borradores' ? value : 'todos'
  const destinationValue: ShipmentFilter =
    value === 'sucursal-1' || value === 'sucursal-2' ? value : 'todos'
  const activeLabel =
    statusOptions.find((option) => option.value === value)?.label ??
    destinationOptions.find((option) => option.value === value)?.label

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium md:hidden',
            value !== 'todos'
              ? 'border-wheat bg-wheat-soft text-ink'
              : 'border-line bg-white text-ink',
          )}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setOpen((current) => !current)
          }}
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          {value !== 'todos' ? 'Filtros (1)' : 'Filtros'}
        </button>
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <FilterSelect
            label="Estado"
            value={statusValue}
            options={statusOptions}
            onChange={onChange}
          />
          <FilterSelect
            label="Destino"
            value={destinationValue}
            options={destinationOptions}
            onChange={onChange}
          />
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="Filtros de envíos"
          className="rounded-surface border border-line bg-white p-3 md:hidden"
        >
          <OptionGroup
            label="Estado"
            options={statusOptions}
            value={statusValue}
            onChange={onChange}
          />
          <OptionGroup
            label="Destino"
            options={destinationOptions}
            value={destinationValue}
            onChange={onChange}
          />
        </div>
      ) : null}

      {value !== 'todos' && activeLabel ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-1 rounded-md border border-line bg-white px-2.5 text-xs font-medium text-ink"
            aria-label={`Quitar filtro ${activeLabel}`}
            onClick={() => {
              onChange('todos')
            }}
          >
            {activeLabel}
            <X aria-hidden="true" size={14} />
          </button>
          <button
            type="button"
            className="min-h-11 px-2 text-sm font-medium text-wheat-strong"
            onClick={() => {
              onChange('todos')
            }}
          >
            Limpiar
          </button>
        </div>
      ) : null}
    </div>
  )
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Array<{ value: ShipmentFilter; label: string }>
  value: ShipmentFilter
  onChange: (value: ShipmentFilter) => void
}) {
  return (
    <fieldset className="mt-3 first:mt-0">
      <legend className="text-xs font-medium text-muted">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
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
                'min-h-11 rounded-lg px-3 text-sm font-medium',
                selected
                  ? 'border border-wheat bg-wheat-soft text-ink'
                  : 'border border-line bg-white text-muted',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: ShipmentFilter
  options: Array<{ value: ShipmentFilter; label: string }>
  onChange: (value: ShipmentFilter) => void
}) {
  const id = `envio-filtro-${label.toLowerCase()}`

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-muted">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value as ShipmentFilter)
        }}
        className="h-11 rounded-lg border border-line bg-white px-2 text-sm text-ink"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
