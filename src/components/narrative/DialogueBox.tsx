import { useDialogueStore } from '@/stores/dialogueStore'
import { motion, AnimatePresence } from 'framer-motion'
import { TypewriterText } from '@/components/ui/TypewriterText'
import { cn } from '@/lib/utils'
import { CHARACTERS } from '@/types/characters'
import type { CharacterId } from '@/types/characters'
import { storyEngine } from '@/engine/StoryEngine'

export function DialogueBox() {
  const { currentNode, isActive, displayedText, availableChoices, isTyping } = useDialogueStore()
  const setDisplayedText = useDialogueStore((s) => s.setDisplayedText)
  const setIsTyping = useDialogueStore((s) => s.setIsTyping)
  const setAvailableChoices = useDialogueStore((s) => s.setAvailableChoices)

  if (!isActive || !currentNode) return null

  const speaker = currentNode.speaker
    ? CHARACTERS[currentNode.speaker as CharacterId]
    : null

  const handleTextComplete = () => {
    setIsTyping(false)
    if (currentNode.choices && currentNode.choices.length > 0) {
      setAvailableChoices(currentNode.choices)
    }
  }

  const handleAdvance = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(currentNode.text || '')
      setIsTyping(false)
      if (currentNode.choices && currentNode.choices.length > 0) {
        setAvailableChoices(currentNode.choices)
      }
      return
    }

    // If no choices, advance to next node
    if (availableChoices.length === 0) {
      storyEngine.advanceDialogue()
    }
  }

  const handleChoiceSelect = (choiceId: string) => {
    storyEngine.advanceDialogue(choiceId)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-40 px-4 flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div
          className="w-full max-w-3xl bg-cyber-dark/95 backdrop-blur-sm border border-cyber-border rounded-sm cursor-pointer"
          onClick={handleAdvance}
        >
          {/* Speaker name */}
          {speaker && (
            <div className="px-4 pt-3 pb-1">
              <span className="font-mono text-xs text-cyber-cyan tracking-wider uppercase">
                {speaker.codename || speaker.name}
              </span>
            </div>
          )}

          {/* Dialogue text */}
          <div className="px-4 py-3 min-h-[60px]">
            {isTyping ? (
              <TypewriterText
                text={currentNode.text || ''}
                className="font-mono text-sm text-cyber-text leading-relaxed"
                onComplete={handleTextComplete}
              />
            ) : (
              <p className="font-mono text-sm text-cyber-text leading-relaxed">
                {displayedText || currentNode.text}
              </p>
            )}
          </div>

          {/* Choices */}
          {!isTyping && availableChoices.length > 0 && (
            <div className="px-4 pb-3 space-y-1 border-t border-cyber-border/50 pt-2">
              {availableChoices.map((choice, i) => (
                <button
                  key={choice.id}
                  className={cn(
                    'w-full text-left px-3 py-2 font-mono text-xs rounded-sm transition-all',
                    'text-cyber-text hover:text-cyber-cyan hover:bg-cyber-cyan/5',
                    'border border-transparent hover:border-cyber-cyan/20',
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleChoiceSelect(choice.id)
                  }}
                >
                  <span className="text-cyber-muted mr-2">[{i + 1}]</span>
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {/* Continue indicator */}
          {!isTyping && availableChoices.length === 0 && (
            <div className="px-4 pb-2 text-right">
              <span className="font-mono text-[10px] text-cyber-muted animate-pulse-glow">
                Click to continue...
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
