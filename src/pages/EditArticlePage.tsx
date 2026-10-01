import { ArrowLeft, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArticleForm } from '../components/articles/ArticleForm.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { quantityToInput } from '../lib/articleForm.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

export function EditArticlePage() {
  usePageTitle('Editar artículo')

  const { id } = useParams()
  const { articles, suppliers, updateArticle } = useStockDemo()
  const article = articles.find((item) => item.id === id) ?? null
  const [seenId, setSeenId] = useState(id)
  const [saved, setSaved] = useState(false)

  if (seenId !== id) {
    setSeenId(id)
    setSaved(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-6">
      <header className="flex flex-col items-start gap-3">
        <Link to="/articulos" className={buttonClassName('secondary')}>
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editar artículo</h1>
          <p className="mt-1 text-base text-muted">
            {article ? article.name : 'No encontramos ese artículo'}
          </p>
        </div>
      </header>

      {!article ? (
        <Card className="flex flex-col items-start gap-4">
          <p className="text-base">No encontramos ese artículo.</p>
          <Link to="/articulos" className={buttonClassName('primary')}>
            Volver a artículos
          </Link>
        </Card>
      ) : saved ? (
        <Card className="flex flex-col items-start gap-4" role="status">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-ok-soft text-ok">
            <CircleCheck aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Cambios guardados</h2>
            <p className="mt-1 text-base">El artículo fue actualizado correctamente</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Link to={`/stock/${article.id}`} className={buttonClassName('primary')}>
              Ver artículo
            </Link>
            <Link to="/articulos" className={buttonClassName('secondary')}>
              Volver a artículos
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
        <ArticleForm
          mode="edit"
          articles={articles}
          suppliers={suppliers}
          exceptId={article.id}
          currentStock={article.currentStock}
          initialValues={{
            name: article.name,
            category: article.category,
            unit: article.unit,
            minimum: quantityToInput(article.minimumStock, article.unit),
            initial: '0',
            supplierId: article.preferredSupplierId,
            note: article.note ?? '',
          }}
          onSubmit={(values) => {
            const updated = updateArticle({
              id: article.id,
              name: values.name,
              category: values.category,
              unit: values.unit,
              minimumStock: values.minimumStock,
              note: values.note,
              preferredSupplierId: values.preferredSupplierId,
            })
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
