import { motion } from 'framer-motion'

interface GlitchTransitionProps {
  onComplete?: () => void
}

export function GlitchTransition({ onComplete }: GlitchTransitionProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.6, times: [0, 0.1, 0.8, 1] }}
      onAnimationComplete={onComplete}
    >
      {/* Glitch bars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 bg-cyber-cyan"
          style={{
            height: `${Math.random() * 4 + 1}px`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0, Math.random() * -30, 0],
            opacity: [0, 1, 0.5, 1, 0],
          }}
          transition={{
            duration: 0.4,
            delay: Math.random() * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Flash */}
      <motion.div
        className="absolute inset-0 bg-cyber-cyan"
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
    </motion.div>
  )
}
