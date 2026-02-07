import { useGameStore } from '@/stores/gameStore'
import { useTerminalStore } from '@/stores/terminalStore'

export function BottomBar() {
  const chapter = useGameStore((s) => s.chapter)
  const currentMachine = useTerminalStore((s) => s.currentMachine)
  const currentPath = useTerminalStore((s) => s.currentPath)

  return (
    <div className="h-6 bg-cyber-dark/90 border-t border-cyber-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] text-cyber-green">
          ECHO@{currentMachine}:{currentPath.join('/')}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] text-cyber-muted">
          CH{chapter} // SECURE_CONN // TAB: autocomplete | ESC: menu
        </span>
      </div>
    </div>
  )
}
