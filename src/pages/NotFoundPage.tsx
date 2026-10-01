import { Home } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClassName } from '../components/ui/buttonStyles.ts'
import { Card } from '../components/ui/Card.tsx'
import { PageHeader } from '../components/ui/PageHeader.tsx'

export function NotFoundPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Página no encontrada"
        description="Esa dirección no existe."
      />
      <Card className="flex flex-col items-start gap-4">
        <Link to="/" className={buttonClassName()}>
          <Home aria-hidden="true" size={20} />
          Volver al inicio
        </Link>
      </Card>
    </section>
  )
}
