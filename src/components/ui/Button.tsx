import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn.ts'
import { buttonClassName, type ButtonVariant } from './buttonStyles.ts'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClassName(variant), className)}
      {...props}
    />
  )
}
