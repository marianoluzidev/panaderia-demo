import { AttentionList } from '../components/home/AttentionList.tsx'
import { HomeHeader } from '../components/home/HomeHeader.tsx'
import { OperationIndicators } from '../components/home/StockSummaryCards.tsx'
import { RecentShipments } from '../components/home/RecentShipments.tsx'
import { shouldReviewStockAgain } from '../lib/dates.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { articlesNeedingAttention, summarizeStock } from '../lib/stockStatus.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function HomePage() {
  usePageTitle('Inicio')

  const { articles } = useStockDemo()
  const summary = summarizeStock(articles)
  const attention = articlesNeedingAttention(articles)
  const pendingReview = articles.filter((article) =>
    shouldReviewStockAgain(article.lastStockCheckAt),
  ).length

  return (
    <div className="flex flex-col gap-6">
      <HomeHeader />
      <OperationIndicators
        low={summary.bajo}
        outOfStock={summary.sinStock}
        pendingReview={pendingReview}
      />
      <AttentionList articles={attention} />
      <RecentShipments />
    </div>
  )
}
