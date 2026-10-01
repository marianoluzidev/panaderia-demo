import { AppRouter } from './routes/AppRouter.tsx'
import { StockDemoProvider } from './state/StockDemoProvider.tsx'

export default function App() {
  return (
    <StockDemoProvider>
      <AppRouter />
    </StockDemoProvider>
  )
}
