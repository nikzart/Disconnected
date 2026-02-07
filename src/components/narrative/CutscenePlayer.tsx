import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { TypewriterText } from '@/components/ui/TypewriterText'
import { GlitchText } from '@/components/ui/GlitchText'
import { ACT_NAMES } from '@/types/game'
import { storyEngine } from '@/engine/StoryEngine'

interface CutsceneLine {
  text: string
  delay?: number
  style?: 'normal' | 'system' | 'glitch' | 'emphasis'
}

const CHAPTER_INTROS: Record<number, CutsceneLine[]> = {
  1: [
    { text: '> INITIALIZING SECURE CONNECTION...', style: 'system' },
    { text: '> ENCRYPTED CHANNEL ESTABLISHED', style: 'system', delay: 800 },
    { text: '', delay: 500 },
    { text: 'February 14, 2027', style: 'emphasis', delay: 300 },
    { text: '03:47 AM EST', style: 'emphasis', delay: 200 },
    { text: '', delay: 500 },
    { text: 'You wake to the sound of your terminal.', delay: 300 },
    { text: 'A new encrypted message. Unknown sender.', delay: 300 },
    { text: '', delay: 300 },
    { text: '"Dr. Vasquez didn\'t kill herself.', style: 'emphasis', delay: 500 },
    { text: 'They\'re erasing everything.', style: 'emphasis', delay: 300 },
    { text: 'Start with her files. Trust no one."', style: 'emphasis', delay: 300 },
    { text: '', delay: 500 },
    { text: '— PRISM', style: 'glitch', delay: 300 },
    { text: '', delay: 800 },
    { text: 'Your hands hover over the keyboard.', delay: 300 },
    { text: 'Lena is dead. And someone wants you to find out why.', delay: 300 },
  ],
}

export function CutscenePlayer() {
  const chapter = useGameStore((s) => s.chapter)
  const setView = useGameStore((s) => s.setView)
  const [currentLine, setCurrentLine] = useState(0)
  const [completedLines, setCompletedLines] = useState<number[]>([])
  const lines = CHAPTER_INTROS[chapter] || CHAPTER_INTROS[1]

  const advanceLine = useCallback(() => {
    setCompletedLines((prev) => [...prev, currentLine])
    if (currentLine < lines.length - 1) {
      setCurrentLine((prev) => prev + 1)
    }
  }, [currentLine, lines.length])

  const handleComplete = useCallback(() => {
    const delay = lines[currentLine]?.delay ?? 100
    setTimeout(advanceLine, delay)
  }, [advanceLine, currentLine, lines])

  const handleSkip = () => {
    // Start the story from ch1_wake_up (after the intro cutscene)
    storyEngine.processNode(chapter, 'ch1_wake_up')
    setView('terminal')
  }

  // Auto-advance empty lines
  useEffect(() => {
    if (lines[currentLine]?.text === '') {
      const delay = lines[currentLine]?.delay ?? 300
      const timer = setTimeout(advanceLine, delay)
      return () => clearTimeout(timer)
    }
  }, [currentLine, lines, advanceLine])

  const allDone = completedLines.length >= lines.length

  return (
    <div className="h-full w-full bg-cyber-black flex flex-col items-center justify-center px-8 relative">
      {/* Chapter title */}
      <motion.div
        className="absolute top-8 left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="font-mono text-xs text-cyber-muted tracking-widest">
          ACT {chapter}
        </div>
        <div className="font-mono text-lg text-cyber-cyan text-glow-cyan tracking-wider mt-1">
          {ACT_NAMES[chapter]}
        </div>
      </motion.div>

      {/* Lines */}
      <div className="max-w-2xl w-full space-y-2">
        <AnimatePresence>
          {lines.slice(0, currentLine + 1).map((line, i) => {
            if (line.text === '') return <div key={i} className="h-4" />

            const isCompleted = completedLines.includes(i)
            const isCurrent = i === currentLine

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {line.style === 'system' ? (
                  <p className="font-mono text-xs text-cyber-green text-glow-green">
                    {isCompleted ? line.text : (
                      <TypewriterText text={line.text} onComplete={isCurrent ? handleComplete : undefined} showCursor={false} />
                    )}
                  </p>
                ) : line.style === 'glitch' ? (
                  <GlitchText
                    text={isCompleted ? line.text : ''}
                    className="font-mono text-sm text-cyber-magenta text-glow-magenta"
                    continuous
                    intensity="low"
                  />
                ) : line.style === 'emphasis' ? (
                  <p className="font-mono text-sm text-cyber-cyan">
                    {isCompleted ? line.text : (
                      <TypewriterText text={line.text} onComplete={isCurrent ? handleComplete : undefined} showCursor={false} />
                    )}
                  </p>
                ) : (
                  <p className="font-mono text-sm text-cyber-text">
                    {isCompleted ? line.text : (
                      <TypewriterText text={line.text} onComplete={isCurrent ? handleComplete : undefined} showCursor={false} />
                    )}
                  </p>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Skip / Continue */}
      <div className="absolute bottom-8 right-8">
        {allDone ? (
          <motion.button
            className="font-mono text-sm text-cyber-cyan hover:text-glow-cyan transition-all"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {'>'} BEGIN_SESSION [ENTER]
          </motion.button>
        ) : (
          <button
            className="font-mono text-xs text-cyber-muted hover:text-cyber-text transition-colors"
            onClick={handleSkip}
          >
            SKIP [ESC]
          </button>
        )}
      </div>
    </div>
  )
}
