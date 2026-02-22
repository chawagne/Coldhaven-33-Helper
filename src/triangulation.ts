import type { HexData } from './types'
import { computeRange, getHexesAtDistance } from './hexUtils'

/**
 * For each numbered hex, mark all hexes at its range.
 * A hex is an "intersection" if it is covered by exactly 3 different number ranges.
 */
export function computeIntersections(hexes: HexData[]): Set<string> {
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

  const intersectionIds = new Set<string>()
  for (const [hexId, sourceIds] of rangesMap) {
    if (sourceIds.size === 3) intersectionIds.add(hexId)
  }
  return intersectionIds
}
