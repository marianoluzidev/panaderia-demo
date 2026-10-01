import { categoryLabels, formatSpokenQuantity } from '../../lib/labels.ts'
import type { Article } from '../../types/article.ts'
import { CategoryMark } from '../stock/CategoryMark.tsx'
import { Card } from '../ui/Card.tsx'

type SelectedArticleCardProps = {
  article: Article
  onChangeArticle: () => void
  stockLabel?: string
}

export function SelectedArticleCard({
  article,
  onChangeArticle,
  stockLabel = 'Registrado actualmente',
}: SelectedArticleCardProps) {
  return (
    <Card className="p-4!">
      <div className="flex items-center gap-3">
        <CategoryMark category={article.category} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{article.name}</p>
          <p className="text-sm text-muted">
            {categoryLabels[article.category]}
          </p>
          <p className="mt-1 text-base">
            {stockLabel}:{' '}
            {formatSpokenQuantity(article.currentStock, article.unit)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onChangeArticle}
        className="mt-3 min-h-11 text-sm font-semibold text-wheat-strong underline-offset-2 hover:underline"
      >
        Cambiar artículo
      </button>
    </Card>
  )
}
