import { playSFX, startAmbient, stopAmbient, type SFXType, type AmbientType } from '@/lib/audioSynth'
import { useGameStore } from '@/stores/gameStore'
import { useAudioStore, type AmbientMood } from '@/stores/audioStore'

class AudioEngineClass {
  private initialized = false

  init() {
    if (this.initialized) return
    this.initialized = true
    useAudioStore.getState().setInitialized(true)

    // Subscribe to ambient mood changes
    useAudioStore.subscribe((state, prevState) => {
      if (state.currentAmbient !== prevState.currentAmbient) {
        this.handleAmbientChange(state.currentAmbient)
      }
    })
  }

  playSFX(type: SFXType) {
    const settings = useGameStore.getState().settings
    const volume = settings.masterVolume * settings.sfxVolume
    if (volume <= 0) return
    playSFX(type, volume)
  }

  private handleAmbientChange(mood: AmbientMood) {
    const settings = useGameStore.getState().settings
    const volume = settings.masterVolume * settings.musicVolume

    if (mood === 'none' || volume <= 0) {
      stopAmbient()
      return
    }

    startAmbient(mood as AmbientType, volume)
  }

  setAmbient(mood: AmbientMood) {
    useAudioStore.getState().setCurrentAmbient(mood)
  }

  stop() {
    stopAmbient()
  }
}

export const audioEngine = new AudioEngineClass()
