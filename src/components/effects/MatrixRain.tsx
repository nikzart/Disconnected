import { useEffect, useRef } from 'react'
import { COLORS } from '@/lib/constants'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\=+-*&^%$#@!~'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100)
    const speeds: number[] = Array(columns).fill(0).map(() => 0.1 + Math.random() * 0.25)

    let animationId: number

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Lead character is brighter
        const brightness = Math.random()
        if (brightness > 0.98) {
          ctx.fillStyle = '#ffffff'
          ctx.shadowBlur = 8
          ctx.shadowColor = COLORS.cyan
        } else if (brightness > 0.9) {
          ctx.fillStyle = COLORS.cyan
          ctx.shadowBlur = 4
          ctx.shadowColor = COLORS.cyan
        } else {
          ctx.fillStyle = `rgba(0, 255, 213, ${0.15 + Math.random() * 0.3})`
          ctx.shadowBlur = 0
        }

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        drops[i] += speeds[i]

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0
          speeds[i] = 0.1 + Math.random() * 0.25
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  )
}
