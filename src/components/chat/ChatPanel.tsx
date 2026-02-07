import { useState, useRef, useEffect } from 'react'
import { useChatStore, type ChatMessage } from '@/stores/chatStore'
import { CHARACTERS, type CharacterId } from '@/types/characters'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'
import { randomId } from '@/lib/utils'

export function ChatPanel() {
  const activeContact = useChatStore((s) => s.activeContact)
  const conversations = useChatStore((s) => s.conversations)
  const addMessage = useChatStore((s) => s.addMessage)
  const suspicionLevel = useChatStore((s) => s.suspicionLevel)
  const trustLevel = useChatStore((s) => s.trustLevel)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = activeContact ? conversations[activeContact] || [] : []
  const contact = activeContact ? CHARACTERS[activeContact] : null

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim() || !activeContact) return

    const playerMsg: ChatMessage = {
      id: randomId(),
      sender: 'player',
      text: inputValue.trim(),
      timestamp: Date.now(),
    }
    addMessage(activeContact, playerMsg)
    setInputValue('')

    // Simple auto-response for now
    setTimeout(() => {
      const response: ChatMessage = {
        id: randomId(),
        sender: activeContact,
        text: getAutoResponse(activeContact, inputValue),
        timestamp: Date.now(),
      }
      addMessage(activeContact, response)
    }, 1000 + Math.random() * 2000)
  }

  if (!activeContact || !contact) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-cyber-muted">No contact selected</p>
          <p className="font-mono text-xs text-cyber-muted/60 mt-2">
            Select a contact from the side panel
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Contact header */}
      <div className="px-4 py-3 border-b border-cyber-border bg-cyber-dark/50 flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm text-cyber-cyan">
            {contact.codename || contact.name}
          </h3>
          <p className="font-mono text-[10px] text-cyber-muted">{contact.role}</p>
        </div>
        {suspicionLevel > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-cyber-red">
              SUSPICION: {suspicionLevel}%
            </span>
            <div className="w-16 h-1 bg-cyber-border rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-red transition-all"
                style={{ width: `${suspicionLevel}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex',
              msg.sender === 'player' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                'max-w-[70%] px-3 py-2 rounded-sm font-mono text-xs',
                msg.sender === 'player'
                  ? 'bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-text'
                  : 'bg-cyber-border/50 border border-cyber-border text-cyber-text',
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Trust bar */}
      <div className="px-4 py-1 border-t border-cyber-border/30 flex items-center gap-2">
        <span className="font-mono text-[10px] text-cyber-muted">TRUST</span>
        <div className="flex-1 h-1 bg-cyber-border rounded-full overflow-hidden">
          <div
            className="h-full bg-cyber-cyan transition-all"
            style={{ width: `${trustLevel}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-cyber-muted">{trustLevel}%</span>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-cyber-border flex items-center gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent font-mono text-sm text-cyber-text placeholder-cyber-muted/50 outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="text-cyber-cyan hover:text-glow-cyan disabled:text-cyber-muted disabled:opacity-40 transition-all p-1"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}

function getAutoResponse(contact: CharacterId, _input: string): string {
  const responses: Record<string, string[]> = {
    prism: [
      'Be careful. They monitor everything.',
      'Check Vasquez\'s files. The truth is there.',
      'I can\'t say more right now. Stay safe.',
      'The encryption key is hidden in plain sight.',
    ],
    zara: [
      'I\'ve been investigating Nexagen for months.',
      'My sources are drying up. They\'re getting scared.',
      'Do you have any hard evidence?',
      'We need to move carefully on this.',
    ],
    marcus: [
      'I shouldn\'t be talking to you...',
      'Hale watches everything. Every login is tracked.',
      'There\'s a backdoor in the LETHE system. I\'ve seen it.',
      'Please don\'t tell anyone about this conversation.',
    ],
  }

  const pool = responses[contact] || ['...']
  return pool[Math.floor(Math.random() * pool.length)]
}
