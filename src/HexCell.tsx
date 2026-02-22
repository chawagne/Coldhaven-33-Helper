import type { HexData } from './types'

const RADIUS = 28

/** Pointy-top hex: point at top (angle 0 = top), flat sides left/right. */
function getPointyHexPoints(cx: number, cy: number): string {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i // 0 = top, then 60°, 120°...
    const x = cx + RADIUS * Math.sin(angle)
    const y = cy + RADIUS * Math.cos(angle)
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return points.join(' ')
}

export interface HexCellProps {
  hex: HexData
  pixelX: number
  pixelY: number
  onSelect: (id: string) => void
  hexesMap: Map<string, HexData>
  draggingHexId: string | null
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onDrop: (id: string) => void
}

export function HexCell({ 
  hex, 
  pixelX, 
  pixelY, 
  onSelect, 
  hexesMap,
  draggingHexId,
  onDragStart,
  onDragEnd,
  onDrop
}: HexCellProps) {
  const points = getPointyHexPoints(pixelX, pixelY)
  const isEmpty = hex.number == null || hex.number === 0
  const isDragging = draggingHexId === hex.id
  const isDragTarget = draggingHexId != null && draggingHexId !== hex.id && isEmpty
  
  const fill = hex.isIntersection
    ? 'rgb(34 197 94)' // green-500
    : isEmpty
      ? isDragTarget
        ? 'rgb(200 220 255)' // light blue when drag target
        : 'rgb(229 231 235)' // gray-200
      : isDragging
        ? 'rgb(200 200 200)' // gray when dragging
        : 'white'
  const stroke = hex.isIntersection 
    ? 'rgb(22 163 74)' 
    : isDragTarget
      ? 'rgb(59 130 246)' // blue when drag target
      : 'rgb(156 163 175)'

  // Get the source numbers for intersection hexes (3 or more)
  const sourceNumbers = hex.intersectionSources
    ? hex.intersectionSources
        .map((sourceId) => hexesMap.get(sourceId)?.number)
        .filter((n): n is number => n != null && n > 0)
        .sort((a, b) => a - b)
    : null

  const handleNumberMouseDown = (e: React.MouseEvent) => {
    if (!isEmpty && e.button === 0) {
      e.stopPropagation()
      e.preventDefault()
      onDragStart(hex.id)
    }
  }

  const handlePolygonMouseUp = (e: React.MouseEvent) => {
    if (draggingHexId && draggingHexId !== hex.id) {
      e.stopPropagation()
      onDrop(hex.id)
    }
  }

  const handlePolygonMouseLeave = () => {
    // Reset drag state if mouse leaves while dragging
    if (draggingHexId) {
      // Keep dragging state, just visual feedback
    }
  }

  return (
    <g
      className="cursor-pointer select-none"
      onClick={() => onSelect(hex.id)}
      style={{ transition: 'fill 0.2s ease', opacity: isDragging ? 0.5 : 1 }}
    >
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={isDragTarget ? 2.5 : 1.5}
        className="hover:opacity-90"
        onMouseUp={handlePolygonMouseUp}
        onMouseLeave={handlePolygonMouseLeave}
      />
      {!isEmpty && (
        <text
          x={pixelX}
          y={pixelY}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-lg font-semibold fill-gray-900"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', pointerEvents: 'all' }}
          onMouseDown={handleNumberMouseDown}
        >
          {hex.number}
        </text>
      )}
      {hex.isIntersection && sourceNumbers && sourceNumbers.length >= 3 && (
        <text
          x={pixelX}
          y={pixelY}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs fill-gray-800 pointer-events-none font-semibold"
        >
          {sourceNumbers.join(', ')}
        </text>
      )}
    </g>
  )
}
