import type { MovementSummary } from '../../lib/movementList.ts'

type MovementSummaryCardsProps = {
  total: number
  summary: MovementSummary
}

function countPhrase(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

export function MovementSummaryCards({ total, summary }: MovementSummaryCardsProps) {
  return (
    <section aria-labelledby="resumen-movimientos">
      <h2 id="resumen-movimientos" className="sr-only">
        Resumen de movimientos
      </h2>
      <p className="text-sm font-semibold text-ink">
        {countPhrase(total, 'movimiento registrado', 'movimientos registrados')}
      </p>
      <p className="text-[13px] text-muted">
        {countPhrase(summary.entradas, 'entrada', 'entradas')}
        {' · '}
        {countPhrase(summary.salidas, 'salida', 'salidas')}
        {' · '}
        {countPhrase(summary.actualizaciones, 'actualización', 'actualizaciones')}
      </p>
    </section>
  )
}
