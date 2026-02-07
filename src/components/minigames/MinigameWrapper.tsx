import { useState } from 'react'
import { PasswordCracker } from './PasswordCracker'
import { NetworkScanner } from './NetworkScanner'
import { CodeInjection } from './CodeInjection'
import { EncryptionPuzzle } from './EncryptionPuzzle'
import type { MinigameConfig, MinigameResult } from '@/types/minigame'

interface MinigameWrapperProps {
  config?: MinigameConfig
}

export function MinigameWrapper({ config }: MinigameWrapperProps) {
  const [_result, setResult] = useState<MinigameResult | null>(null)

  const handleComplete = (result: MinigameResult) => {
    setResult(result)
  }

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-cyber-muted">No active mini-game</p>
          <p className="font-mono text-xs text-cyber-muted/60 mt-2">
            Mini-games are triggered through story events
          </p>
        </div>
      </div>
    )
  }

  switch (config.type) {
    case 'password-cracker':
      return <PasswordCracker config={config} onComplete={handleComplete} />
    case 'network-scanner':
      return <NetworkScanner config={config} onComplete={handleComplete} />
    case 'code-injection':
      return <CodeInjection config={config} onComplete={handleComplete} />
    case 'encryption-puzzle':
      return <EncryptionPuzzle config={config} onComplete={handleComplete} />
    default:
      return (
        <div className="h-full flex items-center justify-center">
          <p className="font-mono text-sm text-cyber-red">Unknown mini-game type</p>
        </div>
      )
  }
}
