import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn.ts'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-surface border border-line bg-white p-4',
        className,
      )}
      {...props}
    />
  )
}
