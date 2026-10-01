import { ArrowLeft, PackageMinus, PackagePlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { MovementPreview } from '../components/movement/MovementPreview.tsx'
import { MovementSuccess } from '../components/movement/MovementSuccess.tsx'
import { MovementTypeChoice } from '../components/movement/MovementTypeChoice.tsx'
import { ArticlePicker } from '../components/update/ArticlePicker.tsx'
import { RealQuantityField } from '../components/update/RealQuantityField.tsx'
import { SelectedArticleCard } from '../components/update/SelectedArticleCard.tsx'
import { Button } from '../components/ui/Button.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { cn } from '../lib/cn.ts'
import { spokenUnitLabel } from '../lib/labels.ts'
import {
  movementQuantityError,
  nextStockAfterMovement,
} from '../lib/movementForm.ts'
import { parseRealQuantity } from '../lib/quantityInput.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'
import type { ManualMovementType } from '../types/movement.ts'

const movementCopy: Record<
  ManualMovementType,
  { title: string; text: string; question: string; note: string; save: string }
> = {
  entrada: {
    title: 'Registrar entrada',
    text: 'Sumá mercadería recibida al stock',
    question: '¿Cuánto ingresó?',
    note: 'Ej.: compra recibida',
    save: 'Guardar entrada',
  },
  salida: {
    title: 'Registrar salida',
    text: 'Descontá mercadería utilizada o retirada',
    question: '¿Cuánto salió?',
    note: 'Ej.: uso de producción',
    save: 'Guardar salida',
  },
}

function readMovementType(value: string | null): ManualMovementType | null {
  if (value === 'entrada' || value === 'salida') {
    return value
  }

  return null
}

export function NewMovementPage() {
  const { articles, registerMovement } = useStockDemo()
  const [searchParams, setSearchParams] = useSearchParams()
  const type = readMovementType(searchParams.get('tipo'))
  const paramId = searchParams.get('articulo')
  const validArticleId = articles.some((article) => article.id === paramId)
    ? paramId
    : null
  const selectionKey = `${type ?? ''}|${validArticleId ?? ''}`
  const [seenKey, setSeenKey] = useState(selectionKey)
  const [picking, setPicking] = useState(false)
  const [rawQuantity, setRawQuantity] = useState('')
  const [note, setNote] = useState('')
  const [savedStock, setSavedStock] = useState<number | null>(null)

  const copy = type ? movementCopy[type] : null
  usePageTitle(copy?.title ?? 'Registrar movimiento')

  if (seenKey !== selectionKey) {
    setSeenKey(selectionKey)
    setPicking(false)
    setRawQuantity('')
    setNote('')
    setSavedStock(null)
  }

  const article = articles.find((item) => item.id === validArticleId) ?? null
  const showPicker = article === null || picking
  const parsed = article ? parseRealQuantity(rawQuantity, article.unit) : null
  const quantityError =
    type && article
      ? movementQuantityError(rawQuantity, article.unit, type, article.currentStock)
      : null
  const noStockForExit =
    type === 'salida' && article !== null && article.currentStock <= 0
  const canSave =
    type !== null &&
    article !== null &&
    !showPicker &&
    !noStockForExit &&
    parsed !== null &&
    parsed > 0 &&
    quantityError === null
  const backTo = article ? `/stock/${article.id}` : '/movimientos'

  function writeParams(nextType: ManualMovementType | null, articleId: string | null) {
    const next = new URLSearchParams()

    if (nextType) {
      next.set('tipo', nextType)
    }

    if (articleId) {
      next.set('articulo', articleId)
    }

    setSearchParams(next, { replace: true })
  }

  function chooseType(nextType: ManualMovementType) {
    writeParams(nextType, validArticleId)
  }

  function chooseArticle(articleId: string) {
    if (articleId === validArticleId) {
      setPicking(false)
      return
    }

    writeParams(type, articleId)
  }

  function registerAnother() {
    writeParams(type, null)
  }

  function saveMovement() {
    if (!type || !article || parsed === null || !canSave) {
      return
    }

    const resulting = nextStockAfterMovement(article.currentStock, type, parsed)
    registerMovement({
      articleId: article.id,
      type,
      quantity: parsed,
      note,
    })
    setSavedStock(resulting)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-5xl lg:gap-6">
      <header className="flex flex-col items-start gap-3">
        <Link to={backTo} className={buttonClassName('secondary')}>
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {copy?.title ?? 'Registrar movimiento'}
          </h1>
          <p className="mt-1 max-w-2xl text-base text-muted">
            {copy?.text ?? 'Elegí si la mercadería entra o sale del stock'}
          </p>
        </div>
      </header>

      {savedStock !== null && article && type ? (
        <MovementSuccess
          article={article}
          type={type}
          quantity={savedStock}
          onRegisterAnother={registerAnother}
        />
      ) : type === null ? (
        <MovementTypeChoice onSelect={chooseType} />
      ) : (
        <form
          className="grid items-start gap-4 lg:grid-cols-[minmax(0,32rem)_minmax(16rem,22rem)] lg:gap-8"
          onSubmit={(event) => {
            event.preventDefault()
            saveMovement()
          }}
        >
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-2 ring-1 ring-line">
              <span
                className={cn(
                  'inline-flex items-center gap-2 font-semibold',
                  type === 'entrada' ? 'text-ok' : 'text-alert',
                )}
              >
                {type === 'entrada' ? (
                  <PackagePlus aria-hidden="true" size={20} />
                ) : (
                  <PackageMinus aria-hidden="true" size={20} />
                )}
                {type === 'entrada' ? 'Entrada' : 'Salida'}
              </span>
              <button
                type="button"
                onClick={() => {
                  writeParams(null, validArticleId)
                }}
                className="min-h-11 text-sm font-semibold text-wheat-strong underline-offset-2 hover:underline"
              >
                Cambiar tipo
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {showPicker || !article ? (
              <ArticlePicker
                articles={articles}
                selectedId={article?.id ?? null}
                onSelect={chooseArticle}
              />
            ) : (
              <SelectedArticleCard
                article={article}
                stockLabel="Stock actual"
                onChangeArticle={() => {
                  setPicking(true)
                }}
              />
            )}
            {article && !showPicker && copy && !noStockForExit ? (
              <RealQuantityField
                unit={article.unit}
                value={rawQuantity}
                question={copy.question}
                extraError={quantityError}
                unitLabel={`Unidad: ${spokenUnitLabel(article.unit)}`}
                onChange={setRawQuantity}
              />
            ) : null}
            {article && !showPicker && noStockForExit && quantityError ? (
              <p
                className="rounded-3xl bg-alert-soft p-4 text-alert ring-1 ring-alert/30"
                role="status"
              >
                {quantityError}
              </p>
            ) : null}
          </div>

          {article && !showPicker && canSave && type && parsed !== null ? (
            <div className="lg:col-start-2 lg:row-start-2 lg:row-span-2">
              <MovementPreview
                type={type}
                current={article.currentStock}
                quantity={parsed}
                unit={article.unit}
              />
            </div>
          ) : null}

          {article && !showPicker && copy && !noStockForExit ? (
            <div className="flex flex-col gap-4 lg:col-start-1">
              <label className="block" htmlFor="nota-movimiento">
                <span className="text-sm font-medium text-muted">
                  Nota (opcional)
                </span>
                <input
                  id="nota-movimiento"
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value)
                  }}
                  placeholder={copy.note}
                  autoComplete="off"
                  className="mt-2 min-h-11 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted"
                />
              </label>
              <div className="sticky bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 -mx-4 bg-cream/95 px-4 py-3 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:p-0">
                <Button type="submit" className="w-full" disabled={!canSave}>
                  {copy.save}
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </div>
  )
}
