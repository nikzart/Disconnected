import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { getSaveSlots, saveGame, loadGame, deleteSave } from '@/engine/SaveManager'
import { formatTimestamp, formatPlayTime } from '@/lib/utils'
import type { SaveSlot } from '@/types/game'
import { ACT_NAMES } from '@/types/game'
import { cn } from '@/lib/utils'
import { Save, Download, Trash2 } from 'lucide-react'

interface SaveLoadMenuProps {
  mode: 'save' | 'load'
  onBack: () => void
}

export function SaveLoadMenu({ mode, onBack }: SaveLoadMenuProps) {
  const [slots, setSlots] = useState<SaveSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setSlots(getSaveSlots())
  }, [])

  const handleSave = (slotId: string) => {
    const name = `Manual Save ${slotId}`
    saveGame(slotId, name)
    setSlots(getSaveSlots())
    setMessage('Game saved successfully.')
    setTimeout(() => setMessage(null), 2000)
  }

  const handleLoad = (slotId: string) => {
    const success = loadGame(slotId)
    if (success) {
      setMessage('Game loaded.')
      setTimeout(() => onBack(), 500)
    } else {
      setMessage('Failed to load save.')
    }
    setTimeout(() => setMessage(null), 2000)
  }

  const handleDelete = (slotId: string) => {
    deleteSave(slotId)
    setSlots(getSaveSlots())
    setSelectedSlot(null)
    setMessage('Save deleted.')
    setTimeout(() => setMessage(null), 2000)
  }

  const slotIds = ['1', '2', '3']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <h3 className="font-mono text-sm text-cyber-cyan tracking-wider text-center mb-6">
        {mode === 'save' ? '// SAVE GAME' : '// LOAD GAME'}
      </h3>

      {/* Auto-save slot */}
      {mode === 'load' && (() => {
        const autoSlot = slots.find((s) => s.id === 'autosave')
        if (!autoSlot) return null
        return (
          <div
            className={cn(
              'p-3 border rounded-sm mb-4 cursor-pointer transition-all',
              selectedSlot === 'autosave'
                ? 'border-cyber-cyan bg-cyber-cyan/5'
                : 'border-cyber-border hover:border-cyber-border/80',
            )}
            onClick={() => setSelectedSlot('autosave')}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyber-amber">AUTO SAVE</span>
              <span className="font-mono text-[10px] text-cyber-muted">
                {formatTimestamp(autoSlot.timestamp)}
              </span>
            </div>
            <div className="font-mono text-[10px] text-cyber-muted mt-1">
              Act {autoSlot.chapter}: {ACT_NAMES[autoSlot.chapter]} — {formatPlayTime(autoSlot.playTime)}
            </div>
            {selectedSlot === 'autosave' && (
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="primary" onClick={() => handleLoad('autosave')}>
                  <Download size={12} className="mr-1" /> Load
                </Button>
              </div>
            )}
          </div>
        )
      })()}

      {/* Manual slots */}
      <div className="space-y-2">
        {slotIds.map((id) => {
          const slot = slots.find((s) => s.id === id)
          return (
            <div
              key={id}
              className={cn(
                'p-3 border rounded-sm cursor-pointer transition-all',
                selectedSlot === id
                  ? 'border-cyber-cyan bg-cyber-cyan/5'
                  : 'border-cyber-border hover:border-cyber-border/80',
              )}
              onClick={() => setSelectedSlot(id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyber-text">
                  SLOT {id}
                </span>
                {slot ? (
                  <span className="font-mono text-[10px] text-cyber-muted">
                    {formatTimestamp(slot.timestamp)}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-cyber-muted italic">
                    Empty
                  </span>
                )}
              </div>
              {slot && (
                <div className="font-mono text-[10px] text-cyber-muted mt-1">
                  Act {slot.chapter}: {ACT_NAMES[slot.chapter]} — {formatPlayTime(slot.playTime)}
                </div>
              )}
              {selectedSlot === id && (
                <div className="mt-2 flex gap-2">
                  {mode === 'save' && (
                    <Button size="sm" variant="primary" onClick={() => handleSave(id)}>
                      <Save size={12} className="mr-1" /> Save
                    </Button>
                  )}
                  {mode === 'load' && slot && (
                    <Button size="sm" variant="primary" onClick={() => handleLoad(id)}>
                      <Download size={12} className="mr-1" /> Load
                    </Button>
                  )}
                  {slot && (
                    <Button size="sm" variant="danger" onClick={() => handleDelete(id)}>
                      <Trash2 size={12} className="mr-1" /> Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs text-cyber-green text-center mt-4"
        >
          {message}
        </motion.p>
      )}

      {/* Back */}
      <div className="mt-6 flex justify-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          BACK
        </Button>
      </div>
    </motion.div>
  )
}
