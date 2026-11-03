import { describe, expect, test } from 'bun:test'
import { conflicts, newBoard } from './board'
import { CLUES, countSolutions, generatePuzzle, randomSolution } from './generator'

// Deterministic PRNG so failures reproduce.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32
    return seed / 2 ** 32
  }
}

describe('randomSolution', () => {
  test('is a full grid with no conflicts', () => {
    const grid = randomSolution(seeded(1))
    expect(grid.every((v) => v >= 1 && v <= 9)).toBe(true)
    expect(conflicts({ ...newBoard(grid) }).size).toBe(0)
  })
})

describe('generatePuzzle', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as const) {
    test(`${difficulty} has a unique solution and few enough clues`, () => {
      const puzzle = generatePuzzle(difficulty, seeded(7))
      const clues = puzzle.filter(Boolean).length
      expect(clues).toBeGreaterThanOrEqual(CLUES[difficulty])
      expect(clues).toBeLessThanOrEqual(CLUES[difficulty] + 3)
      expect(countSolutions([...puzzle])).toBe(1)
    })
  }

  test('countSolutions finds more than one on an empty-ish grid', () => {
    expect(countSolutions(Array<number>(81).fill(0))).toBe(2)
  })
})
