import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArticlePicker } from '../components/update/ArticlePicker.tsx'
import { RealQuantityField } from '../components/update/RealQuantityField.tsx'
import { SelectedArticleCard } from '../components/update/SelectedArticleCard.tsx'
import { StockComparison } from '../components/update/StockComparison.tsx'
import { UpdateSuccess } from '../components/update/UpdateSuccess.tsx'
import { Button } from '../components/ui/Button.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { parseRealQuantity } from '../lib/quantityInput.ts'
import { stockUpdateOutcome } from '../lib/updateStock.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function UpdateStockPage() {
  const { articles, updateRealStock } = useStockDemo()
  const [searchParams, setSearchParams] = useSearchParams()
  const paramId = searchParams.get('articulo')
  const validFromUrl = articles.some((article) => article.id === paramId)
    ? paramId
    : null
  const [seenParam, setSeenParam] = useState(validFromUrl)
  const [picking, setPicking] = useState(false)
  const [rawQuantity, setRawQuantity] = useState('')
  const [note, setNote] = useState('')
  const [savedQuantity, setSavedQuantity] = useState<number | null>(null)

  usePageTitle('Actualizar stock real')

  if (seenParam !== validFromUrl) {
    setSeenParam(validFromUrl)
    setPicking(false)
    setRawQuantity('')
    setNote('')
    setSavedQuantity(null)
  }

  const article =
    articles.find((item) => item.id === validFromUrl) ?? null
  const showPicker = article === null || picking
  const found = article ? parseRealQuantity(rawQuantity, article.unit) : null
  const outcome =
    article && found !== null
      ? stockUpdateOutcome(article.currentStock, found)
      : null
  const canSave = article !== null && found !== null && outcome !== 'same'
  const backTo = article ? `/stock/${article.id}` : '/stock'

  function chooseArticle(articleId: string) {
    if (articleId === validFromUrl) {
      setPicking(false)
      return
    }

    setSearchParams({ articulo: articleId }, { replace: true })
  }

  function reviewAnother() {
    setSearchParams({}, { replace: true })
  }

  function saveStock() {
    if (!article || found === null || !canSave) {
      return
    }

    updateRealStock({
      articleId: article.id,
      quantity: found,
      note,
    })
    setSavedQuantity(found)
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
            Actualizar stock real
          </h1>
          <p className="mt-1 max-w-2xl text-base text-muted">
            Ingresá la cantidad que encontraste al revisar el depósito
          </p>
        </div>
      </header>

      {savedQuantity !== null && article ? (
        <UpdateSuccess
          article={article}
          quantity={savedQuantity}
          onReviewAnother={reviewAnother}
        />
      ) : (
        <form
          className="grid items-start gap-4 lg:grid-cols-[minmax(0,32rem)_minmax(16rem,22rem)] lg:gap-8"
          onSubmit={(event) => {
            event.preventDefault()
            saveStock()
          }}
        >
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
                onChangeArticle={() => {
                  setPicking(true)
                }}
              />
            )}
            {article && !showPicker ? (
              <RealQuantityField
                unit={article.unit}
                value={rawQuantity}
                onChange={setRawQuantity}
              />
            ) : null}
          </div>

          {article && !showPicker && found !== null ? (
            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <StockComparison article={article} found={found} />
            </div>
          ) : null}

          {article && !showPicker ? (
            <div className="flex flex-col gap-4 lg:col-start-1">
              <label className="block" htmlFor="nota-stock">
                <span className="text-sm font-medium text-muted">
                  Nota (opcional)
                </span>
                <input
                  id="nota-stock"
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value)
                  }}
                  placeholder="Ej.: revisión semanal del depósito"
                  autoComplete="off"
                  className="mt-2 min-h-11 w-full rounded-2xl bg-white px-4 text-base text-ink ring-1 ring-line placeholder:text-muted"
                />
              </label>
              <div className="sticky bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 -mx-4 bg-cream/95 px-4 py-3 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:p-0">
                <Button type="submit" className="w-full" disabled={!canSave}>
                  Guardar stock real
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </div>
  )
}
