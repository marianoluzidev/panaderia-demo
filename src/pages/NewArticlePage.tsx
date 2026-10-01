import { ArrowLeft, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { ArticleForm } from '../components/articles/ArticleForm.tsx'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import type { ArticleFormValues } from '../lib/articleForm.ts'
import { usePageTitle } from '../lib/usePageTitle.ts'
import { useStockDemo } from '../state/useStockDemo.ts'

const emptyValues: ArticleFormValues = {
  name: '',
  category: null,
  unit: null,
  minimum: '',
  initial: '0',
  supplierId: null,
  note: '',
}

export function NewArticlePage() {
  usePageTitle('Nuevo artículo')

  const { articles, suppliers, createArticle } = useStockDemo()
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)
  const created = articles.find((article) => article.id === createdId) ?? null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-6">
      <header className="flex flex-col items-start gap-3">
        <Link to="/articulos" className={buttonClassName('secondary')}>
          <ArrowLeft aria-hidden="true" size={18} />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuevo artículo</h1>
          <p className="mt-1 text-base text-muted">
            Definí cómo vas a controlar este producto
          </p>
        </div>
      </header>

      {created ? (
        <Card className="flex flex-col items-start gap-4" role="status">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-ok-soft text-ok">
            <CircleCheck aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Artículo creado</h2>
            <p className="mt-1 text-base">
              {created.name} ya está disponible en Stock
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Link to={`/stock/${created.id}`} className={buttonClassName('primary')}>
              Ver artículo
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
        <ArticleForm
          key={formKey}
          mode="create"
          articles={articles}
          suppliers={suppliers}
          initialValues={emptyValues}
          onSubmit={(values) => {
            const id = createArticle(values)
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
