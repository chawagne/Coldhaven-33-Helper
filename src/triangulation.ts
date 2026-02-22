import type { HexData } from './types'
import { computeRange, getHexesAtDistance } from './hexUtils'

/**
 * For each numbered hex, mark all hexes at its range.
 * A hex is an "intersection" if it is covered by 3 or more different number ranges.
 * Returns a map of intersection hex IDs to their source hex IDs.
 */
export function computeIntersections(hexes: HexData[]): Map<string, string[]> {
  const rangesMap = new Map<string, Set<string>>() // hexId -> set of source hex ids that cover it

  for (const hex of hexes) {
    if (hex.number == null || hex.number < 1 || hex.number > 12) continue
    const range = computeRange(hex.number)
    const covered = getHexesAtDistance(hex.id, range)
    for (const id of covered) {
      let set = rangesMap.get(id)
      if (!set) {
        set = new Set()
        rangesMap.set(id, set)
      }
      set.add(hex.id)
    }
  }

  const intersections = new Map<string, string[]>()
  for (const [hexId, sourceIds] of rangesMap) {
    if (sourceIds.size >= 3) {
      intersections.set(hexId, Array.from(sourceIds))
    }
  }
  return intersections
}
