export function ScanlineOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />
      {/* Moving scanline */}
      <div
        className="absolute left-0 right-0 h-[2px] animate-scanline"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,213,0.06), transparent)',
        }}
      />
    </div>
  )
}
