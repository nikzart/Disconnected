import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div' | 'p'
  glitchOnHover?: boolean
  continuous?: boolean
  intensity?: 'low' | 'medium' | 'high'
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコ'

export function GlitchText({
  text,
  className,
  as: Tag = 'span',
  glitchOnHover = false,
  continuous = false,
  intensity = 'medium',
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(continuous)

  const glitchFrequency = intensity === 'low' ? 3000 : intensity === 'medium' ? 1500 : 800

  const doGlitch = useCallback(() => {
    const glitchCount = intensity === 'low' ? 1 : intensity === 'medium' ? 2 : 4
    let iterations = 0
    const maxIterations = glitchCount * 3

    const interval = setInterval(() => {
      const chars = text.split('')
      const numGlitched = Math.ceil(chars.length * (intensity === 'low' ? 0.1 : intensity === 'medium' ? 0.2 : 0.4))
      for (let i = 0; i < numGlitched; i++) {
        const idx = Math.floor(Math.random() * chars.length)
        chars[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }
      setDisplayText(chars.join(''))
      iterations++

      if (iterations >= maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [text, intensity])

  useEffect(() => {
    if (!continuous) return
    const timer = setInterval(doGlitch, glitchFrequency)
    return () => clearInterval(timer)
  }, [continuous, doGlitch, glitchFrequency])

  useEffect(() => {
    setDisplayText(text)
  }, [text])

  return (
    <Tag
      className={cn('relative inline-block', className)}
      onMouseEnter={glitchOnHover ? () => { setIsGlitching(true); doGlitch() } : undefined}
      onMouseLeave={glitchOnHover ? () => setIsGlitching(false) : undefined}
    >
      {displayText}
      {(isGlitching || continuous) && (
        <>
          <span
            className="absolute inset-0 text-cyber-cyan opacity-70"
            style={{
              animation: 'glitch-1 0.3s infinite',
              clipPath: 'inset(20% 0 60% 0)',
            }}
            aria-hidden
          >
            {displayText}
          </span>
          <span
            className="absolute inset-0 text-cyber-magenta opacity-70"
            style={{
              animation: 'glitch-2 0.3s infinite',
              clipPath: 'inset(60% 0 20% 0)',
            }}
            aria-hidden
          >
            {displayText}
          </span>
        </>
      )}
    </Tag>
  )
}
