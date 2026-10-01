import type { Article } from '../../types/article.ts'
import { StockArticleCard } from './StockArticleCard.tsx'

type StockListProps = {
  articles: readonly Article[]
}

export function StockList({ articles }: StockListProps) {
  return (
    <ul className="flex flex-col gap-2 md:gap-3">
      {articles.map((article) => (
        <li key={article.id}>
          <StockArticleCard article={article} />
        </li>
      ))}
    </ul>
  )
}
