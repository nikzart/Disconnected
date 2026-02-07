import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'danger'
  noPadding?: boolean
}

export function Card({ children, variant = 'default', noPadding = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'border rounded-sm bg-cyber-panel/80 backdrop-blur-sm',
        !noPadding && 'p-4',
        variant === 'default' && 'border-cyber-border',
        variant === 'highlighted' && 'border-cyber-cyan/30 shadow-[0_0_8px_rgba(0,255,213,0.1)]',
        variant === 'danger' && 'border-cyber-red/30 shadow-[0_0_8px_rgba(255,51,51,0.1)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
