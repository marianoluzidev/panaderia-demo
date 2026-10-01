import {
  ClipboardCheck,
  PackageMinus,
  PackagePlus,
  SlidersHorizontal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MovementType } from '../types/movement.ts'

export const movementIcon: Record<MovementType, LucideIcon> = {
  entrada: PackagePlus,
  salida: PackageMinus,
  conteo: ClipboardCheck,
  ajuste: SlidersHorizontal,
}

export const movementTone: Record<MovementType, { icon: string; amount: string }> = {
  entrada: { icon: 'bg-ok-soft text-ok', amount: 'text-ok' },
  salida: { icon: 'bg-alert-soft text-alert', amount: 'text-alert' },
  conteo: {
    icon: 'bg-wheat-soft text-wheat-strong',
    amount: 'text-wheat-strong',
  },
  ajuste: { icon: 'bg-cream text-muted ring-1 ring-line', amount: 'text-ink' },
}
