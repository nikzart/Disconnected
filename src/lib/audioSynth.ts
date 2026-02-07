let audioContext: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

function createGain(ctx: AudioContext, volume: number): GainNode {
  const gain = ctx.createGain()
  gain.gain.value = volume
  gain.connect(ctx.destination)
  return gain
}

export type SFXType = 'keystroke' | 'boot' | 'error' | 'success' | 'notification' | 'glitch' | 'alarm' | 'decrypt' | 'hack' | 'connect' | 'disconnect'

export function playSFX(type: SFXType, volume = 0.3) {
  const ctx = getContext()
  const now = ctx.currentTime

  switch (type) {
    case 'keystroke': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.15)
      osc.type = 'square'
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.05)
      break
    }

    case 'boot': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.4)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.6)
      gain.gain.setValueAtTime(volume * 0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.9)
      break
    }

    case 'error': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.3)
      osc.type = 'square'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.setValueAtTime(150, now + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.35)
      break
    }

    case 'success': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.25)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523, now)       // C5
      osc.frequency.setValueAtTime(659, now + 0.1)  // E5
      osc.frequency.setValueAtTime(784, now + 0.2)  // G5
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.55)
      break
    }

    case 'notification': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.2)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.setValueAtTime(1100, now + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.25)
      break
    }

    case 'glitch': {
      const bufferSize = ctx.sampleRate * 0.1
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
      }
      const source = ctx.createBufferSource()
      const gain = createGain(ctx, volume * 0.15)
      source.buffer = buffer
      source.connect(gain)
      source.start(now)
      break
    }

    case 'alarm': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.3)
      osc.type = 'square'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.setValueAtTime(600, now + 0.15)
      osc.frequency.setValueAtTime(800, now + 0.3)
      osc.frequency.setValueAtTime(600, now + 0.45)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.65)
      break
    }

    case 'decrypt': {
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator()
        const gain = createGain(ctx, volume * 0.1)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400 + i * 200, now + i * 0.08)
        gain.gain.setValueAtTime(volume * 0.1, now + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.1)
        osc.connect(gain)
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.12)
      }
      break
    }

    case 'hack': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.2)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.linearRampToValueAtTime(2000, now + 0.5)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.65)
      break
    }

    case 'connect': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.2)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.45)
      break
    }

    case 'disconnect': {
      const osc = ctx.createOscillator()
      const gain = createGain(ctx, volume * 0.2)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.45)
      break
    }
  }
}

export type AmbientType = 'dark' | 'tense' | 'hack' | 'calm' | 'danger'

let currentAmbientNodes: { oscillators: OscillatorNode[]; gains: GainNode[] } | null = null

export function startAmbient(type: AmbientType, volume = 0.15) {
  stopAmbient()

  const ctx = getContext()
  const now = ctx.currentTime
  const oscillators: OscillatorNode[] = []
  const gains: GainNode[] = []

  const masterGain = ctx.createGain()
  masterGain.gain.value = volume
  masterGain.connect(ctx.destination)

  const createOsc = (freq: number, type: OscillatorType, vol: number, detune = 0) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    gain.gain.value = vol
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start(now)
    oscillators.push(osc)
    gains.push(gain)
    return { osc, gain }
  }

  switch (type) {
    case 'dark': {
      createOsc(55, 'sine', 0.3)
      createOsc(55.5, 'sine', 0.2, 5)
      createOsc(82.5, 'sine', 0.1)
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.1
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 3
      lfo.connect(lfoGain)
      const { osc: droneOsc } = createOsc(110, 'sawtooth', 0.05)
      lfoGain.connect(droneOsc.frequency)
      lfo.start(now)
      oscillators.push(lfo)
      gains.push(lfoGain)
      break
    }

    case 'tense': {
      createOsc(73.4, 'sine', 0.25)
      createOsc(73.8, 'sine', 0.2, 8)
      createOsc(110, 'triangle', 0.08)
      createOsc(146.8, 'sine', 0.05)
      break
    }

    case 'hack': {
      createOsc(82.4, 'sawtooth', 0.08)
      createOsc(82.6, 'sawtooth', 0.06, 3)
      createOsc(164.8, 'square', 0.02)
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 2
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.02
      lfo.connect(lfoGain)
      lfoGain.connect(masterGain.gain)
      lfo.start(now)
      oscillators.push(lfo)
      gains.push(lfoGain)
      break
    }

    case 'calm': {
      createOsc(65.4, 'sine', 0.2)
      createOsc(98.0, 'sine', 0.1)
      createOsc(130.8, 'sine', 0.05)
      break
    }

    case 'danger': {
      createOsc(55, 'sawtooth', 0.12)
      createOsc(58.3, 'sawtooth', 0.1)
      createOsc(110, 'square', 0.03)
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.5
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.05
      lfo.connect(lfoGain)
      lfoGain.connect(masterGain.gain)
      lfo.start(now)
      oscillators.push(lfo)
      gains.push(lfoGain)
      break
    }
  }

  currentAmbientNodes = { oscillators, gains }
}

export function stopAmbient() {
  if (currentAmbientNodes) {
    const ctx = getContext()
    const now = ctx.currentTime
    for (const gain of currentAmbientNodes.gains) {
      try {
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1)
      } catch {
        // already stopped
      }
    }
    for (const osc of currentAmbientNodes.oscillators) {
      try {
        osc.stop(now + 1.1)
      } catch {
        // already stopped
      }
    }
    currentAmbientNodes = null
  }
}
