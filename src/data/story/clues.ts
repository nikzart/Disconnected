import type { Clue, ClueConnection } from '@/types/investigation'

export const CLUE_DATA: Record<string, Clue> = {
  clue_vasquez_email: {
    id: 'clue_vasquez_email',
    title: "Vasquez's Last Email",
    description: 'The final email from Dr. Vasquez, sent just days before her death. References Project LETHE and a hidden backup.',
    type: 'email',
    chain: 'murder',
    chapter: 1,
    discovered: false,
    content: `"I found something in Project LETHE. It's not what they told us.
The scale of it... this isn't just an AI project.
I've hidden a backup. Look for the lighthouse."`,
    position: { x: 100, y: 150 },
  },
  clue_prism_message: {
    id: 'clue_prism_message',
    title: "PRISM's Warning",
    description: 'An anonymous encrypted message claiming Dr. Vasquez was murdered.',
    type: 'email',
    chain: 'murder',
    chapter: 1,
    discovered: false,
    content: `"Dr. Vasquez didn't kill herself. They're erasing everything.
Start with her files. Trust no one." — PRISM`,
    position: { x: 250, y: 100 },
  },
  clue_access_logs: {
    id: 'clue_access_logs',
    title: 'Nexagen Access Logs',
    description: "Server logs showing Vasquez's final access attempts and Hale's immediate response to purge files.",
    type: 'data',
    chain: 'coverup',
    chapter: 1,
    discovered: false,
    content: `Vasquez accessed /research/lethe/ at 23:51
Attempted /training_data/ — 403 DENIED
Account privileges revoked at 23:56
Hale purged ethics_review files at 00:15`,
    position: { x: 400, y: 200 },
  },
  clue_auth_logs: {
    id: 'clue_auth_logs',
    title: 'Authentication Logs',
    description: "Logs showing failed login attempts from Vasquez's disabled account and Hale's user management activity.",
    type: 'data',
    chain: 'coverup',
    chapter: 1,
    discovered: false,
    content: `Someone tried to log in as Vasquez after her death.
Three failed attempts, then Hale accessed user management.
Vasquez's profile marked for deletion.`,
    position: { x: 550, y: 150 },
  },
  clue_marcus_todo: {
    id: 'clue_marcus_todo',
    title: "Marcus's TODO List",
    description: "Marcus Webb's personal task list reveals a backdoor he's keeping secret and suspicious 'cleanup' meetings with Hale.",
    type: 'document',
    chain: 'lethe',
    chapter: 1,
    discovered: false,
    content: `Meeting with Hale re: "cleanup" — what does he mean?
LETHE deployment prep??
Remember: backdoor port is still open on research-03
DO NOT tell Hale about this. Insurance.`,
    position: { x: 300, y: 350 },
  },
  clue_lethe_readme: {
    id: 'clue_lethe_readme',
    title: 'Project LETHE Overview',
    description: 'The official README for Project LETHE reveals its true purpose: mass manipulation of public perception.',
    type: 'document',
    chain: 'lethe',
    chapter: 2,
    discovered: false,
    content: `LETHE: Language-Enhanced Thought Harmonization Engine
An advanced AI system designed to analyze, predict, and
influence public perception at unprecedented scale.`,
    position: { x: 150, y: 400 },
  },
  clue_lethe_subjects: {
    id: 'clue_lethe_subjects',
    title: 'LETHE Test Subjects',
    description: 'A list of people being actively manipulated by LETHE, including Senator Marsh and journalist Zara Okonkwo.',
    type: 'data',
    chain: 'lethe',
    chapter: 2,
    discovered: false,
    content: `Senator Marsh — Compliance: HIGH (94.2% influence)
Journalist Okonkwo — HOSTILE (ACTIVE COUNTERMEASURES)
112+ additional subjects being monitored`,
    position: { x: 450, y: 400 },
  },
  clue_vasquez_ethics_report: {
    id: 'clue_vasquez_ethics_report',
    title: "Vasquez's Ethics Report",
    description: 'The suppressed ethics review that got Dr. Vasquez killed. Documents LETHE\'s full capabilities and recommends shutdown.',
    type: 'document',
    chain: 'murder',
    chapter: 2,
    discovered: false,
    content: `LETHE can manipulate individual beliefs with >90% success rate.
Already tested on elected officials.
Senator Marsh's policy reversals correlate with LETHE campaigns.
RECOMMENDATION: Immediate shutdown and full disclosure.
NOTE: This report has been suppressed by CTO directive.`,
    position: { x: 200, y: 500 },
  },
  clue_hale_directive: {
    id: 'clue_hale_directive',
    title: "Hale's Purge Directive",
    description: 'Internal directive from Victor Hale ordering the deletion of all ethics review documentation.',
    type: 'document',
    chain: 'coverup',
    chapter: 2,
    discovered: false,
    content: `DIRECTIVE VH-2027-0208
All ethics review documentation for Project LETHE
is to be archived (deleted) effective immediately.
Non-compliance will result in termination.
— Victor Hale, CTO`,
    position: { x: 600, y: 350 },
  },
  clue_marsh_payments: {
    id: 'clue_marsh_payments',
    title: 'Marsh Campaign Payments',
    description: 'Financial records showing large payments from Nexagen to Senator Marsh\'s campaign fund.',
    type: 'data',
    chain: 'coverup',
    chapter: 3,
    discovered: false,
    content: `Nexagen Corp → Marsh Campaign Fund
$2.4M across 12 transactions (2025-2027)
Routed through 3 shell companies
Correlates with favorable committee votes`,
    position: { x: 500, y: 500 },
  },
  clue_vasquez_death_report: {
    id: 'clue_vasquez_death_report',
    title: 'Medical Examiner Report',
    description: 'The official death report for Dr. Vasquez. Time of death discrepancies suggest tampering.',
    type: 'document',
    chain: 'murder',
    chapter: 3,
    discovered: false,
    content: `Cause of death: Asphyxiation (ruled suicide)
Time of death: ~10:00 PM EST
NOTE: Security camera footage from 9-11 PM "corrupted"
NOTE: No suicide note found despite subject's known habits`,
    position: { x: 350, y: 600 },
  },
}

export const CONNECTION_DATA: ClueConnection[] = [
  {
    id: 'conn_prism_email',
    from: 'clue_prism_message',
    to: 'clue_vasquez_email',
    label: 'Both reference murder',
    discovered: false,
  },
  {
    id: 'conn_email_logs',
    from: 'clue_vasquez_email',
    to: 'clue_access_logs',
    label: 'Vasquez accessed files she referenced',
    discovered: false,
  },
  {
    id: 'conn_logs_auth',
    from: 'clue_access_logs',
    to: 'clue_auth_logs',
    label: 'Hale responded to her access',
    discovered: false,
  },
  {
    id: 'conn_marcus_lethe',
    from: 'clue_marcus_todo',
    to: 'clue_lethe_readme',
    label: "Marcus knows about LETHE's deployment",
    discovered: false,
  },
  {
    id: 'conn_lethe_subjects',
    from: 'clue_lethe_readme',
    to: 'clue_lethe_subjects',
    label: 'LETHE is already being used on people',
    discovered: false,
  },
  {
    id: 'conn_subjects_marsh',
    from: 'clue_lethe_subjects',
    to: 'clue_marsh_payments',
    label: 'Marsh is both subject and beneficiary',
    discovered: false,
    unlocks: 'marsh_conspiracy_revealed',
  },
  {
    id: 'conn_ethics_murder',
    from: 'clue_vasquez_ethics_report',
    to: 'clue_vasquez_death_report',
    label: 'Report led to her death',
    discovered: false,
    unlocks: 'vasquez_murder_confirmed',
  },
  {
    id: 'conn_hale_coverup',
    from: 'clue_hale_directive',
    to: 'clue_access_logs',
    label: 'Hale ordered the evidence destroyed',
    discovered: false,
  },
]
