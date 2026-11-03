import { useEffect } from 'preact/hooks'
import Grid from '@/features/sudoku/Grid'
import Controls from '@/features/sudoku/Controls'
import type { Difficulty } from '@/features/sudoku/generator'
import { PUZZLES } from '@/features/sudoku/puzzles'
import {
  erase,
  loadPuzzle,
  mode,
  moveSelection,
  newPuzzle,
  pressDigit,
  puzzle,
  restart,
  selection,
  solved,
  undo,
} from '@/features/sudoku/store'

const arrows: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
}

const modeKeys: Record<string, typeof mode.value> = { v: 'pen', p: 'pencil', x: 'cross' }

// Keyboard play for desktop; the on-screen controls cover everything on mobile.
function onKeyDown(e: KeyboardEvent) {
  if (e.target instanceof HTMLSelectElement) return
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') undo()
  else if (e.metaKey || e.ctrlKey || e.altKey) return
  else if (/^[1-9]$/.test(e.key)) pressDigit(Number(e.key))
  else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') erase()
  else if (e.key in arrows) moveSelection(...arrows[e.key])
  else if (e.key in modeKeys) mode.value = modeKeys[e.key]
  else if (e.key === 'Escape') selection.value = []
  else return
  e.preventDefault()
}

export default function SudokuPage() {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div class="mx-auto flex w-full max-w-md flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <select
          aria-label="Puzzle"
          value={puzzle.value.id}
          onChange={(e) => loadPuzzle(e.currentTarget.value)}
          class="border border-void-line bg-void-raised px-2 py-1.5 font-mono text-xs uppercase tracking-widest text-ink"
        >
          {PUZZLES.some((p) => p.id === puzzle.value.id) ? null : (
            <option value={puzzle.value.id}>{puzzle.value.name}</option>
          )}
          {PUZZLES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          aria-label="New generated puzzle"
          value=""
          onChange={(e) => newPuzzle(e.currentTarget.value as Difficulty)}
          class="border border-void-line bg-void-raised px-2 py-1.5 font-mono text-xs uppercase tracking-widest text-ink"
        >
          <option value="" disabled>
            New…
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {solved.value ? <span class="font-display text-lg italic text-lime">Solved.</span> : null}
        <button
          type="button"
          onClick={restart}
          class="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-flame"
        >
          Restart
        </button>
      </div>
      <Grid />
      <Controls />
    </div>
  )
}
