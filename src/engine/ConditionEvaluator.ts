import type { StoryCondition } from '@/types/story'

interface EvalContext {
  flags: Record<string, boolean>
  clues: string[]
  relationships: Record<string, number>
  choices: Record<string, string>
}

export function evaluateCondition(condition: StoryCondition, ctx: EvalContext): boolean {
  switch (condition.type) {
    case 'flag':
      return ctx.flags[condition.target] === true

    case 'not_flag':
      return ctx.flags[condition.target] !== true

    case 'clue':
      return ctx.clues.includes(condition.target)

    case 'clue_count': {
      const count = ctx.clues.length
      const value = typeof condition.value === 'number' ? condition.value : 0
      switch (condition.operator) {
        case '>=': return count >= value
        case '>': return count > value
        case '<': return count < value
        case '==': return count === value
        case '!=': return count !== value
        default: return count >= value
      }
    }

    case 'relationship': {
      const rel = ctx.relationships[condition.target] ?? 0
      const value = typeof condition.value === 'number' ? condition.value : 0
      switch (condition.operator) {
        case '>=': return rel >= value
        case '>': return rel > value
        case '<': return rel < value
        case '==': return rel === value
        case '!=': return rel !== value
        default: return rel >= value
      }
    }

    case 'choice_made':
      if (condition.value !== undefined) {
        return ctx.choices[condition.target] === String(condition.value)
      }
      return condition.target in ctx.choices

    default:
      return false
  }
}

export function evaluateConditions(conditions: StoryCondition[] | undefined, ctx: EvalContext): boolean {
  if (!conditions || conditions.length === 0) return true
  return conditions.every((c) => evaluateCondition(c, ctx))
}
