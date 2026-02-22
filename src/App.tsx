import { useState, useMemo, useEffect } from 'react'
import { HexGrid } from './HexGrid'
import { NumberInputModal } from './NumberInputModal'
import type { HexData } from './types'
import { rowColToId, ROWS, getColsForRow } from './hexUtils'
import { computeIntersections } from './triangulation'

const STORAGE_KEY = 'frosthaven-hex-grid-state'

function loadHexesFromStorage(): HexData[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const data = JSON.parse(stored)
    if (!data || !Array.isArray(data)) return null
    
    // Validate that we have the right structure
    const initialHexes = buildInitialHexes()
    const hexMap = new Map(initialHexes.map((h) => [h.id, h]))
    
    // Restore numbers from stored data, preserving structure
    return data.map((storedHex: any) => {
      const baseHex = hexMap.get(storedHex.id)
      if (!baseHex) return null
      
      return {
        ...baseHex,
        number: storedHex.number ?? null,
      }
    }).filter((h): h is HexData => h !== null)
  } catch (error) {
    console.warn('Failed to load hexes from localStorage:', error)
    return null
  }
}

function saveHexesToStorage(hexes: HexData[]): void {
  try {
    // Only save the essential data (id and number)
    const dataToSave = hexes.map((h) => ({
      id: h.id,
      number: h.number,
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.warn('Failed to save hexes to localStorage:', error)
  }
}

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
  // Load initial state from localStorage or use defaults
  const [hexes, setHexes] = useState<HexData[]>(() => {
    const loaded = loadHexesFromStorage()
    return loaded ?? buildInitialHexes()
  })
  const [selectedHexId, setSelectedHexId] = useState<string | null>(null)
  const [draggingHexId, setDraggingHexId] = useState<string | null>(null)

  // Save to localStorage whenever hexes changes
  useEffect(() => {
    saveHexesToStorage(hexes)
  }, [hexes])

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
