// Pure sudoku board logic. Cells are indexed 0–80 row-major; a cell's pencil
// marks are a 9-bit mask where bit (d - 1) set means digit d is still possible.

export interface Board {
  /** Digits printed in the puzzle, 0 for blank. Never changes during play. */
  givens: number[]
  /** Digits the player has written in, 0 for blank. Givens are mirrored here. */
  values: number[]
  /** Pencil-mark bitmask per cell. */
  notes: number[]
}

export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export const ALL_NOTES = 0b111111111

export const rowOf = (i: number) => Math.floor(i / 9)
export const colOf = (i: number) => i % 9
export const boxOf = (i: number) => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3)

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/** The 27 rows, columns and boxes, each as a list of 9 cell indices. */
export const UNITS: number[][] = [
  ...range(9).map((r) => range(9).map((c) => r * 9 + c)),
  ...range(9).map((c) => range(9).map((r) => r * 9 + c)),
  ...range(9).map((b) => range(81).filter((i) => boxOf(i) === b)),
]

/** For each cell, the 20 other cells sharing a row, column or box with it. */
export const PEERS: Set<number>[] = range(81).map(
  (i) => new Set(UNITS.filter((u) => u.includes(i)).flatMap((u) => u.filter((j) => j !== i))),
)

export const bit = (d: number) => 1 << (d - 1)
export const hasNote = (mask: number, d: number) => (mask & bit(d)) !== 0
export const noteDigits = (mask: number) => DIGITS.filter((d) => hasNote(mask, d))

export function parseGrid(text: string): number[] {
  const digits = text.replace(/[^0-9.]/g, '').replace(/\./g, '0')
  if (digits.length !== 81) throw new Error(`Expected 81 digits, got ${digits.length}`)
  return [...digits].map(Number)
}

export function newBoard(givens: number[]): Board {
  return { givens, values: [...givens], notes: givens.map(() => 0) }
}

/**
 * Cells outside `cells` that share a unit with every one of them. If a digit
 * must go in one of `cells`, it can't go in any of these.
 */
export function commonPeers(cells: number[]): number[] {
  if (cells.length === 0) return []
  const [first, ...rest] = cells
  return [...PEERS[first]].filter((j) => !cells.includes(j) && rest.every((c) => PEERS[c].has(j)))
}

/** The digit written in every one of `cells`, or 0 if they differ or any is blank. */
export function sharedValue(board: Board, cells: number[]): number {
  const d = board.values[cells[0]] ?? 0
  return d && cells.every((i) => board.values[i] === d) ? d : 0
}

/**
 * Cells a Cross would clear. Cells all holding the same digit rule it out of
 * every peer of any of them; otherwise it's the cells that see all of them.
 */
export function crossCells(board: Board, cells: number[]): number[] {
  if (cells.length < 2 || !sharedValue(board, cells)) return commonPeers(cells)
  const all = new Set(cells.flatMap((i) => [...PEERS[i]]))
  return [...all].filter((j) => !cells.includes(j))
}

/** Digits not yet written anywhere in the cell's row, column or box. */
export function candidates(board: Board, i: number): number {
  let mask = ALL_NOTES
  for (const j of PEERS[i]) if (board.values[j]) mask &= ~bit(board.values[j])
  return mask
}

/** Cells whose value is repeated elsewhere in one of their units. */
export function conflicts(board: Board): Set<number> {
  const bad = new Set<number>()
  for (const unit of UNITS) {
    for (const d of DIGITS) {
      const hits = unit.filter((i) => board.values[i] === d)
      if (hits.length > 1) hits.forEach((i) => bad.add(i))
    }
  }
  return bad
}

export const isSolved = (board: Board) =>
  board.values.every((v) => v !== 0) && conflicts(board).size === 0

const editable = (board: Board, cells: number[]) => cells.filter((i) => !board.givens[i])

/**
 * Write `d` into the cells, or erase it if every cell already holds it.
 * Writing also crosses `d` off the pencil marks of every peer.
 */
export function placeValue(board: Board, cells: number[], d: number): Board {
  const targets = editable(board, cells)
  if (targets.length === 0) return board
  const values = [...board.values]
  const notes = [...board.notes]
  const erase = targets.every((i) => values[i] === d)
  for (const i of targets) {
    values[i] = erase ? 0 : d
    if (erase) continue
    notes[i] = 0
    for (const j of PEERS[i]) notes[j] &= ~bit(d)
  }
  return { ...board, values, notes }
}

/** Toggle pencil mark `d` on the empty cells: add it to all unless all already have it. */
export function toggleNote(board: Board, cells: number[], d: number): Board {
  const targets = editable(board, cells).filter((i) => !board.values[i])
  if (targets.length === 0) return board
  const notes = [...board.notes]
  const remove = targets.every((i) => hasNote(notes[i], d))
  for (const i of targets) notes[i] = remove ? notes[i] & ~bit(d) : notes[i] | bit(d)
  return { ...board, notes }
}

/**
 * Cross `d` off every cell in `crossCells`. When the cells share a written
 * digit, only that digit is ruled out of their peers, so any other is ignored.
 */
export function eliminate(board: Board, cells: number[], d: number): Board {
  const shared = sharedValue(board, cells)
  if (shared && shared !== d) return board
  const notes = [...board.notes]
  for (const j of crossCells(board, cells)) notes[j] &= ~bit(d)
  return { ...board, notes }
}

/**
 * Naked subset: when N empty cells sharing a unit have only N digits between
 * them in their pencil marks, those digits are spoken for, so cross them off
 * every other cell in the shared unit. Returns null when the selection doesn't
 * qualify.
 */
export function lockSubset(board: Board, cells: number[]): Board | null {
  if (cells.length < 2 || cells.some((i) => board.values[i] || !board.notes[i])) return null
  const union = cells.reduce((mask, i) => mask | board.notes[i], 0)
  if (noteDigits(union).length !== cells.length) return null
  const peers = commonPeers(cells)
  if (peers.length === 0) return null
  const notes = [...board.notes]
  for (const j of peers) notes[j] &= ~union
  return { ...board, notes }
}

/** Pencil in every digit each empty cell could still hold, as you would by scanning. */
export function fillNotes(board: Board, cells: number[]): Board {
  const notes = [...board.notes]
  for (const i of cells) if (!board.values[i]) notes[i] = candidates(board, i)
  return { ...board, notes }
}

/** Erase written values and pencil marks from the non-given cells. */
export function clearCells(board: Board, cells: number[]): Board {
  const values = [...board.values]
  const notes = [...board.notes]
  for (const i of editable(board, cells)) {
    values[i] = 0
    notes[i] = 0
  }
  return { ...board, values, notes }
}
