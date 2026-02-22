/**
 * Hex grid utilities: axial/cube coordinates and distance.
 * Grid: 7 rows, pointy-top. Even rows (0,2,4,6) have 8 hexes, odd rows (1,3,5) have 6 hexes.
 * ID format: hex-r{row}-c{col}
 */

export const ROWS = 7
export const MAX_COLS = 8  // Maximum columns (for even rows)
export const ODD_ROW_COLS = 7  // Columns for odd rows

/** Get the number of columns for a given row */
export function getColsForRow(row: number): number {
  return row % 2 === 0 ? MAX_COLS : ODD_ROW_COLS
}

export const TOTAL_HEXES = 4 * MAX_COLS + 3 * ODD_ROW_COLS  // 32 + 21 = 53

export type Cube = { x: number; y: number; z: number }

/** Row and column indices (0-based). */
export function idToRowCol(id: string): { row: number; col: number } {
  const match = id.match(/^hex-r(\d+)-c(\d+)$/)
  if (!match) throw new Error(`Invalid hex id: ${id}`)
  return { row: parseInt(match[1], 10), col: parseInt(match[2], 10) }
}

export function rowColToId(row: number, col: number): string {
  return `hex-r${row}-c${col}`
}

/** Odd-r offset (row, col) to cube. Required so hex distance matches the visual grid. */
export function rowColToCube(row: number, col: number): Cube {
  const x = col - (row - (row & 1)) / 2
  const z = row
  const y = -x - z
  return { x, y, z }
}

export function idToCube(id: string): Cube {
  const { row, col } = idToRowCol(id)
  return rowColToCube(row, col)
}

/** Cube distance: max of absolute coordinate differences. */
export function cubeDistance(a: Cube, b: Cube): number {
  return Math.max(
    Math.abs(a.x - b.x),
    Math.abs(a.y - b.y),
    Math.abs(a.z - b.z)
  )
}

/** All hex ids in the grid. */
export function allHexIds(): string[] {
  const ids: string[] = []
  for (let row = 0; row < ROWS; row++) {
    const cols = getColsForRow(row)
    for (let col = 0; col < cols; col++) {
      ids.push(rowColToId(row, col))
    }
  }
  return ids
}

/** Hexes exactly `distance` steps from the given hex (by cube distance). */
export function getHexesAtDistance(hexId: string, distance: number): string[] {
  const center = idToCube(hexId)
  const result: string[] = []
  for (let row = 0; row < ROWS; row++) {
    const cols = getColsForRow(row)
    for (let col = 0; col < cols; col++) {
      const id = rowColToId(row, col)
      const cube = rowColToCube(row, col)
      if (cubeDistance(center, cube) === distance) result.push(id)
    }
  }
  return result
}

/** range = ceil(N / 2) */
export function computeRange(number: number): number {
  return Math.ceil(number / 2)
}
