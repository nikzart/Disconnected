import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameScreen, GameView, Chapter, GameSettings, Objective, Ending } from '@/types/game'
import { SETTINGS_KEY } from '@/lib/constants'

interface GameState {
  // Screen state
  screen: GameScreen
  view: GameView
  chapter: Chapter

  // Game progress
  flags: Record<string, boolean>
  choices: Record<string, string>
  startTime: number
  playTime: number

  // Objectives
  objectives: Objective[]

  // Settings
  settings: GameSettings

  // Notifications
  notifications: Notification[]

  // Ending
  ending: Ending | null

  // Actions
  setScreen: (screen: GameScreen) => void
  setView: (view: GameView) => void
  setChapter: (chapter: Chapter) => void
  setFlag: (flag: string, value: boolean) => void
  removeFlag: (flag: string) => void
  hasFlag: (flag: string) => boolean
  setChoice: (choiceId: string, value: string) => void
  addObjective: (objective: Objective) => void
  completeObjective: (id: string) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  addNotification: (notification: Notification) => void
  dismissNotification: (id: string) => void
  setEnding: (ending: Ending) => void
  startNewGame: () => void
  getSerializedState: () => string
  loadSerializedState: (data: string) => void
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'clue'
  title: string
  message: string
  timestamp: number
  duration?: number
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.7,
  textSpeed: 'normal',
  crtEffect: true,
  scanlines: true,
  screenShake: true,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'main-menu',
      view: 'terminal',
      chapter: 1,
      flags: {},
      choices: {},
      startTime: 0,
      playTime: 0,
      objectives: [],
      settings: DEFAULT_SETTINGS,
      notifications: [],
      ending: null,

      setScreen: (screen) => set({ screen }),
      setView: (view) => set({ view }),
      setChapter: (chapter) => set({ chapter }),

      setFlag: (flag, value) => set((state) => ({
        flags: { ...state.flags, [flag]: value },
      })),

      removeFlag: (flag) => set((state) => {
        const flags = { ...state.flags }
        delete flags[flag]
        return { flags }
      }),

      hasFlag: (flag) => get().flags[flag] === true,

      setChoice: (choiceId, value) => set((state) => ({
        choices: { ...state.choices, [choiceId]: value },
      })),

      addObjective: (objective) => set((state) => ({
        objectives: [...state.objectives, objective],
      })),

      completeObjective: (id) => set((state) => ({
        objectives: state.objectives.map((o) =>
          o.id === id ? { ...o, completed: true } : o
        ),
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification],
      })),

      dismissNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

      setEnding: (ending) => set({ ending }),

      startNewGame: () => set({
        screen: 'game',
        view: 'cutscene',
        chapter: 1,
        flags: {},
        choices: {},
        startTime: Date.now(),
        playTime: 0,
        objectives: [],
        notifications: [],
        ending: null,
      }),

      getSerializedState: () => {
        const state = get()
        return JSON.stringify({
          chapter: state.chapter,
          flags: state.flags,
          choices: state.choices,
          playTime: state.playTime,
          objectives: state.objectives,
        })
      },

      loadSerializedState: (data) => {
        const parsed = JSON.parse(data)
        set({
          chapter: parsed.chapter,
          flags: parsed.flags,
          choices: parsed.choices,
          playTime: parsed.playTime,
          objectives: parsed.objectives,
          screen: 'game',
          view: 'terminal',
        })
      },
    }),
    {
      name: SETTINGS_KEY,
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
