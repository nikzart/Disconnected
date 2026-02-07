import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useGameStore } from '@/stores/gameStore'
import { TEXT_SPEEDS } from '@/lib/constants'

interface TypewriterTextProps {
  text: string
  className?: string
  onComplete?: () => void
  delay?: number
  showCursor?: boolean
  sound?: boolean
}

export function TypewriterText({
  text,
  className,
  onComplete,
  delay = 0,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const textSpeed = useGameStore((s) => s.settings.textSpeed)

  const speed = TEXT_SPEEDS[textSpeed]

  const complete = useCallback(() => {
    setDisplayed(text)
    setIsComplete(true)
    onComplete?.()
  }, [text, onComplete])

  useEffect(() => {
    if (speed === 0) {
      const timer = setTimeout(() => {
        setHasStarted(true)
        complete()
      }, delay)
      return () => clearTimeout(timer)
    }

    const startTimer = setTimeout(() => {
      setHasStarted(true)
      let index = 0

      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [text, speed, delay, onComplete, complete])

  const handleClick = () => {
    if (!isComplete) {
      complete()
    }
  }

  if (!hasStarted) return null

  return (
    <span className={cn('font-mono', className)} onClick={handleClick}>
      {displayed}
      {showCursor && !isComplete && (
        <span className="inline-block w-[0.6em] h-[1.1em] bg-cyber-cyan ml-[1px] align-middle animate-blink" />
      )}
    </span>
  )
}
