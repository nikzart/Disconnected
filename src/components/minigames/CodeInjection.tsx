import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { MinigameConfig, MinigameResult, CodeInjectionData } from '@/types/minigame'
import { cn } from '@/lib/utils'

interface CodeInjectionProps {
  config: MinigameConfig
  onComplete: (result: MinigameResult) => void
}

export function CodeInjection({ config, onComplete }: CodeInjectionProps) {
  const data = config.data as CodeInjectionData
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(data.injectionPoints.map((p) => [p.id, ''])),
  )
  const [activePoint, setActivePoint] = useState<string | null>(null)
  const [showHints, setShowHints] = useState<Set<string>>(new Set())
  const [result, setResult] = useState<'success' | 'error' | null>(null)

  const handleValueChange = useCallback((pointId: string, value: string) => {
    setValues((prev) => ({ ...prev, [pointId]: value }))
  }, [])

  const handleSubmit = useCallback(() => {
    const allCorrect = data.injectionPoints.every(
      (point) => values[point.id]?.trim().toLowerCase() === point.correctValue.toLowerCase(),
    )

    if (allCorrect) {
      setResult('success')
      onComplete('success')
    } else {
      setResult('error')
      setTimeout(() => setResult(null), 1500)
    }
  }, [data.injectionPoints, values, onComplete])

  const toggleHint = (pointId: string) => {
    setShowHints((prev) => {
      const next = new Set(prev)
      if (next.has(pointId)) next.delete(pointId)
      else next.add(pointId)
      return next
    })
  }

  // Build code display with injection points
  const lines = data.code.split('\n')

  return (
    <div className="h-full flex flex-col bg-cyber-black">
      <div className="px-4 py-2 border-b border-cyber-border">
        <h2 className="font-mono text-sm text-cyber-cyan tracking-wider">CODE INJECTION</h2>
        <p className="font-mono text-xs text-cyber-muted">{config.description}</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Code view */}
        <div className="flex-1 overflow-auto p-4">
          <pre className="font-code text-xs leading-relaxed">
            {lines.map((line, i) => {
              const point = data.injectionPoints.find((p) => p.line === i + 1)
              return (
                <div key={i} className="flex">
                  <span className="text-cyber-muted/30 w-8 text-right mr-4 select-none">
                    {i + 1}
                  </span>
                  <span className="text-cyber-text whitespace-pre">
                    {point ? (
                      <>
                        {line.split(point.placeholder)[0]}
                        <span
                          className={cn(
                            'inline-block min-w-[120px] border-b-2 mx-1 px-1 cursor-pointer',
                            activePoint === point.id
                              ? 'border-cyber-cyan bg-cyber-cyan/10'
                              : values[point.id]
                                ? 'border-cyber-amber bg-cyber-amber/5'
                                : 'border-cyber-muted/30',
                          )}
                          onClick={() => setActivePoint(point.id)}
                        >
                          {values[point.id] || (
                            <span className="text-cyber-muted/40">{point.placeholder}</span>
                          )}
                        </span>
                        {line.split(point.placeholder)[1]}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              )
            })}
          </pre>
        </div>

        {/* Injection panel */}
        <div className="w-64 border-l border-cyber-border p-4 overflow-y-auto">
          <h3 className="font-mono text-xs text-cyber-muted tracking-wider mb-3">
            INJECTION POINTS
          </h3>
          <div className="space-y-3">
            {data.injectionPoints.map((point) => (
              <div
                key={point.id}
                className={cn(
                  'p-2 border rounded-sm cursor-pointer transition-all',
                  activePoint === point.id
                    ? 'border-cyber-cyan bg-cyber-cyan/5'
                    : 'border-cyber-border hover:border-cyber-border',
                )}
                onClick={() => setActivePoint(point.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-cyber-cyan">
                    Line {point.line}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleHint(point.id) }}
                    className="font-mono text-[10px] text-cyber-amber hover:underline"
                  >
                    HINT
                  </button>
                </div>
                <input
                  value={values[point.id]}
                  onChange={(e) => handleValueChange(point.id, e.target.value)}
                  placeholder={point.placeholder}
                  className="w-full bg-cyber-black border border-cyber-border rounded-sm px-2 py-1 font-code text-xs text-cyber-text placeholder-cyber-muted/30 outline-none focus:border-cyber-cyan"
                />
                {showHints.has(point.id) && (
                  <p className="font-mono text-[10px] text-cyber-amber mt-1">
                    {point.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-mono text-xs hover:bg-cyber-cyan/20 transition-all"
          >
            EXECUTE INJECTION
          </button>

          {result === 'success' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs text-cyber-green text-glow-green text-center mt-2"
            >
              INJECTION SUCCESSFUL
            </motion.p>
          )}
          {result === 'error' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs text-cyber-red text-glow-red text-center mt-2"
            >
              INJECTION FAILED — CHECK VALUES
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
