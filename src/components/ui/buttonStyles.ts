import { cn } from '../../lib/cn.ts'

export type ButtonVariant = 'primary' | 'secondary'

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-wheat-strong text-white hover:bg-wheat-deep active:bg-wheat-deep',
  secondary:
    'border border-line bg-white text-ink hover:bg-cream active:bg-cream',
}

export function buttonClassName(variant: ButtonVariant = 'primary'): string {
  return cn(buttonBase, buttonVariants[variant])
}
