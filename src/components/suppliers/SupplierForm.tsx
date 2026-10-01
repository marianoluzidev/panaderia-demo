import { useState, type FormEvent } from 'react'
import {
  supplierFormErrors,
  supplierInputFromValues,
  type SupplierFormField,
  type SupplierFormValues,
} from '../../lib/suppliers.ts'
import type { Supplier, SupplierInput } from '../../types/supplier.ts'
import { Button } from '../ui/Button.tsx'

type SupplierFormProps = {
  suppliers: readonly Supplier[]
  exceptId?: string
  initialValues: SupplierFormValues
  submitLabel: string
  onSubmit: (input: SupplierInput) => boolean
}

const pendingMessages = new Set(['Ingresá un nombre.', 'Ingresá un teléfono.'])

export function SupplierForm({
  suppliers,
  exceptId,
  initialValues,
  submitLabel,
  onSubmit,
}: SupplierFormProps) {
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<SupplierFormField, boolean>>>({})
  const errors = supplierFormErrors(values, suppliers, exceptId)
  const canSave = Object.keys(errors).length === 0

  function update<K extends SupplierFormField>(field: K, value: SupplierFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function touch(field: SupplierFormField) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function visibleError(field: 'name' | 'phone'): string | null {
    const message = errors[field]

    if (!message) {
      return null
    }

    if (submitted || touched[field] || !pendingMessages.has(message)) {
      return message
    }

    return null
  }

  function save(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)

    if (!canSave) {
      return
    }

    const saved = onSubmit(supplierInputFromValues(values))

    if (!saved) {
      setTouched((current) => ({ ...current, name: true, phone: true }))
    }
  }

  const nameError = visibleError('name')
  const phoneError = visibleError('phone')

  return (
    <form className="flex flex-col gap-5" onSubmit={save} noValidate>
      <div>
        <label htmlFor="proveedor-nombre" className="text-base font-semibold">
          Nombre
        </label>
        <input
          id="proveedor-nombre"
          value={values.name}
          onChange={(event) => {
            update('name', event.target.value)
          }}
          onBlur={() => {
            touch('name')
          }}
          placeholder="Ej.: Molino Santa Fe"
          autoComplete="organization"
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? 'proveedor-nombre-error' : undefined}
          className="mt-2 min-h-12 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted"
        />
        {nameError ? (
          <p id="proveedor-nombre-error" className="mt-2 text-sm text-alert">
            {nameError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="proveedor-contacto" className="text-base font-semibold">
          Persona de contacto <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input
          id="proveedor-contacto"
          value={values.contactName}
          onChange={(event) => {
            update('contactName', event.target.value)
          }}
          placeholder="Ej.: Carlos"
          autoComplete="name"
          className="mt-2 min-h-12 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted"
        />
      </div>

      <div>
        <label htmlFor="proveedor-telefono" className="text-base font-semibold">
          Teléfono
        </label>
        <input
          id="proveedor-telefono"
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(event) => {
            update('phone', event.target.value)
          }}
          onBlur={() => {
            touch('phone')
          }}
          placeholder="0000-1000"
          autoComplete="tel"
          aria-invalid={phoneError ? true : undefined}
          aria-describedby={phoneError ? 'proveedor-telefono-error' : 'proveedor-telefono-ayuda'}
          className="mt-2 min-h-12 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted"
        />
        <p id="proveedor-telefono-ayuda" className="mt-2 text-sm text-muted">
          Usá un dato de demostración, por ejemplo 0000-1000.
        </p>
        {phoneError ? (
          <p id="proveedor-telefono-error" className="mt-2 text-sm text-alert">
            {phoneError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="proveedor-nota" className="text-base font-semibold">
          Nota <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="proveedor-nota"
          value={values.notes}
          onChange={(event) => {
            update('notes', event.target.value)
          }}
          rows={3}
          placeholder="Información útil sobre este proveedor"
          className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-base text-ink ring-1 ring-line placeholder:text-muted"
        />
      </div>

      <div className="sticky bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 -mx-4 bg-cream/95 px-4 py-3 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:p-0">
        <Button type="submit" className="w-full" disabled={!canSave}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
