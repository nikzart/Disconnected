import type { StoryChapter } from '@/types/story'

export const CHAPTER_1: StoryChapter = {
  id: 1,
  title: 'Signal',
  actName: 'Act I',
  subtitle: 'The Hook',
  startNode: 'ch1_intro',
  nodes: {
    // === OPENING SEQUENCE ===
    ch1_intro: {
      id: 'ch1_intro',
      type: 'cutscene',
      chapter: 1,
      actions: [
        { type: 'set_ambient', target: 'dark' },
        { type: 'add_objective', target: 'obj_read_prism', value: "Read PRISM's encrypted message" },
        { type: 'add_objective', target: 'obj_check_vasquez', value: "Check Vasquez's last email" },
        { type: 'unlock_contact', target: 'prism' },
      ],
      nextNode: 'ch1_wake_up',
    },

    ch1_wake_up: {
      id: 'ch1_wake_up',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "3:47 AM. My terminal is screaming. An encrypted message from someone I don't know... calling themselves PRISM. They say Lena didn't kill herself. My hands are shaking.",
      nextNode: 'ch1_first_choice',
    },

    ch1_first_choice: {
      id: 'ch1_first_choice',
      type: 'choice',
      chapter: 1,
      speaker: 'maya',
      text: "I need to decide how to approach this. Someone is reaching out about Lena's death.",
      choices: [
        {
          id: 'ch1_investigate_immediately',
          text: 'Start investigating immediately. Read the message and check the files.',
          actions: [
            { type: 'set_flag', target: 'approach_aggressive' },
          ],
          nextNode: 'ch1_terminal_start',
        },
        {
          id: 'ch1_proceed_carefully',
          text: 'Proceed carefully. This could be a trap.',
          actions: [
            { type: 'set_flag', target: 'approach_cautious' },
          ],
          nextNode: 'ch1_caution_dialogue',
        },
        {
          id: 'ch1_contact_zara',
          text: "Contact Zara first. She's been investigating Nexagen.",
          actions: [
            { type: 'set_flag', target: 'approach_collaborative' },
            { type: 'unlock_contact', target: 'zara' },
          ],
          nextNode: 'ch1_zara_intro',
        },
      ],
    },

    // === AGGRESSIVE PATH ===
    ch1_terminal_start: {
      id: 'ch1_terminal_start',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "No more waiting. I'm going straight to the terminal. First step: read PRISM's message, then check Lena's last email.",
      actions: [
        { type: 'set_flag', target: 'terminal_intro_shown' },
      ],
      nextNode: 'ch1_terminal_instructions',
    },

    ch1_terminal_instructions: {
      id: 'ch1_terminal_instructions',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "My files are in ~/documents and ~/mail. Let me start there. Use 'ls' to look around, 'cat' to read files, 'cd' to move between directories.",
      nextNode: 'ch1_terminal_free',
    },

    // === CAUTIOUS PATH ===
    ch1_caution_dialogue: {
      id: 'ch1_caution_dialogue',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "Could be social engineering. Could be Nexagen trying to flush out anyone Lena might have talked to. But... if there's even a chance she was murdered, I owe it to her to find out.",
      nextNode: 'ch1_caution_choice',
    },

    ch1_caution_choice: {
      id: 'ch1_caution_choice',
      type: 'choice',
      chapter: 1,
      speaker: 'maya',
      text: "I'll set up some precautions first. Route through extra proxies, enable dead man's switch.",
      choices: [
        {
          id: 'ch1_caution_proceed',
          text: "Alright, precautions set. Let's see what PRISM has to say.",
          actions: [
            { type: 'set_flag', target: 'extra_security' },
          ],
          nextNode: 'ch1_terminal_instructions',
        },
        {
          id: 'ch1_caution_wait',
          text: "I should try to trace PRISM's message first.",
          actions: [
            { type: 'set_flag', target: 'traced_prism' },
          ],
          nextNode: 'ch1_trace_prism',
        },
      ],
    },

    ch1_trace_prism: {
      id: 'ch1_trace_prism',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "I ran a trace... seven proxy nodes. VPN chains through three countries. Whoever PRISM is, they know what they're doing. The routing is... professional. Military-grade, even. I can't trace the origin. That's either very good or very bad.",
      nextNode: 'ch1_terminal_instructions',
    },

    // === ZARA PATH ===
    ch1_zara_intro: {
      id: 'ch1_zara_intro',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "Zara's been investigating Nexagen for months. If anyone knows what Lena was mixed up in, it's her. Let me check if she's messaged me.",
      nextNode: 'ch1_zara_message',
    },

    ch1_zara_message: {
      id: 'ch1_zara_message',
      type: 'dialogue',
      chapter: 1,
      speaker: 'zara',
      text: "Maya, I heard about Lena. I'm so sorry. I've been investigating Nexagen for a story — there are things that don't add up. Can we talk? Secure channel only.",
      actions: [
        { type: 'send_message', target: 'zara', value: "Maya, I heard about Lena. I've been investigating Nexagen. Can we talk?" },
      ],
      nextNode: 'ch1_zara_response_choice',
    },

    ch1_zara_response_choice: {
      id: 'ch1_zara_response_choice',
      type: 'choice',
      chapter: 1,
      speaker: 'maya',
      text: 'How much do I tell Zara?',
      choices: [
        {
          id: 'ch1_tell_zara_everything',
          text: 'Tell her about PRISM and the encrypted message.',
          actions: [
            { type: 'set_flag', target: 'zara_knows_prism' },
            { type: 'change_relationship', target: 'zara', value: 10 },
          ],
          nextNode: 'ch1_zara_grateful',
        },
        {
          id: 'ch1_tell_zara_minimal',
          text: 'Keep it vague. Just ask what she knows about Nexagen.',
          actions: [
            { type: 'change_relationship', target: 'zara', value: 5 },
          ],
          nextNode: 'ch1_zara_info',
        },
      ],
    },

    ch1_zara_grateful: {
      id: 'ch1_zara_grateful',
      type: 'dialogue',
      chapter: 1,
      speaker: 'zara',
      text: "PRISM? That name's come up in my investigation. My sources say there's an insider at Nexagen leaking information. If they reached out to you... this is bigger than I thought. Be careful, Maya. Check your local files first — Lena may have left you breadcrumbs.",
      nextNode: 'ch1_terminal_instructions',
    },

    ch1_zara_info: {
      id: 'ch1_zara_info',
      type: 'dialogue',
      chapter: 1,
      speaker: 'zara',
      text: "I've been tracking unusual data flows from Nexagen. They have a project called LETHE — officially it's 'sentiment analysis' but my sources say it goes much deeper. Lena was asking questions about it before she died. Start with what you have locally.",
      nextNode: 'ch1_terminal_instructions',
    },

    // === TERMINAL FREE EXPLORATION ===
    ch1_terminal_free: {
      id: 'ch1_terminal_free',
      type: 'terminal',
      chapter: 1,
      text: 'Explore your local machine. Read mail, check documents.',
      actions: [
        { type: 'set_ambient', target: 'tense' },
      ],
      metadata: {
        hint: "Try: ls, cd mail/inbox, cat msg_001_prism.txt",
      },
      nextNode: 'ch1_after_exploration',
    },

    // === AFTER READING KEY FILES ===
    ch1_after_exploration: {
      id: 'ch1_after_exploration',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "Lena mentioned a 'lighthouse.' And PRISM says they're erasing everything. I need to get into Nexagen's systems before it's too late.",
      conditions: [
        { type: 'flag', target: 'clue_vasquez_email' },
      ],
      actions: [
        { type: 'complete_objective', target: 'obj_check_vasquez' },
        { type: 'add_objective', target: 'obj_access_nexagen', value: 'Gain access to Nexagen network' },
      ],
      nextNode: 'ch1_nexagen_approach',
    },

    ch1_nexagen_approach: {
      id: 'ch1_nexagen_approach',
      type: 'choice',
      chapter: 1,
      speaker: 'maya',
      text: 'I need to get into Nexagen\'s network. There are a few ways I could approach this...',
      choices: [
        {
          id: 'ch1_hack_direct',
          text: "Scan their network directly. Use nmap to find vulnerabilities.",
          actions: [
            { type: 'set_flag', target: 'nexagen_approach_hack' },
          ],
          nextNode: 'ch1_nmap_nexagen',
        },
        {
          id: 'ch1_social_marcus',
          text: "Try to contact Marcus Webb, the sysadmin. He might be sympathetic.",
          actions: [
            { type: 'set_flag', target: 'nexagen_approach_social' },
            { type: 'unlock_contact', target: 'marcus' },
          ],
          nextNode: 'ch1_marcus_intro',
        },
        {
          id: 'ch1_use_prism',
          text: "Ask PRISM for help. They seem to know their way around Nexagen.",
          actions: [
            { type: 'set_flag', target: 'nexagen_approach_prism' },
          ],
          nextNode: 'ch1_prism_help',
        },
      ],
    },

    // === DIRECT HACK PATH ===
    ch1_nmap_nexagen: {
      id: 'ch1_nmap_nexagen',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "Let me scan their network. Use 'nmap' to see what's out there, then 'nmap <target>' for details. Once I find a way in, I can 'ssh' to connect.",
      nextNode: 'ch1_hack_terminal',
    },

    ch1_hack_terminal: {
      id: 'ch1_hack_terminal',
      type: 'terminal',
      chapter: 1,
      metadata: {
        hint: "Try: nmap, then nmap nexagen-gateway, then crack nexagen-gateway",
      },
      nextNode: 'ch1_nexagen_inside',
    },

    // === SOCIAL ENGINEERING PATH ===
    ch1_marcus_intro: {
      id: 'ch1_marcus_intro',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "Marcus Webb. Mid-level sysadmin at Nexagen. Lena mentioned him once — said he seemed like a decent guy who was in over his head. Maybe I can get him to help.",
      nextNode: 'ch1_marcus_chat',
    },

    ch1_marcus_chat: {
      id: 'ch1_marcus_chat',
      type: 'dialogue',
      chapter: 1,
      speaker: 'marcus',
      text: "Who is this? How did you get this channel? ...Wait, you're the one Vasquez mentioned? I shouldn't be talking to you. They monitor everything.",
      nextNode: 'ch1_marcus_choice',
    },

    ch1_marcus_choice: {
      id: 'ch1_marcus_choice',
      type: 'choice',
      chapter: 1,
      speaker: 'maya',
      text: 'Marcus is scared. I need to handle this carefully.',
      choices: [
        {
          id: 'ch1_marcus_empathy',
          text: "I know you're scared. Lena was my friend too. I just want the truth.",
          actions: [
            { type: 'change_relationship', target: 'marcus', value: 15 },
            { type: 'set_flag', target: 'marcus_empathy' },
          ],
          nextNode: 'ch1_marcus_opens_up',
        },
        {
          id: 'ch1_marcus_pressure',
          text: "I know about the backdoor on research-03. Help me or I leak it to Hale.",
          actions: [
            { type: 'change_relationship', target: 'marcus', value: -20 },
            { type: 'set_flag', target: 'marcus_pressured' },
          ],
          nextNode: 'ch1_marcus_pressured',
        },
      ],
    },

    ch1_marcus_opens_up: {
      id: 'ch1_marcus_opens_up',
      type: 'dialogue',
      chapter: 1,
      speaker: 'marcus',
      text: "Vasquez... she was the only one who cared about ethics here. Hale had her access revoked the night she died. He's been purging files ever since. I can give you credentials to the gateway server. But please — be careful. And don't use my name.",
      actions: [
        { type: 'set_flag', target: 'access_nexagen-gateway' },
        { type: 'set_flag', target: 'marcus_helped' },
        { type: 'add_objective', target: 'obj_explore_nexagen', value: 'Explore Nexagen internal servers' },
      ],
      nextNode: 'ch1_gateway_access',
    },

    ch1_marcus_pressured: {
      id: 'ch1_marcus_pressured',
      type: 'dialogue',
      chapter: 1,
      speaker: 'marcus',
      text: "How do you— Fine. FINE. Here are the gateway credentials. But this isn't over between us. You just made an enemy.",
      actions: [
        { type: 'set_flag', target: 'access_nexagen-gateway' },
        { type: 'set_flag', target: 'marcus_hostile' },
        { type: 'add_objective', target: 'obj_explore_nexagen', value: 'Explore Nexagen internal servers' },
      ],
      nextNode: 'ch1_gateway_access',
    },

    // === PRISM HELP PATH ===
    ch1_prism_help: {
      id: 'ch1_prism_help',
      type: 'dialogue',
      chapter: 1,
      speaker: 'prism',
      text: "Smart choice asking me. I've already mapped their external network. The gateway server has a known vulnerability — I've seen their patch schedule, and they're behind. Use nmap to confirm, then crack the gateway. I'll walk you through it.",
      actions: [
        { type: 'set_flag', target: 'prism_helped_gateway' },
        { type: 'change_relationship', target: 'prism', value: 10 },
      ],
      nextNode: 'ch1_nmap_nexagen',
    },

    // === INSIDE NEXAGEN ===
    ch1_gateway_access: {
      id: 'ch1_gateway_access',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "I'm in. Nexagen's gateway server. Now I can use 'ssh nexagen-gateway' to connect and explore their files. Let me see what they were trying to hide.",
      nextNode: 'ch1_nexagen_inside',
    },

    ch1_nexagen_inside: {
      id: 'ch1_nexagen_inside',
      type: 'terminal',
      chapter: 1,
      metadata: {
        hint: "ssh nexagen-gateway, then explore: ls, cd var/log, cat access.log",
      },
      nextNode: 'ch1_found_evidence',
    },

    // === EVIDENCE FOUND ===
    ch1_found_evidence: {
      id: 'ch1_found_evidence',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "The access logs... Hale revoked Lena's access and purged her files within hours. And the auth logs show someone tried to log in as Lena after her death. This wasn't a suicide. This was a cover-up.",
      conditions: [
        { type: 'flag', target: 'clue_access_logs' },
      ],
      actions: [
        { type: 'complete_objective', target: 'obj_access_nexagen' },
        { type: 'set_flag', target: 'ch1_evidence_found' },
      ],
      nextNode: 'ch1_chapter_end_choice',
    },

    ch1_chapter_end_choice: {
      id: 'ch1_chapter_end_choice',
      type: 'choice',
      chapter: 1,
      speaker: 'maya',
      text: "I have enough to know this goes deep. But I need to decide my next move.",
      choices: [
        {
          id: 'ch1_dig_deeper',
          text: 'Push deeper into Nexagen. Find the research server.',
          actions: [
            { type: 'set_flag', target: 'ch1_choice_aggressive' },
          ],
          nextNode: 'ch1_ending_aggressive',
        },
        {
          id: 'ch1_secure_evidence',
          text: 'Secure what I have first. Back everything up.',
          actions: [
            { type: 'set_flag', target: 'ch1_choice_cautious' },
          ],
          nextNode: 'ch1_ending_cautious',
        },
        {
          id: 'ch1_share_findings',
          text: 'Share what I found with Zara. We need to go public.',
          actions: [
            { type: 'set_flag', target: 'ch1_choice_expose' },
          ],
          nextNode: 'ch1_ending_expose',
        },
      ],
    },

    ch1_ending_aggressive: {
      id: 'ch1_ending_aggressive',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "No stopping now. The research servers are where LETHE lives. I need to find that ethics report Lena wrote — and whatever they're trying to bury. The deeper I go, the more dangerous it gets.",
      actions: [
        { type: 'set_flag', target: 'ch1_complete' },
      ],
      nextNode: 'ch1_transition',
    },

    ch1_ending_cautious: {
      id: 'ch1_ending_cautious',
      type: 'dialogue',
      chapter: 1,
      speaker: 'maya',
      text: "I encrypt everything. Triple backup across different services. If something happens to me, this evidence doesn't disappear. Then I get some sleep. Tomorrow, the real investigation begins.",
      actions: [
        { type: 'set_flag', target: 'ch1_complete' },
        { type: 'set_flag', target: 'evidence_backed_up' },
      ],
      nextNode: 'ch1_transition',
    },

    ch1_ending_expose: {
      id: 'ch1_ending_expose',
      type: 'dialogue',
      chapter: 1,
      speaker: 'zara',
      text: "Maya, this is incredible. These logs prove Hale covered up Vasquez's investigation. But we need more — the actual LETHE project documents. Can you get inside their research servers?",
      conditions: [
        { type: 'flag', target: 'approach_collaborative' },
      ],
      actions: [
        { type: 'set_flag', target: 'ch1_complete' },
        { type: 'set_flag', target: 'zara_has_evidence' },
      ],
      nextNode: 'ch1_transition',
    },

    // === CHAPTER TRANSITION ===
    ch1_transition: {
      id: 'ch1_transition',
      type: 'transition',
      chapter: 1,
      text: 'End of Act I: Signal',
      actions: [
        { type: 'set_chapter', target: 'chapter', value: 2 },
      ],
      nextNode: 'ch2_intro',
      metadata: {
        transition_text: 'The signal was clear. Now comes the noise.',
      },
    },
  },
}
