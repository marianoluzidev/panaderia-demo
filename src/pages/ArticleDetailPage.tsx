import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { ArticleActions } from '../components/article/ArticleActions.tsx'
import { PreferredSupplierCard } from '../components/article/PreferredSupplierCard.tsx'
import { ArticleIdentity } from '../components/article/ArticleIdentity.tsx'
import { ArticleNotFound } from '../components/article/ArticleNotFound.tsx'
import { MovementHistory } from '../components/article/MovementHistory.tsx'
import { StockCheckInfo } from '../components/article/StockCheckInfo.tsx'
import { StockSummaryCard } from '../components/article/StockSummaryCard.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { cn } from '../lib/cn.ts'
import { movementsForArticle } from '../lib/movements.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function ArticleDetailPage() {
  const { articleId } = useParams()
  const { articles, movements, suppliers } = useStockDemo()
  const article = articles.find((item) => item.id === articleId)

  usePageTitle(article ? article.name : 'Artículo no encontrado')

  if (!article) {
    return <ArticleNotFound />
  }

  const history = movementsForArticle(article.id, movements)
  const supplier =
    suppliers.find((item) => item.id === article.preferredSupplierId) ?? null

  return (
    <div className="-mt-4 flex flex-col gap-1 md:mt-0 md:gap-4 lg:gap-6">
      <Link
        to="/stock"
        className={cn(buttonClassName('secondary'), 'self-start')}
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Volver a Stock
      </Link>
      <div className="grid items-start gap-1 md:gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-1 md:gap-4">
          <ArticleIdentity article={article} />
          <StockSummaryCard article={article} />
          <StockCheckInfo article={article} />
          <ArticleActions article={article} />
          <PreferredSupplierCard article={article} supplier={supplier} />
        </div>
        <MovementHistory article={article} movements={history} />
      </div>
    </div>
  )
}
