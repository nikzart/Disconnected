export type ClueType = 'document' | 'email' | 'photo' | 'recording' | 'data' | 'testimony' | 'code'

export type ClueChain = 'murder' | 'lethe' | 'coverup'

export interface Clue {
  id: string
  title: string
  description: string
  type: ClueType
  chain: ClueChain
  chapter: number
  discovered: boolean
  content: string
  position?: { x: number; y: number }
}

export interface ClueConnection {
  id: string
  from: string
  to: string
  label: string
  discovered: boolean
  unlocks?: string // story node or flag
}
