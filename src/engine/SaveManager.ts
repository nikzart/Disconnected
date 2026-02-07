import { useGameStore } from '@/stores/gameStore'
import { useTerminalStore } from '@/stores/terminalStore'
import { useInvestigationStore } from '@/stores/investigationStore'
import { useChatStore } from '@/stores/chatStore'
import { SAVE_KEY, MAX_SAVE_SLOTS } from '@/lib/constants'
import type { SaveSlot } from '@/types/game'

interface FullSaveData {
  game: string
  terminal: {
    currentMachine: string
    currentPath: string[]
  }
  investigation: {
    clues: ReturnType<typeof useInvestigationStore.getState>['clues']
    connections: ReturnType<typeof useInvestigationStore.getState>['connections']
  }
  chat: {
    contacts: ReturnType<typeof useChatStore.getState>['contacts']
    conversations: ReturnType<typeof useChatStore.getState>['conversations']
  }
}

function getFullState(): FullSaveData {
  return {
    game: useGameStore.getState().getSerializedState(),
    terminal: {
      currentMachine: useTerminalStore.getState().currentMachine,
      currentPath: useTerminalStore.getState().currentPath,
    },
    investigation: {
      clues: useInvestigationStore.getState().clues,
      connections: useInvestigationStore.getState().connections,
    },
    chat: {
      contacts: useChatStore.getState().contacts,
      conversations: useChatStore.getState().conversations,
    },
  }
}

function loadFullState(data: FullSaveData) {
  useGameStore.getState().loadSerializedState(data.game)

  const termStore = useTerminalStore.getState()
  termStore.setCurrentMachine(data.terminal.currentMachine)
  termStore.setCurrentPath(data.terminal.currentPath)

  // Investigation state - re-populate
  const invStore = useInvestigationStore.getState()
  for (const clue of data.investigation.clues) {
    if (!invStore.hasClue(clue.id)) {
      invStore.addClue(clue)
    }
  }

  // Chat state
  const chatStore = useChatStore.getState()
  for (const contact of data.chat.contacts) {
    chatStore.addContact(contact)
  }
}

export function getSaveSlots(): SaveSlot[] {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveGame(slotId: string, name?: string): SaveSlot {
  const state = useGameStore.getState()
  const fullData = getFullState()

  const slot: SaveSlot = {
    id: slotId,
    name: name || `Save ${slotId}`,
    chapter: state.chapter,
    timestamp: Date.now(),
    playTime: state.playTime,
    data: JSON.stringify(fullData),
  }

  const slots = getSaveSlots().filter((s) => s.id !== slotId)
  slots.push(slot)

  // Keep max slots
  while (slots.length > MAX_SAVE_SLOTS + 1) {
    slots.shift()
  }

  localStorage.setItem(SAVE_KEY, JSON.stringify(slots))
  return slot
}

export function loadGame(slotId: string): boolean {
  const slots = getSaveSlots()
  const slot = slots.find((s) => s.id === slotId)
  if (!slot) return false

  try {
    const data: FullSaveData = JSON.parse(slot.data)
    loadFullState(data)
    return true
  } catch {
    return false
  }
}

export function deleteSave(slotId: string) {
  const slots = getSaveSlots().filter((s) => s.id !== slotId)
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots))
}

export function autoSave() {
  saveGame('autosave', 'Auto Save')
}
