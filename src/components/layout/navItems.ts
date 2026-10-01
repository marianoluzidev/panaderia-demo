import {
  ArrowLeftRight,
  Boxes,
  Home,
  Package,
  Store,
  Truck,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const primaryNavItems: readonly NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/stock', label: 'Stock', icon: Package },
  { to: '/envios', label: 'Envíos', icon: Truck },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
]

export const moreNavItems: readonly NavItem[] = [
  { to: '/articulos', label: 'Artículos', icon: Boxes },
  { to: '/proveedores', label: 'Proveedores', icon: Store },
]

export const sidebarNavItems: readonly NavItem[] = [
  ...primaryNavItems,
  ...moreNavItems,
]
