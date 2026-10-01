import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn.ts'
import type { CategoryFilter, StatusFilter } from '../../lib/stockList.ts'

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'materia-prima', label: 'Materias primas' },
  { value: 'descartable', label: 'Descartables' },
]

const mobileCategoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'todos', label: 'Todas' },
  { value: 'materia-prima', label: 'Materias primas' },
  { value: 'descartable', label: 'Descartables' },
]

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'ok', label: 'En orden' },
  { value: 'bajo', label: 'Stock bajo' },
  { value: 'sin-stock', label: 'Sin stock' },
]

const mobileStatusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'sin-stock', label: 'Sin stock' },
  { value: 'bajo', label: 'Stock bajo' },
  { value: 'ok', label: 'En orden' },
]

type StockFiltersProps = {
  search: string
  category: CategoryFilter
  status: StatusFilter
  onSearchChange: (value: string) => void
  onCategoryChange: (value: CategoryFilter) => void
  onStatusChange: (value: StatusFilter) => void
}

export function StockFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: StockFiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const categoryActive = category !== 'todos'

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      <div className="flex items-center gap-2">
        <form
          className="min-w-0 flex-1"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label htmlFor="buscar-articulo" className="relative block">
            <span className="sr-only">Buscar un artículo</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              size={20}
            />
            <input
              id="buscar-articulo"
              type="search"
              value={search}
              onChange={(event) => {
                onSearchChange(event.target.value)
              }}
              placeholder="Buscar un artículo"
              autoComplete="off"
              className="min-h-11 w-full rounded-2xl bg-white pr-4 pl-12 text-base text-ink ring-1 ring-line transition placeholder:text-muted hover:ring-wheat focus-visible:ring-wheat-strong md:min-h-12"
            />
          </label>
        </form>
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-3 text-base font-semibold transition md:hidden',
            categoryActive
              ? 'bg-wheat-soft text-wheat-strong ring-1 ring-wheat-strong'
              : 'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft',
          )}
          aria-expanded={categoryOpen}
          aria-controls="filtros-categoria"
          onClick={() => {
            setCategoryOpen((open) => !open)
          }}
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          {categoryActive ? 'Filtros (1)' : 'Filtros'}
        </button>
      </div>

      <div
        id="filtros-categoria"
        className={cn(
          'rounded-2xl bg-white p-3 ring-1 ring-line md:hidden',
          categoryOpen ? '' : 'hidden',
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p id="filtro-categoria-movil" className="text-base font-medium text-muted">
            Categoría
          </p>
          {categoryActive ? (
            <button
              type="button"
              className="min-h-11 rounded-xl px-3 text-base font-semibold text-wheat-strong hover:bg-wheat-soft active:bg-wheat-soft"
              onClick={() => {
                onCategoryChange('todos')
              }}
            >
              Limpiar
            </button>
          ) : null}
        </div>
        <div
          role="group"
          aria-labelledby="filtro-categoria-movil"
          className="flex flex-wrap gap-2"
        >
          {mobileCategoryOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={option.value === category}
              compact
              onClick={() => {
                onCategoryChange(option.value)
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:hidden"
        role="group"
        aria-label="Estado"
      >
        {mobileStatusOptions.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={option.value === status}
            compact
            onClick={() => {
              onStatusChange(option.value)
            }}
          />
        ))}
      </div>

      <div className="hidden flex-col gap-5 md:flex">
        <FilterGroup
          label="Categoría"
          options={categoryOptions}
          value={category}
          onChange={onCategoryChange}
        />
        <FilterGroup
          label="Estado"
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
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
  const labelId = `filtro-${label.toLowerCase()}`

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
