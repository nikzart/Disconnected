import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { TopBar } from './TopBar'
import { BottomBar } from './BottomBar'
import { SidePanel } from './SidePanel'
import { Terminal } from '@/components/terminal/Terminal'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { InvestigationBoard } from '@/components/investigation/InvestigationBoard'
import { DialogueBox } from '@/components/narrative/DialogueBox'
import { CutscenePlayer } from '@/components/narrative/CutscenePlayer'
import { CharacterDossier } from '@/components/characters/CharacterDossier'
import { MinigameWrapper } from '@/components/minigames/MinigameWrapper'

export function GameLayout() {
  const view = useGameStore((s) => s.view)
  const setScreen = useGameStore((s) => s.setScreen)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setScreen('pause')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setScreen])

  return (
    <motion.div
      className="h-full w-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <SidePanel />

        {/* Main content area */}
        <div className="flex-1 relative overflow-hidden">
          {view === 'terminal' && <Terminal />}
          {view === 'chat' && <ChatPanel />}
          {view === 'investigation' && <InvestigationBoard />}
          {view === 'cutscene' && <CutscenePlayer />}
          {view === 'dossier' && <CharacterDossier />}
          {view === 'minigame' && <MinigameWrapper />}
        </div>
      </div>

      {/* Dialogue overlay */}
      <DialogueBox />

      <BottomBar />
    </motion.div>
  )
}
