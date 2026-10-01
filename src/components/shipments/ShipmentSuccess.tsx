import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'
import { Card } from '../ui/Card.tsx'

type ShipmentSuccessProps = {
  shipmentId: string
  confirmed: boolean
}

export function ShipmentSuccess({ shipmentId, confirmed }: ShipmentSuccessProps) {
  return (
    <Card className="flex flex-col items-start gap-4" role="status">
      <span className="flex size-10 items-center justify-center rounded-lg bg-ok-soft text-ok">
        <CircleCheck aria-hidden="true" size={20} />
      </span>
      <div>
        <h2 className="text-lg font-semibold">
          {confirmed ? 'Envío confirmado' : 'Borrador guardado'}
        </h2>
        {confirmed ? (
          <p className="mt-1 text-base">El stock de Central fue actualizado</p>
        ) : null}
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link to={`/envios/${shipmentId}`} className={buttonClassName('primary')}>
          Ver envío
        </Link>
        <Link to="/envios" className={buttonClassName('secondary')}>
          Volver a Envíos
        </Link>
      </div>
    </Card>
  )
}
