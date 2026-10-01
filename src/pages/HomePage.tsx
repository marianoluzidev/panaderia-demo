import { AttentionList } from '../components/home/AttentionList.tsx'
import { HomeHeader } from '../components/home/HomeHeader.tsx'
import { PendingReview } from '../components/home/PendingReview.tsx'
import { QuickActions } from '../components/home/QuickActions.tsx'
import { RecentShipments } from '../components/home/RecentShipments.tsx'
import { StockSummaryCards } from '../components/home/StockSummaryCards.tsx'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'
import {
  articlesNeedingAttention,
  articlesPendingReview,
  summarizeStock,
} from '../lib/stockStatus.ts'

export function HomePage() {
  usePageTitle('Inicio')

  const { articles } = useStockDemo()
  const summary = summarizeStock(articles)
  const attention = articlesNeedingAttention(articles)
  const pending = articlesPendingReview(articles)

  return (
    <div className="flex flex-col gap-8">
      <HomeHeader />
      <StockSummaryCards summary={summary} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.9fr)] lg:items-start">
        <AttentionList
          articles={attention}
          className="order-1 lg:order-none lg:col-start-1 lg:row-start-1"
        />
        <QuickActions className="order-2 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-2" />
        <PendingReview
          articles={pending}
          className="order-3 lg:order-none lg:col-start-2 lg:row-start-1"
        />
      </div>
      <RecentShipments />
    </div>
  )
}
