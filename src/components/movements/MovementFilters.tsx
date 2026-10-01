import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
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
  { value: 'todos', label: 'Todos' },
  { value: 'hoy', label: 'Hoy' },
  { value: '7-dias', label: 'Últimos 7 días' },
  { value: '30-dias', label: 'Últimos 30 días' },
]

type MovementFiltersProps = {
  search: string
  type: MovementTypeFilter
  date: MovementDateFilter
  onSearchChange: (value: string) => void
  onTypeChange: (value: MovementTypeFilter) => void
  onDateChange: (value: MovementDateFilter) => void
}

export function MovementFilters({
  search,
  type,
  date,
  onSearchChange,
  onTypeChange,
  onDateChange,
}: MovementFiltersProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const dateActive = date !== 'todos'

  return (
    <div className="flex flex-col gap-2 md:gap-5">
      <div className="flex items-center gap-2">
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
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              size={20}
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
              className="min-h-11 w-full rounded-2xl bg-white pr-4 pl-12 text-base text-ink ring-1 ring-line placeholder:text-muted hover:ring-wheat focus-visible:ring-wheat-strong md:min-h-12"
            />
          </label>
        </form>
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-3 text-base font-semibold transition md:hidden',
            dateActive
              ? 'bg-wheat-soft text-wheat-strong ring-1 ring-wheat-strong'
              : 'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft',
          )}
          aria-expanded={dateOpen}
          aria-controls="filtros-fecha"
          onClick={() => {
            setDateOpen((open) => !open)
          }}
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          {dateActive ? 'Filtros (1)' : 'Filtros'}
        </button>
      </div>

      <div
        id="filtros-fecha"
        className={cn(
          'rounded-2xl bg-white p-3 ring-1 ring-line md:hidden',
          dateOpen ? '' : 'hidden',
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p id="filtro-fecha-movil" className="text-base font-medium text-muted">
            Fecha
          </p>
          {dateActive ? (
            <button
              type="button"
              className="min-h-11 rounded-xl px-3 text-base font-semibold text-wheat-strong hover:bg-wheat-soft active:bg-wheat-soft"
              onClick={() => {
                onDateChange('todos')
              }}
            >
              Limpiar
            </button>
          ) : null}
        </div>
        <div
          role="group"
          aria-labelledby="filtro-fecha-movil"
          className="flex flex-wrap gap-2"
        >
          {dateOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={option.value === date}
              compact
              onClick={() => {
                onDateChange(option.value)
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:hidden"
        role="group"
        aria-label="Tipo"
      >
        {typeOptions.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={option.value === type}
            compact
            onClick={() => {
              onTypeChange(option.value)
            }}
          />
        ))}
      </div>

      <div className="hidden flex-col gap-5 md:flex">
        <FilterGroup
          label="Tipo"
          options={typeOptions}
          value={type}
          onChange={onTypeChange}
        />
        <FilterGroup
          label="Fecha"
          options={dateOptions}
          value={date}
          onChange={onDateChange}
        />
      </div>
    </div>
  )
}

type FilterChipProps = {
  label: string
  selected: boolean
  compact?: boolean
  onClick: () => void
}

function FilterChip({ label, selected, compact = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-4 font-semibold transition',
        compact ? 'min-h-11 text-base' : 'min-h-12 text-base',
        selected
          ? 'bg-wheat-strong text-white hover:bg-wheat-deep active:bg-wheat-deep'
          : 'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft',
      )}
    >
      {label}
    </button>
  )
}

type FilterGroupProps<T extends string> = {
  label: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterGroupProps<T>) {
  const labelId = `filtro-movimiento-${label.toLowerCase()}`

  return (
    <div>
      <p id={labelId} className="mb-2 text-base font-medium text-muted">
        {label}
      </p>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={option.value === value}
            onClick={() => {
              onChange(option.value)
            }}
          />
        ))}
      </div>
    </div>
  )
}
