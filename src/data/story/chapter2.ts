import type { StoryChapter } from '@/types/story'

export const CHAPTER_2: StoryChapter = {
  id: 2,
  title: 'Noise',
  actName: 'Act II',
  subtitle: 'The Investigation',
  startNode: 'ch2_intro',
  nodes: {
    ch2_intro: {
      id: 'ch2_intro',
      type: 'cutscene',
      chapter: 2,
      actions: [
        { type: 'set_ambient', target: 'tense' },
        { type: 'add_objective', target: 'obj_find_lethe', value: 'Find Project LETHE documentation' },
        { type: 'add_objective', target: 'obj_ethics_report', value: "Recover Vasquez's ethics report" },
      ],
      nextNode: 'ch2_morning',
    },

    ch2_morning: {
      id: 'ch2_morning',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "February 15, 2027. I barely slept. The things I found in Nexagen's gateway logs... someone is covering up a murder, and it goes to the top. I need to get into the research server — that's where LETHE lives.",
      nextNode: 'ch2_prism_update',
    },

    ch2_prism_update: {
      id: 'ch2_prism_update',
      type: 'dialogue',
      chapter: 2,
      speaker: 'prism',
      text: "Good work last night. But they've noticed the intrusion. Nexagen's security team is running diagnostics. You have a window — maybe 48 hours before they patch everything. The research server has a backdoor on port 8080. Marcus Webb left it open as 'insurance.' Use it.",
      actions: [
        { type: 'set_flag', target: 'knows_research_backdoor' },
      ],
      nextNode: 'ch2_research_approach',
    },

    ch2_research_approach: {
      id: 'ch2_research_approach',
      type: 'choice',
      chapter: 2,
      speaker: 'maya',
      text: "The research server. That's where Lena was working. Where LETHE was built. Where the answers are.",
      choices: [
        {
          id: 'ch2_use_backdoor',
          text: "Use Marcus's backdoor on port 8080.",
          actions: [
            { type: 'set_flag', target: 'used_backdoor' },
            { type: 'set_flag', target: 'access_nexagen-research' },
          ],
          nextNode: 'ch2_research_access',
        },
        {
          id: 'ch2_crack_research',
          text: 'Crack it the hard way. More secure, less traceable.',
          nextNode: 'ch2_crack_research',
        },
      ],
    },

    ch2_crack_research: {
      id: 'ch2_crack_research',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "Harder path, but cleaner. No trail leading back to Marcus. Let me scan and crack the research server the proper way.",
      actions: [
        { type: 'set_flag', target: 'access_nexagen-research' },
      ],
      nextNode: 'ch2_research_access',
    },

    ch2_research_access: {
      id: 'ch2_research_access',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "I'm on the research server. Use 'ssh nexagen-research' to connect. Then navigate to /research/lethe/ — that's where LETHE's documentation should be. And look for /research/archive/ — Lena's report might still be there.",
      nextNode: 'ch2_explore_research',
    },

    ch2_explore_research: {
      id: 'ch2_explore_research',
      type: 'terminal',
      chapter: 2,
      metadata: {
        hint: "ssh nexagen-research, then cd research/lethe, then ls -a, cat README.md",
      },
      nextNode: 'ch2_lethe_discovered',
    },

    ch2_lethe_discovered: {
      id: 'ch2_lethe_discovered',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: 'Language-Enhanced Thought Harmonization Engine. They built an AI that manipulates how people think. And they\'re already using it — on senators, journalists... even on Zara. "Active countermeasures authorized." They\'re targeting people who investigate them.',
      conditions: [
        { type: 'flag', target: 'clue_lethe_readme' },
      ],
      actions: [
        { type: 'complete_objective', target: 'obj_find_lethe' },
      ],
      nextNode: 'ch2_ethics_hunt',
    },

    ch2_ethics_hunt: {
      id: 'ch2_ethics_hunt',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "Now I need to find Lena's ethics report. It was supposed to be purged, but maybe there's a backup. Check the /research/archive/ directory — look for hidden files with 'ls -a'.",
      nextNode: 'ch2_ethics_terminal',
    },

    ch2_ethics_terminal: {
      id: 'ch2_ethics_terminal',
      type: 'terminal',
      chapter: 2,
      metadata: {
        hint: "cd research/archive, ls -a, cat vasquez_ethics_report.pdf.bak",
      },
      nextNode: 'ch2_ethics_found',
    },

    ch2_ethics_found: {
      id: 'ch2_ethics_found',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "The ethics report. The smoking gun. Lena documented everything — how LETHE manipulates beliefs, how it was tested on elected officials, how Hale lied to the board. She recommended immediate shutdown. And for that... they killed her.",
      conditions: [
        { type: 'flag', target: 'clue_vasquez_ethics_report' },
      ],
      actions: [
        { type: 'complete_objective', target: 'obj_ethics_report' },
      ],
      nextNode: 'ch2_revelation',
    },

    ch2_revelation: {
      id: 'ch2_revelation',
      type: 'choice',
      chapter: 2,
      speaker: 'maya',
      text: "Senator Marsh is on the subject list. High compliance. She's not just being bribed — she's being controlled by an AI. This is bigger than a cover-up. This is a conspiracy against democracy itself.",
      choices: [
        {
          id: 'ch2_confront_hale',
          text: 'I need to go after Victor Hale directly.',
          actions: [
            { type: 'set_flag', target: 'ch2_target_hale' },
          ],
          nextNode: 'ch2_hale_path',
        },
        {
          id: 'ch2_expose_marsh',
          text: 'Expose Senator Marsh first. Cut off their political cover.',
          actions: [
            { type: 'set_flag', target: 'ch2_target_marsh' },
          ],
          nextNode: 'ch2_marsh_path',
        },
        {
          id: 'ch2_gather_more',
          text: 'I need more evidence before making a move.',
          actions: [
            { type: 'set_flag', target: 'ch2_gather_evidence' },
          ],
          nextNode: 'ch2_evidence_path',
        },
      ],
    },

    ch2_hale_path: {
      id: 'ch2_hale_path',
      type: 'dialogue',
      chapter: 2,
      speaker: 'prism',
      text: "Careful. Hale isn't just the CTO — he built LETHE himself. He has full control of the system, and he's using it to protect himself. If you go after him directly, LETHE will target you too. You need allies.",
      nextNode: 'ch2_ending',
    },

    ch2_marsh_path: {
      id: 'ch2_marsh_path',
      type: 'dialogue',
      chapter: 2,
      speaker: 'zara',
      text: "Marsh is the keystone. She's chair of the Senate Tech Committee — if she falls, Nexagen loses its political protection. But she's powerful. We need ironclad evidence of the payments and the manipulation. I can publish once we have it.",
      nextNode: 'ch2_ending',
    },

    ch2_evidence_path: {
      id: 'ch2_evidence_path',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "More evidence. The subjects file, the financial trails, Lena's full report. I need to build an airtight case before they find out how deep I've gotten. One mistake and everything disappears — including me.",
      nextNode: 'ch2_ending',
    },

    ch2_ending: {
      id: 'ch2_ending',
      type: 'dialogue',
      chapter: 2,
      speaker: 'maya',
      text: "The noise is deafening now. Everyone has an angle. Everyone has something to hide. But the signal is still there — Lena's voice, in her own words, calling for the truth. I won't let them silence it.",
      actions: [
        { type: 'set_flag', target: 'ch2_complete' },
      ],
      nextNode: 'ch2_transition',
    },

    ch2_transition: {
      id: 'ch2_transition',
      type: 'transition',
      chapter: 2,
      text: 'End of Act II: Noise',
      actions: [
        { type: 'set_chapter', target: 'chapter', value: 3 },
      ],
      nextNode: 'ch3_intro',
    },
  },
}
