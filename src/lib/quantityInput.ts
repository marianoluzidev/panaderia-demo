import type { Unit } from '../types/article.ts'

const decimalUnits: ReadonlySet<Unit> = new Set(['kg', 'g', 'l', 'ml'])

export const maxRealQuantity = 99_999

export function allowsDecimalQuantity(unit: Unit): boolean {
  return decimalUnits.has(unit)
}

export function roundQuantity(value: number): number {
  return Math.round(value * 1000) / 1000
}

export function parseRealQuantity(raw: string, unit: Unit): number | null {
  const trimmed = raw.trim().replace(',', '.')

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null
  }

  if (allowsDecimalQuantity(unit)) {
    if (!/^\d+(\.\d{1,3})?$/.test(trimmed)) {
      return null
    }
  } else if (!/^\d+$/.test(trimmed)) {
    return null
  }

  const value = Number(trimmed)

  if (!Number.isFinite(value) || value < 0 || value > maxRealQuantity) {
    return null
  }

  return roundQuantity(value)
}

export function quantityInputError(raw: string, unit: Unit): string | null {
  const trimmed = raw.trim()

  if (trimmed === '') {
    return null
  }

  if (parseRealQuantity(trimmed, unit) !== null) {
    return null
  }

  if (trimmed.includes('-')) {
    return 'No se permiten valores negativos.'
  }

  if (!allowsDecimalQuantity(unit) && /[.,]/.test(trimmed)) {
    return 'Esta unidad no admite decimales.'
  }

  return 'Ingresá un número válido.'
}

export function stepRealQuantity(
  raw: string,
  unit: Unit,
  direction: -1 | 1,
): string {
  const current = parseRealQuantity(raw, unit) ?? 0
  const step = allowsDecimalQuantity(unit) ? 0.1 : 1
  const next = roundQuantity(
    Math.min(maxRealQuantity, Math.max(0, current + direction * step)),
  )

  if (!allowsDecimalQuantity(unit) || Number.isInteger(next)) {
    return String(Math.round(next))
  }

  return String(next).replace('.', ',')
}
