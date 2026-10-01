import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { cn } from '../../lib/cn.ts'
import type {
  MovementDateFilter,
  MovementTypeFilter,
} from '../../lib/movementList.ts'

const typeOptions: Array<{ value: MovementTypeFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'entrada', label: 'Entradas' },
  { value: 'salida', label: 'Salidas' },
  { value: 'conteo', label: 'Stock real' },
  { value: 'ajuste', label: 'Ajustes' },
]

const dateOptions: Array<{ value: MovementDateFilter; label: string }> = [
  { value: 'todos', label: 'Todas' },
  { value: 'hoy', label: 'Hoy' },
  { value: '7-dias', label: 'Últimos 7 días' },
  { value: '30-dias', label: 'Últimos 30 días' },
]

const searchClassName =
  'h-11 w-full rounded-lg border border-line bg-field pr-3 pl-10 text-sm text-ink placeholder:text-muted'

type MovementFiltersProps = {
  search: string
  type: MovementTypeFilter
  date: MovementDateFilter
  onSearchChange: (value: string) => void
  onTypeChange: (value: MovementTypeFilter) => void
  onDateChange: (value: MovementDateFilter) => void
  onClear: () => void
}

export function MovementFilters({
  search,
  type,
  date,
  onSearchChange,
  onTypeChange,
  onDateChange,
  onClear,
}: MovementFiltersProps) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const activeCount = Number(type !== 'todos') + Number(date !== 'todos')

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
      <div className="flex items-center gap-2">
        <SearchField search={search} onSearchChange={onSearchChange} />
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium md:hidden',
            activeCount > 0
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
          {activeCount > 0 ? `Filtros (${activeCount})` : 'Filtros'}
        </button>
        <div className="hidden items-center gap-2 md:flex">
          <FilterSelect
            label="Tipo"
            value={type}
            options={typeOptions}
            onChange={onTypeChange}
          />
          <FilterSelect
            label="Fecha"
            value={date}
            options={dateOptions}
            onChange={onDateChange}
          />
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="Filtros de movimientos"
          className="rounded-surface border border-line bg-white p-3 md:hidden"
        >
          <OptionGroup
            label="Tipo"
            options={typeOptions}
            value={type}
            onChange={onTypeChange}
          />
          <OptionGroup
            label="Fecha"
            options={dateOptions}
            value={date}
            onChange={onDateChange}
          />
        </div>
      ) : null}

      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {type !== 'todos' ? (
            <RemovableChip
              label={typeOptions.find((option) => option.value === type)?.label ?? type}
              onRemove={() => {
                onTypeChange('todos')
              }}
            />
          ) : null}
          {date !== 'todos' ? (
            <RemovableChip
              label={dateOptions.find((option) => option.value === date)?.label ?? date}
              onRemove={() => {
                onDateChange('todos')
              }}
            />
          ) : null}
          <button
            type="button"
            className="min-h-11 px-2 text-sm font-medium text-wheat-strong"
            onClick={onClear}
          >
            Limpiar
          </button>
        </div>
      ) : null}
    </div>
  )
}

function SearchField({
  search,
  onSearchChange,
}: {
  search: string
  onSearchChange: (value: string) => void
}) {
  return (
    <form
      className="min-w-0 flex-1"
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <label htmlFor="buscar-movimiento" className="relative block">
        <span className="sr-only">Buscar un artículo</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          size={18}
        />
        <input
          id="buscar-movimiento"
          type="search"
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value)
          }}
          placeholder="Buscar un artículo"
          autoComplete="off"
          className={searchClassName}
        />
      </label>
    </form>
  )
}

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
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

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}) {
  const id = `filtro-${label.toLowerCase()}`

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-muted">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value as T)
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

function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-1 rounded-md border border-line bg-white px-2.5 text-xs font-medium text-ink"
      aria-label={`Quitar filtro ${label}`}
      onClick={onRemove}
    >
      {label}
      <X aria-hidden="true" size={14} />
    </button>
  )
}
