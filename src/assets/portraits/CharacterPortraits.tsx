import type { CharacterId, Expression } from '@/types/characters'

interface PortraitProps {
  character: CharacterId
  expression?: Expression
  size?: number
  className?: string
}

export function CharacterPortrait({ character, expression = 'neutral', size = 80, className }: PortraitProps) {
  const colors = CHARACTER_COLORS[character]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill={colors.bg} stroke={colors.accent} strokeWidth="1.5" opacity="0.8" />

      {/* Head shape */}
      <ellipse cx="50" cy="42" rx="22" ry="26" fill={colors.skin} />

      {/* Hair */}
      <HairStyle character={character} color={colors.hair} />

      {/* Eyes */}
      <Eyes expression={expression} color={colors.accent} />

      {/* Mouth */}
      <Mouth expression={expression} />

      {/* Character-specific details */}
      <CharacterDetails character={character} color={colors.accent} />

      {/* Initial letter overlay */}
      <text
        x="50"
        y="90"
        textAnchor="middle"
        fill={colors.accent}
        fontSize="10"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="bold"
        opacity="0.6"
      >
        {CHARACTER_INITIALS[character]}
      </text>
    </svg>
  )
}

function Eyes({ expression, color }: { expression: Expression; color: string }) {
  const eyeY = 38
  const leftEyeX = 42
  const rightEyeX = 58

  switch (expression) {
    case 'angry':
      return (
        <g>
          <line x1={leftEyeX - 4} y1={eyeY - 3} x2={leftEyeX + 4} y2={eyeY} stroke={color} strokeWidth="2" />
          <line x1={rightEyeX - 4} y1={eyeY} x2={rightEyeX + 4} y2={eyeY - 3} stroke={color} strokeWidth="2" />
          <circle cx={leftEyeX} cy={eyeY + 1} r="2" fill={color} />
          <circle cx={rightEyeX} cy={eyeY + 1} r="2" fill={color} />
        </g>
      )
    case 'sad':
      return (
        <g>
          <line x1={leftEyeX - 3} y1={eyeY - 2} x2={leftEyeX + 3} y2={eyeY} stroke={color} strokeWidth="1.5" />
          <line x1={rightEyeX - 3} y1={eyeY} x2={rightEyeX + 3} y2={eyeY - 2} stroke={color} strokeWidth="1.5" />
          <circle cx={leftEyeX} cy={eyeY + 1} r="1.5" fill={color} />
          <circle cx={rightEyeX} cy={eyeY + 1} r="1.5" fill={color} />
        </g>
      )
    case 'suspicious':
      return (
        <g>
          <line x1={leftEyeX - 4} y1={eyeY} x2={leftEyeX + 4} y2={eyeY} stroke={color} strokeWidth="2.5" />
          <line x1={rightEyeX - 4} y1={eyeY - 1} x2={rightEyeX + 4} y2={eyeY + 1} stroke={color} strokeWidth="2.5" />
          <circle cx={leftEyeX + 1} cy={eyeY} r="1.5" fill={color} />
          <circle cx={rightEyeX + 1} cy={eyeY} r="1.5" fill={color} />
        </g>
      )
    case 'scared':
      return (
        <g>
          <circle cx={leftEyeX} cy={eyeY} r="4" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={rightEyeX} cy={eyeY} r="4" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={leftEyeX} cy={eyeY} r="2" fill={color} />
          <circle cx={rightEyeX} cy={eyeY} r="2" fill={color} />
        </g>
      )
    case 'smirk':
      return (
        <g>
          <line x1={leftEyeX - 3} y1={eyeY + 1} x2={leftEyeX + 3} y2={eyeY - 1} stroke={color} strokeWidth="2" />
          <circle cx={rightEyeX} cy={eyeY} r="3" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={rightEyeX + 1} cy={eyeY - 1} r="1.5" fill={color} />
        </g>
      )
    case 'determined':
      return (
        <g>
          <line x1={leftEyeX - 3} y1={eyeY - 1} x2={leftEyeX + 3} y2={eyeY} stroke={color} strokeWidth="2" />
          <line x1={rightEyeX - 3} y1={eyeY} x2={rightEyeX + 3} y2={eyeY - 1} stroke={color} strokeWidth="2" />
          <circle cx={leftEyeX} cy={eyeY + 1} r="2.5" fill={color} />
          <circle cx={rightEyeX} cy={eyeY + 1} r="2.5" fill={color} />
        </g>
      )
    default: // neutral, happy
      return (
        <g>
          <circle cx={leftEyeX} cy={eyeY} r="3" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={rightEyeX} cy={eyeY} r="3" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={leftEyeX} cy={eyeY} r="1.5" fill={color} />
          <circle cx={rightEyeX} cy={eyeY} r="1.5" fill={color} />
        </g>
      )
  }
}

function Mouth({ expression }: { expression: Expression }) {
  const y = 50

  switch (expression) {
    case 'happy':
      return <path d="M 43 49 Q 50 55 57 49" fill="none" stroke="#666" strokeWidth="1.5" />
    case 'angry':
      return <line x1="44" y1={y} x2="56" y2={y} stroke="#666" strokeWidth="2" />
    case 'sad':
      return <path d="M 43 52 Q 50 47 57 52" fill="none" stroke="#666" strokeWidth="1.5" />
    case 'scared':
      return <ellipse cx="50" cy={y + 2} rx="4" ry="3" fill="none" stroke="#666" strokeWidth="1.5" />
    case 'smirk':
      return <path d="M 44 50 Q 52 54 58 49" fill="none" stroke="#666" strokeWidth="1.5" />
    default:
      return <line x1="45" y1={y} x2="55" y2={y} stroke="#666" strokeWidth="1.5" />
  }
}

function HairStyle({ character, color }: { character: CharacterId; color: string }) {
  switch (character) {
    case 'maya':
      return (
        <g>
          <path d="M 28 38 Q 28 14 50 14 Q 72 14 72 38" fill={color} />
          <path d="M 28 38 L 26 56" stroke={color} strokeWidth="4" />
          <path d="M 72 38 L 74 56" stroke={color} strokeWidth="4" />
        </g>
      )
    case 'vasquez':
      return <path d="M 30 40 Q 30 12 50 12 Q 70 12 70 40 L 72 50 Q 60 42 50 42 Q 40 42 28 50 Z" fill={color} />
    case 'prism':
      return (
        <g>
          <path d="M 30 38 Q 30 14 50 14 Q 70 14 70 38" fill={color} />
          <path d="M 30 30 L 25 22" stroke={color} strokeWidth="3" />
          <path d="M 70 30 L 75 22" stroke={color} strokeWidth="3" />
        </g>
      )
    case 'zara':
      return (
        <g>
          <path d="M 28 40 Q 28 12 50 12 Q 72 12 72 40" fill={color} />
          <circle cx="28" cy="42" r="6" fill={color} />
          <circle cx="72" cy="42" r="6" fill={color} />
        </g>
      )
    case 'marcus':
      return <path d="M 32 36 Q 32 18 50 18 Q 68 18 68 36" fill={color} />
    case 'victor':
      return (
        <g>
          <path d="M 32 38 Q 32 16 50 16 Q 68 16 68 38" fill={color} />
          <path d="M 32 38 Q 50 32 68 38" fill={color} />
        </g>
      )
    case 'marsh':
      return (
        <g>
          <path d="M 28 38 Q 28 10 50 10 Q 72 10 72 38" fill={color} />
          <path d="M 28 38 Q 30 45 35 38" fill={color} />
          <path d="M 72 38 Q 70 45 65 38" fill={color} />
        </g>
      )
    case 'ghost':
      return (
        <g>
          <path d="M 34 36 Q 34 20 50 20 Q 66 20 66 36" fill={color} />
          <rect x="36" y="34" width="28" height="3" rx="1" fill="rgba(0,255,213,0.3)" />
        </g>
      )
    default:
      return <path d="M 30 38 Q 30 14 50 14 Q 70 14 70 38" fill={color} />
  }
}

function CharacterDetails({ character, color }: { character: CharacterId; color: string }) {
  switch (character) {
    case 'maya':
      // Headphones
      return (
        <g opacity="0.5">
          <path d="M 28 35 Q 25 35 25 40 L 25 45 Q 25 48 28 48" fill="none" stroke={color} strokeWidth="1.5" />
          <path d="M 72 35 Q 75 35 75 40 L 75 45 Q 75 48 72 48" fill="none" stroke={color} strokeWidth="1.5" />
        </g>
      )
    case 'prism':
      // Glitch overlay
      return (
        <g opacity="0.3">
          <rect x="35" y="36" width="12" height="1" fill={color} />
          <rect x="55" y="42" width="8" height="1" fill={color} />
        </g>
      )
    case 'ghost':
      // Sunglasses
      return (
        <g>
          <rect x="36" y="34" width="12" height="8" rx="1" fill="rgba(0,0,0,0.6)" stroke={color} strokeWidth="0.5" />
          <rect x="52" y="34" width="12" height="8" rx="1" fill="rgba(0,0,0,0.6)" stroke={color} strokeWidth="0.5" />
          <line x1="48" y1="38" x2="52" y2="38" stroke={color} strokeWidth="0.5" />
        </g>
      )
    default:
      return null
  }
}

const CHARACTER_COLORS: Record<CharacterId, { bg: string; skin: string; hair: string; accent: string }> = {
  maya: { bg: '#0d0d14', skin: '#d4a574', hair: '#1a1a2e', accent: '#00ffd5' },
  vasquez: { bg: '#0d0d14', skin: '#c4956a', hair: '#2a1a10', accent: '#ffaa00' },
  prism: { bg: '#0d0d14', skin: '#e8c5a0', hair: '#4a2080', accent: '#ff00ff' },
  zara: { bg: '#0d0d14', skin: '#8b5e3c', hair: '#1a0a00', accent: '#ffaa00' },
  marcus: { bg: '#0d0d14', skin: '#d4a574', hair: '#3a2a1a', accent: '#4488ff' },
  victor: { bg: '#0d0d14', skin: '#e0c8a8', hair: '#555555', accent: '#ff3333' },
  marsh: { bg: '#0d0d14', skin: '#e0c8a8', hair: '#8a6a30', accent: '#ffaa00' },
  ghost: { bg: '#0d0d14', skin: '#c4a478', hair: '#2a2a2a', accent: '#00ffd5' },
}

const CHARACTER_INITIALS: Record<CharacterId, string> = {
  maya: 'ECHO',
  vasquez: 'LV',
  prism: 'PRISM',
  zara: 'ZO',
  marcus: 'MW',
  victor: 'VH',
  marsh: 'DM',
  ghost: 'GHOST',
}
