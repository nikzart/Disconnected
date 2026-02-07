import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { MinigameConfig, MinigameResult, EncryptionPuzzleData } from '@/types/minigame'
import { cn } from '@/lib/utils'

interface EncryptionPuzzleProps {
  config: MinigameConfig
  onComplete: (result: MinigameResult) => void
}

export function EncryptionPuzzle({ config, onComplete }: EncryptionPuzzleProps) {
  const data = config.data as EncryptionPuzzleData
  const [keyGuess, setKeyGuess] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [solved, setSolved] = useState(false)
  const [showHintIndex, setShowHintIndex] = useState(0)

  const applyCaesarDecrypt = useCallback((text: string, shift: number) => {
    return text.split('').map((c) => {
      if (c >= 'A' && c <= 'Z') {
        return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65)
      }
      if (c >= 'a' && c <= 'z') {
        return String.fromCharCode(((c.charCodeAt(0) - 97 - shift + 26) % 26) + 97)
      }
      return c
    }).join('')
  }, [])

  const applyDecrypt = useCallback((key: string) => {
    try {
      switch (data.cipherType) {
        case 'caesar': {
          const shift = parseInt(key)
          if (isNaN(shift)) return data.ciphertext
          return applyCaesarDecrypt(data.ciphertext, shift)
        }
        case 'xor': {
          const xorKey = parseInt(key)
          if (isNaN(xorKey)) return data.ciphertext
          return data.ciphertext.split('').map((c) =>
            String.fromCharCode(c.charCodeAt(0) ^ xorKey),
          ).join('')
        }
        case 'substitution':
        case 'vigenere':
        default:
          return data.ciphertext
      }
    } catch {
      return data.ciphertext
    }
  }, [data, applyCaesarDecrypt])

  const handleKeyChange = (value: string) => {
    setKeyGuess(value)
    setDecrypted(applyDecrypt(value))
  }

  const handleSubmit = () => {
    if (decrypted.toLowerCase() === data.plaintext.toLowerCase()) {
      setSolved(true)
      onComplete('success')
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="h-full flex flex-col bg-cyber-black">
      <div className="px-4 py-2 border-b border-cyber-border">
        <h2 className="font-mono text-sm text-cyber-cyan tracking-wider">ENCRYPTION PUZZLE</h2>
        <p className="font-mono text-xs text-cyber-muted">
          Cipher type: {data.cipherType.toUpperCase()}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
        {/* Cipher wheel visualization */}
        {data.cipherType === 'caesar' && (
          <div className="relative w-48 h-48 mb-4">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-cyber-border">
              {alphabet.map((letter, i) => {
                const angle = (i * 360) / 26 - 90
                const rad = (angle * Math.PI) / 180
                const x = 50 + 42 * Math.cos(rad)
                const y = 50 + 42 * Math.sin(rad)
                return (
                  <span
                    key={`outer-${i}`}
                    className="absolute font-mono text-[10px] text-cyber-muted"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {letter}
                  </span>
                )
              })}
            </div>
            {/* Inner ring (shifted) */}
            <div
              className="absolute inset-4 rounded-full border border-cyber-cyan/30"
              style={{
                transform: `rotate(${(parseInt(keyGuess) || 0) * (360 / 26)}deg)`,
                transition: 'transform 0.3s ease',
              }}
            >
              {alphabet.map((letter, i) => {
                const angle = (i * 360) / 26 - 90
                const rad = (angle * Math.PI) / 180
                const x = 50 + 42 * Math.cos(rad)
                const y = 50 + 42 * Math.sin(rad)
                return (
                  <span
                    key={`inner-${i}`}
                    className="absolute font-mono text-[10px] text-cyber-cyan"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {letter}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Ciphertext */}
        <div className="w-full max-w-lg">
          <label className="font-mono text-[10px] text-cyber-muted tracking-wider">CIPHERTEXT</label>
          <div className="mt-1 p-3 bg-cyber-panel border border-cyber-border rounded-sm font-mono text-sm text-cyber-red tracking-wider break-all">
            {data.ciphertext}
          </div>
        </div>

        {/* Key input */}
        <div className="w-full max-w-lg">
          <label className="font-mono text-[10px] text-cyber-muted tracking-wider">
            DECRYPTION KEY ({data.cipherType === 'caesar' ? 'shift value' : 'key'})
          </label>
          <input
            value={keyGuess}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="mt-1 w-full bg-cyber-panel border border-cyber-border rounded-sm px-3 py-2 font-mono text-sm text-cyber-text outline-none focus:border-cyber-cyan"
            placeholder={data.cipherType === 'caesar' ? 'Enter shift (0-25)' : 'Enter key'}
          />
        </div>

        {/* Decrypted preview */}
        <div className="w-full max-w-lg">
          <label className="font-mono text-[10px] text-cyber-muted tracking-wider">DECRYPTED OUTPUT</label>
          <div
            className={cn(
              'mt-1 p-3 border rounded-sm font-mono text-sm tracking-wider break-all',
              solved
                ? 'bg-cyber-green/10 border-cyber-green text-cyber-green'
                : 'bg-cyber-panel border-cyber-border text-cyber-text',
            )}
          >
            {decrypted || '...'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!decrypted || solved}
            className="px-6 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-mono text-xs hover:bg-cyber-cyan/20 disabled:opacity-40 transition-all"
          >
            DECRYPT
          </button>
          {data.hints.length > 0 && showHintIndex < data.hints.length && (
            <button
              onClick={() => setShowHintIndex((i) => i + 1)}
              className="px-4 py-2 border border-cyber-amber text-cyber-amber font-mono text-xs hover:bg-cyber-amber/10 transition-all"
            >
              HINT ({showHintIndex}/{data.hints.length})
            </button>
          )}
        </div>

        {/* Hints */}
        {showHintIndex > 0 && (
          <div className="w-full max-w-lg space-y-1">
            {data.hints.slice(0, showHintIndex).map((hint, i) => (
              <p key={i} className="font-mono text-xs text-cyber-amber">
                Hint {i + 1}: {hint}
              </p>
            ))}
          </div>
        )}

        {/* Success */}
        {solved && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <p className="font-mono text-lg text-cyber-green text-glow-green">DECRYPTION COMPLETE</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
