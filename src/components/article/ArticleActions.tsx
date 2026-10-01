import { ClipboardCheck, PackageMinus, PackagePlus } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'
import type { Article } from '../../types/article.ts'
import { buttonClassName } from '../ui/buttonStyles.ts'

type ArticleActionsProps = {
  article: Article
}

export function ArticleActions({ article }: ArticleActionsProps) {
  const articleQuery = `articulo=${encodeURIComponent(article.id)}`

  return (
    <section aria-label="Acciones">
      <div className="grid gap-1 md:gap-2">
        <Link
          to={`/stock/actualizar?${articleQuery}`}
          className={cn(buttonClassName('primary'), 'w-full max-md:min-h-11!')}
        >
          <ClipboardCheck aria-hidden="true" size={18} />
          Actualizar stock real
        </Link>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-1 md:gap-2">
          <Link
            to={`/movimientos/nuevo?tipo=entrada&${articleQuery}`}
            aria-label="Registrar entrada"
            className={cn(buttonClassName('secondary'), 'w-full min-w-0 max-md:min-h-11!')}
          >
            <PackagePlus aria-hidden="true" size={18} className="shrink-0" />
            <span className="md:hidden">Entrada</span>
            <span className="hidden md:inline">Registrar entrada</span>
          </Link>
          <Link
            to={`/movimientos/nuevo?tipo=salida&${articleQuery}`}
            aria-label="Registrar salida"
            className={cn(buttonClassName('secondary'), 'w-full min-w-0 max-md:min-h-11!')}
          >
            <PackageMinus aria-hidden="true" size={18} className="shrink-0" />
            <span className="md:hidden">Salida</span>
            <span className="hidden md:inline">Registrar salida</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
