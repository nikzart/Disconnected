import { useState, useCallback } from 'react'
import type { MinigameConfig, MinigameResult, NetworkScannerData, NetworkNode } from '@/types/minigame'
import { cn } from '@/lib/utils'

interface NetworkScannerProps {
  config: MinigameConfig
  onComplete: (result: MinigameResult) => void
}

export function NetworkScanner({ config, onComplete }: NetworkScannerProps) {
  const data = config.data as NetworkScannerData
  const [scannedNodes, setScannedNodes] = useState<Set<string>>(new Set([data.startNode]))
  const [exploitedNodes, setExploitedNodes] = useState<Set<string>>(new Set([data.startNode]))
  const [selectedNode, setSelectedNode] = useState<string | null>(data.startNode)
  const [scanning, setScanning] = useState(false)

  const canScan = useCallback((nodeId: string) => {
    return data.edges.some(
      (e) =>
        (exploitedNodes.has(e.from) && e.to === nodeId) ||
        (exploitedNodes.has(e.to) && e.from === nodeId),
    )
  }, [data.edges, exploitedNodes])

  const scanNode = useCallback((nodeId: string) => {
    if (scannedNodes.has(nodeId) || !canScan(nodeId)) return
    setScanning(true)
    setTimeout(() => {
      setScannedNodes((prev) => new Set([...prev, nodeId]))
      setScanning(false)
    }, 800)
  }, [scannedNodes, canScan])

  const exploitNode = useCallback((node: NetworkNode) => {
    if (!scannedNodes.has(node.id) || exploitedNodes.has(node.id)) return
    if (node.secured && !node.vulnerability) return

    setExploitedNodes((prev) => new Set([...prev, node.id]))

    if (node.id === data.targetNode) {
      onComplete('success')
    }
  }, [scannedNodes, exploitedNodes, data.targetNode, onComplete])

  const getNodeColor = (node: NetworkNode) => {
    if (node.id === data.targetNode && exploitedNodes.has(node.id)) return '#39ff14'
    if (node.id === data.targetNode) return '#ff3333'
    if (exploitedNodes.has(node.id)) return '#00ffd5'
    if (scannedNodes.has(node.id)) return '#ffaa00'
    if (canScan(node.id)) return '#666680'
    return '#1a1a2e'
  }

  return (
    <div className="h-full flex flex-col bg-cyber-black">
      <div className="px-4 py-2 border-b border-cyber-border">
        <h2 className="font-mono text-sm text-cyber-cyan tracking-wider">NETWORK SCANNER</h2>
        <p className="font-mono text-xs text-cyber-muted">{config.description}</p>
      </div>

      <div className="flex-1 relative">
        <svg className="w-full h-full">
          {/* Edges */}
          {data.edges.map((edge, i) => {
            const from = data.nodes.find((n) => n.id === edge.from)
            const to = data.nodes.find((n) => n.id === edge.to)
            if (!from || !to) return null

            const isActive = exploitedNodes.has(edge.from) || exploitedNodes.has(edge.to)

            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? 'rgba(0,255,213,0.3)' : 'rgba(26,26,46,0.5)'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={edge.encrypted ? '4 4' : undefined}
              />
            )
          })}

          {/* Nodes */}
          {data.nodes.map((node) => {
            const color = getNodeColor(node)
            const isSelected = selectedNode === node.id
            const isAccessible = canScan(node.id) || exploitedNodes.has(node.id)

            return (
              <g
                key={node.id}
                className={cn('cursor-pointer', !isAccessible && 'opacity-30')}
                onClick={() => {
                  setSelectedNode(node.id)
                  if (!scannedNodes.has(node.id) && canScan(node.id)) {
                    scanNode(node.id)
                  }
                }}
              >
                {/* Glow */}
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={28} fill={color} opacity={0.1} />
                )}
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill="#0a0a0f"
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                />
                {/* Icon text */}
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fontSize={8}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {node.type === 'server' ? 'SRV' : node.type === 'router' ? 'RTR' :
                   node.type === 'firewall' ? 'FW' : node.type === 'target' ? 'TGT' : 'END'}
                </text>
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + 30}
                  textAnchor="middle"
                  fill="#666680"
                  fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Node detail panel */}
        {selectedNode && (() => {
          const node = data.nodes.find((n) => n.id === selectedNode)
          if (!node) return null

          return (
            <div className="absolute bottom-4 right-4 w-56 bg-cyber-dark/95 border border-cyber-border rounded-sm p-3">
              <div className="font-mono text-xs text-cyber-cyan mb-1">{node.label}</div>
              <div className="font-mono text-[10px] text-cyber-muted mb-2">
                Type: {node.type} | {node.secured ? 'SECURED' : 'OPEN'}
              </div>
              {scannedNodes.has(node.id) && node.vulnerability && (
                <div className="font-mono text-[10px] text-cyber-amber mb-2">
                  Vulnerability: {node.vulnerability}
                </div>
              )}
              <div className="flex gap-2">
                {!scannedNodes.has(node.id) && canScan(node.id) && (
                  <button
                    onClick={() => scanNode(node.id)}
                    disabled={scanning}
                    className="flex-1 font-mono text-[10px] py-1 border border-cyber-amber text-cyber-amber hover:bg-cyber-amber/10 disabled:opacity-40"
                  >
                    {scanning ? 'SCANNING...' : 'SCAN'}
                  </button>
                )}
                {scannedNodes.has(node.id) && !exploitedNodes.has(node.id) && (
                  <button
                    onClick={() => exploitNode(node)}
                    className="flex-1 font-mono text-[10px] py-1 border border-cyber-green text-cyber-green hover:bg-cyber-green/10"
                  >
                    EXPLOIT
                  </button>
                )}
                {exploitedNodes.has(node.id) && (
                  <span className="font-mono text-[10px] text-cyber-green">COMPROMISED</span>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
