import { useGameStore } from '@/stores/gameStore'
import { useChatStore } from '@/stores/chatStore'
import { CHARACTERS, type CharacterId } from '@/types/characters'
import { User, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SidePanel() {
  const setView = useGameStore((s) => s.setView)
  const contacts = useChatStore((s) => s.contacts)
  const unreadCounts = useChatStore((s) => s.unreadCounts)
  const activeContact = useChatStore((s) => s.activeContact)
  const setActiveContact = useChatStore((s) => s.setActiveContact)
  const objectives = useGameStore((s) => s.objectives)
  const chapter = useGameStore((s) => s.chapter)

  const activeObjectives = objectives.filter((o) => !o.completed && o.chapter === chapter && !o.hidden)
  const completedObjectives = objectives.filter((o) => o.completed && o.chapter === chapter)

  const handleContactClick = (id: CharacterId) => {
    setActiveContact(id)
    setView('chat')
  }

  return (
    <div className="w-56 bg-cyber-dark/60 border-r border-cyber-border flex flex-col shrink-0 overflow-hidden">
      {/* Contacts */}
      <div className="border-b border-cyber-border">
        <div className="px-3 py-2 flex items-center gap-2">
          <User size={12} className="text-cyber-cyan" />
          <span className="font-mono text-[10px] text-cyber-cyan tracking-wider uppercase">
            Contacts
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="px-3 py-2 text-[10px] font-mono text-cyber-muted italic">
              No contacts yet
            </div>
          ) : (
            contacts.map((id) => {
              const char = CHARACTERS[id]
              const unread = unreadCounts[id] || 0
              return (
                <button
                  key={id}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors',
                    'hover:bg-cyber-border/30',
                    activeContact === id && 'bg-cyber-cyan/10',
                  )}
                  onClick={() => handleContactClick(id)}
                >
                  <Circle
                    size={6}
                    className={cn(
                      'fill-current',
                      activeContact === id ? 'text-cyber-green' : 'text-cyber-muted',
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs text-cyber-text truncate">
                      {char.codename || char.name}
                    </div>
                  </div>
                  {unread > 0 && (
                    <span className="font-mono text-[10px] bg-cyber-cyan/20 text-cyber-cyan px-1.5 rounded-sm">
                      {unread}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Objectives */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 flex items-center gap-2">
          <ChevronRight size={12} className="text-cyber-amber" />
          <span className="font-mono text-[10px] text-cyber-amber tracking-wider uppercase">
            Objectives
          </span>
        </div>
        <div className="px-3 pb-2 space-y-1">
          {activeObjectives.map((obj) => (
            <div key={obj.id} className="flex items-start gap-2">
              <span className="text-cyber-amber font-mono text-[10px] mt-0.5">[ ]</span>
              <span className="font-mono text-[10px] text-cyber-text leading-tight">
                {obj.title}
              </span>
            </div>
          ))}
          {completedObjectives.map((obj) => (
            <div key={obj.id} className="flex items-start gap-2 opacity-40">
              <span className="text-cyber-green font-mono text-[10px] mt-0.5">[x]</span>
              <span className="font-mono text-[10px] text-cyber-muted leading-tight line-through">
                {obj.title}
              </span>
            </div>
          ))}
          {activeObjectives.length === 0 && completedObjectives.length === 0 && (
            <div className="text-[10px] font-mono text-cyber-muted italic">
              No objectives yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
