import { Button } from '../ui/Button.tsx'

type ShipmentConfirmPanelProps = {
  pending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ShipmentConfirmPanel({
  pending,
  onConfirm,
  onCancel,
}: ShipmentConfirmPanelProps) {
  return (
    <div
      className="rounded-3xl bg-wheat-soft p-4 ring-1 ring-wheat"
      role="region"
      aria-labelledby="confirmar-envio-titulo"
    >
      <h2 id="confirmar-envio-titulo" className="text-lg font-semibold">
        Confirmar envío
      </h2>
      <p className="mt-2 text-base">
        Al confirmar, estas cantidades se descontarán del stock de Central.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Button type="button" disabled={pending} onClick={onConfirm}>
          Confirmar envío
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Volver
        </Button>
      </div>
    </div>
  )
}
