import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { ArticleConfigList } from '../components/articles/ArticleConfigList.tsx'
import { ArticleFilters } from '../components/articles/ArticleFilters.tsx'
import { Button } from '../components/ui/Button.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { cn } from '../lib/cn.ts'
import {
  articleEmptyDetail,
  hasActiveArticleFilters,
  listArticles,
  type ArticleCategoryFilter,
} from '../lib/articleCatalog.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function ArticlesPage() {
  usePageTitle('Artículos')

  const { articles } = useStockDemo()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ArticleCategoryFilter>('todos')
  const query = { search, category }
  const results = listArticles(articles, query)
  const filtered = hasActiveArticleFilters(query)

  function clearFilters() {
    setSearch('')
    setCategory('todos')
  }

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Artículos</h1>
            <Link
              to="/articulos/nuevo"
              className={cn(
                buttonClassName('primary'),
                'max-md:min-h-11! max-md:px-3! max-md:text-sm md:hidden!',
              )}
            >
              <Plus aria-hidden="true" size={18} />
              Nuevo artículo
            </Link>
          </div>
          <p className="mt-0.5 max-w-2xl text-sm leading-tight text-muted md:mt-1 md:text-base">
            Administrá los productos que controlás
          </p>
          <Link
            to="/proveedores"
            className={cn(buttonClassName('secondary'), 'mt-3 self-start')}
          >
            Ver proveedores
          </Link>
        </div>
        <Link
          to="/articulos/nuevo"
          className={cn(buttonClassName('primary'), 'max-md:hidden! shrink-0')}
        >
          <Plus aria-hidden="true" size={18} />
          Nuevo artículo
        </Link>
      </header>

      {articles.length === 0 ? (
        <Card className="flex flex-col items-start gap-4">
          <p className="text-base">Todavía no hay artículos cargados.</p>
          <Link to="/articulos/nuevo" className={buttonClassName('primary')}>
            <Plus aria-hidden="true" size={18} />
            Nuevo artículo
          </Link>
        </Card>
      ) : (
        <>
          <ArticleFilters
            search={search}
            category={category}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
          />
          {filtered && results.length > 0 ? (
            <Button variant="secondary" className="self-start max-md:min-h-11!" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          ) : null}
          {results.length === 0 ? (
            <Card className="flex flex-col items-start gap-3">
              <div>
                <p className="text-base font-semibold">No encontramos artículos</p>
                <p className="mt-1 text-base text-muted">{articleEmptyDetail(query)}</p>
              </div>
              <Button variant="secondary" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </Card>
          ) : (
            <ArticleConfigList articles={results} />
          )}
        </>
      )}
    </div>
  )
}
