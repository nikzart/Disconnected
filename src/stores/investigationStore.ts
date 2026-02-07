import { create } from 'zustand'
import type { Clue, ClueConnection } from '@/types/investigation'

interface InvestigationState {
  clues: Clue[]
  connections: ClueConnection[]
  selectedClue: string | null
  boardOffset: { x: number; y: number }
  boardZoom: number
  filterChain: string | null
  filterType: string | null

  addClue: (clue: Clue) => void
  discoverClue: (id: string) => void
  updateCluePosition: (id: string, x: number, y: number) => void
  addConnection: (connection: ClueConnection) => void
  discoverConnection: (id: string) => void
  setSelectedClue: (id: string | null) => void
  setBoardOffset: (offset: { x: number; y: number }) => void
  setBoardZoom: (zoom: number) => void
  setFilterChain: (chain: string | null) => void
  setFilterType: (type: string | null) => void
  hasClue: (id: string) => boolean
  hasConnection: (id: string) => boolean
}

export const useInvestigationStore = create<InvestigationState>()((set, get) => ({
  clues: [],
  connections: [],
  selectedClue: null,
  boardOffset: { x: 0, y: 0 },
  boardZoom: 1,
  filterChain: null,
  filterType: null,

  addClue: (clue) =>
    set((state) => ({
      clues: [...state.clues, clue],
    })),

  discoverClue: (id) =>
    set((state) => ({
      clues: state.clues.map((c) =>
        c.id === id ? { ...c, discovered: true } : c
      ),
    })),

  updateCluePosition: (id, x, y) =>
    set((state) => ({
      clues: state.clues.map((c) =>
        c.id === id ? { ...c, position: { x, y } } : c
      ),
    })),

  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),

  discoverConnection: (id) =>
    set((state) => ({
      connections: state.connections.map((c) =>
        c.id === id ? { ...c, discovered: true } : c
      ),
    })),

  setSelectedClue: (selectedClue) => set({ selectedClue }),
  setBoardOffset: (boardOffset) => set({ boardOffset }),
  setBoardZoom: (boardZoom) => set({ boardZoom }),
  setFilterChain: (filterChain) => set({ filterChain }),
  setFilterType: (filterType) => set({ filterType }),
  hasClue: (id) => get().clues.some((c) => c.id === id && c.discovered),
  hasConnection: (id) => get().connections.some((c) => c.id === id && c.discovered),
}))
