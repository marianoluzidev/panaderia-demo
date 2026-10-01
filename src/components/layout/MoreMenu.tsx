import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { moreNavItems } from './navItems.ts'

type MoreMenuProps = {
  onClose: () => void
}

export function MoreMenu({ onClose }: MoreMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    firstLinkRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        className="fixed inset-0 z-20 bg-ink/40 md:hidden"
        onClick={onClose}
      />
      <div
        id="menu-mas"
        role="dialog"
        aria-modal="true"
        aria-label="Más opciones"
        className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-line bg-white px-2 py-2 md:hidden"
      >
        <ul>
          {moreNavItems.map((item, index) => {
            const Icon = item.icon

            return (
              <li key={item.to}>
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  to={item.to}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink hover:bg-cream"
                  onClick={onClose}
                >
                  <Icon aria-hidden="true" size={18} className="text-muted" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
