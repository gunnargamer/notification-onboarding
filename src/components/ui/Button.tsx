import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

/** Pill button (radius-pill). Magenta only on the primary variant. */
export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex min-h-touch items-center justify-center rounded-pill px-5 py-3 text-base font-medium transition-colors disabled:opacity-50'
  const styles =
    variant === 'primary'
      ? 'bg-primary text-white'
      : 'bg-card text-text'
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
