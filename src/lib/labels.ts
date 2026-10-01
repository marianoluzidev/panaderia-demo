import type { ArticleCategory, Unit } from '../types/article.ts'
import type { MovementType } from '../types/movement.ts'
import type { StockStatus } from '../types/stock.ts'

export const categoryLabels: Record<ArticleCategory, string> = {
  'materia-prima': 'Materia prima',
  descartable: 'Descartable',
}

const unitForms: Record<Unit, { one: string; many: string }> = {
  kg: { one: 'kg', many: 'kg' },
  g: { one: 'g', many: 'g' },
  l: { one: 'l', many: 'l' },
  ml: { one: 'ml', many: 'ml' },
  unidad: { one: 'unidad', many: 'unidades' },
  bolsa: { one: 'bolsa', many: 'bolsas' },
  pack: { one: 'pack', many: 'packs' },
  paquete: { one: 'paquete', many: 'paquetes' },
}

export const unitLabels: Record<Unit, string> = {
  kg: unitForms.kg.many,
  g: unitForms.g.many,
  l: unitForms.l.many,
  ml: unitForms.ml.many,
  unidad: 'unid.',
  bolsa: unitForms.bolsa.many,
  pack: unitForms.pack.many,
  paquete: unitForms.paquete.many,
}

const spokenForms: Record<Unit, { one: string; many: string }> = {
  kg: { one: 'kg', many: 'kg' },
  g: { one: 'g', many: 'g' },
  l: { one: 'litro', many: 'litros' },
  ml: { one: 'ml', many: 'ml' },
  unidad: unitForms.unidad,
  bolsa: unitForms.bolsa,
  pack: unitForms.pack,
  paquete: unitForms.paquete,
}

const feminineUnits: ReadonlySet<Unit> = new Set(['bolsa', 'unidad'])

export function formatAmount(quantity: number): string {
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 3,
  }).format(quantity)
}

export function formatQuantity(quantity: number, unit: Unit): string {
  const form = quantity === 1 ? unitForms[unit].one : unitForms[unit].many
  return `${formatAmount(quantity)} ${form}`
}

export function formatSpokenQuantity(quantity: number, unit: Unit): string {
  const form = quantity === 1 ? spokenForms[unit].one : spokenForms[unit].many
  return `${formatAmount(quantity)} ${form}`
}

export function spokenUnitLabel(unit: Unit): string {
  return spokenForms[unit].many
}

export function realQuantityQuestion(unit: Unit): string {
  const pronoun = feminineUnits.has(unit) ? 'Cuántas' : 'Cuántos'
  return `¿${pronoun} ${spokenForms[unit].many} hay realmente?`
}

export function formatRegisteredBefore(quantity: number, unit: Unit): string {
  const feminine = feminineUnits.has(unit)
  const adjective =
    quantity === 1
      ? feminine
        ? 'registrada'
        : 'registrado'
      : feminine
        ? 'registradas'
        : 'registrados'

  return `Había ${formatAmount(quantity)} ${adjective}`
}

export const movementTypeLabels: Record<MovementType, string> = {
  entrada: 'Entrada',
  salida: 'Salida',
  ajuste: 'Ajuste',
  conteo: 'Actualización de stock real',
}

export const stockStatusLabels: Record<StockStatus, string> = {
  ok: 'En orden',
  bajo: 'Bajo',
  'sin-stock': 'Sin stock',
}
