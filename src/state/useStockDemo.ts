import { useContext } from 'react'
import { StockDemoContext, type StockDemo } from './stockDemoContext.ts'

export function useStockDemo(): StockDemo {
  const demo = useContext(StockDemoContext)

  if (!demo) {
    throw new Error('useStockDemo debe usarse dentro de StockDemoProvider')
  }

  return demo
}
