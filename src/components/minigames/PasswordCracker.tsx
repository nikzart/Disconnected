import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { MinigameConfig, MinigameResult, PasswordCrackerData } from '@/types/minigame'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'

interface PasswordCrackerProps {
  config: MinigameConfig
  onComplete: (result: MinigameResult) => void
}

export function PasswordCracker({ config, onComplete }: PasswordCrackerProps) {
  const data = config.data as PasswordCrackerData
  const [guess, setGuess] = useState('')
  const [, setAttempts] = useState<string[]>([])
  const [detection, setDetection] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit || 60)
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState<Array<{ char: string; status: 'correct' | 'present' | 'absent' }[]>>([])

  const maxDetection = config.detectionLimit || 100

  useEffect(() => {
    if (solved || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          onComplete('timeout')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [solved, timeLeft, onComplete])

  const checkGuess = useCallback(() => {
    if (guess.length !== data.length || solved) return

    const upperGuess = guess.toUpperCase()
    const upperAnswer = data.answer.toUpperCase()

    if (upperGuess === upperAnswer) {
      setSolved(true)
      onComplete('success')
      return
    }

    // Check each character
    const result = upperGuess.split('').map((char, i) => {
      if (char === upperAnswer[i]) return { char, status: 'correct' as const }
      if (upperAnswer.includes(char)) return { char, status: 'present' as const }
      return { char, status: 'absent' as const }
    })

    setFeedback((prev) => [...prev, result])
    setAttempts((prev) => [...prev, upperGuess])
    setDetection((d) => Math.min(d + 15, maxDetection))
    setGuess('')

    if (detection + 15 >= maxDetection) {
      onComplete('failure')
    }
  }, [guess, data, solved, detection, maxDetection, onComplete])

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-cyber-black">
      <div className="w-full max-w-md">
        <h2 className="font-mono text-sm text-cyber-cyan text-glow-cyan tracking-wider mb-1">
          PASSWORD CRACKER
        </h2>
        <p className="font-mono text-xs text-cyber-muted mb-4">{config.description}</p>

        {/* Status bars */}
        <div className="flex gap-4 mb-6">
          <ProgressBar
            value={timeLeft}
            max={config.timeLimit || 60}
            color="cyan"
            label="TIME"
            showValue
            className="flex-1"
          />
          <ProgressBar
            value={detection}
            max={maxDetection}
            color="red"
            label="DETECTION"
            showValue
            className="flex-1"
          />
        </div>

        {/* Hints */}
        {data.hints.length > 0 && (
          <div className="mb-4 p-2 bg-cyber-panel border border-cyber-border rounded-sm">
            <span className="font-mono text-[10px] text-cyber-amber">HINTS:</span>
            {data.hints.map((hint, i) => (
              <p key={i} className="font-mono text-xs text-cyber-muted mt-1">
                - {hint}
              </p>
            ))}
          </div>
        )}

        {/* Previous attempts */}
        <div className="space-y-2 mb-4">
          {feedback.map((row, i) => (
            <div key={i} className="flex gap-1 justify-center">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center font-mono text-sm font-bold border',
                    cell.status === 'correct' && 'bg-cyber-green/20 border-cyber-green text-cyber-green',
                    cell.status === 'present' && 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber',
                    cell.status === 'absent' && 'bg-cyber-border/30 border-cyber-border text-cyber-muted',
                  )}
                >
                  {cell.char}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Input */}
        {!solved && detection < maxDetection && timeLeft > 0 && (
          <div className="flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value.slice(0, data.length))}
              onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
              placeholder={`Enter ${data.length}-char password`}
              className="flex-1 bg-cyber-panel border border-cyber-border rounded-sm px-3 py-2 font-mono text-sm text-cyber-text placeholder-cyber-muted/50 outline-none focus:border-cyber-cyan uppercase tracking-widest"
              maxLength={data.length}
              autoFocus
            />
            <button
              onClick={checkGuess}
              disabled={guess.length !== data.length}
              className="px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-mono text-xs hover:bg-cyber-cyan/20 disabled:opacity-40 transition-all"
            >
              CRACK
            </button>
          </div>
        )}

        {/* Result */}
        {solved && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-4"
          >
            <p className="font-mono text-lg text-cyber-green text-glow-green">ACCESS GRANTED</p>
            <p className="font-mono text-xs text-cyber-muted mt-1">Password: {data.answer}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
