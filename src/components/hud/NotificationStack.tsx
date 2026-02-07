import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { AlertCircle, CheckCircle, AlertTriangle, Info, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  clue: Search,
}

const COLORS = {
  info: 'border-cyber-blue text-cyber-blue',
  success: 'border-cyber-green text-cyber-green',
  warning: 'border-cyber-amber text-cyber-amber',
  error: 'border-cyber-red text-cyber-red',
  clue: 'border-cyber-magenta text-cyber-magenta',
}

export function NotificationStack() {
  const notifications = useGameStore((s) => s.notifications)
  const dismissNotification = useGameStore((s) => s.dismissNotification)

  useEffect(() => {
    for (const n of notifications) {
      const duration = n.duration ?? 4000
      if (duration > 0) {
        const timer = setTimeout(() => dismissNotification(n.id), duration)
        return () => clearTimeout(timer)
      }
    }
  }, [notifications, dismissNotification])

  return (
    <div className="fixed bottom-8 right-4 z-[80] flex flex-col gap-2 pointer-events-none max-w-sm">
      <AnimatePresence>
        {notifications.slice(-5).map((n) => {
          const Icon = ICONS[n.type]
          return (
            <motion.div
              key={n.id}
              className={cn(
                'pointer-events-auto bg-cyber-dark/95 backdrop-blur-sm border-l-2 px-3 py-2',
                'cursor-pointer',
                COLORS[n.type],
              )}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => dismissNotification(n.id)}
            >
              <div className="flex items-start gap-2">
                <Icon size={14} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-xs font-semibold">{n.title}</div>
                  <div className="font-mono text-[10px] text-cyber-muted mt-0.5">{n.message}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
