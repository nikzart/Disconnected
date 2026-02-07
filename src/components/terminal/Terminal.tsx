import { useEffect, useRef, useCallback } from 'react'
import { useTerminalStore } from '@/stores/terminalStore'
import { useGameStore } from '@/stores/gameStore'
import { executeCommand, getCompletions } from '@/engine/TerminalEngine'
import { cn } from '@/lib/utils'
import { MACHINES } from '@/data/terminal/filesystems'

export function Terminal() {
  const {
    currentMachine,
    currentPath,
    history,
    inputValue,
    isProcessing,
    tabCompletions,
    showTabCompletions,
    setInputValue,
    addLine,
    addLines,
    clearHistory,
    addCommandToHistory,
    navigateHistory,
    setCurrentMachine,
    setCurrentPath,
    setIsProcessing,
    setTabCompletions,
    setShowTabCompletions,
  } = useTerminalStore()

  const setView = useGameStore((s) => s.setView)
  const setFlag = useGameStore((s) => s.setFlag)
  const flags = useGameStore((s) => s.flags)
  const addNotification = useGameStore((s) => s.addNotification)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasShownMotd = useRef(false)

  // Show MOTD on first mount
  useEffect(() => {
    if (!hasShownMotd.current) {
      hasShownMotd.current = true
      const machine = MACHINES[currentMachine]
      if (machine?.motd) {
        addLines(machine.motd.split('\n').map((line) => ({ type: 'system', content: line })))
      }
    }
  }, [currentMachine, addLines])

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [history])

  // Focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleAction = useCallback((action: { type: string; target: string; value?: string | number | boolean }) => {
    switch (action.type) {
      case 'trigger':
        // Story triggers (clue discovery, contact unlock, etc.)
        setFlag(action.target, true)
        if (action.target.startsWith('clue_')) {
          addNotification({
            id: action.target,
            type: 'clue',
            title: 'Clue Discovered',
            message: action.target.replace('clue_', '').replace(/_/g, ' '),
            timestamp: Date.now(),
          })
        }
        if (action.target.startsWith('contact_unlock_')) {
          addNotification({
            id: action.target,
            type: 'info',
            title: 'New Contact',
            message: `Contact added to your list`,
            timestamp: Date.now(),
          })
        }
        break
      case 'set_view':
        setView(action.target as 'terminal' | 'chat' | 'investigation' | 'minigame' | 'cutscene' | 'dossier')
        break
      case 'trigger_minigame':
        setView('minigame')
        break
      case 'set_flag':
        setFlag(action.target, action.value !== false)
        break
      default:
        break
    }
  }, [setFlag, setView, addNotification])

  const handleSubmit = useCallback(() => {
    if (isProcessing) return
    const command = inputValue.trim()
    if (!command) return

    const prompt = getPrompt()
    addLine('input', `${prompt}${command}`)
    addCommandToHistory(command)
    setInputValue('')
    setShowTabCompletions(false)
    setIsProcessing(true)

    // Simulate slight delay for "processing"
    setTimeout(() => {
      const result = executeCommand(command, { currentMachine, currentPath, flags })

      // Handle clear
      if (result.lines.some((l) => l.content === '__CLEAR__')) {
        clearHistory()
      } else {
        addLines(result.lines)
      }

      // Handle path changes
      if (result.newPath) setCurrentPath(result.newPath)
      if (result.newMachine) {
        setCurrentMachine(result.newMachine)
        // Grant access flag when SSH succeeds
        setFlag(`access_${result.newMachine}`, true)
      }

      // Handle actions
      if (result.actions) {
        result.actions.forEach(handleAction)
      }

      setIsProcessing(false)
    }, 50 + Math.random() * 100)
  }, [
    inputValue, isProcessing, currentMachine, currentPath, flags,
    addLine, addLines, clearHistory, addCommandToHistory, setInputValue,
    setCurrentMachine, setCurrentPath, setIsProcessing, handleAction,
    setShowTabCompletions, setFlag,
  ])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        handleSubmit()
        break
      case 'ArrowUp': {
        e.preventDefault()
        const prev = navigateHistory('up')
        setInputValue(prev)
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        const next = navigateHistory('down')
        setInputValue(next)
        break
      }
      case 'Tab': {
        e.preventDefault()
        const completions = getCompletions(inputValue, { currentMachine, currentPath, flags })

        if (completions.length === 1) {
          const parts = inputValue.split(/\s+/)
          parts[parts.length - 1] = completions[0]
          setInputValue(parts.join(' ') + ' ')
          setShowTabCompletions(false)
        } else if (completions.length > 1) {
          setTabCompletions(completions)
          setShowTabCompletions(true)
        }
        break
      }
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault()
          setInputValue('')
          addLine('input', `${getPrompt()}^C`)
        }
        break
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault()
          clearHistory()
        }
        break
      default:
        setShowTabCompletions(false)
    }
  }, [
    handleSubmit, navigateHistory, inputValue, currentMachine, currentPath, flags,
    setInputValue, setTabCompletions, setShowTabCompletions, addLine, clearHistory,
  ])

  const getPrompt = () => {
    const hostname = MACHINES[currentMachine]?.hostname || currentMachine
    const path = currentPath.join('/')
    return `echo@${hostname}:${path}$ `
  }

  const getLineColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-cyber-red'
      case 'system': return 'text-cyber-cyan'
      case 'success': return 'text-cyber-green'
      case 'warning': return 'text-cyber-amber'
      case 'input': return 'text-cyber-text'
      case 'ascii': return 'text-cyber-cyan'
      default: return 'text-cyber-text/80'
    }
  }

  return (
    <div
      className="h-full flex flex-col bg-cyber-black/50 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2">
        {history.map((line) => (
          <div
            key={line.id}
            className={cn(
              'whitespace-pre-wrap break-all leading-relaxed',
              getLineColor(line.type),
              line.type === 'input' && 'text-cyber-green',
            )}
          >
            {line.content}
          </div>
        ))}

        {/* Tab completions */}
        {showTabCompletions && tabCompletions.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-0 text-cyber-muted text-xs mt-1 mb-1">
            {tabCompletions.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center px-4 py-2 border-t border-cyber-border/30">
        <span className="text-cyber-green whitespace-pre shrink-0">{getPrompt()}</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-cyber-text outline-none caret-cyber-cyan"
          spellCheck={false}
          autoComplete="off"
          autoFocus
        />
        <span className="w-2 h-4 bg-cyber-cyan animate-blink ml-0.5" />
      </div>
    </div>
  )
}
