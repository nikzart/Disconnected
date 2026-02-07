import { MACHINES } from '@/data/terminal/filesystems'
import { isDirectory, isFile, type VFSDirectory, type VFSEntry } from '@/types/terminal'

export interface CommandResult {
  lines: Array<{ type: 'output' | 'error' | 'system' | 'success' | 'warning' | 'ascii'; content: string }>
  actions?: Array<{ type: string; target: string; value?: string | number | boolean }>
  newPath?: string[]
  newMachine?: string
}

type CommandHandler = (args: string[], state: TerminalState) => CommandResult

interface TerminalState {
  currentMachine: string
  currentPath: string[]
  flags: Record<string, boolean>
}

function resolvePath(pathParts: string[], currentPath: string[]): string[] {
  const result = [...currentPath]

  for (const part of pathParts) {
    if (part === '..') {
      if (result.length > 1) result.pop()
    } else if (part === '.') {
      continue
    } else if (part === '~') {
      return ['~']
    } else {
      result.push(part)
    }
  }

  return result
}

function getEntry(path: string[], machine: string): VFSEntry | null {
  const fs = MACHINES[machine]?.filesystem
  if (!fs) return null

  if (path.length === 0 || (path.length === 1 && (path[0] === '~' || path[0] === '/'))) {
    return fs
  }

  let current: VFSEntry = fs
  for (let i = 1; i < path.length; i++) {
    if (!isDirectory(current)) return null
    const next: VFSEntry | undefined = current.children[path[i]]
    if (!next) return null
    current = next
  }
  return current
}

function listDir(dir: VFSDirectory, showHidden: boolean): string[] {
  return Object.keys(dir.children)
    .filter((name) => showHidden || !dir.children[name].hidden)
    .sort()
}

const COMMANDS: Record<string, CommandHandler> = {
  help: (_args) => {
    return {
      lines: [
        { type: 'system', content: 'Available commands:' },
        { type: 'output', content: '  help              — Show this help message' },
        { type: 'output', content: '  ls [path]         — List directory contents (-a for hidden)' },
        { type: 'output', content: '  cd <path>         — Change directory' },
        { type: 'output', content: '  cat <file>        — Display file contents' },
        { type: 'output', content: '  grep <pattern> <file> — Search file for pattern' },
        { type: 'output', content: '  clear             — Clear terminal' },
        { type: 'output', content: '  pwd               — Print working directory' },
        { type: 'output', content: '  whoami            — Display current user' },
        { type: 'output', content: '  history           — Show command history' },
        { type: 'output', content: '' },
        { type: 'system', content: 'Hacking tools:' },
        { type: 'output', content: '  ssh <target>      — Connect to remote machine' },
        { type: 'output', content: '  nmap <target>     — Scan network target' },
        { type: 'output', content: '  crack <target>    — Attempt password crack' },
        { type: 'output', content: '  decrypt <file>    — Decrypt encrypted file' },
        { type: 'output', content: '  download <file>   — Download file to local' },
        { type: 'output', content: '  mail              — Check messages' },
        { type: 'output', content: '  connect <contact> — Open secure chat channel' },
        { type: 'output', content: '  scan              — Scan for clues in current dir' },
        { type: 'output', content: '  board             — Open investigation board' },
      ],
    }
  },

  ls: (args, state) => {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al')
    const pathArg = args.find((a) => !a.startsWith('-'))
    let targetPath = state.currentPath

    if (pathArg) {
      targetPath = resolvePath(pathArg.split('/'), state.currentPath)
    }

    const entry = getEntry(targetPath, state.currentMachine)
    if (!entry || !isDirectory(entry)) {
      return { lines: [{ type: 'error', content: `ls: cannot access '${pathArg || '.'}': No such directory` }] }
    }

    const items = listDir(entry, showHidden)
    if (items.length === 0) {
      return { lines: [{ type: 'output', content: '(empty directory)' }] }
    }

    const lines = items.map((name) => {
      const child = entry.children[name]
      const isDir = isDirectory(child)
      const prefix = isDir ? 'd' : '-'
      const suffix = isDir ? '/' : ''
      const encrypted = !isDir && isFile(child) && child.encrypted
      return { type: 'output' as const, content: `${prefix}  ${name}${suffix}  ${encrypted ? '[ENCRYPTED]' : ''}` }
    })

    return { lines }
  },

  cd: (args, state) => {
    if (args.length === 0) {
      return { lines: [], newPath: ['~'] }
    }

    const targetPath = resolvePath(args[0].split('/'), state.currentPath)
    const entry = getEntry(targetPath, state.currentMachine)

    if (!entry) {
      return { lines: [{ type: 'error', content: `cd: no such directory: ${args[0]}` }] }
    }
    if (!isDirectory(entry)) {
      return { lines: [{ type: 'error', content: `cd: not a directory: ${args[0]}` }] }
    }

    return { lines: [], newPath: targetPath }
  },

  cat: (args, state) => {
    if (args.length === 0) {
      return { lines: [{ type: 'error', content: 'cat: missing file operand' }] }
    }

    const filePath = resolvePath(args[0].split('/'), state.currentPath)
    const entry = getEntry(filePath, state.currentMachine)

    if (!entry) {
      // Try in current directory
      const currentDir = getEntry(state.currentPath, state.currentMachine)
      if (currentDir && isDirectory(currentDir) && currentDir.children[args[0]]) {
        const file = currentDir.children[args[0]]
        if (isDirectory(file)) {
          return { lines: [{ type: 'error', content: `cat: ${args[0]}: Is a directory` }] }
        }

        if (file.encrypted) {
          return {
            lines: [
              { type: 'warning', content: `[ENCRYPTED] ${args[0]} — Use 'decrypt ${args[0]}' to decrypt` },
            ],
          }
        }

        const actions: CommandResult['actions'] = []
        if (file.onRead) {
          actions.push({ type: 'trigger', target: file.onRead })
        }

        return {
          lines: file.content.split('\n').map((line) => ({ type: 'output' as const, content: line })),
          actions,
        }
      }
      return { lines: [{ type: 'error', content: `cat: ${args[0]}: No such file` }] }
    }

    if (isDirectory(entry)) {
      return { lines: [{ type: 'error', content: `cat: ${args[0]}: Is a directory` }] }
    }

    if (entry.encrypted) {
      return {
        lines: [{ type: 'warning', content: `[ENCRYPTED] ${args[0]} — Use 'decrypt ${args[0]}' to decrypt` }],
      }
    }

    const actions: CommandResult['actions'] = []
    if (entry.onRead) {
      actions.push({ type: 'trigger', target: entry.onRead })
    }

    return {
      lines: entry.content.split('\n').map((line) => ({ type: 'output' as const, content: line })),
      actions,
    }
  },

  grep: (args, state) => {
    if (args.length < 2) {
      return { lines: [{ type: 'error', content: 'Usage: grep <pattern> <file>' }] }
    }

    const pattern = args[0]
    const fileName = args[1]

    const currentDir = getEntry(state.currentPath, state.currentMachine)
    if (!currentDir || !isDirectory(currentDir)) {
      return { lines: [{ type: 'error', content: 'grep: cannot access current directory' }] }
    }

    const file = currentDir.children[fileName]
    if (!file || isDirectory(file)) {
      return { lines: [{ type: 'error', content: `grep: ${fileName}: No such file` }] }
    }

    if (file.encrypted) {
      return { lines: [{ type: 'error', content: `grep: ${fileName}: File is encrypted` }] }
    }

    const regex = new RegExp(pattern, 'gi')
    const matches = file.content.split('\n').filter((line) => regex.test(line))

    if (matches.length === 0) {
      return { lines: [{ type: 'output', content: '(no matches)' }] }
    }

    return {
      lines: matches.map((line) => ({ type: 'success' as const, content: line.trim() })),
    }
  },

  pwd: (_args, state) => {
    return { lines: [{ type: 'output', content: state.currentPath.join('/') }] }
  },

  whoami: (_args, state) => {
    const user = state.currentMachine === 'localhost' ? 'echo' : 'guest'
    return { lines: [{ type: 'output', content: user }] }
  },

  clear: () => {
    return { lines: [{ type: 'system', content: '__CLEAR__' }] }
  },

  ssh: (args, state) => {
    if (args.length === 0) {
      return { lines: [{ type: 'error', content: 'Usage: ssh <hostname|ip>' }] }
    }

    const target = args[0]
    const machine = Object.values(MACHINES).find(
      (m) => m.hostname === target || m.ip === target || m.id === target,
    )

    if (!machine) {
      return {
        lines: [{ type: 'error', content: `ssh: Could not resolve hostname ${target}` }],
      }
    }

    if (machine.id === state.currentMachine) {
      return { lines: [{ type: 'warning', content: 'Already connected to this machine.' }] }
    }

    if (machine.requiresAccess && !machine.accessGranted && !state.flags[`access_${machine.id}`]) {
      return {
        lines: [
          { type: 'error', content: `ssh: Connection to ${machine.hostname} refused.` },
          { type: 'warning', content: 'Access denied. Use crack or find credentials to gain access.' },
        ],
      }
    }

    return {
      lines: [
        { type: 'system', content: `Connecting to ${machine.hostname} (${machine.ip})...` },
        { type: 'success', content: 'Connection established.' },
        ...(machine.motd ? machine.motd.split('\n').map((l) => ({ type: 'system' as const, content: l })) : []),
      ],
      newMachine: machine.id,
      newPath: machine.filesystem.name === '~' ? ['~'] : ['/'],
    }
  },

  nmap: (args) => {
    if (args.length === 0) {
      return {
        lines: [
          { type: 'system', content: 'Starting NMAP scan...' },
          { type: 'output', content: '' },
          { type: 'output', content: 'Discovered hosts:' },
          ...Object.values(MACHINES).map((m) => ({
            type: 'output' as const,
            content: `  ${m.ip.padEnd(16)} ${m.hostname.padEnd(20)} ${m.requiresAccess ? '[SECURED]' : '[OPEN]'}`,
          })),
          { type: 'output', content: '' },
          { type: 'output', content: `${Object.keys(MACHINES).length} hosts found.` },
        ],
      }
    }

    const target = args[0]
    const machine = Object.values(MACHINES).find(
      (m) => m.hostname === target || m.ip === target || m.id === target,
    )

    if (!machine) {
      return { lines: [{ type: 'error', content: `nmap: Host ${target} not found` }] }
    }

    return {
      lines: [
        { type: 'system', content: `Scanning ${machine.hostname} (${machine.ip})...` },
        { type: 'output', content: '' },
        { type: 'output', content: `Host: ${machine.hostname}` },
        { type: 'output', content: `IP: ${machine.ip}` },
        { type: 'output', content: `Status: ${machine.requiresAccess ? 'SECURED' : 'OPEN'}` },
        { type: 'output', content: 'Open ports:' },
        { type: 'output', content: '  22/tcp   ssh' },
        { type: 'output', content: '  80/tcp   http' },
        { type: 'output', content: '  443/tcp  https' },
        ...(machine.id === 'nexagen-research' ? [
          { type: 'output' as const, content: '  8080/tcp http-alt [UNPATCHED]' },
          { type: 'warning' as const, content: '  ↑ Potential vulnerability detected on port 8080' },
        ] : []),
      ],
    }
  },

  crack: (args, _state) => {
    if (args.length === 0) {
      return { lines: [{ type: 'error', content: 'Usage: crack <target>' }] }
    }

    const target = args[0]
    const machine = Object.values(MACHINES).find(
      (m) => m.hostname === target || m.ip === target || m.id === target,
    )

    if (!machine) {
      return { lines: [{ type: 'error', content: `crack: Unknown target ${target}` }] }
    }

    if (!machine.requiresAccess) {
      return { lines: [{ type: 'warning', content: 'Target does not require credentials.' }] }
    }

    return {
      lines: [
        { type: 'system', content: `Initiating password cracker against ${machine.hostname}...` },
        { type: 'system', content: 'Launching interactive cracker module...' },
      ],
      actions: [
        { type: 'trigger_minigame', target: `crack_${machine.id}` },
      ],
    }
  },

  decrypt: (args, state) => {
    if (args.length === 0) {
      return { lines: [{ type: 'error', content: 'Usage: decrypt <file>' }] }
    }

    const fileName = args[0]
    const currentDir = getEntry(state.currentPath, state.currentMachine)
    if (!currentDir || !isDirectory(currentDir)) {
      return { lines: [{ type: 'error', content: 'decrypt: cannot access current directory' }] }
    }

    const file = currentDir.children[fileName]
    if (!file || isDirectory(file)) {
      return { lines: [{ type: 'error', content: `decrypt: ${fileName}: No such file` }] }
    }

    if (!file.encrypted) {
      return { lines: [{ type: 'warning', content: `${fileName} is not encrypted.` }] }
    }

    return {
      lines: [
        { type: 'system', content: `Analyzing encryption on ${fileName}...` },
        { type: 'system', content: 'Launching decryption module...' },
      ],
      actions: [
        { type: 'trigger_minigame', target: `decrypt_${fileName}` },
      ],
    }
  },

  download: (args, state) => {
    if (args.length === 0) {
      return { lines: [{ type: 'error', content: 'Usage: download <file>' }] }
    }

    const fileName = args[0]
    const currentDir = getEntry(state.currentPath, state.currentMachine)
    if (!currentDir || !isDirectory(currentDir)) {
      return { lines: [{ type: 'error', content: 'download: cannot access current directory' }] }
    }

    const file = currentDir.children[fileName]
    if (!file || isDirectory(file)) {
      return { lines: [{ type: 'error', content: `download: ${fileName}: No such file` }] }
    }

    return {
      lines: [
        { type: 'system', content: `Downloading ${fileName}...` },
        { type: 'success', content: `${fileName} saved to ~/downloads/` },
      ],
      actions: [
        { type: 'add_file', target: fileName, value: file.content },
      ],
    }
  },

  mail: (_args, state) => {
    if (state.currentMachine !== 'localhost') {
      return { lines: [{ type: 'error', content: 'mail: Only available on local machine' }] }
    }

    return {
      lines: [
        { type: 'system', content: 'Checking encrypted mail...' },
        { type: 'output', content: '' },
        { type: 'output', content: 'INBOX:' },
        { type: 'output', content: '  1. [NEW] Unknown sender — (no subject)' },
        { type: 'output', content: '  2. [NEW] Zara Okonkwo — About Dr. Vasquez' },
        { type: 'output', content: '' },
        { type: 'output', content: 'Read with: cat mail/inbox/<filename>' },
      ],
    }
  },

  connect: (args) => {
    if (args.length === 0) {
      return { lines: [{ type: 'error', content: 'Usage: connect <contact>' }] }
    }

    return {
      lines: [
        { type: 'system', content: `Opening secure channel to ${args[0]}...` },
      ],
      actions: [
        { type: 'set_view', target: 'chat' },
        { type: 'set_active_contact', target: args[0] },
      ],
    }
  },

  scan: (_args, state) => {
    const currentDir = getEntry(state.currentPath, state.currentMachine)
    if (!currentDir || !isDirectory(currentDir)) {
      return { lines: [{ type: 'error', content: 'scan: cannot scan current directory' }] }
    }

    const items = Object.values(currentDir.children)
    const interesting = items.filter((item) => {
      if (isFile(item)) return item.onRead || item.encrypted || item.hidden
      return item.hidden
    })

    if (interesting.length === 0) {
      return {
        lines: [
          { type: 'system', content: 'Scanning for points of interest...' },
          { type: 'output', content: 'No notable items found in current directory.' },
        ],
      }
    }

    return {
      lines: [
        { type: 'system', content: 'Scanning for points of interest...' },
        { type: 'output', content: '' },
        ...interesting.map((item) => {
          const tags: string[] = []
          if (isFile(item) && item.encrypted) tags.push('[ENCRYPTED]')
          if (item.hidden) tags.push('[HIDDEN]')
          if (isFile(item) && item.onRead) tags.push('[CLUE]')
          return { type: 'warning' as const, content: `  ${item.name} ${tags.join(' ')}` }
        }),
        { type: 'output', content: '' },
        { type: 'output', content: `${interesting.length} items of interest found.` },
      ],
    }
  },

  board: () => {
    return {
      lines: [{ type: 'system', content: 'Opening investigation board...' }],
      actions: [{ type: 'set_view', target: 'investigation' }],
    }
  },

  history: () => {
    // History is handled by the terminal component itself
    return {
      lines: [{ type: 'system', content: 'Command history:' }],
    }
  },

  exit: (_args, state) => {
    if (state.currentMachine !== 'localhost') {
      return {
        lines: [
          { type: 'system', content: 'Disconnecting...' },
          { type: 'success', content: 'Returned to local machine.' },
        ],
        newMachine: 'localhost',
        newPath: ['~'],
      }
    }
    return {
      lines: [{ type: 'output', content: 'You can\'t exit reality. Use Esc for menu.' }],
    }
  },

  logout: (...args) => COMMANDS.exit(...args),
  disconnect: (...args) => COMMANDS.exit(...args),
}

export function executeCommand(
  input: string,
  state: TerminalState,
): CommandResult {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [] }

  const parts = trimmed.split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  const handler = COMMANDS[command]
  if (!handler) {
    return {
      lines: [{ type: 'error', content: `Command not found: ${command}. Type 'help' for available commands.` }],
    }
  }

  return handler(args, state)
}

export function getCompletions(partial: string, state: TerminalState): string[] {
  const parts = partial.split(/\s+/)

  if (parts.length <= 1) {
    // Command completion
    return Object.keys(COMMANDS).filter((cmd) => cmd.startsWith(parts[0].toLowerCase()))
  }

  // File/directory completion
  const currentDir = getEntry(state.currentPath, state.currentMachine)
  if (!currentDir || !isDirectory(currentDir)) return []

  const lastPart = parts[parts.length - 1]
  return Object.keys(currentDir.children).filter((name) => name.startsWith(lastPart))
}
