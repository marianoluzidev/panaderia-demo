import type { Article } from '../../types/article.ts'
import { StockArticleCard } from './StockArticleCard.tsx'

type StockListProps = {
  articles: readonly Article[]
}

export function StockList({ articles }: StockListProps) {
  return (
    <div className="overflow-hidden rounded-surface border border-line bg-white">
      <div className="hidden grid-cols-[minmax(0,1.7fr)_7.5rem_7.5rem_10rem_7.5rem_1.25rem] gap-3 border-b border-line px-3 py-2 text-xs font-medium text-muted lg:grid">
        <span className="pl-11">Artículo</span>
        <span>Stock actual</span>
        <span>Stock mínimo</span>
        <span>Última revisión</span>
        <span>Estado</span>
        <span className="sr-only">Abrir</span>
      </div>
      <ul>
        {articles.map((article) => (
          <li key={article.id} className="border-b border-line last:border-b-0">
            <StockArticleCard article={article} />
          </li>
        ))}
      </ul>
    </div>
  )
}
