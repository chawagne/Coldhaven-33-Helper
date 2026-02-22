import { useState, useMemo } from 'react'
import { HexGrid } from './HexGrid'
import { NumberInputModal } from './NumberInputModal'
import type { HexData } from './types'
import { rowColToId, ROWS, getColsForRow } from './hexUtils'
import { computeIntersections } from './triangulation'

function buildInitialHexes(): HexData[] {
  const hexes: HexData[] = []
  for (let row = 0; row < ROWS; row++) {
    const cols = getColsForRow(row)
    for (let col = 0; col < cols; col++) {
      hexes.push({
        id: rowColToId(row, col),
        row,
        col,
        number: null,
        isIntersection: false,
        intersectionSources: null,
      })
    }
  }
  return hexes
}

export default function App() {
  const [hexes, setHexes] = useState<HexData[]>(buildInitialHexes)
  const [selectedHexId, setSelectedHexId] = useState<string | null>(null)
  const [draggingHexId, setDraggingHexId] = useState<string | null>(null)

  const intersections = useMemo(() => computeIntersections(hexes), [hexes])

  const hexesWithIntersections = useMemo(() => {
    return hexes.map((h) => {
      const sources = intersections.get(h.id)
      return {
        ...h,
        isIntersection: sources != null,
        intersectionSources: sources ?? null,
      }
    })
  }, [hexes, intersections])

  const selectedHex = hexes.find((h) => h.id === selectedHexId)

  const handleNumberChange = (hexId: string, value: number | null) => {
    setHexes((prev) =>
      prev.map((h) =>
        h.id === hexId ? { ...h, number: value } : h
      )
    )
    setSelectedHexId(null)
  }

  const handleDragStart = (hexId: string) => {
    const hex = hexes.find((h) => h.id === hexId)
    if (hex && hex.number != null && hex.number > 0) {
      setDraggingHexId(hexId)
    }
  }

  const handleDragEnd = () => {
    setDraggingHexId(null)
  }

  const handleDrop = (targetHexId: string) => {
    if (!draggingHexId) {
      return
    }

    if (draggingHexId === targetHexId) {
      setDraggingHexId(null)
      return
    }

    const sourceHex = hexes.find((h) => h.id === draggingHexId)
    if (!sourceHex || sourceHex.number == null) {
      setDraggingHexId(null)
      return
    }

    const numberToMove = sourceHex.number

    setHexes((prev) =>
      prev.map((h) => {
        if (h.id === draggingHexId) {
          // Clear source hex
          return { ...h, number: null }
        } else if (h.id === targetHexId) {
          // Set target hex (overwrites existing number if any)
          return { ...h, number: numberToMove }
        }
        return h
      })
    )
    setDraggingHexId(null)
  }

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Hex Grid Number Triangulation
        </h1>
        <p className="text-slate-600 mb-6">
          Click a hex to set a number (1–12). Range = ceil(N/2). Hexes covered by 3 or more ranges turn green.
        </p>
        <div className="inline-block">
          <HexGrid
            hexes={hexesWithIntersections}
            onHexSelect={setSelectedHexId}
            draggingHexId={draggingHexId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          />
        </div>
        <NumberInputModal
          hexId={selectedHexId}
          currentNumber={selectedHex?.number ?? null}
          onClose={() => setSelectedHexId(null)}
          onSave={handleNumberChange}
        />
      </div>
    </div>
  )
}
