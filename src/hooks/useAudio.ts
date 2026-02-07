import { useEffect, useCallback } from 'react'
import { audioEngine } from '@/engine/AudioEngine'
import type { SFXType } from '@/lib/audioSynth'
import type { AmbientMood } from '@/stores/audioStore'

export function useAudio() {
  useEffect(() => {
    const handleInteraction = () => {
      audioEngine.init()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  const play = useCallback((type: SFXType) => {
    audioEngine.playSFX(type)
  }, [])

  const setAmbient = useCallback((mood: AmbientMood) => {
    audioEngine.setAmbient(mood)
  }, [])

  const stop = useCallback(() => {
    audioEngine.stop()
  }, [])

  return { play, setAmbient, stop }
}
