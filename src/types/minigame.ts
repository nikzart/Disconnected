export type MinigameType = 'password-cracker' | 'network-scanner' | 'code-injection' | 'encryption-puzzle' | 'filesystem-puzzle' | 'social-engineering'

export type MinigameResult = 'success' | 'failure' | 'partial' | 'timeout'

export interface MinigameConfig {
  id: string
  type: MinigameType
  title: string
  description: string
  difficulty: 1 | 2 | 3 | 4 | 5
  timeLimit?: number
  detectionLimit?: number
  data: PasswordCrackerData | NetworkScannerData | CodeInjectionData | EncryptionPuzzleData
  onSuccess: string
  onFailure?: string
}

export interface PasswordCrackerData {
  targetHash: string
  charset: string
  length: number
  hints: string[]
  answer: string
}

export interface NetworkScannerData {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  targetNode: string
  startNode: string
}

export interface NetworkNode {
  id: string
  label: string
  type: 'server' | 'router' | 'firewall' | 'endpoint' | 'target'
  x: number
  y: number
  secured: boolean
  vulnerability?: string
}

export interface NetworkEdge {
  from: string
  to: string
  encrypted: boolean
}

export interface CodeInjectionData {
  code: string
  injectionPoints: InjectionPoint[]
  expectedOutput: string
}

export interface InjectionPoint {
  id: string
  line: number
  column: number
  placeholder: string
  correctValue: string
  hint: string
}

export interface EncryptionPuzzleData {
  cipherType: 'caesar' | 'substitution' | 'xor' | 'vigenere'
  ciphertext: string
  plaintext: string
  key: string | number
  hints: string[]
}
