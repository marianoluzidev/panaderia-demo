import { Link } from 'react-router'
import { categoryLabels, formatSpokenQuantity, spokenUnitLabel } from '../../lib/labels.ts'
import type { Article } from '../../types/article.ts'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'

type ArticleConfigListProps = {
  articles: readonly Article[]
}

export function ArticleConfigList({ articles }: ArticleConfigListProps) {
  return (
    <ul className="flex flex-col gap-2 md:gap-3">
      {articles.map((article) => (
        <li key={article.id}>
          <article className="flex items-start gap-3 rounded-3xl bg-white p-3 shadow-card ring-1 ring-line md:items-center md:p-4">
            <ArticleIllustration illustration={article.illustration} />
            <div className="grid min-w-0 flex-1 gap-1 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.8fr))_auto] lg:items-center lg:gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold leading-tight">{article.name}</h2>
                <p className="text-sm text-muted">
                  {categoryLabels[article.category]}
                </p>
              </div>
              <p className="text-sm text-muted lg:text-base lg:text-ink">
                <span className="lg:hidden">Unidad: </span>
                {spokenUnitLabel(article.unit)}
              </p>
              <p className="text-sm text-muted lg:text-base lg:text-ink">
                Mínimo: {formatSpokenQuantity(article.minimumStock, article.unit)}
              </p>
              <p className="text-sm text-muted">
                Stock actual:{' '}
                {formatSpokenQuantity(article.currentStock, article.unit)}
              </p>
              <Link
                to={`/articulos/${article.id}/editar`}
                className="inline-flex min-h-11 items-center justify-center justify-self-start rounded-2xl bg-white px-4 text-sm font-semibold text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft lg:justify-self-end"
              >
                Editar
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
