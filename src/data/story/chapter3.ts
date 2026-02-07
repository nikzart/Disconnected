import type { StoryChapter } from '@/types/story'

export const CHAPTER_3: StoryChapter = {
  id: 3,
  title: 'Static',
  actName: 'Act III',
  subtitle: 'The Betrayal',
  startNode: 'ch3_intro',
  nodes: {
    ch3_intro: {
      id: 'ch3_intro',
      type: 'cutscene',
      chapter: 3,
      actions: [
        { type: 'set_ambient', target: 'danger' },
        { type: 'add_objective', target: 'obj_find_mole', value: 'Identify who betrayed you' },
        { type: 'add_objective', target: 'obj_marsh_evidence', value: 'Find financial evidence against Marsh' },
      ],
      nextNode: 'ch3_opening',
    },

    ch3_opening: {
      id: 'ch3_opening',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "February 17, 2027. Something's wrong. My encrypted backup was accessed by someone else. My apartment building's security cameras went dark for two hours last night. And PRISM hasn't responded in 12 hours. Someone knows I'm investigating.",
      nextNode: 'ch3_threat',
    },

    ch3_threat: {
      id: 'ch3_threat',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "New message. Unknown sender. Different from PRISM's channel.",
      nextNode: 'ch3_threat_message',
    },

    ch3_threat_message: {
      id: 'ch3_threat_message',
      type: 'dialogue',
      chapter: 3,
      speaker: 'victor',
      text: "Ms. Chen. I know what you've been doing. I know what you've found. You're smart — smart enough to know that this can only end one way. Walk away. Delete everything. Go back to your freelance work. This is your only warning.",
      actions: [
        { type: 'set_flag', target: 'hale_warned' },
      ],
      nextNode: 'ch3_response_choice',
    },

    ch3_response_choice: {
      id: 'ch3_response_choice',
      type: 'choice',
      chapter: 3,
      speaker: 'maya',
      text: "Victor Hale himself. He's watching. But how did he find me?",
      choices: [
        {
          id: 'ch3_defiant',
          text: "I won't be intimidated. Push harder.",
          actions: [
            { type: 'set_flag', target: 'ch3_defiant' },
          ],
          nextNode: 'ch3_defiant_path',
        },
        {
          id: 'ch3_investigate_leak',
          text: "Someone told him. Find the leak first.",
          actions: [
            { type: 'set_flag', target: 'ch3_investigate_leak' },
          ],
          nextNode: 'ch3_leak_investigation',
        },
        {
          id: 'ch3_pretend_comply',
          text: 'Pretend to comply. Go dark. Continue in secret.',
          actions: [
            { type: 'set_flag', target: 'ch3_went_dark' },
          ],
          nextNode: 'ch3_dark_path',
        },
      ],
    },

    ch3_defiant_path: {
      id: 'ch3_defiant_path',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "You killed Lena. You're manipulating senators. You're using AI to brainwash people. And you think a warning is going to stop me? I'm coming for you, Hale.",
      nextNode: 'ch3_betrayal_reveal',
    },

    ch3_leak_investigation: {
      id: 'ch3_leak_investigation',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "How did Hale find me? I was careful. Unless... someone I trusted gave me up. PRISM, Zara, Marcus — one of them is compromised. I need to figure out who before I make another move.",
      nextNode: 'ch3_betrayal_reveal',
    },

    ch3_dark_path: {
      id: 'ch3_dark_path',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "I send a carefully worded response. Apologetic. Scared. The kind Hale expects. Then I wipe my visible trails and set up a new encrypted tunnel. If he thinks I've backed off, I can move more freely.",
      actions: [
        { type: 'set_flag', target: 'hale_thinks_complied' },
      ],
      nextNode: 'ch3_betrayal_reveal',
    },

    ch3_betrayal_reveal: {
      id: 'ch3_betrayal_reveal',
      type: 'dialogue',
      chapter: 3,
      speaker: 'prism',
      text: "Maya. I owe you the truth. PRISM isn't just a codename. My real name is Kai Nakamura. I worked at Nexagen. I was on the LETHE development team. I helped BUILD the thing that killed Vasquez.",
      actions: [
        { type: 'set_flag', target: 'prism_revealed' },
      ],
      nextNode: 'ch3_prism_confession',
    },

    ch3_prism_confession: {
      id: 'ch3_prism_confession',
      type: 'dialogue',
      chapter: 3,
      speaker: 'prism',
      text: "I left because I couldn't live with what we built. But Hale found out I was leaking information. He turned LETHE on me — targeted my social media, my email, tried to make me look unstable. I went underground. I reached out to you because Vasquez trusted you. And because you're the only one skilled enough to take LETHE down from the inside.",
      nextNode: 'ch3_prism_choice',
    },

    ch3_prism_choice: {
      id: 'ch3_prism_choice',
      type: 'choice',
      chapter: 3,
      speaker: 'maya',
      text: 'Kai built the weapon that killed Lena. But he\'s also the only person who truly understands how it works.',
      choices: [
        {
          id: 'ch3_forgive_prism',
          text: "You came forward. That matters. We work together.",
          actions: [
            { type: 'set_flag', target: 'prism_forgiven' },
            { type: 'change_relationship', target: 'prism', value: 20 },
          ],
          nextNode: 'ch3_alliance',
        },
        {
          id: 'ch3_distrust_prism',
          text: "You helped create the thing that killed my mentor. I'll use your help, but I don't trust you.",
          actions: [
            { type: 'set_flag', target: 'prism_distrusted' },
            { type: 'change_relationship', target: 'prism', value: -10 },
          ],
          nextNode: 'ch3_alliance',
        },
        {
          id: 'ch3_cut_prism',
          text: "Get away from me. I'll do this alone.",
          actions: [
            { type: 'set_flag', target: 'prism_cut' },
            { type: 'change_relationship', target: 'prism', value: -50 },
          ],
          nextNode: 'ch3_alone_path',
        },
      ],
    },

    ch3_alliance: {
      id: 'ch3_alliance',
      type: 'dialogue',
      chapter: 3,
      speaker: 'prism',
      text: "There's a financial trail. Nexagen has been funneling money to Marsh's campaign through shell companies. The records are on a secure financial server. If we can get those records and combine them with the LETHE subject data, it's game over for both of them.",
      actions: [
        { type: 'complete_objective', target: 'obj_find_mole' },
      ],
      nextNode: 'ch3_financial_investigation',
    },

    ch3_alone_path: {
      id: 'ch3_alone_path',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "I don't need someone with blood on their hands. I've gotten this far alone — I can finish it alone. But Kai's right about one thing: the financial records would blow this wide open. I just need to find them myself.",
      actions: [
        { type: 'complete_objective', target: 'obj_find_mole' },
      ],
      nextNode: 'ch3_financial_investigation',
    },

    ch3_financial_investigation: {
      id: 'ch3_financial_investigation',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "Senator Marsh's campaign finances. Nexagen payments routed through shell companies. If I can trace the money, it proves the corruption goes beyond just LETHE. It proves they bought the government's silence.",
      nextNode: 'ch3_financial_terminal',
    },

    ch3_financial_terminal: {
      id: 'ch3_financial_terminal',
      type: 'terminal',
      chapter: 3,
      metadata: {
        hint: "Investigate financial records and connections on the investigation board",
      },
      nextNode: 'ch3_marsh_evidence',
    },

    ch3_marsh_evidence: {
      id: 'ch3_marsh_evidence',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "$2.4 million. Twelve transactions over two years. All routed through shell companies with connections to Nexagen board members. Senator Marsh's votes on tech regulation correlate perfectly with the payments. She's been bought and manipulated by LETHE simultaneously.",
      actions: [
        { type: 'complete_objective', target: 'obj_marsh_evidence' },
        { type: 'set_flag', target: 'marsh_evidence_found' },
      ],
      nextNode: 'ch3_ending',
    },

    ch3_ending: {
      id: 'ch3_ending',
      type: 'dialogue',
      chapter: 3,
      speaker: 'maya',
      text: "I have the evidence. Murder, manipulation, corruption. But knowing the truth and proving it are different things. And now Hale knows I'm coming. The static is clearing. I can see the shape of the conspiracy. Now I need to decide: do I fight from the shadows, or step into the light?",
      actions: [
        { type: 'set_flag', target: 'ch3_complete' },
      ],
      nextNode: 'ch3_transition',
    },

    ch3_transition: {
      id: 'ch3_transition',
      type: 'transition',
      chapter: 3,
      text: 'End of Act III: Static',
      actions: [
        { type: 'set_chapter', target: 'chapter', value: 4 },
      ],
      nextNode: 'ch4_intro',
    },
  },
}
