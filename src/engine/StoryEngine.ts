import type { StoryNode, StoryAction, StoryChapter } from '@/types/story'
import { evaluateConditions } from './ConditionEvaluator'
import { useGameStore } from '@/stores/gameStore'
import { useDialogueStore } from '@/stores/dialogueStore'
import { useChatStore } from '@/stores/chatStore'
import { useInvestigationStore } from '@/stores/investigationStore'
import { useAudioStore } from '@/stores/audioStore'
import type { CharacterId } from '@/types/characters'
import type { AmbientMood } from '@/stores/audioStore'
import type { GameView, Chapter } from '@/types/game'
import { randomId } from '@/lib/utils'
import { CLUE_DATA } from '@/data/story/clues'

class StoryEngineClass {
  private chapters: Map<number, StoryChapter> = new Map()

  registerChapter(chapter: StoryChapter) {
    this.chapters.set(chapter.id, chapter)
  }

  getNode(chapter: number, nodeId: string): StoryNode | null {
    const ch = this.chapters.get(chapter)
    if (!ch) return null
    return ch.nodes[nodeId] || null
  }

  startChapter(chapterNum: number) {
    const chapter = this.chapters.get(chapterNum)
    if (!chapter) return

    const gameStore = useGameStore.getState()
    gameStore.setChapter(chapterNum as Chapter)

    this.processNode(chapterNum, chapter.startNode)
  }

  processNode(chapter: number, nodeId: string) {
    const node = this.getNode(chapter, nodeId)
    if (!node) return

    const gameStore = useGameStore.getState()
    const clues = useInvestigationStore.getState().clues.filter((c) => c.discovered).map((c) => c.id)

    // Check conditions
    const ctx = {
      flags: gameStore.flags,
      clues,
      relationships: {},
      choices: gameStore.choices,
    }

    if (!evaluateConditions(node.conditions, ctx)) {
      // Skip to next node if conditions not met
      if (node.nextNode) {
        this.processNode(chapter, node.nextNode)
      }
      return
    }

    // Execute actions
    if (node.actions) {
      node.actions.forEach((action) => this.executeAction(action))
    }

    // Handle node by type
    switch (node.type) {
      case 'dialogue':
        this.showDialogue(node)
        break
      case 'choice':
        this.showDialogue(node)
        break
      case 'terminal':
        gameStore.setView('terminal')
        if (node.nextNode) {
          // Terminal nodes advance when a trigger happens
          gameStore.setFlag(`awaiting_trigger_${node.nextNode}`, true)
        }
        break
      case 'cutscene':
        gameStore.setView('cutscene')
        break
      case 'minigame':
        gameStore.setView('minigame')
        break
      case 'chat':
        gameStore.setView('chat')
        break
      case 'investigation':
        gameStore.setView('investigation')
        break
      case 'transition':
        if (node.nextNode) {
          setTimeout(() => this.processNode(chapter, node.nextNode!), 1500)
        }
        break
    }
  }

  showDialogue(node: StoryNode) {
    const dialogueStore = useDialogueStore.getState()
    dialogueStore.setCurrentNode(node)
    dialogueStore.setIsTyping(true)
    dialogueStore.setIsActive(true)
    dialogueStore.setDisplayedText('')
    dialogueStore.setAvailableChoices([])

    if (node.speaker && node.text) {
      dialogueStore.addToHistory(node.speaker, node.text)
    }
  }

  advanceDialogue(choiceId?: string) {
    const dialogueStore = useDialogueStore.getState()
    const gameStore = useGameStore.getState()
    const node = dialogueStore.currentNode

    if (!node) return

    if (choiceId && node.choices) {
      const choice = node.choices.find((c) => c.id === choiceId)
      if (choice) {
        gameStore.setChoice(node.id, choiceId)

        if (choice.actions) {
          choice.actions.forEach((action) => this.executeAction(action))
        }

        dialogueStore.clearDialogue()
        this.processNode(node.chapter, choice.nextNode)
        return
      }
    }

    // No choice — advance to next node
    dialogueStore.clearDialogue()
    if (node.nextNode) {
      this.processNode(node.chapter, node.nextNode)
    }
  }

  executeAction(action: StoryAction) {
    const gameStore = useGameStore.getState()

    switch (action.type) {
      case 'set_flag':
        gameStore.setFlag(action.target, action.value !== false)
        break

      case 'remove_flag':
        gameStore.removeFlag(action.target)
        break

      case 'add_clue': {
        const store = useInvestigationStore.getState()
        const clueData = CLUE_DATA[action.target]
        if (clueData && !store.hasClue(action.target)) {
          store.addClue({ ...clueData, discovered: true })
          gameStore.addNotification({
            id: randomId(),
            type: 'clue',
            title: 'Clue Discovered',
            message: clueData.title,
            timestamp: Date.now(),
          })
        }
        break
      }

      case 'change_relationship':
        // Will be used when we have character relationship tracking
        break

      case 'trigger_minigame':
        gameStore.setView('minigame')
        gameStore.setFlag(`minigame_active_${action.target}`, true)
        break

      case 'play_sound':
        // Audio engine will handle this
        break

      case 'set_chapter':
        gameStore.setChapter(Number(action.value) as Chapter)
        break

      case 'add_objective':
        gameStore.addObjective({
          id: action.target,
          chapter: gameStore.chapter,
          title: String(action.value || action.target),
          description: '',
          completed: false,
          hidden: false,
        })
        break

      case 'complete_objective':
        gameStore.completeObjective(action.target)
        break

      case 'unlock_contact': {
        const chatStore = useChatStore.getState()
        chatStore.addContact(action.target as CharacterId)
        gameStore.addNotification({
          id: randomId(),
          type: 'info',
          title: 'New Contact',
          message: `${action.target} added to contacts`,
          timestamp: Date.now(),
        })
        break
      }

      case 'send_message': {
        const chatStore = useChatStore.getState()
        chatStore.addMessage(action.target, {
          id: randomId(),
          sender: action.target as CharacterId,
          text: String(action.value),
          timestamp: Date.now(),
        })
        break
      }

      case 'set_view':
        gameStore.setView(action.target as GameView)
        break

      case 'set_ambient': {
        const audioStore = useAudioStore.getState()
        audioStore.setCurrentAmbient(action.target as AmbientMood)
        break
      }

      case 'trigger_ending':
        gameStore.setEnding(action.target as 'hero' | 'martyr' | 'ghost' | 'pragmatist' | 'villain' | 'sacrifice')
        break

      default:
        break
    }
  }

  // Called when a terminal trigger fires
  handleTrigger(triggerId: string) {
    const gameStore = useGameStore.getState()
    const chapter = gameStore.chapter

    // Check if any node is awaiting this trigger
    const ch = this.chapters.get(chapter)
    if (!ch) return

    // Look for awaiting trigger flags
    for (const [nodeId, _flag] of Object.entries(gameStore.flags)) {
      if (nodeId === `awaiting_trigger_${triggerId}`) {
        gameStore.removeFlag(nodeId)
      }
    }

    // Also check for direct trigger handlers
    const triggerNode = Object.values(ch.nodes).find(
      (n) => n.metadata?.trigger === triggerId,
    )
    if (triggerNode) {
      this.processNode(chapter, triggerNode.id)
    }
  }
}

export const storyEngine = new StoryEngineClass()
