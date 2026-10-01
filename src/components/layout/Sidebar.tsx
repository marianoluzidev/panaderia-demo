import { Wheat } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { sidebarNavItems } from './navItems.ts'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar md:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <Wheat aria-hidden="true" className="text-wheat" size={20} />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight text-white">Panadería</p>
          <p className="text-xs leading-tight text-white/60">Central</p>
        </div>
      </div>
      <nav aria-label="Principal" className="flex flex-col px-2 pb-4">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 border-l-[3px] px-3 text-sm font-medium',
                  isActive
                    ? 'border-wheat bg-sidebar-hover text-white'
                    : 'border-transparent text-white/70 hover:bg-sidebar-hover hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    aria-hidden="true"
                    size={18}
                    className={isActive ? 'text-wheat' : undefined}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
