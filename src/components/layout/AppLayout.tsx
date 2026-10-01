import { Outlet, useLocation } from 'react-router'
import { useStockDemo } from '../../state/useStockDemo.ts'
import { BottomNav } from './BottomNav.tsx'
import { screenTitle } from './screenTitle.ts'
import { Sidebar } from './Sidebar.tsx'

export function AppLayout() {
  const { pathname } = useLocation()
  const { articles } = useStockDemo()
  const title = screenTitle(pathname, articles)

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Sidebar />
      <div className="md:pl-60">
        <header className="sticky top-0 z-20 hidden h-12 items-center border-b border-line bg-white px-8 md:flex">
          <p className="text-[13px] text-muted">
            Sucursal <span className="font-semibold text-ink">Central</span>
          </p>
        </header>
        <header className="sticky top-0 z-20 flex h-12 items-center border-b border-line bg-white px-4 md:hidden">
          <p className="truncate text-base font-semibold">{title}</p>
        </header>
        <main
          id="contenido"
          className="mx-auto w-full max-w-[1280px] min-w-0 px-4 py-4 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:px-8 md:py-6 md:pb-8"
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
