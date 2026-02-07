# DISCONNECTED

A story-based hacking investigative game set in 2027. You are **ECHO** (Maya Chen), a freelance white-hat hacker investigating the suspicious death of your mentor, Dr. Lena Vasquez. Uncover corporate corruption, rogue AI development, and government complicity as you hack your way to the truth about **Project LETHE** — an AI system designed to manipulate public perception at scale.

**[Play Now](https://disconnected-game-app.web.app)**

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)

---

## Story

**Year 2027.** Dr. Lena Vasquez, an AI ethics researcher at Nexagen Corp, is found dead — ruled a suicide. An anonymous encrypted message from someone called **PRISM** suggests she was silenced. You must hack, investigate, and socially engineer your way through five acts of escalating conspiracy.

**5 Acts:** Signal → Noise → Static → Interference → Disconnect

**8 Characters** with branching relationships, **30+ discoverable clues** across three investigation chains, and **6 distinct endings** shaped by your choices — from hero to villain to sacrifice.

## Features

### Terminal Emulator
A realistic terminal with command history, tab completion, and colored output. Navigate virtual filesystems across multiple machines with standard commands (`ls`, `cd`, `cat`, `grep`) and hacking tools (`ssh`, `nmap`, `crack`, `decrypt`, `inject`). Reading certain files triggers story progression and clue discovery.

### Story Engine
A JSON-driven finite state machine powers the branching narrative. Each story node supports conditions (flags, clues, relationships), actions (set flags, add clues, change relationships, trigger minigames), and multiple choice paths. The story spans ~500+ nodes across 5 chapters.

### Investigation Board
A draggable cork-board UI where discovered clues appear as cards organized across three chains: Murder, Project LETHE, and Cover-Up. Connect related clues with SVG lines to unlock new story paths. Supports pan, zoom, and filtering.

### Hacking Mini-Games
- **Password Cracker** — Wordle-style character matching with a detection meter
- **Network Scanner** — SVG topology graph where you scan and exploit nodes to reach a target
- **Code Injection** — Modify code at marked injection points to exploit vulnerabilities
- **Encryption Puzzle** — Interactive cipher wheel for Caesar, XOR, substitution, and Vigenere ciphers

### Chat & Social Engineering
Real-time chat interface with NPC contacts. Manage trust and suspicion meters during conversations. Your dialogue choices affect character relationships and unlock different story branches.

### Audio
Fully procedural — no audio files. All sounds are synthesized at runtime via the Web Audio API:
- 11 SFX types (keystroke, boot, error, success, glitch, alarm, decrypt, etc.)
- 5 ambient drone moods (dark, tense, hack, calm, danger)
- Per-channel volume controls (master, music, SFX)

### Visual Effects
- CRT scanlines and vignette overlay
- Matrix rain canvas background
- Glitch text with chromatic aberration, horizontal slice displacement, and flicker
- Typewriter text rendering
- Framer Motion transitions throughout

### Save System
3 manual save slots plus auto-save. Full serialization of game state including flags, clues, terminal state, chat history, and choices. Persisted to localStorage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + tailwind-merge + clsx |
| State | Zustand (6 domain stores) |
| Animation | Framer Motion + CSS animations |
| Icons | Lucide React |
| Audio | Web Audio API (procedural synthesis) |
| Fonts | JetBrains Mono, Fira Code, Inter |

No backend. No external image files. No audio files. All visuals are SVG components, CSS, and Canvas. All sounds are procedurally generated.

## Getting Started

```bash
# Clone
git clone https://github.com/nikzart/Disconnected.git
cd Disconnected

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
  app/              App entry point
  components/
    ui/             Button, Card, Modal, GlitchText, TypewriterText, ProgressBar
    layout/         GameLayout, TopBar, BottomBar, SidePanel
    menu/           MainMenu, PauseMenu, SettingsMenu, SaveLoadMenu, DisconnectedLogo
    terminal/       Terminal emulator
    chat/           ChatPanel with contacts and messaging
    investigation/  Investigation board with draggable clues
    minigames/      PasswordCracker, NetworkScanner, CodeInjection, EncryptionPuzzle
    narrative/      DialogueBox, CutscenePlayer
    characters/     CharacterDossier
    effects/        MatrixRain, ScanlineOverlay, CRTEffect, GlitchTransition, ParticleField
    hud/            NotificationStack
  stores/           Zustand stores (game, dialogue, terminal, investigation, audio, chat)
  engine/           StoryEngine, TerminalEngine, ConditionEvaluator, AudioEngine, SaveManager
  data/
    story/          Chapter 1-5 story nodes, clues, objectives
    terminal/       Virtual filesystem definitions
  hooks/            useAudio
  lib/              utils, constants, audioSynth, asciiArt
  types/            TypeScript type definitions
  assets/           SVG character portraits
```

## Controls

| Key | Action |
|-----|--------|
| `Enter` | Execute terminal command / Advance dialogue |
| `Tab` | Terminal autocomplete |
| `Up/Down` | Terminal command history |
| `Esc` | Pause menu |
| `Ctrl+C` | Cancel current input |
| `Ctrl+L` | Clear terminal |
| Click | Advance dialogue / Select choices |

## License

MIT
