import { ArrowLeft, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { SupplierForm } from '../components/suppliers/SupplierForm.tsx'
import { SupplierNotFound } from '../components/suppliers/SupplierNotFound.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function EditSupplierPage() {
  const { id } = useParams()
  const { suppliers, updateSupplier } = useStockDemo()
  const supplier = suppliers.find((item) => item.id === id) ?? null

  usePageTitle(supplier ? 'Editar proveedor' : 'Proveedor no encontrado')
  const [seenId, setSeenId] = useState(id)
  const [saved, setSaved] = useState(false)

  if (seenId !== id) {
    setSeenId(id)
    setSaved(false)
  }

  if (!supplier) {
    return <SupplierNotFound />
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-6">
      <header className="flex flex-col items-start gap-3">
        <Link
          to={`/proveedores/${supplier.id}`}
          className={buttonClassName('secondary')}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editar proveedor</h1>
          <p className="mt-1 text-base text-muted">{supplier.name}</p>
        </div>
      </header>

      {saved ? (
        <Card className="flex flex-col items-start gap-4" role="status">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-ok-soft text-ok">
            <CircleCheck aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Cambios guardados</h2>
            <p className="mt-1 text-base">El proveedor fue actualizado correctamente</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Link to={`/proveedores/${supplier.id}`} className={buttonClassName('primary')}>
              Ver proveedor
            </Link>
            <button
              type="button"
              className={buttonClassName('secondary')}
              onClick={() => {
                setSaved(false)
              }}
            >
              Seguir editando
            </button>
          </div>
        </Card>
      ) : (
        <SupplierForm
          suppliers={suppliers}
          exceptId={supplier.id}
          submitLabel="Guardar cambios"
          initialValues={{
            name: supplier.name,
            contactName: supplier.contactName ?? '',
            phone: supplier.phone,
            notes: supplier.notes ?? '',
          }}
          onSubmit={(input) => {
            const updated = updateSupplier(supplier.id, input)
            if (updated) {
              setSaved(true)
            }
            return updated
          }}
        />
      )}
    </div>
  )
}
