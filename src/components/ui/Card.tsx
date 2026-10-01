import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn.ts'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white p-5 shadow-card ring-1 ring-line',
        className,
      )}
      {...props}
    />
  )
}
