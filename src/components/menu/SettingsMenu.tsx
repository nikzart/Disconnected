import { motion } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function SettingsMenu() {
  const setScreen = useGameStore((s) => s.setScreen)
  const settings = useGameStore((s) => s.settings)
  const updateSettings = useGameStore((s) => s.updateSettings)

  const SliderRow = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: number
    onChange: (v: number) => void
  }) => (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-xs text-cyber-text w-32">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-cyber-cyan"
      />
      <span className="font-mono text-xs text-cyber-muted w-10 text-right">
        {Math.round(value * 100)}%
      </span>
    </div>
  )

  const ToggleRow = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: boolean
    onChange: (v: boolean) => void
  }) => (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-xs text-cyber-text">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'font-mono text-xs px-3 py-1 border rounded-sm transition-all',
          value
            ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
            : 'border-cyber-border text-cyber-muted',
        )}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  )

  const speedOptions = ['slow', 'normal', 'fast', 'instant'] as const

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center bg-cyber-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md px-6">
        <h2 className="font-mono text-xl text-cyber-cyan text-glow-cyan tracking-widest mb-8 text-center">
          // SETTINGS
        </h2>

        <div className="space-y-6">
          {/* Audio */}
          <div>
            <h3 className="font-mono text-xs text-cyber-muted tracking-wider uppercase mb-3">
              AUDIO
            </h3>
            <div className="space-y-3">
              <SliderRow
                label="Master"
                value={settings.masterVolume}
                onChange={(v) => updateSettings({ masterVolume: v })}
              />
              <SliderRow
                label="Music"
                value={settings.musicVolume}
                onChange={(v) => updateSettings({ musicVolume: v })}
              />
              <SliderRow
                label="SFX"
                value={settings.sfxVolume}
                onChange={(v) => updateSettings({ sfxVolume: v })}
              />
            </div>
          </div>

          {/* Display */}
          <div>
            <h3 className="font-mono text-xs text-cyber-muted tracking-wider uppercase mb-3">
              DISPLAY
            </h3>
            <div className="space-y-3">
              <ToggleRow
                label="CRT Effect"
                value={settings.crtEffect}
                onChange={(v) => updateSettings({ crtEffect: v })}
              />
              <ToggleRow
                label="Scanlines"
                value={settings.scanlines}
                onChange={(v) => updateSettings({ scanlines: v })}
              />
              <ToggleRow
                label="Screen Shake"
                value={settings.screenShake}
                onChange={(v) => updateSettings({ screenShake: v })}
              />
            </div>
          </div>

          {/* Text Speed */}
          <div>
            <h3 className="font-mono text-xs text-cyber-muted tracking-wider uppercase mb-3">
              TEXT SPEED
            </h3>
            <div className="flex gap-2">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ textSpeed: speed })}
                  className={cn(
                    'flex-1 font-mono text-xs py-1.5 border rounded-sm transition-all uppercase',
                    settings.textSpeed === speed
                      ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
                      : 'border-cyber-border text-cyber-muted hover:text-cyber-text',
                  )}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={() => setScreen('main-menu')}>
            BACK
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
