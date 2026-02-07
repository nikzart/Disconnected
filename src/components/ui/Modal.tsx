import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
  showClose?: boolean
}

export function Modal({ open, onClose, title, children, className, showClose = true }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className={cn(
              'relative border border-cyber-border bg-cyber-dark/95 backdrop-blur-md',
              'rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-lg w-full mx-4',
              className,
            )}
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
                {title && (
                  <h3 className="font-mono text-sm font-semibold text-cyber-cyan tracking-wider uppercase">
                    {title}
                  </h3>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="text-cyber-muted hover:text-cyber-text transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
