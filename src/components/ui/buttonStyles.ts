import { cn } from '../../lib/cn.ts'

export type ButtonVariant = 'primary' | 'secondary'

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-wheat-strong text-white hover:bg-wheat-deep active:bg-wheat-deep',
  secondary:
    'bg-white text-ink ring-1 ring-line hover:bg-wheat-soft active:bg-wheat-soft',
}

export function buttonClassName(variant: ButtonVariant = 'primary'): string {
  return cn(buttonBase, buttonVariants[variant])
}
