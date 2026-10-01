import { NavLink } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { navItems } from './navItems.ts'

export function BottomNav() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white md:hidden"
    >
      <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-center text-[10px] font-medium leading-tight sm:text-xs',
                    isActive ? 'text-wheat-strong' : 'text-muted',
                  )
                }
              >
                <Icon aria-hidden="true" size={20} />
                {item.label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
