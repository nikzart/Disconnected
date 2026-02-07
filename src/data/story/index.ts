import { CHAPTER_1 } from './chapter1'
import { CHAPTER_2 } from './chapter2'
import { CHAPTER_3 } from './chapter3'
import { CHAPTER_4 } from './chapter4'
import { CHAPTER_5 } from './chapter5'
import { storyEngine } from '@/engine/StoryEngine'

export function registerAllChapters() {
  storyEngine.registerChapter(CHAPTER_1)
  storyEngine.registerChapter(CHAPTER_2)
  storyEngine.registerChapter(CHAPTER_3)
  storyEngine.registerChapter(CHAPTER_4)
  storyEngine.registerChapter(CHAPTER_5)
}

export { CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5 }
