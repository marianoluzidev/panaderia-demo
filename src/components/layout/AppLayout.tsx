import { Wheat } from 'lucide-react'
import { Outlet, useLocation } from 'react-router'
import { BottomNav } from './BottomNav.tsx'
import { Sidebar } from './Sidebar.tsx'

export function AppLayout() {
  const isStockList = useLocation().pathname === '/stock'

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Sidebar />
      <div className="md:pl-64">
        {isStockList ? null : (
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-wheat-soft text-wheat-strong">
              <Wheat aria-hidden="true" size={22} />
            </span>
            <p className="text-lg font-semibold">Panadería</p>
          </header>
        )}
        <main
          id="contenido"
          className="mx-auto w-full max-w-[1200px] px-4 py-6 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:px-8 md:py-8 md:pb-10"
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
