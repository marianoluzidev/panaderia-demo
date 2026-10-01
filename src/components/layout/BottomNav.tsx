import { Ellipsis } from 'lucide-react'
import { useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { MoreMenu } from './MoreMenu.tsx'
import { primaryNavItems } from './navItems.ts'

export function BottomNav() {
  const { pathname } = useLocation()
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const moreOpen = menuPath === pathname
  const moreCurrent =
    pathname.startsWith('/articulos') || pathname.startsWith('/proveedores')

  return (
    <>
      {moreOpen ? (
        <MoreMenu
          onClose={() => {
            setMenuPath(null)
            moreButtonRef.current?.focus()
          }}
        />
      ) : null}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white md:hidden"
      >
        <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {primaryNavItems.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-14 flex-col items-center justify-center gap-1 px-0.5 text-center text-[11px] leading-none font-medium',
                      isActive ? 'text-wheat-strong' : 'text-muted',
                    )
                  }
                >
                  <Icon aria-hidden="true" size={18} />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
          <li>
            <button
              ref={moreButtonRef}
              type="button"
              className={cn(
                'flex min-h-14 w-full flex-col items-center justify-center gap-1 px-0.5 text-center text-[11px] leading-none font-medium',
                moreOpen || moreCurrent ? 'text-wheat-strong' : 'text-muted',
              )}
              aria-expanded={moreOpen}
              aria-controls="menu-mas"
              onClick={() => {
                setMenuPath(moreOpen ? null : pathname)
              }}
            >
              <Ellipsis aria-hidden="true" size={18} />
              Más
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
