export function CRTEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      {/* Slight color fringing on edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,20,0.2) 100%)',
        }}
      />
    </div>
  )
}
