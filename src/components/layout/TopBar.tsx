import { useGameStore } from '@/stores/gameStore'
import { ACT_NAMES } from '@/types/game'
import { Shield, Terminal, MessageSquare, Search, Puzzle, Settings } from 'lucide-react'
import type { GameView } from '@/types/game'
import { cn } from '@/lib/utils'

const VIEW_TABS: Array<{ id: GameView; label: string; icon: typeof Terminal }> = [
  { id: 'terminal', label: 'TERMINAL', icon: Terminal },
  { id: 'chat', label: 'COMMS', icon: MessageSquare },
  { id: 'investigation', label: 'BOARD', icon: Search },
  { id: 'minigame', label: 'TOOLS', icon: Puzzle },
  { id: 'dossier', label: 'DOSSIER', icon: Shield },
]

export function TopBar() {
  const chapter = useGameStore((s) => s.chapter)
  const view = useGameStore((s) => s.view)
  const setView = useGameStore((s) => s.setView)
  const setScreen = useGameStore((s) => s.setScreen)
  const objectives = useGameStore((s) => s.objectives)

  const activeObjectives = objectives.filter((o) => !o.completed && o.chapter === chapter && !o.hidden)

  return (
    <div className="h-10 bg-cyber-dark/90 border-b border-cyber-border flex items-center justify-between px-4 shrink-0">
      {/* Left: Chapter info */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-cyber-cyan tracking-wider">
          ACT {chapter}: {ACT_NAMES[chapter]}
        </span>
        {activeObjectives.length > 0 && (
          <span className="font-mono text-xs text-cyber-muted">
            // {activeObjectives[0].title}
          </span>
        )}
      </div>

      {/* Center: View tabs */}
      <div className="flex items-center gap-1">
        {VIEW_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-all duration-150',
              'border border-transparent rounded-sm',
              view === id
                ? 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30'
                : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/30',
            )}
          >
            <Icon size={12} />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Right: Settings */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setScreen('pause')}
          className="text-cyber-muted hover:text-cyber-text transition-colors p-1"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  )
}
