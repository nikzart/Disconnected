import { create } from 'zustand'
import type { TerminalLine, TerminalState } from '@/types/terminal'
import { randomId } from '@/lib/utils'

interface TerminalStoreState extends TerminalState {
  inputValue: string
  isProcessing: boolean
  tabCompletions: string[]
  showTabCompletions: boolean

  setInputValue: (value: string) => void
  addLine: (type: TerminalLine['type'], content: string) => void
  addLines: (lines: Array<{ type: TerminalLine['type']; content: string }>) => void
  clearHistory: () => void
  addCommandToHistory: (command: string) => void
  setHistoryIndex: (index: number) => void
  navigateHistory: (direction: 'up' | 'down') => string
  setCurrentMachine: (machine: string) => void
  setCurrentPath: (path: string[]) => void
  setIsProcessing: (processing: boolean) => void
  setTabCompletions: (completions: string[]) => void
  setShowTabCompletions: (show: boolean) => void
}

export const useTerminalStore = create<TerminalStoreState>()((set, get) => ({
  currentMachine: 'localhost',
  currentPath: ['~'],
  history: [],
  commandHistory: [],
  historyIndex: -1,
  inputValue: '',
  isProcessing: false,
  tabCompletions: [],
  showTabCompletions: false,

  setInputValue: (inputValue) => set({ inputValue }),

  addLine: (type, content) =>
    set((state) => ({
      history: [
        ...state.history,
        { id: randomId(), type, content, timestamp: Date.now() },
      ],
    })),

  addLines: (lines) =>
    set((state) => ({
      history: [
        ...state.history,
        ...lines.map((l) => ({
          id: randomId(),
          type: l.type,
          content: l.content,
          timestamp: Date.now(),
        })),
      ],
    })),

  clearHistory: () => set({ history: [] }),

  addCommandToHistory: (command) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      historyIndex: -1,
    })),

  setHistoryIndex: (historyIndex) => set({ historyIndex }),

  navigateHistory: (direction) => {
    const state = get()
    const { commandHistory, historyIndex } = state
    if (commandHistory.length === 0) return ''

    let newIndex: number
    if (direction === 'up') {
      newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1)
    } else {
      newIndex = historyIndex === -1
        ? -1
        : historyIndex >= commandHistory.length - 1
          ? -1
          : historyIndex + 1
    }

    set({ historyIndex: newIndex })
    return newIndex === -1 ? '' : commandHistory[newIndex]
  },

  setCurrentMachine: (currentMachine) => set({ currentMachine }),
  setCurrentPath: (currentPath) => set({ currentPath }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setTabCompletions: (tabCompletions) => set({ tabCompletions }),
  setShowTabCompletions: (showTabCompletions) => set({ showTabCompletions }),
}))
