import { useRef, useState, useCallback } from 'react'
import { useInvestigationStore } from '@/stores/investigationStore'
import { cn } from '@/lib/utils'
import { ZoomIn, ZoomOut, Filter } from 'lucide-react'
import type { Clue, ClueConnection } from '@/types/investigation'

const CHAIN_COLORS = {
  murder: '#ff3333',
  lethe: '#00ffd5',
  coverup: '#ff00ff',
}

const TYPE_ICONS = {
  document: '[ DOC ]',
  email: '[ MAIL ]',
  photo: '[ IMG ]',
  recording: '[ AUD ]',
  data: '[ DAT ]',
  testimony: '[ TST ]',
  code: '[ COD ]',
}

export function InvestigationBoard() {
  const {
    clues,
    connections,
    selectedClue,
    boardOffset,
    boardZoom,
    setSelectedClue,
    setBoardOffset,
    setBoardZoom,
    updateCluePosition,
  } = useInvestigationStore()

  const boardRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggingClue, setDraggingClue] = useState<string | null>(null)

  const discoveredClues = clues.filter((c) => c.discovered)
  const discoveredConnections = connections.filter((c) => c.discovered)

  const handleBoardMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === boardRef.current || (e.target as HTMLElement).classList.contains('board-bg')) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - boardOffset.x, y: e.clientY - boardOffset.y })
    }
  }, [boardOffset])

  const handleBoardMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setBoardOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
    if (draggingClue) {
      const rect = boardRef.current?.getBoundingClientRect()
      if (rect) {
        updateCluePosition(
          draggingClue,
          (e.clientX - rect.left - boardOffset.x) / boardZoom,
          (e.clientY - rect.top - boardOffset.y) / boardZoom,
        )
      }
    }
  }, [isDragging, dragStart, draggingClue, boardOffset, boardZoom, setBoardOffset, updateCluePosition])

  const handleBoardMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggingClue(null)
  }, [])

  const getCluePosition = (clue: Clue) =>
    clue.position || { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 }

  const renderConnection = (conn: ClueConnection) => {
    const fromClue = discoveredClues.find((c) => c.id === conn.from)
    const toClue = discoveredClues.find((c) => c.id === conn.to)
    if (!fromClue || !toClue) return null

    const from = getCluePosition(fromClue)
    const to = getCluePosition(toClue)

    return (
      <line
        key={conn.id}
        x1={from.x + 60}
        y1={from.y + 30}
        x2={to.x + 60}
        y2={to.y + 30}
        stroke="rgba(0,255,213,0.3)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-cyber-black relative overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-cyber-border flex items-center justify-between bg-cyber-dark/50">
        <span className="font-mono text-xs text-cyber-cyan tracking-wider">
          INVESTIGATION BOARD — {discoveredClues.length} clues
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBoardZoom(Math.min(boardZoom + 0.1, 2))}
            className="text-cyber-muted hover:text-cyber-text p-1"
          >
            <ZoomIn size={14} />
          </button>
          <span className="font-mono text-[10px] text-cyber-muted">
            {Math.round(boardZoom * 100)}%
          </span>
          <button
            onClick={() => setBoardZoom(Math.max(boardZoom - 0.1, 0.3))}
            className="text-cyber-muted hover:text-cyber-text p-1"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Board area */}
      <div
        ref={boardRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing board-bg"
        onMouseDown={handleBoardMouseDown}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={handleBoardMouseUp}
        onMouseLeave={handleBoardMouseUp}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(26,26,46,0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div
          style={{
            transform: `translate(${boardOffset.x}px, ${boardOffset.y}px) scale(${boardZoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none">
            {discoveredConnections.map(renderConnection)}
          </svg>

          {/* Clue cards */}
          {discoveredClues.map((clue) => {
            const pos = getCluePosition(clue)
            return (
              <div
                key={clue.id}
                className={cn(
                  'absolute w-[120px] cursor-pointer transition-shadow duration-150',
                  'bg-cyber-panel border rounded-sm p-2',
                  selectedClue === clue.id
                    ? 'border-cyber-cyan shadow-[0_0_8px_rgba(0,255,213,0.3)] z-10'
                    : 'border-cyber-border hover:border-cyber-cyan/30',
                )}
                style={{
                  left: pos.x,
                  top: pos.y,
                  borderLeftColor: CHAIN_COLORS[clue.chain],
                  borderLeftWidth: '3px',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedClue(selectedClue === clue.id ? null : clue.id)
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  setDraggingClue(clue.id)
                }}
              >
                <div className="font-mono text-[8px] text-cyber-muted mb-1">
                  {TYPE_ICONS[clue.type]}
                </div>
                <div className="font-mono text-[10px] text-cyber-text leading-tight truncate">
                  {clue.title}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {discoveredClues.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Filter size={24} className="text-cyber-muted/30 mx-auto mb-2" />
              <p className="font-mono text-sm text-cyber-muted">No clues discovered yet</p>
              <p className="font-mono text-xs text-cyber-muted/60 mt-1">
                Use the terminal to investigate
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected clue detail */}
      {selectedClue && (() => {
        const clue = discoveredClues.find((c) => c.id === selectedClue)
        if (!clue) return null
        return (
          <div className="absolute right-0 top-[41px] bottom-0 w-64 bg-cyber-dark/95 border-l border-cyber-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span
                className="font-mono text-[10px] tracking-wider uppercase"
                style={{ color: CHAIN_COLORS[clue.chain] }}
              >
                {clue.chain}
              </span>
              <button
                onClick={() => setSelectedClue(null)}
                className="font-mono text-xs text-cyber-muted hover:text-cyber-text"
              >
                [X]
              </button>
            </div>
            <h3 className="font-mono text-sm text-cyber-cyan mb-2">{clue.title}</h3>
            <p className="font-mono text-xs text-cyber-text leading-relaxed mb-3">
              {clue.description}
            </p>
            <div className="font-mono text-[10px] text-cyber-muted bg-cyber-black/50 p-2 rounded-sm whitespace-pre-wrap">
              {clue.content}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
