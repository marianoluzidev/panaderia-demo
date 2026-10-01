import { Search } from 'lucide-react'
import { cn } from '../../lib/cn.ts'
import type { ArticleCategoryFilter } from '../../lib/articleCatalog.ts'

const categoryOptions: Array<{ value: ArticleCategoryFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'materia-prima', label: 'Materias primas' },
  { value: 'descartable', label: 'Descartables' },
]

type ArticleFiltersProps = {
  search: string
  category: ArticleCategoryFilter
  onSearchChange: (value: string) => void
  onCategoryChange: (value: ArticleCategoryFilter) => void
}

export function ArticleFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ArticleFiltersProps) {
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="buscar-configuracion" className="relative block">
          <span className="sr-only">Buscar un artículo</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            id="buscar-configuracion"
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
      <div
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        role="group"
        aria-label="Categoría"
      >
        {categoryOptions.map((option) => {
          const selected = option.value === category

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                onCategoryChange(option.value)
              }}
              className={cn(
                'shrink-0 rounded-full px-4 font-semibold transition',
                'min-h-11 text-base md:min-h-12',
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
