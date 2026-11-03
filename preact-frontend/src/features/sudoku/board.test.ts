import { describe, expect, test } from 'bun:test'
import {
  bit,
  candidates,
  clearCells,
  commonPeers,
  conflicts,
  crossCells,
  eliminate,
  fillNotes,
  isSolved,
  lockSubset,
  newBoard,
  noteDigits,
  parseGrid,
  placeValue,
  toggleNote,
} from './board'

// Project Euler grid 01 and its solution.
const PUZZLE = parseGrid(`
  003020600 900305001 001806400 008102900 700000008
  006708200 002609500 800203009 005010300`)
const SOLUTION = parseGrid(`
  483921657 967345821 251876493 548132976 729564138
  136798245 372689514 814253769 695417382`)

const at = (r: number, c: number) => r * 9 + c
const mask = (...ds: number[]) => ds.reduce((m, d) => m | bit(d), 0)

describe('commonPeers', () => {
  test('a single cell sees its 20 peers', () => {
    expect(commonPeers([at(0, 0)])).toHaveLength(20)
  })

  test('two cells in a row and box share the rest of both', () => {
    // Row 0 has 7 others, box 0 has 7 others; 1 (cell 0,2) is in both.
    expect(commonPeers([at(0, 0), at(0, 1)])).toHaveLength(13)
  })

  test('cells with no common unit share only crossing cells', () => {
    expect(commonPeers([at(0, 0), at(4, 4)]).sort((a, b) => a - b)).toEqual([at(0, 4), at(4, 0)])
  })
})

describe('placeValue', () => {
  test('writes a digit and crosses it off peers', () => {
    let board = fillNotes(newBoard(PUZZLE), [at(0, 0), at(0, 1), at(8, 8)])
    expect(noteDigits(board.notes[at(0, 1)])).toContain(4)
    board = placeValue(board, [at(0, 0)], 4)
    expect(board.values[at(0, 0)]).toBe(4)
    expect(noteDigits(board.notes[at(0, 1)])).not.toContain(4)
  })

  test('placing the same digit again erases it', () => {
    const board = placeValue(placeValue(newBoard(PUZZLE), [at(0, 0)], 4), [at(0, 0)], 4)
    expect(board.values[at(0, 0)]).toBe(0)
  })

  test('leaves givens alone', () => {
    const board = newBoard(PUZZLE)
    expect(placeValue(board, [at(0, 2)], 9)).toBe(board)
  })
})

describe('toggleNote', () => {
  test('adds to all, then removes from all', () => {
    const cells = [at(0, 0), at(0, 1)]
    const marked = toggleNote(newBoard(PUZZLE), cells, 5)
    expect(cells.map((i) => marked.notes[i])).toEqual([mask(5), mask(5)])
    const cleared = toggleNote(marked, cells, 5)
    expect(cells.map((i) => cleared.notes[i])).toEqual([0, 0])
  })

  test('adds to all when only some have it', () => {
    const cells = [at(0, 0), at(0, 1)]
    const board = toggleNote(toggleNote(newBoard(PUZZLE), [at(0, 0)], 5), cells, 5)
    expect(cells.map((i) => board.notes[i])).toEqual([mask(5), mask(5)])
  })
})

describe('eliminate', () => {
  test('crosses a digit off cells that see every selected cell', () => {
    let board = fillNotes(
      newBoard(PUZZLE),
      PUZZLE.map((_, i) => i),
    )
    board = eliminate(board, [at(1, 1), at(1, 2)], 6)
    // Row 1 outside the pair loses 6...
    expect(noteDigits(board.notes[at(1, 6)])).not.toContain(6)
    // ...but the pair itself keeps it.
    expect(noteDigits(board.notes[at(1, 1)])).toContain(6)
  })
})

describe('crossCells', () => {
  test('cells sharing a written digit rule it out of the union of their peers', () => {
    let board = newBoard(PUZZLE)
    const a = at(0, 0)
    const b = at(4, 4)
    board = { ...board, values: board.values.map((v, i) => (i === a || i === b ? 7 : v)) }
    const cells = crossCells(board, [a, b])
    expect(cells).toContain(at(0, 8)) // row of a
    expect(cells).toContain(at(8, 4)) // column of b
    expect(cells).not.toContain(a)
    // Only the shared digit may be crossed off.
    expect(eliminate(board, [a, b], 3)).toBe(board)
  })
})

describe('lockSubset', () => {
  test('a naked pair clears its digits from the shared row', () => {
    let board = newBoard(PUZZLE)
    board = { ...board, notes: board.notes.map(() => 0) }
    const notes = [...board.notes]
    notes[at(0, 0)] = mask(4, 5)
    notes[at(0, 1)] = mask(4, 5)
    notes[at(0, 3)] = mask(1, 4, 5)
    notes[at(1, 2)] = mask(4, 7)
    board = lockSubset({ ...board, notes }, [at(0, 0), at(0, 1)])!
    expect(board.notes[at(0, 3)]).toBe(mask(1))
    // Same box, so the box loses them too.
    expect(board.notes[at(1, 2)]).toBe(mask(7))
    expect(board.notes[at(0, 0)]).toBe(mask(4, 5))
  })

  test('rejects a selection with more digits than cells', () => {
    const board = newBoard(PUZZLE)
    const notes = [...board.notes]
    notes[at(0, 0)] = mask(4, 5)
    notes[at(0, 1)] = mask(4, 7)
    expect(lockSubset({ ...board, notes }, [at(0, 0), at(0, 1)])).toBeNull()
  })
})

describe('candidates and conflicts', () => {
  test('candidates exclude digits already seen', () => {
    expect(noteDigits(candidates(newBoard(PUZZLE), at(0, 0)))).toEqual([4, 5])
  })

  test('a repeated digit marks both cells', () => {
    const board = placeValue(newBoard(PUZZLE), [at(0, 0)], 2)
    expect([...conflicts(board)].sort((a, b) => a - b)).toEqual([at(0, 0), at(0, 4)])
  })

  test('a correctly filled grid is solved', () => {
    const board = { ...newBoard(PUZZLE), values: SOLUTION }
    expect(isSolved(board)).toBe(true)
    expect(isSolved(clearCells(board, [at(0, 0)]))).toBe(false)
  })
})
