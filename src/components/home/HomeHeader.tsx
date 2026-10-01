import { User } from 'lucide-react'
import { formatGreeting, formatLongDate } from '../../lib/dates.ts'

export function HomeHeader() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">
          {formatGreeting()}
        </h1>
        <p className="mt-1 text-base text-muted">
          Este es el estado actual de tu stock
        </p>
        <p className="mt-2 text-sm font-medium text-ink">{formatLongDate()}</p>
      </div>
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-wheat-soft text-wheat-strong"
      >
        <User aria-hidden="true" />
      </span>
    </header>
  )
}
