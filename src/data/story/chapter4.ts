import type { StoryChapter } from '@/types/story'

export const CHAPTER_4: StoryChapter = {
  id: 4,
  title: 'Interference',
  actName: 'Act IV',
  subtitle: 'The Counter-Attack',
  startNode: 'ch4_intro',
  nodes: {
    ch4_intro: {
      id: 'ch4_intro',
      type: 'cutscene',
      chapter: 4,
      actions: [
        { type: 'set_ambient', target: 'hack' },
        { type: 'add_objective', target: 'obj_counter_lethe', value: 'Develop a counter to LETHE' },
        { type: 'add_objective', target: 'obj_choose_ally', value: 'Choose your key ally for the endgame' },
      ],
      nextNode: 'ch4_opening',
    },

    ch4_opening: {
      id: 'ch4_opening',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "February 20, 2027. Three days since Hale's warning. Five days since Lena died. I have the evidence — LETHE's documentation, the financial records, Lena's ethics report. But evidence means nothing if LETHE can manipulate how people perceive it. I need to neutralize the AI first.",
      nextNode: 'ch4_ghost_contact',
    },

    ch4_ghost_contact: {
      id: 'ch4_ghost_contact',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "I've been contacted by someone new. Agent Reeves, FBI Cyber Division. Codename: GHOST. They've been investigating Nexagen through official channels. They want to help... but on their terms.",
      actions: [
        { type: 'unlock_contact', target: 'ghost' },
      ],
      nextNode: 'ch4_ghost_intro',
    },

    ch4_ghost_intro: {
      id: 'ch4_ghost_intro',
      type: 'dialogue',
      chapter: 4,
      speaker: 'ghost',
      text: "Ms. Chen — or should I say ECHO. We've been watching Nexagen for months. You've gotten further than our entire cyber division. I won't pretend to approve of your methods, but right now, we need each other. Hale is about to deploy LETHE at scale. We have days, not weeks.",
      nextNode: 'ch4_ally_choice',
    },

    ch4_ally_choice: {
      id: 'ch4_ally_choice',
      type: 'choice',
      chapter: 4,
      speaker: 'maya',
      text: 'The endgame is coming. I need to choose who I trust to have my back.',
      choices: [
        {
          id: 'ch4_ally_ghost',
          text: 'Work with Agent Reeves. Legal channels, federal backing.',
          actions: [
            { type: 'set_flag', target: 'ally_ghost' },
            { type: 'complete_objective', target: 'obj_choose_ally' },
          ],
          nextNode: 'ch4_ghost_alliance',
        },
        {
          id: 'ch4_ally_prism',
          text: 'Stick with PRISM/Kai. They know LETHE best.',
          conditions: [{ type: 'not_flag', target: 'prism_cut' }],
          actions: [
            { type: 'set_flag', target: 'ally_prism' },
            { type: 'complete_objective', target: 'obj_choose_ally' },
          ],
          nextNode: 'ch4_prism_alliance',
        },
        {
          id: 'ch4_ally_zara',
          text: 'Trust Zara. Public exposure is the most powerful weapon.',
          actions: [
            { type: 'set_flag', target: 'ally_zara' },
            { type: 'complete_objective', target: 'obj_choose_ally' },
          ],
          nextNode: 'ch4_zara_alliance',
        },
        {
          id: 'ch4_ally_none',
          text: 'Trust no one. I work alone.',
          actions: [
            { type: 'set_flag', target: 'ally_none' },
            { type: 'complete_objective', target: 'obj_choose_ally' },
          ],
          nextNode: 'ch4_lone_wolf',
        },
      ],
    },

    ch4_ghost_alliance: {
      id: 'ch4_ghost_alliance',
      type: 'dialogue',
      chapter: 4,
      speaker: 'ghost',
      text: "Smart choice. We'll provide legal cover and backup. My team will prep warrants while you work on disabling LETHE from the inside. Once the system is down, we move on Hale and Marsh simultaneously. Here's the technical briefing on LETHE's infrastructure.",
      actions: [
        { type: 'set_flag', target: 'has_legal_backing' },
      ],
      nextNode: 'ch4_counter_plan',
    },

    ch4_prism_alliance: {
      id: 'ch4_prism_alliance',
      type: 'dialogue',
      chapter: 4,
      speaker: 'prism',
      text: "I know LETHE's architecture. I built the core inference engine. There's a vulnerability in the influence propagation system — if we inject contradictory data into the training pipeline, we can cause a cascade failure. LETHE will destroy itself. But we need direct access to the core server.",
      nextNode: 'ch4_counter_plan',
    },

    ch4_zara_alliance: {
      id: 'ch4_zara_alliance',
      type: 'dialogue',
      chapter: 4,
      speaker: 'zara',
      text: "I have contacts at every major news outlet. When we drop this, it drops everywhere at once — TV, print, social media, international press. Nexagen won't be able to suppress it. But we need the story to be airtight. Give me everything and I'll write the piece that brings them down.",
      actions: [
        { type: 'set_flag', target: 'has_media_alliance' },
      ],
      nextNode: 'ch4_counter_plan',
    },

    ch4_lone_wolf: {
      id: 'ch4_lone_wolf',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "Everyone has an angle. The FBI wants jurisdiction. Kai wants redemption. Zara wants the story. I just want the truth for Lena. I'll take LETHE down myself and release everything anonymously. If it works, no one needs to know my name.",
      nextNode: 'ch4_counter_plan',
    },

    ch4_counter_plan: {
      id: 'ch4_counter_plan',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "LETHE runs on a central server cluster at Nexagen's data center. To neutralize it, I need to either disable the server directly, corrupt the training data to make it useless, or expose it publicly so they're forced to shut it down. Maybe all three.",
      actions: [
        { type: 'set_ambient', target: 'hack' },
      ],
      nextNode: 'ch4_hack_lethe',
    },

    ch4_hack_lethe: {
      id: 'ch4_hack_lethe',
      type: 'terminal',
      chapter: 4,
      metadata: {
        hint: "Use advanced terminal commands to penetrate LETHE's core systems",
      },
      nextNode: 'ch4_inside_lethe',
    },

    ch4_inside_lethe: {
      id: 'ch4_inside_lethe',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "I'm inside LETHE's core system. The scale of it... thousands of influence campaigns running simultaneously. Sentiment manipulation across every major platform. Personal profiles on millions of people. This isn't just a tool — it's a weapon of mass psychological warfare.",
      actions: [
        { type: 'complete_objective', target: 'obj_counter_lethe' },
      ],
      nextNode: 'ch4_lethe_choice',
    },

    ch4_lethe_choice: {
      id: 'ch4_lethe_choice',
      type: 'choice',
      chapter: 4,
      speaker: 'maya',
      text: "I have access to LETHE's core. I could destroy it completely... or I could use it. Turn the weapon against its creators.",
      choices: [
        {
          id: 'ch4_destroy_lethe',
          text: 'Destroy LETHE completely. Delete everything.',
          actions: [
            { type: 'set_flag', target: 'chose_destroy' },
          ],
          nextNode: 'ch4_destroy_path',
        },
        {
          id: 'ch4_use_lethe',
          text: 'Use LETHE against Nexagen. Let them taste their own medicine.',
          actions: [
            { type: 'set_flag', target: 'chose_use_lethe' },
          ],
          nextNode: 'ch4_use_path',
        },
        {
          id: 'ch4_expose_lethe',
          text: 'Leave it running but expose it. Let the world see what it does.',
          actions: [
            { type: 'set_flag', target: 'chose_expose' },
          ],
          nextNode: 'ch4_expose_path',
        },
      ],
    },

    ch4_destroy_path: {
      id: 'ch4_destroy_path',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "Some things shouldn't exist. I initiate the purge sequence — every model, every dataset, every influence campaign. Deletion cascades through the system. LETHE is dying. And when Hale finds out... he'll come for me with everything he has.",
      actions: [
        { type: 'set_flag', target: 'lethe_destroyed' },
      ],
      nextNode: 'ch4_ending',
    },

    ch4_use_path: {
      id: 'ch4_use_path',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "I turn LETHE's influence campaigns against Nexagen itself. Public sentiment shifting against them. Board members questioning Hale's leadership. Investors pulling out. It's poetic justice... but am I any better than them? Using the same weapon I condemned?",
      actions: [
        { type: 'set_flag', target: 'lethe_weaponized' },
        { type: 'set_flag', target: 'moral_compromise' },
      ],
      nextNode: 'ch4_ending',
    },

    ch4_expose_path: {
      id: 'ch4_expose_path',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "I open LETHE's dashboard to the world. Every active campaign, every manipulation target, every compromised politician — all visible in real-time. Let people see exactly how they're being controlled. The truth is the ultimate counter-weapon.",
      actions: [
        { type: 'set_flag', target: 'lethe_exposed_public' },
      ],
      nextNode: 'ch4_ending',
    },

    ch4_ending: {
      id: 'ch4_ending',
      type: 'dialogue',
      chapter: 4,
      speaker: 'maya',
      text: "The counter-attack is launched. But the interference isn't over. Hale will respond. Marsh will use every lever of power she has. And the question that keeps me up at night: did I make the right choice? I guess we'll find out.",
      actions: [
        { type: 'set_flag', target: 'ch4_complete' },
      ],
      nextNode: 'ch4_transition',
    },

    ch4_transition: {
      id: 'ch4_transition',
      type: 'transition',
      chapter: 4,
      text: 'End of Act IV: Interference',
      actions: [
        { type: 'set_chapter', target: 'chapter', value: 5 },
      ],
      nextNode: 'ch5_intro',
    },
  },
}
