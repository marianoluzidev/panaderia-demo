import { usePageTitle } from '../../lib/usePageTitle.ts'

type PageHeaderProps = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  usePageTitle(title)

  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </header>
  )
}
