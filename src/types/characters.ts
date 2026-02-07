export type CharacterId = 'maya' | 'vasquez' | 'prism' | 'zara' | 'marcus' | 'victor' | 'marsh' | 'ghost'

export type Expression = 'neutral' | 'happy' | 'angry' | 'sad' | 'suspicious' | 'scared' | 'smirk' | 'determined'

export interface Character {
  id: CharacterId
  name: string
  codename?: string
  role: string
  description: string
  relationship: number // -100 to 100
  unlocked: boolean
  contactAvailable: boolean
}

export const CHARACTERS: Record<CharacterId, Omit<Character, 'relationship' | 'unlocked' | 'contactAvailable'>> = {
  maya: {
    id: 'maya',
    name: 'Maya Chen',
    codename: 'ECHO',
    role: 'Freelance White-Hat Hacker (You)',
    description: 'Former security researcher turned freelance hacker. Dr. Vasquez was your mentor and closest friend.',
  },
  vasquez: {
    id: 'vasquez',
    name: 'Dr. Lena Vasquez',
    role: 'AI Ethics Researcher (Deceased)',
    description: 'Renowned AI ethics researcher at Nexagen Corp. Found dead — ruled a suicide. Your mentor.',
  },
  prism: {
    id: 'prism',
    name: 'Kai Nakamura',
    codename: 'PRISM',
    role: 'Anonymous Informant',
    description: 'Mysterious hacker who sent the initial encrypted message. Claims to have insider knowledge of Nexagen.',
  },
  zara: {
    id: 'zara',
    name: 'Zara Okonkwo',
    role: 'Investigative Journalist',
    description: 'Award-winning journalist at The Circuit. Has been investigating Nexagen for months independently.',
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Webb',
    role: 'Nexagen Systems Administrator',
    description: 'Mid-level sysadmin at Nexagen with access to internal servers. Nervous but has a conscience.',
  },
  victor: {
    id: 'victor',
    name: 'Victor Hale',
    role: 'Nexagen CTO / Project LETHE Director',
    description: 'Brilliant but ruthless technologist. Architect of Project LETHE. Will do anything to protect his creation.',
  },
  marsh: {
    id: 'marsh',
    name: 'Senator Diana Marsh',
    role: 'Chair of Senate Tech Committee',
    description: 'Powerful senator with deep ties to Nexagen. Publicly champions tech regulation while secretly enabling LETHE.',
  },
  ghost: {
    id: 'ghost',
    name: 'Agent Reeves',
    codename: 'GHOST',
    role: 'Federal Agent (Potential Ally)',
    description: 'FBI cyber division agent investigating Nexagen through official channels. May become an ally in Act 4.',
  },
}
