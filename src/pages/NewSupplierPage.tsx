import { ArrowLeft, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { SupplierForm } from '../components/suppliers/SupplierForm.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import type { SupplierFormValues } from '../lib/suppliers.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

const emptyValues: SupplierFormValues = {
  name: '',
  contactName: '',
  phone: '',
  notes: '',
}

export function NewSupplierPage() {
  usePageTitle('Nuevo proveedor')

  const { suppliers, createSupplier } = useStockDemo()
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)
  const created = suppliers.find((supplier) => supplier.id === createdId) ?? null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-6">
      <header className="flex flex-col items-start gap-3">
        <Link to="/proveedores" className={buttonClassName('secondary')}>
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuevo proveedor</h1>
          <p className="mt-1 text-base text-muted">
            Cargá el contacto al que le comprás habitualmente
          </p>
        </div>
      </header>

      {created ? (
        <Card className="flex flex-col items-start gap-4" role="status">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-ok-soft text-ok">
            <CircleCheck aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Proveedor creado</h2>
            <p className="mt-1 text-base">{created.name} ya está en el catálogo</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Link to={`/proveedores/${created.id}`} className={buttonClassName('primary')}>
              Ver proveedor
            </Link>
            <button
              type="button"
              className={buttonClassName('secondary')}
              onClick={() => {
                setCreatedId(null)
                setFormKey((key) => key + 1)
              }}
            >
              Crear otro
            </button>
          </div>
        </Card>
      ) : (
        <SupplierForm
          key={formKey}
          suppliers={suppliers}
          initialValues={emptyValues}
          submitLabel="Crear proveedor"
          onSubmit={(input) => {
            const id = createSupplier(input)
            if (!id) {
              return false
            }

            setCreatedId(id)
            return true
          }}
        />
      )}
    </div>
  )
}
