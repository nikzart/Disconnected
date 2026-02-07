import type { Objective } from '@/types/game'

export const ALL_OBJECTIVES: Objective[] = [
  // Chapter 1
  {
    id: 'obj_read_prism',
    chapter: 1,
    title: "Read PRISM's encrypted message",
    description: 'Check your mail inbox for the anonymous message.',
    completed: false,
    hidden: false,
  },
  {
    id: 'obj_check_vasquez',
    chapter: 1,
    title: "Check Vasquez's last email",
    description: 'Read the final email from Dr. Vasquez in your documents.',
    completed: false,
    hidden: false,
  },
  {
    id: 'obj_access_nexagen',
    chapter: 1,
    title: 'Gain access to Nexagen network',
    description: 'Find a way into Nexagen\'s internal systems.',
    completed: false,
    hidden: true,
  },
  {
    id: 'obj_explore_nexagen',
    chapter: 1,
    title: 'Explore Nexagen internal servers',
    description: 'SSH into Nexagen gateway and look for evidence.',
    completed: false,
    hidden: true,
  },
  // Chapter 2
  {
    id: 'obj_find_lethe',
    chapter: 2,
    title: 'Find Project LETHE documentation',
    description: 'Access the research server and locate LETHE files.',
    completed: false,
    hidden: false,
  },
  {
    id: 'obj_ethics_report',
    chapter: 2,
    title: "Recover Vasquez's ethics report",
    description: 'Find the suppressed ethics report in the research archive.',
    completed: false,
    hidden: false,
  },
  // Chapter 3
  {
    id: 'obj_find_mole',
    chapter: 3,
    title: 'Identify who betrayed you',
    description: 'Determine how Victor Hale found out about your investigation.',
    completed: false,
    hidden: false,
  },
  {
    id: 'obj_marsh_evidence',
    chapter: 3,
    title: 'Find financial evidence against Marsh',
    description: 'Trace the money between Nexagen and Senator Marsh.',
    completed: false,
    hidden: false,
  },
  // Chapter 4
  {
    id: 'obj_counter_lethe',
    chapter: 4,
    title: 'Develop a counter to LETHE',
    description: 'Find a way to neutralize or disable LETHE.',
    completed: false,
    hidden: false,
  },
  {
    id: 'obj_choose_ally',
    chapter: 4,
    title: 'Choose your key ally for the endgame',
    description: 'Decide who to trust for the final confrontation.',
    completed: false,
    hidden: false,
  },
  // Chapter 5
  {
    id: 'obj_endgame',
    chapter: 5,
    title: 'Bring the conspiracy to an end',
    description: 'Make your final choice and end this.',
    completed: false,
    hidden: false,
  },
]
