import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/Button'
import { SaveLoadMenu } from './SaveLoadMenu'
import { autoSave } from '@/engine/SaveManager'

export function PauseMenu() {
  const setScreen = useGameStore((s) => s.setScreen)
  const [subMenu, setSubMenu] = useState<'none' | 'save' | 'load'>('none')

  const handleResume = () => {
    setScreen('game')
  }

  const handleQuit = () => {
    autoSave()
    setScreen('main-menu')
  }

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center bg-cyber-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {subMenu === 'none' ? (
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-mono text-2xl text-cyber-cyan text-glow-cyan tracking-widest mb-6">
            // PAUSED
          </h2>
          <Button variant="primary" onClick={handleResume} className="w-52">
            RESUME
          </Button>
          <Button variant="secondary" onClick={() => setSubMenu('save')} className="w-52">
            SAVE GAME
          </Button>
          <Button variant="secondary" onClick={() => setSubMenu('load')} className="w-52">
            LOAD GAME
          </Button>
          <Button variant="secondary" onClick={() => setScreen('settings')} className="w-52">
            SETTINGS
          </Button>
          <div className="mt-2">
            <Button variant="danger" onClick={handleQuit} className="w-52">
              QUIT TO MENU
            </Button>
          </div>
        </div>
      ) : (
        <SaveLoadMenu mode={subMenu} onBack={() => setSubMenu('none')} />
      )}
    </motion.div>
  )
}
