import type { StoryChapter } from '@/types/story'

export const CHAPTER_5: StoryChapter = {
  id: 5,
  title: 'Disconnect',
  actName: 'Act V',
  subtitle: 'The Endgame',
  startNode: 'ch5_intro',
  nodes: {
    ch5_intro: {
      id: 'ch5_intro',
      type: 'cutscene',
      chapter: 5,
      actions: [
        { type: 'set_ambient', target: 'danger' },
        { type: 'add_objective', target: 'obj_endgame', value: 'Bring the conspiracy to an end' },
      ],
      nextNode: 'ch5_opening',
    },

    ch5_opening: {
      id: 'ch5_opening',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "February 22, 2027. One week since Lena died. Everything converges today. Hale knows I'm coming. Marsh is scrambling. And the world is starting to ask questions about Nexagen. This is the endgame.",
      nextNode: 'ch5_hale_confrontation',
    },

    ch5_hale_confrontation: {
      id: 'ch5_hale_confrontation',
      type: 'dialogue',
      chapter: 5,
      speaker: 'victor',
      text: "Impressive, ECHO. You're better than I expected. Vasquez always said you were talented. But talent isn't enough. Do you know what LETHE really is? It's not a weapon — it's a mirror. It shows people what they already want to believe. I didn't create the manipulation. I just... optimized it.",
      nextNode: 'ch5_hale_offer',
    },

    ch5_hale_offer: {
      id: 'ch5_hale_offer',
      type: 'dialogue',
      chapter: 5,
      speaker: 'victor',
      text: "I have an offer. Join me. With your skills and my technology, we could reshape the world. Not through manipulation — through clarity. A new version of LETHE that helps people see through misinformation, that protects democracy instead of undermining it. Vasquez wanted that. You could finish her work.",
      nextNode: 'ch5_final_choice',
    },

    ch5_final_choice: {
      id: 'ch5_final_choice',
      type: 'choice',
      chapter: 5,
      speaker: 'maya',
      text: 'This is it. The choice that defines everything.',
      choices: [
        {
          id: 'ch5_refuse_expose',
          text: 'Refuse. Release everything to the public and take down Nexagen.',
          actions: [
            { type: 'set_flag', target: 'final_choice_expose' },
          ],
          nextNode: 'ch5_ending_branch',
        },
        {
          id: 'ch5_accept_hale',
          text: "Accept Hale's offer. Rebuild LETHE as a force for good.",
          actions: [
            { type: 'set_flag', target: 'final_choice_accept' },
          ],
          nextNode: 'ch5_ending_branch',
        },
        {
          id: 'ch5_destroy_all',
          text: 'Destroy everything. LETHE, the evidence, all of it. Burn it all down.',
          actions: [
            { type: 'set_flag', target: 'final_choice_destroy' },
          ],
          nextNode: 'ch5_ending_branch',
        },
        {
          id: 'ch5_sacrifice',
          text: 'Take the fall personally. Ensure the evidence survives even if you don\'t.',
          actions: [
            { type: 'set_flag', target: 'final_choice_sacrifice' },
          ],
          nextNode: 'ch5_ending_branch',
        },
      ],
    },

    // === ENDING CALCULATOR ===
    ch5_ending_branch: {
      id: 'ch5_ending_branch',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: '...',
      nextNode: 'ch5_ending_hero',
    },

    // === ENDING: HERO ===
    ch5_ending_hero: {
      id: 'ch5_ending_hero',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "I refuse. I release everything — every document, every log, every financial record. Zara's story hits every major outlet simultaneously. The FBI moves on Nexagen. Marsh resigns. Hale is arrested. LETHE is shut down by court order.",
      conditions: [
        { type: 'flag', target: 'final_choice_expose' },
        { type: 'flag', target: 'has_legal_backing' },
      ],
      actions: [
        { type: 'trigger_ending', target: 'hero' },
      ],
      nextNode: 'ch5_epilogue_hero',
    },

    ch5_epilogue_hero: {
      id: 'ch5_epilogue_hero',
      type: 'cutscene',
      chapter: 5,
      text: "The trial takes months. But the evidence is overwhelming. Victor Hale is convicted. Senator Marsh faces impeachment. And the world learns the truth about Project LETHE. Maya Chen — ECHO — becomes a symbol of digital resistance. Lena's legacy lives on.",
      actions: [
        { type: 'complete_objective', target: 'obj_endgame' },
      ],
      nextNode: 'ch5_final_screen',
    },

    // === ENDING: MARTYR ===
    ch5_ending_martyr: {
      id: 'ch5_ending_martyr',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "I release everything. But without legal cover, without allies, I'm exposed. Nexagen's lawyers come after me. The FBI offers no protection — they were never going to protect a hacker. But the truth is out. That's what matters.",
      conditions: [
        { type: 'flag', target: 'final_choice_expose' },
        { type: 'not_flag', target: 'has_legal_backing' },
      ],
      actions: [
        { type: 'trigger_ending', target: 'martyr' },
      ],
      nextNode: 'ch5_epilogue_martyr',
    },

    ch5_epilogue_martyr: {
      id: 'ch5_epilogue_martyr',
      type: 'cutscene',
      chapter: 5,
      text: "Maya faces federal charges. But the public outcry is deafening. A legal defense fund raises millions. The trial becomes a referendum on tech accountability. Nexagen collapses. Lena's name is cleared. And Maya... Maya pays the price. But the world is watching now.",
    },

    // === ENDING: GHOST ===
    ch5_ending_ghost: {
      id: 'ch5_ending_ghost',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "I destroy everything — LETHE, the evidence, the backups. Then I disappear. New identity, new life. The conspiracy dies in the dark. No one is held accountable. But no one can use LETHE again either. Lena... I hope you understand.",
      conditions: [
        { type: 'flag', target: 'final_choice_destroy' },
      ],
      actions: [
        { type: 'trigger_ending', target: 'ghost' },
      ],
      nextNode: 'ch5_epilogue_ghost',
    },

    ch5_epilogue_ghost: {
      id: 'ch5_epilogue_ghost',
      type: 'cutscene',
      chapter: 5,
      text: "ECHO vanishes from the net. The Nexagen investigation stalls without evidence. Hale quietly rebuilds. Marsh keeps her seat. But LETHE is gone — truly gone. And somewhere in the world, a woman with a new name opens her laptop, knowing the truth even if no one else does.",
    },

    // === ENDING: PRAGMATIST ===
    ch5_ending_pragmatist: {
      id: 'ch5_ending_pragmatist',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "I accept Hale's offer. Not because I trust him — because I understand the technology. Under my control, LETHE could actually do what it promises. Counter misinformation. Protect democratic processes. Be the shield Lena wanted, not the sword Hale wielded.",
      conditions: [
        { type: 'flag', target: 'final_choice_accept' },
      ],
      actions: [
        { type: 'trigger_ending', target: 'pragmatist' },
      ],
      nextNode: 'ch5_epilogue_pragmatist',
    },

    ch5_epilogue_pragmatist: {
      id: 'ch5_epilogue_pragmatist',
      type: 'cutscene',
      chapter: 5,
      text: "Maya becomes Nexagen's new CTO. She rebuilds LETHE as an open-source transparency tool — its algorithms now detect and expose manipulation instead of creating it. It's a compromise. Hale walks free. Marsh keeps her secrets. But the technology is saved, repurposed. Is it enough? Lena would have argued about it for hours.",
    },

    // === ENDING: VILLAIN ===
    ch5_ending_villain: {
      id: 'ch5_ending_villain',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "I accept Hale's offer — then I take everything from him. LETHE, Nexagen, all of it. If the world is going to be shaped by AI, it should be shaped by someone who understands the consequences. Someone like me.",
      conditions: [
        { type: 'flag', target: 'final_choice_accept' },
        { type: 'flag', target: 'moral_compromise' },
      ],
      actions: [
        { type: 'trigger_ending', target: 'villain' },
      ],
      nextNode: 'ch5_epilogue_villain',
    },

    ch5_epilogue_villain: {
      id: 'ch5_epilogue_villain',
      type: 'cutscene',
      chapter: 5,
      text: "Maya takes control. Hale doesn't see it coming. Within months, she controls the most powerful AI influence system ever created. She tells herself it's different when she uses it. That her goals are noble. But Lena's voice in her head grows quieter every day. Power corrupts. Even the best of us.",
    },

    // === ENDING: SACRIFICE ===
    ch5_ending_sacrifice: {
      id: 'ch5_ending_sacrifice',
      type: 'dialogue',
      chapter: 5,
      speaker: 'maya',
      text: "I set the dead man's switch. Every piece of evidence I've gathered, queued for automatic release to every journalist, every law enforcement agency, every platform. Then I walk into Nexagen's headquarters. If Hale wants to silence me, he'll have to do it in person. And the moment he does, the truth comes out.",
      conditions: [
        { type: 'flag', target: 'final_choice_sacrifice' },
      ],
      actions: [
        { type: 'trigger_ending', target: 'sacrifice' },
      ],
      nextNode: 'ch5_epilogue_sacrifice',
    },

    ch5_epilogue_sacrifice: {
      id: 'ch5_epilogue_sacrifice',
      type: 'cutscene',
      chapter: 5,
      text: "Maya doesn't come back. But the dead man's switch triggers perfectly. Evidence floods every channel. The investigation is unstoppable. Hale, Marsh, the entire conspiracy — it all unravels. They find Maya's terminal still logged in, cursor blinking. On screen: 'For Lena.' ECHO is gone. But the signal she sent will never fade.",
    },

    // === FINAL SCREEN ===
    ch5_final_screen: {
      id: 'ch5_final_screen',
      type: 'cutscene',
      chapter: 5,
      text: 'DISCONNECTED',
      actions: [
        { type: 'set_flag', target: 'game_complete' },
      ],
    },
  },
}
