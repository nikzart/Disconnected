export interface VFSFile {
  name: string
  content: string
  hidden?: boolean
  encrypted?: boolean
  readable?: boolean
  onRead?: string // story action trigger ID
}

export interface VFSDirectory {
  name: string
  children: Record<string, VFSEntry>
  hidden?: boolean
}

export type VFSEntry = VFSFile | VFSDirectory

export function isDirectory(entry: VFSEntry): entry is VFSDirectory {
  return 'children' in entry
}

export function isFile(entry: VFSEntry): entry is VFSFile {
  return 'content' in entry
}

export interface Machine {
  id: string
  hostname: string
  ip: string
  filesystem: VFSDirectory
  requiresAccess?: boolean
  accessGranted?: boolean
  motd?: string
}

export interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'warning' | 'ascii'
  content: string
  timestamp: number
}

export interface TerminalState {
  currentMachine: string
  currentPath: string[]
  history: TerminalLine[]
  commandHistory: string[]
  historyIndex: number
}
