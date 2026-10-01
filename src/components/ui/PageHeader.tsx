import { usePageTitle } from '../../lib/usePageTitle.ts'

type PageHeaderProps = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  usePageTitle(title)

  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight md:text-[28px] md:leading-9">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
    </header>
  )
}
