import { batch, computed, effect, signal } from '@preact/signals'
import {
  clearCells,
  crossCells,
  conflicts,
  eliminate,
  fillNotes,
  isSolved,
  lockSubset,
  newBoard,
  placeValue,
  toggleNote,
  type Board,
} from '@/features/sudoku/board'
import { generatePuzzle, type Difficulty } from '@/features/sudoku/generator'
import { PUZZLES, findPuzzle, generatedPuzzle, type Puzzle } from '@/features/sudoku/puzzles'

/** What tapping a digit on the pad does. */
export type Mode = 'pen' | 'pencil' | 'cross'

const CURRENT_KEY = 'sudoku-current'
const boardKey = (id: string) => `sudoku-board:${id}`

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked — progress just won't survive a reload.
  }
}

function boardFor(puzzle: Puzzle): Board {
  const saved = load<Pick<Board, 'values' | 'notes'>>(boardKey(puzzle.id))
  // A save that disagrees with the printed digits belongs to some other puzzle.
  const valid =
    saved?.values?.length === 81 &&
    saved.notes?.length === 81 &&
    puzzle.givens.every((g, i) => !g || saved.values[i] === g)
  return valid
    ? { givens: puzzle.givens, values: saved.values, notes: saved.notes }
    : newBoard(puzzle.givens)
}

const initialPuzzle = findPuzzle(load<string>(CURRENT_KEY)) ?? PUZZLES[0]

export const puzzle = signal<Puzzle>(initialPuzzle)
export const board = signal<Board>(boardFor(initialPuzzle))
export const history = signal<Board[]>([])
export const selection = signal<number[]>([])
export const mode = signal<Mode>('pen')
/** When on, tapping a cell adds it to the selection instead of replacing it. */
export const multiSelect = signal(false)
export const helpOpen = signal(false)

export const conflictCells = computed(() => conflicts(board.value))
export const solved = computed(() => isSolved(board.value))
/** Cells a Cross tap would affect: see `crossCells` in board.ts. */
export const crossTargets = computed(() => new Set(crossCells(board.value, selection.value)))
/** The digit to highlight across the board: the value in the single selected cell. */
export const focusDigit = computed(() =>
  selection.value.length === 1 ? board.value.values[selection.value[0]] : 0,
)
export const canLock = computed(() => lockSubset(board.value, selection.value) !== null)

effect(() => {
  save(CURRENT_KEY, puzzle.value.id)
  save(boardKey(puzzle.value.id), { values: board.value.values, notes: board.value.notes })
})

function commit(next: Board | null) {
  if (!next || next === board.value) return
  history.value = [...history.value, board.value]
  board.value = next
}

export function pressDigit(d: number) {
  const cells = selection.value
  if (cells.length === 0) return
  if (mode.value === 'pen') commit(placeValue(board.value, cells, d))
  else if (mode.value === 'pencil') commit(toggleNote(board.value, cells, d))
  else commit(eliminate(board.value, cells, d))
}

export const erase = () => commit(clearCells(board.value, selection.value))
export const lock = () => commit(lockSubset(board.value, selection.value))

/** Pencil in candidates for the selection, or the whole board if nothing is selected. */
export function autoNotes() {
  const cells = selection.value.length ? selection.value : board.value.values.map((_, i) => i)
  commit(fillNotes(board.value, cells))
}

export function undo() {
  const prev = history.value.at(-1)
  if (!prev) return
  history.value = history.value.slice(0, -1)
  board.value = prev
}

export function selectCell(i: number, extend = false) {
  if (!extend && !multiSelect.value) {
    selection.value = [i]
  } else if (selection.value.includes(i)) {
    // Dragging back over a selected cell keeps it; tapping it in multi mode drops it.
    if (!extend) selection.value = selection.value.filter((j) => j !== i)
  } else {
    selection.value = [...selection.value, i]
  }
}

export function moveSelection(dr: number, dc: number) {
  const from = selection.value.at(-1) ?? 40
  const r = (Math.floor(from / 9) + dr + 9) % 9
  const c = ((from % 9) + dc + 9) % 9
  selection.value = [r * 9 + c]
}

export function loadPuzzle(id: string) {
  const next = findPuzzle(id)
  if (!next) return
  setPuzzle(next)
}

/** Generate a fresh puzzle with a unique solution and switch to it. */
export function newPuzzle(difficulty: Difficulty) {
  const next = generatedPuzzle(generatePuzzle(difficulty))
  setPuzzle(next)
}

function setPuzzle(next: Puzzle) {
  const old = puzzle.value
  // Generated puzzles can't be picked again, so don't leave their progress behind.
  if (old.id.startsWith('gen-') && old.id !== next.id) {
    try {
      localStorage.removeItem(boardKey(old.id))
    } catch {
      // Storage blocked — nothing to clean up.
    }
  }
  // Batched so the save effect never sees the new puzzle with the old board,
  // which would write one puzzle's progress under another's key.
  batch(() => {
    puzzle.value = next
    board.value = boardFor(next)
    history.value = []
    selection.value = []
  })
}

export function restart() {
  commit(newBoard(puzzle.value.givens))
  selection.value = []
}
