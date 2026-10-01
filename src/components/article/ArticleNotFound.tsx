import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClassName } from '../ui/buttonStyles.ts'

export function ArticleNotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Artículo no encontrado
      </h1>
      <Link to="/stock" className={buttonClassName('primary')}>
        <ArrowLeft aria-hidden="true" size={18} />
        Volver a Stock
      </Link>
    </div>
  )
}
