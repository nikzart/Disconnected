import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-mono font-medium border transition-all duration-200 relative overflow-hidden',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        // Size
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-8 py-3.5 text-base',
        // Variant
        variant === 'primary' && [
          'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan',
          'hover:bg-cyber-cyan/20 hover:shadow-[0_0_12px_rgba(0,255,213,0.3)]',
        ],
        variant === 'secondary' && [
          'bg-cyber-border/50 border-cyber-border text-cyber-text',
          'hover:bg-cyber-border hover:border-cyber-muted',
        ],
        variant === 'danger' && [
          'bg-cyber-red/10 border-cyber-red text-cyber-red',
          'hover:bg-cyber-red/20 hover:shadow-[0_0_12px_rgba(255,51,51,0.3)]',
        ],
        variant === 'ghost' && [
          'bg-transparent border-transparent text-cyber-muted',
          'hover:text-cyber-text hover:bg-cyber-border/30',
        ],
        glow && variant === 'primary' && 'neon-border-cyan',
        glow && variant === 'danger' && 'neon-border-red',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
