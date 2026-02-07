import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { MatrixRain } from '@/components/effects/MatrixRain'
import { DisconnectedLogo } from './DisconnectedLogo'
import { TypewriterText } from '@/components/ui/TypewriterText'
import { GlitchTransition } from '@/components/effects/GlitchTransition'
import { getSaveSlots, loadGame } from '@/engine/SaveManager'

export function MainMenu() {
  const [showTransition, setShowTransition] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [subtitleDone, setSubtitleDone] = useState(false)
  const startNewGame = useGameStore((s) => s.startNewGame)
  const setScreen = useGameStore((s) => s.setScreen)
  const hasSaves = useMemo(() => getSaveSlots().length > 0, [])

  const MENU_ITEMS = useMemo(() => [
    { id: 'new-game', label: '> NEW_GAME' },
    ...(hasSaves ? [{ id: 'continue', label: '> CONTINUE' }] : []),
    { id: 'settings', label: '> SETTINGS' },
  ], [hasSaves])

  const handleMenuClick = (id: string) => {
    if (id === 'new-game') {
      setShowTransition(true)
    } else if (id === 'continue') {
      const slots = getSaveSlots()
      if (slots.length > 0) {
        const latest = slots.sort((a, b) => b.timestamp - a.timestamp)[0]
        loadGame(latest.id)
      }
    } else if (id === 'settings') {
      setScreen('settings')
    }
  }

  const handleTransitionComplete = () => {
    setShowTransition(false)
    startNewGame()
  }

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MatrixRain />

      {showTransition && (
        <GlitchTransition onComplete={handleTransitionComplete} />
      )}

      {/* Title area */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Main title — the big show */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DisconnectedLogo />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="mt-6 h-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <TypewriterText
            text="THE TRUTH IS IN THE CODE"
            className="text-sm tracking-[0.4em] text-cyber-muted font-mono"
            delay={200}
            showCursor={false}
            onComplete={() => setSubtitleDone(true)}
          />
        </motion.div>

        {/* Decorative accent lines */}
        <motion.div
          className="mt-8 mb-12 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.8 }}
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyber-cyan/40" />
          <div className="font-mono text-[10px] text-cyber-cyan/30 tracking-[0.5em]">ECHO_SYS</div>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyber-cyan/40" />
        </motion.div>

        {/* Menu items */}
        {subtitleDone && (
          <motion.nav
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {MENU_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                className={`
                  font-mono text-lg px-8 py-3 transition-all duration-200 relative
                  border border-transparent
                  ${hoveredItem === item.id
                    ? 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5'
                    : 'text-cyber-text hover:text-cyber-cyan'
                  }
                `}
                style={{
                  textShadow: hoveredItem === item.id
                    ? '0 0 8px rgba(0,255,213,0.5)'
                    : 'none',
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.3 }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleMenuClick(item.id)}
              >
                {/* Hover indicator bar */}
                {hoveredItem === item.id && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cyber-cyan"
                    layoutId="menu-indicator"
                    style={{ boxShadow: '0 0 8px #00ffd5' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {item.label}
              </motion.button>
            ))}
          </motion.nav>
        )}

        {/* Version */}
        <motion.div
          className="absolute bottom-[-120px] text-xs font-mono text-cyber-muted/30 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          v1.0.0
        </motion.div>
      </div>
    </motion.div>
  )
}
