import { Package, Wheat } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import {
  articleFormErrors,
  controlUnitLabels,
  controlUnits,
  parsedStockAmount,
  unitPreviewSentence,
  type ArticleFormField,
  type ArticleFormValues,
} from '../../lib/articleForm.ts'
import { resolveArticleIllustration } from '../../lib/articleIllustration.ts'
import { categoryLabels, formatSpokenQuantity } from '../../lib/labels.ts'
import type { Article, ArticleCategory, Unit } from '../../types/article.ts'
import type { Supplier } from '../../types/supplier.ts'
import { ArticleIllustration } from '../stock/ArticleIllustration.tsx'
import { RealQuantityField } from '../update/RealQuantityField.tsx'
import { Button } from '../ui/Button.tsx'

type ArticleFormProps = {
  mode: 'create' | 'edit'
  articles: readonly Article[]
  suppliers: readonly Supplier[]
  exceptId?: string
  initialValues: ArticleFormValues
  currentStock?: number
  onSubmit: (values: {
    name: string
    category: ArticleCategory
    unit: Unit
    minimumStock: number
    initialStock: number
    note: string
    preferredSupplierId: string
  }) => boolean
}

export function ArticleForm({
  mode,
  articles,
  suppliers,
  exceptId,
  initialValues,
  currentStock,
  onSubmit,
}: ArticleFormProps) {
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<ArticleFormField, boolean>>>({})
  const errors = articleFormErrors(values, articles, suppliers, mode, exceptId)
  const supplierOptions = [...suppliers].sort((left, right) =>
    left.name.localeCompare(right.name, 'es'),
  )
  const canSave = Object.keys(errors).length === 0
  const illustration =
    values.category === null
      ? null
      : resolveArticleIllustration(values.name, values.category)

  function update<K extends ArticleFormField>(field: K, value: ArticleFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function touch(field: ArticleFormField) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function visibleError(field: Exclude<ArticleFormField, 'note'>): string | null {
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

    if (
      !canSave ||
      values.category === null ||
      values.unit === null ||
      values.supplierId === null
    ) {
      return
    }

    const minimumStock = parsedStockAmount(values.minimum, values.unit)
    const initialStock =
      mode === 'create' ? parsedStockAmount(values.initial, values.unit) : 0

    if (minimumStock === null || initialStock === null) {
      return
    }

    const saved = onSubmit({
      name: values.name.trim(),
      category: values.category,
      unit: values.unit,
      minimumStock,
      initialStock,
      note: values.note.trim(),
      preferredSupplierId: values.supplierId,
    })

    if (!saved) {
      setTouched((current) => ({ ...current, name: true }))
    }
  }

  return (
    <form
      className="grid items-start gap-5 lg:grid-cols-2 lg:gap-x-8"
      onSubmit={save}
      noValidate
    >
      <div className="lg:col-span-2">
        <label htmlFor="articulo-nombre" className="text-base font-semibold">
          Nombre
        </label>
        <input
          id="articulo-nombre"
          value={values.name}
          onChange={(event) => {
            update('name', event.target.value)
          }}
          onBlur={() => {
            touch('name')
          }}
          placeholder="Ej.: Harina integral"
          autoComplete="off"
          aria-invalid={visibleError('name') !== null}
          aria-describedby={visibleError('name') ? 'articulo-nombre-error' : undefined}
          className="mt-2 min-h-12 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted focus-visible:ring-2 focus-visible:ring-wheat-strong"
        />
        {visibleError('name') ? (
          <p id="articulo-nombre-error" className="mt-2 text-sm text-alert">
            {visibleError('name')}
          </p>
        ) : null}
      </div>

      <fieldset className="min-w-0 lg:col-span-2">
        <legend className="text-base font-semibold">Categoría</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <CategoryOption
            label={categoryLabels['materia-prima']}
            selected={values.category === 'materia-prima'}
            icon="materia"
            onSelect={() => {
              update('category', 'materia-prima')
              touch('category')
            }}
          />
          <CategoryOption
            label={categoryLabels.descartable}
            selected={values.category === 'descartable'}
            icon="descartable"
            onSelect={() => {
              update('category', 'descartable')
              touch('category')
            }}
          />
        </div>
        {visibleError('category') ? (
          <p className="mt-2 text-sm text-alert">{visibleError('category')}</p>
        ) : null}
      </fieldset>

      <fieldset className="min-w-0 lg:col-span-2">
        <legend className="text-base font-semibold">Unidad de control</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {controlUnits.map((unit) => {
            const selected = values.unit === unit

            return (
              <button
                key={unit}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  update('unit', unit)
                  touch('unit')
                }}
                className={cn(
                  'min-h-11 rounded-2xl px-3 text-base font-semibold transition',
                  selected
                    ? 'bg-wheat-strong text-white'
                    : 'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft',
                )}
              >
                {controlUnitLabels[unit]}
              </button>
            )
          })}
        </div>
        {values.unit ? (
          <p className="mt-3 text-sm text-muted">{unitPreviewSentence(values.unit)}</p>
        ) : null}
        {visibleError('unit') ? (
          <p className="mt-2 text-sm text-alert">{visibleError('unit')}</p>
        ) : null}
      </fieldset>

      {values.unit ? (
        <>
          <RealQuantityField
            inputId="stock-minimo"
            unit={values.unit}
            value={values.minimum}
            question="Stock mínimo"
            extraError={visibleError('minimum')}
            decreaseLabel="Disminuir stock mínimo"
            increaseLabel="Aumentar stock mínimo"
            onChange={(value) => {
              update('minimum', value)
              touch('minimum')
            }}
          />
          {mode === 'create' ? (
            <div>
              <RealQuantityField
                inputId="stock-inicial"
                unit={values.unit}
                value={values.initial}
                question="Stock inicial"
                extraError={visibleError('initial')}
                decreaseLabel="Disminuir stock inicial"
                increaseLabel="Aumentar stock inicial"
                onChange={(value) => {
                  update('initial', value)
                  touch('initial')
                }}
              />
              <p className="mt-2 text-sm text-muted">
                Cantidad disponible al crear el artículo
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-4 ring-1 ring-line">
              <p className="text-sm text-muted">Stock actual</p>
              <p className="mt-1 text-lg font-semibold">
                {formatSpokenQuantity(currentStock ?? 0, values.unit)}
              </p>
              <p className="mt-2 text-sm text-muted">
                Para corregir la cantidad disponible, usá{' '}
                <Link
                  to={`/stock/actualizar?articulo=${encodeURIComponent(exceptId ?? '')}`}
                  className="font-semibold text-wheat-strong underline-offset-2 hover:underline"
                >
                  Actualizar stock real
                </Link>
                .
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted lg:col-span-2">
          Elegí una unidad para indicar las cantidades.
        </p>
      )}

      <fieldset className="lg:col-span-2">
        <legend className="text-base font-semibold">Proveedor habitual</legend>
        <div className="mt-2 flex flex-col gap-2" role="group" aria-label="Proveedor habitual">
          {supplierOptions.map((supplier) => {
            const selected = values.supplierId === supplier.id

            return (
              <button
                key={supplier.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  update('supplierId', supplier.id)
                  touch('supplierId')
                }}
                className={cn(
                  'flex min-h-12 items-center rounded-2xl px-4 text-left text-base font-medium ring-1 transition',
                  selected
                    ? 'bg-wheat-soft text-wheat-strong ring-2 ring-wheat-strong'
                    : 'bg-white text-ink ring-line hover:bg-wheat-soft',
                )}
              >
                {supplier.name}
              </button>
            )
          })}
        </div>
        {visibleError('supplierId') ? (
          <p className="mt-2 text-sm text-alert">{visibleError('supplierId')}</p>
        ) : null}
      </fieldset>

      <div className="lg:col-span-2">
        <label htmlFor="articulo-nota" className="text-sm font-medium text-muted">
          Nota (opcional)
        </label>
        <input
          id="articulo-nota"
          value={values.note}
          onChange={(event) => {
            update('note', event.target.value)
          }}
          placeholder="Información útil sobre este artículo"
          autoComplete="off"
          className="mt-2 min-h-11 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted"
        />
      </div>

      {illustration ? (
        <div className="flex items-center gap-3 lg:col-span-2">
          <ArticleIllustration illustration={illustration} />
          <p className="text-sm text-muted">Ilustración asignada automáticamente</p>
        </div>
      ) : null}

      <div className="sticky bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 -mx-4 bg-cream/95 px-4 py-3 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:p-0 lg:col-span-2">
        <Button type="submit" className="w-full" disabled={!canSave}>
          {mode === 'create' ? 'Crear artículo' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}

const pendingMessages = new Set([
  'Ingresá un nombre.',
  'Elegí una categoría.',
  'Elegí una unidad de control.',
  'Ingresá el stock mínimo.',
  'Ingresá el stock inicial.',
  'Elegí un proveedor habitual.',
])

type CategoryOptionProps = {
  label: string
  selected: boolean
  icon: 'materia' | 'descartable'
  onSelect: () => void
}

function CategoryOption({ label, selected, icon, onSelect }: CategoryOptionProps) {
  const Icon = icon === 'materia' ? Wheat : Package

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl px-4 text-lg font-semibold ring-1 transition',
        selected
          ? 'bg-wheat-soft text-wheat-strong ring-2 ring-wheat-strong'
          : 'bg-white text-ink ring-line hover:bg-wheat-soft',
      )}
    >
      <Icon aria-hidden="true" size={28} />
      {label}
    </button>
  )
}
