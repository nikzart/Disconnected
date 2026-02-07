import type { Chapter } from './game'

export type StoryNodeType = 'dialogue' | 'choice' | 'terminal' | 'cutscene' | 'minigame' | 'transition' | 'chat' | 'investigation'

export interface StoryCondition {
  type: 'flag' | 'clue' | 'relationship' | 'choice_made' | 'not_flag' | 'clue_count'
  target: string
  value?: string | number | boolean
  operator?: '==' | '!=' | '>' | '<' | '>='
}

export type StoryActionType =
  | 'set_flag'
  | 'add_clue'
  | 'remove_flag'
  | 'change_relationship'
  | 'trigger_minigame'
  | 'play_sound'
  | 'set_chapter'
  | 'add_objective'
  | 'complete_objective'
  | 'unlock_contact'
  | 'send_message'
  | 'add_file'
  | 'set_view'
  | 'trigger_ending'
  | 'set_ambient'

export interface StoryAction {
  type: StoryActionType
  target: string
  value?: string | number | boolean
}

export interface StoryChoice {
  id: string
  text: string
  conditions?: StoryCondition[]
  actions?: StoryAction[]
  nextNode: string
  tooltip?: string
}

export interface StoryNode {
  id: string
  type: StoryNodeType
  chapter: Chapter
  speaker?: string
  text?: string
  choices?: StoryChoice[]
  actions?: StoryAction[]
  conditions?: StoryCondition[]
  nextNode?: string
  metadata?: Record<string, string>
}

export interface StoryChapter {
  id: Chapter
  title: string
  actName: string
  subtitle: string
  nodes: Record<string, StoryNode>
  startNode: string
}
