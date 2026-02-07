import { CHARACTERS, type CharacterId } from '@/types/characters'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function CharacterDossier() {
  const contacts = useChatStore((s) => s.contacts)
  const [selected, setSelected] = useState<CharacterId | null>(null)

  // Always show maya, plus discovered contacts
  const knownCharacters: CharacterId[] = ['maya', ...contacts.filter((c) => c !== 'maya')]

  const selectedChar = selected ? CHARACTERS[selected] : null

  return (
    <div className="h-full flex bg-cyber-black">
      {/* Character list */}
      <div className="w-48 border-r border-cyber-border overflow-y-auto">
        <div className="px-3 py-2 border-b border-cyber-border">
          <span className="font-mono text-xs text-cyber-cyan tracking-wider">DOSSIER</span>
        </div>
        {knownCharacters.map((id) => {
          const char = CHARACTERS[id]
          return (
            <button
              key={id}
              className={cn(
                'w-full text-left px-3 py-2 border-b border-cyber-border/30 transition-colors',
                'hover:bg-cyber-border/20',
                selected === id && 'bg-cyber-cyan/10 border-l-2 border-l-cyber-cyan',
              )}
              onClick={() => setSelected(id)}
            >
              <div className="font-mono text-xs text-cyber-text">{char.name}</div>
              {char.codename && (
                <div className="font-mono text-[10px] text-cyber-muted">
                  a.k.a. {char.codename}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Detail view */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedChar ? (
          <div className="max-w-lg">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 border border-cyber-border rounded-sm bg-cyber-panel flex items-center justify-center mb-4">
              <span className="font-mono text-2xl text-cyber-cyan">
                {selectedChar.name.charAt(0)}
              </span>
            </div>

            <h2 className="font-mono text-lg text-cyber-cyan mb-1">
              {selectedChar.name}
            </h2>
            {selectedChar.codename && (
              <p className="font-mono text-xs text-cyber-magenta text-glow-magenta mb-2">
                CODENAME: {selectedChar.codename}
              </p>
            )}
            <p className="font-mono text-xs text-cyber-muted mb-4">
              {selectedChar.role}
            </p>

            <div className="border-t border-cyber-border pt-4">
              <h3 className="font-mono text-xs text-cyber-muted tracking-wider mb-2">
                PROFILE
              </h3>
              <p className="font-mono text-sm text-cyber-text leading-relaxed">
                {selectedChar.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="font-mono text-sm text-cyber-muted">Select a character</p>
          </div>
        )}
      </div>
    </div>
  )
}
