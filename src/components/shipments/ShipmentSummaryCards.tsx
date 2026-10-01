type ShipmentSummaryCardsProps = {
  confirmed: number
  drafts: number
  recentLines: number
}

function countPhrase(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

export function ShipmentSummaryCards({
  confirmed,
  drafts,
  recentLines,
}: ShipmentSummaryCardsProps) {
  return (
    <section aria-labelledby="resumen-envios">
      <h2 id="resumen-envios" className="sr-only">
        Resumen de envíos
      </h2>
      <p className="text-sm font-semibold text-ink">
        {countPhrase(confirmed, 'confirmado', 'confirmados')}
        {' · '}
        {countPhrase(drafts, 'borrador', 'borradores')}
      </p>
      <p className="text-[13px] text-muted">
        {countPhrase(recentLines, 'artículo enviado', 'artículos enviados')} en los
        últimos 7 días
      </p>
    </section>
  )
}
