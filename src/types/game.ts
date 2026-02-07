export type GameScreen = 'main-menu' | 'game' | 'pause' | 'settings' | 'save-load'

export type GameView = 'terminal' | 'chat' | 'investigation' | 'minigame' | 'cutscene' | 'dossier'

export type Chapter = 1 | 2 | 3 | 4 | 5

export type ActName = 'Signal' | 'Noise' | 'Static' | 'Interference' | 'Disconnect'

export const ACT_NAMES: Record<Chapter, ActName> = {
  1: 'Signal',
  2: 'Noise',
  3: 'Static',
  4: 'Interference',
  5: 'Disconnect',
}

export type Ending = 'hero' | 'martyr' | 'ghost' | 'pragmatist' | 'villain' | 'sacrifice'

export interface Objective {
  id: string
  chapter: Chapter
  title: string
  description: string
  completed: boolean
  hidden: boolean
}

export interface GameSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant'
  crtEffect: boolean
  scanlines: boolean
  screenShake: boolean
}

export interface SaveSlot {
  id: string
  name: string
  chapter: Chapter
  timestamp: number
  playTime: number
  data: string
}
