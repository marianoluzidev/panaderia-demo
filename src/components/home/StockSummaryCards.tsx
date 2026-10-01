type OperationIndicatorsProps = {
  low: number
  outOfStock: number
  pendingReview: number
}

const items = [
  { key: 'low', label: 'Stock bajo', tone: 'text-low' },
  { key: 'out', label: 'Sin stock', tone: 'text-alert' },
  { key: 'pending', label: 'Stock pendiente de revisar', tone: 'text-ink' },
] as const

export function OperationIndicators({
  low,
  outOfStock,
  pendingReview,
}: OperationIndicatorsProps) {
  const counts = {
    low,
    out: outOfStock,
    pending: pendingReview,
  }

  return (
    <section aria-labelledby="indicadores-operacion">
      <h2 id="indicadores-operacion" className="sr-only">
        Indicadores de stock
      </h2>
      <ul className="grid grid-cols-3 gap-2 md:gap-3">
        {items.map((item) => (
          <li key={item.key}>
            <article className="flex h-full flex-col gap-1 rounded-surface border border-line bg-white px-3 py-2.5">
              <p className={`text-xl font-bold tabular-nums md:text-2xl ${item.tone}`}>
                {counts[item.key]}
              </p>
              <h3 className="text-xs leading-tight font-medium text-muted">
                {item.label}
              </h3>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
