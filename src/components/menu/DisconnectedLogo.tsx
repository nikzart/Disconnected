import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const GLITCH_CHARS = '!@#$%^&*<>{}[]|/\\アイウエオカキクケコサシスセソ01▓▒░█▄▀'

const LETTERS = 'DISCONNECTED'.split('')

interface SliceState {
  top: number
  height: number
  offsetX: number
  skew: number
}

export function DisconnectedLogo() {
  const [phase, setPhase] = useState<'boot' | 'scramble' | 'reveal' | 'idle'>('boot')
  const [scrambledLetters, setScrambledLetters] = useState<string[]>(
    LETTERS.map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
  )
  const [revealedCount, setRevealedCount] = useState(0)
  const [glitchFlash, setGlitchFlash] = useState(false)
  const [slices, setSlices] = useState<SliceState[]>([])
  const [chromaOffset, setChromaOffset] = useState({ r: { x: -2, y: 0.5 }, b: { x: 2, y: -0.5 } })
  const [flickerOff, setFlickerOff] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Phase 1: boot delay
  useEffect(() => {
    const t = setTimeout(() => setPhase('scramble'), 600)
    return () => clearTimeout(t)
  }, [])

  // Phase 2: rapid scramble
  useEffect(() => {
    if (phase !== 'scramble') return

    intervalRef.current = setInterval(() => {
      setScrambledLetters(
        LETTERS.map((_, i) =>
          i < revealedCount
            ? LETTERS[i]
            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        )
      )
    }, 50)

    const revealTimer = setTimeout(() => setPhase('reveal'), 900)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearTimeout(revealTimer)
    }
  }, [phase, revealedCount])

  // Phase 3: reveal one letter at a time
  useEffect(() => {
    if (phase !== 'reveal') return

    intervalRef.current = setInterval(() => {
      setScrambledLetters(
        LETTERS.map((_, i) =>
          i < revealedCount
            ? LETTERS[i]
            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        )
      )
    }, 50)

    const letterTimer = setInterval(() => {
      setRevealedCount((c) => {
        if (c >= LETTERS.length) {
          clearInterval(letterTimer)
          setPhase('idle')
          return c
        }
        return c + 1
      })
    }, 100)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearInterval(letterTimer)
    }
  }, [phase, revealedCount])

  // Phase 4: idle — glitch bursts + micro-glitches
  useEffect(() => {
    if (phase !== 'idle') return

    if (intervalRef.current) clearInterval(intervalRef.current)
    setScrambledLetters([...LETTERS])

    // Main glitch loop
    const glitchLoop = setInterval(() => {
      doGlitchBurst()
    }, 1500 + Math.random() * 2000)

    // Micro-glitches — single letter flickers, held longer
    const microGlitchLoop = setInterval(() => {
      const corrupted = [...LETTERS]
      const numCorrupt = 1 + Math.floor(Math.random() * 2)
      for (let j = 0; j < numCorrupt; j++) {
        const idx = Math.floor(Math.random() * corrupted.length)
        corrupted[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }
      setScrambledLetters(corrupted)
      setTimeout(() => setScrambledLetters([...LETTERS]), 120 + Math.random() * 180)
    }, 600 + Math.random() * 1000)

    return () => {
      clearInterval(glitchLoop)
      clearInterval(microGlitchLoop)
    }
  }, [phase])

  const doGlitchBurst = useCallback(() => {
    setGlitchFlash(true)

    // Random horizontal slices
    const numSlices = 2 + Math.floor(Math.random() * 4)
    const newSlices: SliceState[] = Array.from({ length: numSlices }, () => ({
      top: Math.random() * 100,
      height: 2 + Math.random() * 15,
      offsetX: (Math.random() - 0.5) * 20,
      skew: (Math.random() - 0.5) * 4,
    }))
    setSlices(newSlices)

    // Wildly offset chromatic aberration
    setChromaOffset({
      r: { x: -4 - Math.random() * 6, y: (Math.random() - 0.5) * 4 },
      b: { x: 4 + Math.random() * 6, y: (Math.random() - 0.5) * 4 },
    })

    // Occasional full-flicker dropout
    if (Math.random() > 0.65) {
      setFlickerOff(true)
      setTimeout(() => setFlickerOff(false), 50 + Math.random() * 60)
    }

    // Corrupt letters over more frames, each frame held longer
    const burstFrames = 5 + Math.floor(Math.random() * 6)
    let frame = 0
    const burst = setInterval(() => {
      const corrupted = [...LETTERS]
      const numCorrupt = 2 + Math.floor(Math.random() * 5)
      for (let j = 0; j < numCorrupt; j++) {
        const idx = Math.floor(Math.random() * corrupted.length)
        corrupted[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }
      setScrambledLetters(corrupted)

      // Shift chroma each frame for wobbly feel
      setChromaOffset({
        r: { x: -3 - Math.random() * 5, y: (Math.random() - 0.5) * 3 },
        b: { x: 3 + Math.random() * 5, y: (Math.random() - 0.5) * 3 },
      })

      frame++
      if (frame >= burstFrames) {
        clearInterval(burst)
        // Hold the last corrupted frame a beat before resolving
        setTimeout(() => {
          setScrambledLetters([...LETTERS])
          // Ease chroma back to resting position (CSS transition handles smoothing)
          setChromaOffset({ r: { x: -2, y: 0.5 }, b: { x: 2, y: -0.5 } })
          // Fade slices out (transition handles it)
          setSlices([])
          setTimeout(() => setGlitchFlash(false), 80)
        }, 100 + Math.random() * 120)
      }
    }, 70)
  }, [])

  const getLetterDelay = useCallback((i: number) => i * 0.04, [])

  return (
    <div className="relative select-none">
      {/* Deep background glow — pulses during glitch */}
      <div
        className="absolute inset-0 blur-[80px]"
        style={{
          background: glitchFlash
            ? 'radial-gradient(ellipse at center, #00ffd5 0%, rgba(255,0,255,0.2) 40%, transparent 70%)'
            : 'radial-gradient(ellipse at center, #00ffd5 0%, transparent 70%)',
          transform: 'scale(2, 1.5)',
          opacity: flickerOff ? 0 : glitchFlash ? 0.35 : 0.2,
          transition: 'opacity 150ms ease-out, background 200ms ease-out',
        }}
      />

      {/* Horizontal scan line that sweeps across during reveal */}
      {phase === 'reveal' && (
        <motion.div
          className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00ffd5 20%, #ffffff 50%, #00ffd5 80%, transparent 100%)',
            boxShadow: '0 0 20px 4px rgba(0,255,213,0.5)',
          }}
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      )}

      {/* Main letter container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          opacity: flickerOff ? 0 : 1,
          transition: 'opacity 40ms ease-out',
        }}
      >
        {/* Chromatic aberration — RED layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          <div
            className="flex"
            style={{
              transform: `translate(${chromaOffset.r.x}px, ${chromaOffset.r.y}px)`,
              transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {scrambledLetters.map((char, i) => (
              <span
                key={`red-${i}`}
                className="font-mono font-black text-5xl md:text-7xl lg:text-8xl"
                style={{
                  color: `rgba(255, 50, 50, ${glitchFlash ? 0.5 : 0.3})`,
                  mixBlendMode: 'screen',
                  letterSpacing: '0.15em',
                  opacity: phase === 'boot' ? 0 : 1,
                  transition: 'color 100ms ease-out, opacity 200ms ease-out',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Chromatic aberration — BLUE layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          <div
            className="flex"
            style={{
              transform: `translate(${chromaOffset.b.x}px, ${chromaOffset.b.y}px)`,
              transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {scrambledLetters.map((char, i) => (
              <span
                key={`blue-${i}`}
                className="font-mono font-black text-5xl md:text-7xl lg:text-8xl"
                style={{
                  color: `rgba(50, 120, 255, ${glitchFlash ? 0.45 : 0.25})`,
                  mixBlendMode: 'screen',
                  letterSpacing: '0.15em',
                  opacity: phase === 'boot' ? 0 : 1,
                  transition: 'color 100ms ease-out, opacity 200ms ease-out',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Main text layer */}
        <div className="relative flex z-10">
          {scrambledLetters.map((char, i) => {
            const isRevealed = i < revealedCount || phase === 'idle'
            const isJustRevealed = i === revealedCount - 1 && phase === 'reveal'
            const isCorrupted = char !== LETTERS[i]

            return (
              <motion.span
                key={`main-${i}`}
                className={cn(
                  'font-mono font-black text-5xl md:text-7xl lg:text-8xl inline-block',
                )}
                style={{
                  letterSpacing: '0.15em',
                  color: isCorrupted
                    ? '#ff3333'
                    : isRevealed ? '#00ffd5' : 'rgba(0, 255, 213, 0.4)',
                  textShadow: isCorrupted
                    ? '0 0 12px rgba(255,51,51,0.8), 0 0 30px rgba(255,51,51,0.4)'
                    : isJustRevealed
                      ? '0 0 30px #00ffd5, 0 0 60px #00ffd5, 0 0 100px rgba(0,255,213,0.5)'
                      : isRevealed
                        ? '0 0 8px rgba(0,255,213,0.6), 0 0 20px rgba(0,255,213,0.2)'
                        : 'none',
                  transform: glitchFlash && Math.random() > 0.5
                    ? `translateX(${(Math.random() - 0.5) * 8}px) translateY(${(Math.random() - 0.5) * 3}px)`
                    : 'none',
                  transition: 'color 80ms ease-out, text-shadow 120ms ease-out, transform 80ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: phase === 'boot' ? 0 : 1,
                  y: 0,
                  scale: isJustRevealed ? [1, 1.08, 1] : 1,
                }}
                transition={{
                  opacity: { delay: getLetterDelay(i), duration: 0.15 },
                  y: { delay: getLetterDelay(i), duration: 0.3, ease: 'easeOut' },
                  scale: { duration: 0.2, ease: 'easeOut' },
                }}
              >
                {char}
              </motion.span>
            )
          })}
        </div>

        {/* Horizontal slice displacement overlays */}
        {slices.map((slice, i) => (
          <div
            key={`slice-${i}`}
            className="absolute left-0 right-0 z-20 overflow-hidden pointer-events-none"
            style={{
              top: `${slice.top}%`,
              height: `${slice.height}%`,
              transform: `translateX(${slice.offsetX}px) skewX(${slice.skew}deg)`,
              background: 'rgba(0, 255, 213, 0.03)',
              borderTop: '1px solid rgba(0, 255, 213, 0.15)',
              borderBottom: '1px solid rgba(0, 255, 213, 0.08)',
              mixBlendMode: 'screen',
              transition: 'transform 100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms ease-out',
            }}
          />
        ))}
      </div>

      {/* Underline bar */}
      <div
        className="relative mt-3 h-[2px] mx-auto overflow-hidden"
        style={{
          width: '100%',
          opacity: flickerOff ? 0 : 1,
          transition: 'opacity 40ms ease-out',
        }}
      >
        <motion.div
          className="h-full"
          style={{
            background: glitchFlash
              ? 'linear-gradient(90deg, transparent, #ff00ff 15%, #00ffd5 35%, #ffffff 50%, #00ffd5 65%, #ff00ff 85%, transparent)'
              : 'linear-gradient(90deg, transparent, #00ffd5 20%, #ffffff 50%, #00ffd5 80%, transparent)',
            transition: 'background 150ms ease-out',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: phase === 'boot' ? 0 : 1,
            opacity: phase === 'boot' ? 0 : 1,
          }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />
        {/* Shimmer traveling across the bar */}
        {(phase === 'idle') && (
          <motion.div
            className="absolute top-0 h-full w-16"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            }}
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Subtle bracket accents */}
      <AnimatePresence>
        {phase !== 'boot' && (
          <>
            <motion.span
              className="absolute -left-8 top-1/2 -translate-y-1/2 font-mono text-2xl md:text-4xl text-cyber-cyan/20 font-thin"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              {'['}
            </motion.span>
            <motion.span
              className="absolute -right-8 top-1/2 -translate-y-1/2 font-mono text-2xl md:text-4xl text-cyber-cyan/20 font-thin"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              {']'}
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Scanline overlay during glitch bursts */}
      {glitchFlash && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,213,0.04) 1px, rgba(0,255,213,0.04) 3px)',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  )
}
