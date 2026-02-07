import { useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { MainMenu } from '@/components/menu/MainMenu'
import { GameLayout } from '@/components/layout/GameLayout'
import { PauseMenu } from '@/components/menu/PauseMenu'
import { SettingsMenu } from '@/components/menu/SettingsMenu'
import { ScanlineOverlay } from '@/components/effects/ScanlineOverlay'
import { CRTEffect } from '@/components/effects/CRTEffect'
import { NotificationStack } from '@/components/hud/NotificationStack'
import { AnimatePresence } from 'framer-motion'
import { registerAllChapters } from '@/data/story/index'
import { useAudio } from '@/hooks/useAudio'

export function App() {
  const screen = useGameStore((s) => s.screen)
  const settings = useGameStore((s) => s.settings)

  // Initialize story engine
  useEffect(() => {
    registerAllChapters()
  }, [])

  // Initialize audio on user interaction
  useAudio()

  return (
    <div className="h-full w-full relative overflow-hidden bg-cyber-black">
      {settings.crtEffect && <CRTEffect />}
      {settings.scanlines && <ScanlineOverlay />}

      <AnimatePresence mode="wait">
        {screen === 'main-menu' && <MainMenu key="main-menu" />}
        {screen === 'game' && <GameLayout key="game" />}
        {screen === 'pause' && <PauseMenu key="pause" />}
        {screen === 'settings' && <SettingsMenu key="settings" />}
      </AnimatePresence>

      <NotificationStack />
    </div>
  )
}
