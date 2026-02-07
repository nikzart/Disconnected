import { create } from 'zustand'
import type { CharacterId } from '@/types/characters'

export interface ChatMessage {
  id: string
  sender: CharacterId | 'player'
  text: string
  timestamp: number
  isTyping?: boolean
}

interface ChatState {
  activeContact: CharacterId | null
  conversations: Record<string, ChatMessage[]>
  unreadCounts: Record<string, number>
  suspicionLevel: number
  trustLevel: number
  contacts: CharacterId[]

  setActiveContact: (contact: CharacterId | null) => void
  addMessage: (contactId: string, message: ChatMessage) => void
  markRead: (contactId: string) => void
  setSuspicionLevel: (level: number) => void
  setTrustLevel: (level: number) => void
  addContact: (contactId: CharacterId) => void
  hasContact: (contactId: CharacterId) => boolean
}

export const useChatStore = create<ChatState>()((set, get) => ({
  activeContact: null,
  conversations: {},
  unreadCounts: {},
  suspicionLevel: 0,
  trustLevel: 50,
  contacts: [],

  setActiveContact: (activeContact) => set({ activeContact }),

  addMessage: (contactId, message) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [contactId]: [...(state.conversations[contactId] || []), message],
      },
      unreadCounts: {
        ...state.unreadCounts,
        [contactId]: message.sender !== 'player'
          ? (state.unreadCounts[contactId] || 0) + 1
          : state.unreadCounts[contactId] || 0,
      },
    })),

  markRead: (contactId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [contactId]: 0 },
    })),

  setSuspicionLevel: (suspicionLevel) => set({ suspicionLevel }),
  setTrustLevel: (trustLevel) => set({ trustLevel }),

  addContact: (contactId) =>
    set((state) => ({
      contacts: state.contacts.includes(contactId)
        ? state.contacts
        : [...state.contacts, contactId],
    })),

  hasContact: (contactId) => get().contacts.includes(contactId),
}))
