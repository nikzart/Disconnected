import type { Machine, VFSDirectory } from '@/types/terminal'

const localhostFS: VFSDirectory = {
  name: '~',
  children: {
    'documents': {
      name: 'documents',
      children: {
        'notes.txt': {
          name: 'notes.txt',
          content: `Personal Notes — Maya Chen
========================
Feb 13, 2027

Lena called last week. She sounded scared.
Said she found something at Nexagen. Something about an AI project.
She wanted to meet in person but...

She's gone now. And the police say suicide.
Lena would never. She had too much to fight for.

I need to find out what happened.`,
        },
        'contacts.txt': {
          name: 'contacts.txt',
          content: `Secure Contacts
===============
PRISM — Anonymous, encrypted channel only
Zara Okonkwo — journalist@thecircuit.net
Dr. Vasquez — [DECEASED] — lvasquez@nexagen.com`,
        },
        'vasquez_last_email.txt': {
          name: 'vasquez_last_email.txt',
          content: `From: lvasquez@nexagen.com
To: maya.echo@protonmail.com
Date: Feb 7, 2027 11:43 PM
Subject: I need to tell you something

Maya,

I can't say much over email. They monitor everything here.
But I found something in Project LETHE. It's not what they told us.
The scale of it... Maya, this isn't just an AI project.

I've hidden a backup. Look for the lighthouse.

Please be careful. Trust no one at Nexagen.

— Lena

[This message was flagged by automated systems]`,
          onRead: 'clue_vasquez_email',
        },
      },
    },
    'tools': {
      name: 'tools',
      children: {
        'README.md': {
          name: 'README.md',
          content: `ECHO Toolkit v2.7
=================
Custom security tools for authorized penetration testing.

Available tools:
  nmap    — Network scanner
  crack   — Password cracker utility
  decrypt — Decryption toolkit
  inject  — Code injection framework
  ssh     — Secure shell client

Use 'help <command>' for usage details.`,
        },
      },
    },
    'downloads': {
      name: 'downloads',
      children: {},
    },
    '.ssh': {
      name: '.ssh',
      hidden: true,
      children: {
        'known_hosts': {
          name: 'known_hosts',
          content: `# Known hosts
192.168.1.1 nexagen-gateway
10.0.0.5 nexagen-mail
10.0.0.12 nexagen-research
10.0.0.50 nexagen-lethe (RESTRICTED)`,
        },
        'id_rsa.pub': {
          name: 'id_rsa.pub',
          content: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... echo@localhost',
        },
      },
    },
    '.config': {
      name: '.config',
      hidden: true,
      children: {
        'prism_channel.enc': {
          name: 'prism_channel.enc',
          content: 'ENCRYPTED: Use decrypt command with key to read.',
          encrypted: true,
        },
      },
    },
    'mail': {
      name: 'mail',
      children: {
        'inbox': {
          name: 'inbox',
          children: {
            'msg_001_prism.txt': {
              name: 'msg_001_prism.txt',
              content: `From: UNKNOWN (encrypted)
Date: Feb 14, 2027 3:47 AM
Subject: [NO SUBJECT]

Dr. Vasquez didn't kill herself.
They're erasing everything.
Start with her files. Trust no one.

— PRISM

[TRACE: routing through 7 proxy nodes — origin unresolvable]`,
              onRead: 'story_prism_first_message',
            },
            'msg_002_zara.txt': {
              name: 'msg_002_zara.txt',
              content: `From: zara.okonkwo@thecircuit.net
Date: Feb 14, 2027 8:15 AM
Subject: About Dr. Vasquez

Maya,

I heard about Lena. I'm so sorry.
I've been investigating Nexagen for a story.
There are things that don't add up.

Can we talk? Secure channel only.

— Zara`,
              onRead: 'contact_unlock_zara',
            },
          },
        },
        'sent': {
          name: 'sent',
          children: {},
        },
      },
    },
  },
}

const nexagenGatewayFS: VFSDirectory = {
  name: '/',
  children: {
    'var': {
      name: 'var',
      children: {
        'log': {
          name: 'log',
          children: {
            'access.log': {
              name: 'access.log',
              content: `[2027-02-07 23:51:02] lvasquez - accessed /research/lethe/ - 200
[2027-02-07 23:52:14] lvasquez - accessed /research/lethe/models/ - 200
[2027-02-07 23:53:01] lvasquez - downloaded /research/lethe/ethics_review.pdf - 200
[2027-02-07 23:55:18] lvasquez - accessed /research/lethe/training_data/ - 403 DENIED
[2027-02-07 23:55:19] ALERT: Unauthorized access attempt by lvasquez
[2027-02-07 23:56:44] SYSTEM: Account lvasquez privileges revoked
[2027-02-08 00:01:12] vhale - accessed /admin/security/ - 200
[2027-02-08 00:02:33] vhale - modified /research/lethe/access_control - 200
[2027-02-08 00:15:00] SYSTEM: Files purged from /research/lethe/ethics_review*`,
              onRead: 'clue_access_logs',
            },
            'auth.log': {
              name: 'auth.log',
              content: `[2027-02-13 22:14:00] Failed login: lvasquez (account disabled)
[2027-02-13 22:14:05] Failed login: lvasquez (account disabled)
[2027-02-13 22:14:10] Failed login: lvasquez (account disabled)
[2027-02-13 22:30:00] Login: mwebb from 10.0.0.15
[2027-02-13 22:31:15] Login: vhale from 10.0.0.1
[2027-02-13 22:31:20] vhale accessed /admin/user_management
[2027-02-13 22:31:45] SYSTEM: User profile lvasquez marked for deletion`,
              onRead: 'clue_auth_logs',
            },
          },
        },
      },
    },
    'home': {
      name: 'home',
      children: {
        'mwebb': {
          name: 'mwebb',
          children: {
            'todo.txt': {
              name: 'todo.txt',
              content: `Marcus's TODO:
- Rotate SSH keys (overdue!!)
- Check backup integrity
- Meeting with Hale re: "cleanup" — what does he mean?
- LETHE deployment prep??
- Remember: backdoor port is still open on research-03
  DO NOT tell Hale about this. Insurance.`,
              onRead: 'clue_marcus_todo',
            },
          },
        },
      },
    },
    'etc': {
      name: 'etc',
      children: {
        'motd': {
          name: 'motd',
          content: 'NEXAGEN CORPORATION — Internal Network\nUnauthorized access is strictly prohibited.',
        },
        'passwd': {
          name: 'passwd',
          content: `root:x:0:0:root:/root:/bin/bash
admin:x:1:1:admin:/home/admin:/bin/bash
vhale:x:100:100:Victor Hale:/home/vhale:/bin/bash
mwebb:x:101:101:Marcus Webb:/home/mwebb:/bin/bash
lvasquez:x:102:102:Lena Vasquez:/home/lvasquez:/bin/nologin [DISABLED]`,
        },
      },
    },
  },
}

const nexagenResearchFS: VFSDirectory = {
  name: '/',
  children: {
    'research': {
      name: 'research',
      children: {
        'lethe': {
          name: 'lethe',
          children: {
            'README.md': {
              name: 'README.md',
              content: `PROJECT LETHE — Classification: TOP SECRET
============================================
Lead: Victor Hale, CTO
Status: Phase 3 — Active Deployment Prep

LETHE: Language-Enhanced Thought Harmonization Engine

An advanced AI system designed to analyze, predict, and
influence public perception at unprecedented scale.

Core capabilities:
  - Real-time sentiment analysis across all major platforms
  - Predictive modeling of public opinion shifts
  - Automated content generation for narrative control
  - Targeted individual influence profiles

NOTE: All ethics review documentation has been archived
per directive VH-2027-0208.`,
              onRead: 'clue_lethe_readme',
            },
            'deployment_plan.enc': {
              name: 'deployment_plan.enc',
              content: 'ENCRYPTED — Requires Level 5 clearance key',
              encrypted: true,
            },
            'subjects.dat': {
              name: 'subjects.dat',
              content: `FIELD TEST SUBJECTS — BATCH 7
Status: Active monitoring

Subject 4471: Senator D. Marsh — Profile: COOPERATIVE
  - Influence score: 94.2%
  - Compliance rating: HIGH
  - Notes: Subject responds well to fear-based narratives

Subject 4472: Gov. Richards — Profile: RESISTANT
  - Influence score: 31.7%
  - Compliance rating: LOW
  - Notes: Flagged for enhanced targeting

Subject 4473: Journalist Z. Okonkwo — Profile: HOSTILE
  - Influence score: 12.1%
  - Compliance rating: NONE
  - Notes: ACTIVE COUNTERMEASURES AUTHORIZED

[...112 additional subjects...]`,
              onRead: 'clue_lethe_subjects',
            },
          },
        },
        'archive': {
          name: 'archive',
          children: {
            'vasquez_ethics_report.pdf.bak': {
              name: 'vasquez_ethics_report.pdf.bak',
              hidden: true,
              content: `ETHICS REVIEW — PROJECT LETHE
Author: Dr. Lena Vasquez
Date: February 5, 2027
Classification: INTERNAL

EXECUTIVE SUMMARY:
Project LETHE represents a fundamental threat to democratic
society. The system's capabilities extend far beyond the
stated objectives of "sentiment analysis." My review reveals:

1. LETHE can effectively manipulate individual beliefs with
   >90% success rate on susceptible subjects
2. The system has already been tested on elected officials
   (see Subject List, Appendix C)
3. Senator Marsh's recent policy reversals correlate directly
   with LETHE influence campaigns
4. No ethical oversight or consent framework exists
5. Victor Hale has knowingly misrepresented the system's
   capabilities to the board

RECOMMENDATION: Immediate shutdown and full disclosure to
regulatory authorities.

NOTE: This report has been suppressed by CTO directive.
Backup copy stored in personal secure location.

— Dr. Lena Vasquez, PhD
   Senior AI Ethics Researcher, Nexagen Corp`,
              onRead: 'clue_vasquez_ethics_report',
            },
          },
        },
      },
    },
  },
}

export const MACHINES: Record<string, Machine> = {
  localhost: {
    id: 'localhost',
    hostname: 'echo-station',
    ip: '127.0.0.1',
    filesystem: localhostFS,
    motd: `ECHO Terminal v2.7.1 — Secure Shell Active
Type 'help' for available commands.
────────────────────────────────────────────`,
  },
  'nexagen-gateway': {
    id: 'nexagen-gateway',
    hostname: 'nexagen-gw',
    ip: '192.168.1.1',
    filesystem: nexagenGatewayFS,
    requiresAccess: true,
    accessGranted: false,
    motd: `╔══════════════════════════════════════════╗
║     NEXAGEN CORP — GATEWAY SERVER        ║
║   Unauthorized access is PROHIBITED.     ║
╚══════════════════════════════════════════╝`,
  },
  'nexagen-research': {
    id: 'nexagen-research',
    hostname: 'nexagen-rs03',
    ip: '10.0.0.12',
    filesystem: nexagenResearchFS,
    requiresAccess: true,
    accessGranted: false,
    motd: `[NEXAGEN RESEARCH SERVER 03]
Classification: RESTRICTED
All access logged and monitored.`,
  },
}
