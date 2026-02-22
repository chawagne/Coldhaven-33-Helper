import { HexCell } from './HexCell'
import type { HexData } from './types'
import { ROWS, MAX_COLS, getColsForRow, rowColToId } from './hexUtils'

const RADIUS = 28
const SQ3 = Math.sqrt(3)

/** Pointy-top rectangular layout: row offset (odd-r). */
function hexToPixel(row: number, col: number): { x: number; y: number } {
  const w = SQ3 * RADIUS   // horizontal center-to-center
  const h = 1.5 * RADIUS   // vertical step
  const x = w * col + (row % 2 === 1 ? w / 2 : 0) + RADIUS
  const y = h * row + RADIUS
  return { x, y }
}

export interface HexGridProps {
  hexes: HexData[]
  onHexSelect: (id: string) => void
}

export function HexGrid({ hexes, onHexSelect }: HexGridProps) {
  const hexMap = new Map(hexes.map((h) => [h.id, h]))
  const w = SQ3 * RADIUS
  const h = 1.5 * RADIUS
  const width = MAX_COLS * w + (ROWS > 1 ? w / 2 : 0) + 2 * RADIUS
  const height = ROWS * h + 2 * RADIUS

  return (
    <svg
      width={width}
      height={height}
      className="bg-slate-100 rounded-lg shadow-lg"
      viewBox={`0 0 ${width} ${height}`}
    >
      {Array.from({ length: ROWS }, (_, row) => {
        const cols = getColsForRow(row)
        return Array.from({ length: cols }, (_, col) => {
          const id = rowColToId(row, col)
          const hex = hexMap.get(id)
          if (!hex) {
            console.warn(`Hex ${id} not found in hexes array`)
            return null
          }
          const { x, y } = hexToPixel(row, col)
          return (
            <HexCell
              key={id}
              hex={hex}
              pixelX={x}
              pixelY={y}
              onSelect={onHexSelect}
              hexesMap={hexMap}
            />
          )
        })
      })}
    </svg>
  )
}
