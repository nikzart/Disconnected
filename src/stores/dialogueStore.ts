import { create } from 'zustand'
import type { StoryNode, StoryChoice } from '@/types/story'

interface DialogueState {
  currentNode: StoryNode | null
  isTyping: boolean
  displayedText: string
  availableChoices: StoryChoice[]
  dialogueHistory: Array<{
    speaker: string
    text: string
    timestamp: number
  }>
  isActive: boolean

  setCurrentNode: (node: StoryNode | null) => void
  setIsTyping: (typing: boolean) => void
  setDisplayedText: (text: string) => void
  setAvailableChoices: (choices: StoryChoice[]) => void
  addToHistory: (speaker: string, text: string) => void
  setIsActive: (active: boolean) => void
  clearDialogue: () => void
}

export const useDialogueStore = create<DialogueState>()((set) => ({
  currentNode: null,
  isTyping: false,
  displayedText: '',
  availableChoices: [],
  dialogueHistory: [],
  isActive: false,

  setCurrentNode: (node) => set({ currentNode: node }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setDisplayedText: (displayedText) => set({ displayedText }),
  setAvailableChoices: (availableChoices) => set({ availableChoices }),
  addToHistory: (speaker, text) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, { speaker, text, timestamp: Date.now() }],
    })),
  setIsActive: (isActive) => set({ isActive }),
  clearDialogue: () =>
    set({
      currentNode: null,
      isTyping: false,
      displayedText: '',
      availableChoices: [],
      isActive: false,
    }),
}))
