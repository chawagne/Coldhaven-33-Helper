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
}

export function HexCell({ hex, pixelX, pixelY, onSelect, hexesMap }: HexCellProps) {
  const points = getPointyHexPoints(pixelX, pixelY)
  const isEmpty = hex.number == null || hex.number === 0
  const fill = hex.isIntersection
    ? 'rgb(34 197 94)' // green-500
    : isEmpty
      ? 'rgb(229 231 235)' // gray-200
      : 'white'
  const stroke = hex.isIntersection ? 'rgb(22 163 74)' : 'rgb(156 163 175)'

  // Get the 3 source numbers for intersection hexes
  const sourceNumbers = hex.intersectionSources
    ? hex.intersectionSources
        .map((sourceId) => hexesMap.get(sourceId)?.number)
        .filter((n): n is number => n != null && n > 0)
        .sort((a, b) => a - b)
    : null

  return (
    <g
      className="cursor-pointer select-none"
      onClick={() => onSelect(hex.id)}
      style={{ transition: 'fill 0.2s ease' }}
    >
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        className="hover:opacity-90"
      />
      {!isEmpty && (
        <text
          x={pixelX}
          y={pixelY}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-lg font-semibold fill-gray-900 pointer-events-none"
        >
          {hex.number}
        </text>
      )}
      {hex.isIntersection && sourceNumbers && sourceNumbers.length === 3 && (
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
