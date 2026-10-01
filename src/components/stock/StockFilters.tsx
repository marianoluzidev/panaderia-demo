import { Search } from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import type { CategoryFilter, StatusFilter } from '../../lib/stockList.ts'

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'materia-prima', label: 'Materias primas' },
  { value: 'descartable', label: 'Descartables' },
]

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'ok', label: 'En orden' },
  { value: 'bajo', label: 'Bajo' },
  { value: 'sin-stock', label: 'Sin stock' },
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
  return (
    <div className="flex flex-col gap-2">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="buscar-articulo" className="relative block">
          <span className="sr-only">Buscar un artículo</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            size={18}
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
            className="h-11 w-full rounded-lg border border-line bg-field pr-3 pl-10 text-sm text-ink placeholder:text-muted"
          />
        </label>
      </form>
      <FilterRow
        label="Categoría"
        options={categoryOptions}
        value={category}
        onChange={onCategoryChange}
      />
      <FilterRow
        label="Estado"
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
      />
    </div>
  )
}

type FilterRowProps<T extends string> = {
  label: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterRowProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="no-scrollbar flex gap-1.5 overflow-x-auto"
    >
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
              'min-h-11 shrink-0 rounded-lg px-3 text-sm font-medium',
              selected
                ? 'border border-wheat bg-wheat-soft text-ink'
                : 'border border-line bg-white text-muted hover:text-ink',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
