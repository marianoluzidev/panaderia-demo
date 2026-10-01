function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysSince(isoDate: string, now = new Date()): number | null {
  const then = new Date(isoDate)

  if (Number.isNaN(then.getTime())) {
    return null
  }

  const diff = startOfDay(now).getTime() - startOfDay(then).getTime()
  return Math.round(diff / 86_400_000)
}

export function formatRelativeDays(isoDate: string, now = new Date()): string {
  const days = daysSince(isoDate, now)

  if (days === null) {
    return 'Sin fecha'
  }

  if (days <= 0) {
    return 'Hoy'
  }

  if (days === 1) {
    return 'Ayer'
  }

  return `Hace ${days} días`
}

export function formatGreeting(date = new Date()): string {
  const hour = date.getHours()

  if (hour < 12) {
    return 'Buen día'
  }

  if (hour < 20) {
    return 'Buenas tardes'
  }

  return 'Buenas noches'
}

/** Pasado este plazo, conviene repetir la actualización del stock real. */
export const stockCheckReviewDays = 14

export function shouldReviewStockAgain(
  isoDate: string | null,
  now = new Date(),
): boolean {
  if (isoDate === null) {
    return true
  }

  const days = daysSince(isoDate, now)
  return days === null || days > stockCheckReviewDays
}

/** Nunca revisados primero; después, la revisión más antigua. */
export function compareLastStockCheck(
  left: string | null,
  right: string | null,
): number {
  if (left === null && right === null) {
    return 0
  }

  if (left === null) {
    return -1
  }

  if (right === null) {
    return 1
  }

  return left.localeCompare(right)
}

export function formatReviewedAgo(isoDate: string, now = new Date()): string {
  const relative = formatRelativeDays(isoDate, now)

  if (relative === 'Hoy') {
    return 'Revisado hoy'
  }

  if (relative === 'Ayer') {
    return 'Revisado ayer'
  }

  if (relative === 'Sin fecha') {
    return 'Sin revisión'
  }

  return `Revisado ${relative.charAt(0).toLowerCase()}${relative.slice(1)}`
}

export function formatLongDate(date = new Date()): string {
  const formatted = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  const day = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
  const time = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date)

  return `${day}, ${time}`
}

/** Fecha corta para listas: “26 sep, 15:00”. */
export function formatCompactDateTime(isoDate: string): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  const month = new Intl.DateTimeFormat('es-AR', { month: 'short' })
    .format(date)
    .replace(/\./g, '')
    .slice(0, 3)
    .toLowerCase()
  const time = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date)

  return `${date.getDate()} ${month}, ${time}`
}

export function calendarDayKey(isoDate: string): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'sin-fecha'
  }

  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function formatMovementDay(isoDate: string, now = new Date()): string {
  const relative = formatRelativeDays(isoDate, now)

  if (relative === 'Hoy' || relative === 'Ayer' || relative === 'Sin fecha') {
    return relative
  }

  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatLocalIso(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function formatReviewDate(isoDate: string, now = new Date()): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  const sameYear = date.getFullYear() === now.getFullYear()

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' as const }),
  }).format(date)
}
