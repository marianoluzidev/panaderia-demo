import { ArrowLeft } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ShipmentArticlePicker } from '../components/shipments/ShipmentArticlePicker.tsx'
import { ShipmentConfirmPanel } from '../components/shipments/ShipmentConfirmPanel.tsx'
import { ShipmentDraftSummary } from '../components/shipments/ShipmentDraftSummary.tsx'
import { ShipmentNotFound } from '../components/shipments/ShipmentNotFound.tsx'
import { ShipmentSuccess } from '../components/shipments/ShipmentSuccess.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { cn } from '../lib/cn.ts'
import {
  destinationBranches,
  shipmentConfirmError,
  shipmentDraftError,
} from '../lib/shipments.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'
import type { Shipment, ShipmentItem } from '../types/shipment.ts'

export function NewShipmentPage() {
  const [params] = useSearchParams()
  const draftId = params.get('borrador')
  const { shipments } = useStockDemo()
  const shipment = draftId
    ? (shipments.find((item) => item.id === draftId) ?? null)
    : null

  usePageTitle(draftId ? 'Editar envío' : 'Nuevo envío')

  if (draftId && !shipment) {
    return <ShipmentNotFound />
  }

  if (shipment?.status === 'confirmed') {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Este envío ya fue confirmado
        </h1>
        <p>No se puede modificar.</p>
        <Link to={`/envios/${shipment.id}`} className={buttonClassName('primary')}>
          Ver envío
        </Link>
      </div>
    )
  }

  return <ShipmentEditor shipment={shipment} />
}

type ShipmentEditorProps = {
  shipment: Shipment | null
}

function ShipmentEditor({ shipment }: ShipmentEditorProps) {
  const { articles, branches, createShipment, updateShipment, confirmShipment } =
    useStockDemo()
  const destinations = destinationBranches(branches)
  const [destinationId, setDestinationId] = useState(
    shipment?.destinationBranchId ?? '',
  )
  const [items, setItems] = useState<ShipmentItem[]>(
    shipment?.items.map((item) => ({ ...item })) ?? [],
  )
  const [quantities, setQuantities] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (shipment?.items ?? []).map((item) => [item.articleId, String(item.quantity)]),
    ),
  )
  const [note, setNote] = useState(shipment?.note ?? '')
  const [error, setError] = useState<string | null>(null)
  const [quantityError, setQuantityError] = useState<string | null>(null)
  const [asking, setAsking] = useState(false)
  const [saved, setSaved] = useState<{ id: string; confirmed: boolean } | null>(null)
  const draftIdRef = useRef(shipment?.id ?? null)

  const draftError = shipmentDraftError(destinationId, items, branches)
  const confirmError = shipmentConfirmError(
    {
      status: 'draft',
      destinationBranchId: destinationId,
      items,
    },
    articles,
    branches,
  )

  function rememberItems(next: ShipmentItem[]) {
    setItems(next)
    setQuantities((current) => {
      const updated = { ...current }
      for (const item of next) {
        updated[item.articleId] = String(item.quantity)
      }
      return updated
    })
  }

  function input() {
    return {
      destinationBranchId: destinationId,
      items,
      ...(note.trim() ? { note: note.trim() } : {}),
    }
  }

  function persistDraft(): string | null {
    if (draftError) {
      setError(draftError)
      return null
    }

    const currentId = draftIdRef.current

    if (currentId) {
      const updated = updateShipment(currentId, input())
      if (!updated) {
        setError('No se pudo guardar el envío.')
        return null
      }
      return currentId
    }

    const id = createShipment(input())
    if (!id) {
      setError('No se pudo guardar el envío.')
      return null
    }

    draftIdRef.current = id
    return id
  }

  function saveDraft() {
    const id = persistDraft()
    if (!id) {
      return
    }
    setSaved({ id, confirmed: false })
  }

  function confirm() {
    if (confirmError) {
      setError(confirmError)
      setAsking(false)
      return
    }

    const id = persistDraft()
    if (!id) {
      setAsking(false)
      return
    }

    const result = confirmShipment(id)
    if (!result.ok) {
      setError(result.message)
      setAsking(false)
      return
    }

    setSaved({ id, confirmed: true })
  }

  if (saved) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <ShipmentSuccess shipmentId={saved.id} confirmed={saved.confirmed} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 lg:max-w-5xl">
      <header className="flex flex-col items-start gap-3">
        <Link to="/envios" className={buttonClassName('secondary')}>
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {shipment ? 'Editar envío' : 'Nuevo envío'}
          </h1>
          <p className="mt-1 text-base text-muted">
            La mercadería sale desde Central
          </p>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.8fr)]">
        <div className="flex flex-col gap-6">
          <section aria-labelledby="envio-destino">
            <h2 id="envio-destino" className="text-lg font-semibold">
              1. Elegir destino
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {destinations.map((branch) => {
                const selected = destinationId === branch.id

                return (
                  <button
                    key={branch.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setDestinationId(branch.id)
                      setError(null)
                      setQuantityError(null)
                    }}
                    className={cn(
                      'min-h-24 rounded-3xl px-4 text-xl font-semibold ring-1 transition',
                      selected
                        ? 'bg-wheat-soft text-wheat-strong ring-2 ring-wheat-strong'
                        : 'bg-white text-ink ring-line hover:bg-wheat-soft',
                    )}
                  >
                    {branch.name}
                  </button>
                )
              })}
            </div>
          </section>

          {destinationId ? (
            <ShipmentArticlePicker
              articles={articles}
              items={items}
              onItemsChange={(next, nextError) => {
                rememberItems([...next])
                setQuantityError(nextError)
              }}
            />
          ) : (
            <p className="text-base text-muted">
              Elegí una sucursal para agregar artículos.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <ShipmentDraftSummary
            articles={articles}
            items={items}
            quantities={quantities}
            onQuantitiesChange={(articleId, value) => {
              setQuantities((current) => ({ ...current, [articleId]: value }))
            }}
            onItemsChange={(next, nextError) => {
              setItems([...next])
              setQuantityError(nextError)
              setQuantities((current) => {
                const updated = { ...current }
                for (const item of next) {
                  if (updated[item.articleId] === undefined) {
                    updated[item.articleId] = String(item.quantity)
                  }
                }
                return updated
              })
            }}
          />

          <div>
            <label htmlFor="envio-nota" className="text-base font-semibold">
              Nota (opcional)
            </label>
            <textarea
              id="envio-nota"
              value={note}
              onChange={(event) => {
                setNote(event.target.value)
              }}
              rows={3}
              placeholder="Ej.: pedido de la semana"
              className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-base text-ink ring-1 ring-line placeholder:text-muted focus-visible:ring-2 focus-visible:ring-wheat-strong"
            />
          </div>

          {quantityError || error ? (
            <p className="text-sm text-alert">{quantityError ?? error}</p>
          ) : null}

          {asking ? (
            <ShipmentConfirmPanel
              pending={false}
              onConfirm={confirm}
              onCancel={() => {
                setAsking(false)
              }}
            />
          ) : (
            <div className="sticky bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 -mx-4 flex flex-col gap-2 bg-cream/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0">
              <button
                type="button"
                className={buttonClassName('secondary')}
                disabled={draftError !== null || quantityError !== null}
                onClick={saveDraft}
              >
                Guardar borrador
              </button>
              <button
                type="button"
                className={buttonClassName('primary')}
                disabled={confirmError !== null || quantityError !== null}
                onClick={() => {
                  setError(null)
                  setQuantityError(null)
                  setAsking(true)
                }}
              >
                Confirmar envío
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
