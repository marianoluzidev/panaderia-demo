import { Package, Wheat } from 'lucide-react'
import type { ArticleCategory } from '../../types/article.ts'

type CategoryMarkProps = {
  category: ArticleCategory
}

export function CategoryMark({ category }: CategoryMarkProps) {
  const Icon = category === 'materia-prima' ? Wheat : Package

  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line text-muted">
      <Icon aria-hidden="true" size={16} />
    </span>
  )
}
