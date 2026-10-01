import {
  ArrowLeftRight,
  Boxes,
  Home,
  Package,
  Truck,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const navItems: readonly NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/stock', label: 'Stock', icon: Package },
  { to: '/envios', label: 'Envíos', icon: Truck },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/articulos', label: 'Artículos', icon: Boxes },
]
