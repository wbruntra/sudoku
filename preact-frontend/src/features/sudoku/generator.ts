// Puzzle generation: fill a random complete grid, then remove clues one at a
// time, keeping each removal only if the puzzle still has exactly one solution.

import { PEERS, bit } from './board'

export type Difficulty = 'easy' | 'medium' | 'hard'

/** Clues to leave behind. Fewer clues usually means harder deductions are needed. */
export const CLUES: Record<Difficulty, number> = { easy: 40, medium: 32, hard: 26 }

type Rng = () => number

function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Bitmask of digits still allowed in cell `i` given the rest of `grid`. */
function allowed(grid: number[], i: number): number {
  let used = 0
  for (const j of PEERS[i]) if (grid[j]) used |= bit(grid[j])
  return 0b111111111 & ~used
}

/**
 * Count solutions of `grid` (0 = blank), stopping at `limit`. Always branches on
 * the most constrained blank cell. Mutates `grid` while searching but restores it.
 */
export function countSolutions(grid: number[], limit = 2, rng?: Rng): number {
  let best = -1
  let bestMask = 0
  let bestCount = 10
  for (let i = 0; i < 81; i++) {
    if (grid[i]) continue
    const mask = allowed(grid, i)
    const count = mask.toString(2).replaceAll('0', '').length
    if (count < bestCount) {
      best = i
      bestMask = mask
      bestCount = count
      if (count <= 1) break
    }
  }
  if (best === -1) return 1
  if (bestCount === 0) return 0

  let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => bestMask & bit(d))
  if (rng) digits = shuffle(digits, rng)
  let found = 0
  for (const d of digits) {
    grid[best] = d
    found += countSolutions(grid, limit - found, rng)
    grid[best] = 0
    if (found >= limit) break
  }
  return found
}

/** A random complete, valid grid. */
export function randomSolution(rng: Rng = Math.random): number[] {
  const grid = Array<number>(81).fill(0)
  // A randomized solve of the empty grid; the first solution found is the grid.
  const fill = (): boolean => {
    let best = -1
    let bestMask = 0
    let bestCount = 10
    for (let i = 0; i < 81; i++) {
      if (grid[i]) continue
      const mask = allowed(grid, i)
      const count = mask.toString(2).replaceAll('0', '').length
      if (count < bestCount) [best, bestMask, bestCount] = [i, mask, count]
    }
    if (best === -1) return true
    for (const d of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)) {
      if (!(bestMask & bit(d))) continue
      grid[best] = d
      if (fill()) return true
      grid[best] = 0
    }
    return false
  }
  fill()
  return grid
}

/** A puzzle with exactly one solution and `CLUES[difficulty]` printed digits (or a few more). */
export function generatePuzzle(difficulty: Difficulty, rng: Rng = Math.random): number[] {
  const puzzle = randomSolution(rng)
  let clues = 81
  for (const i of shuffle(
    Array.from({ length: 81 }, (_, k) => k),
    rng,
  )) {
    if (clues <= CLUES[difficulty]) break
    const keep = puzzle[i]
    puzzle[i] = 0
    if (countSolutions(puzzle) === 1) clues--
    else puzzle[i] = keep
  }
  return puzzle
}
