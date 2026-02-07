import { create } from 'zustand'

export type AmbientMood = 'dark' | 'tense' | 'hack' | 'calm' | 'danger' | 'none'

interface AudioState {
  isInitialized: boolean
  currentAmbient: AmbientMood
  isMuted: boolean

  setInitialized: (initialized: boolean) => void
  setCurrentAmbient: (mood: AmbientMood) => void
  setMuted: (muted: boolean) => void
}

export const useAudioStore = create<AudioState>()((set) => ({
  isInitialized: false,
  currentAmbient: 'none',
  isMuted: false,

  setInitialized: (isInitialized) => set({ isInitialized }),
  setCurrentAmbient: (currentAmbient) => set({ currentAmbient }),
  setMuted: (isMuted) => set({ isMuted }),
}))
