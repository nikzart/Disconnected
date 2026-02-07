import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'cyan' | 'green' | 'red' | 'magenta' | 'amber'
  size?: 'sm' | 'md'
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = 'cyan',
  size = 'md',
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const colorClasses = {
    cyan: 'bg-cyber-cyan shadow-[0_0_6px_rgba(0,255,213,0.4)]',
    green: 'bg-cyber-green shadow-[0_0_6px_rgba(57,255,20,0.4)]',
    red: 'bg-cyber-red shadow-[0_0_6px_rgba(255,51,51,0.4)]',
    magenta: 'bg-cyber-magenta shadow-[0_0_6px_rgba(255,0,255,0.4)]',
    amber: 'bg-cyber-amber shadow-[0_0_6px_rgba(255,170,0,0.4)]',
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-mono text-cyber-muted">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono text-cyber-text">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-cyber-border/50 rounded-sm overflow-hidden',
          size === 'sm' ? 'h-1' : 'h-2',
        )}
      >
        <div
          className={cn(
            'h-full rounded-sm transition-all duration-300',
            colorClasses[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
