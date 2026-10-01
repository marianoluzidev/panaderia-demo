import { Store, Wheat } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { navItems } from './navItems.ts'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-wheat-soft text-wheat-strong">
          <Wheat aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-semibold leading-tight">Panadería</p>
          <p className="text-sm text-muted">Stock</p>
        </div>
      </div>
      <nav aria-label="Principal" className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-medium',
                  isActive
                    ? 'bg-wheat-soft text-wheat-strong'
                    : 'text-ink hover:bg-cream',
                )
              }
            >
              <Icon aria-hidden="true" />
              {item.label}
            </NavLink>
          )
        })}
        <NavLink
          to="/proveedores"
          className={({ isActive }) =>
            cn(
              'flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-medium',
              isActive ? 'bg-wheat-soft text-wheat-strong' : 'text-ink hover:bg-cream',
            )
          }
        >
          <Store aria-hidden="true" />
          Proveedores
        </NavLink>
      </nav>
    </aside>
  )
}
