export interface HexData {
  id: string
  row: number
  col: number
  number: number | null
  isIntersection: boolean
  intersectionSources: string[] | null // IDs of the 3 hexes that cause this intersection
}
