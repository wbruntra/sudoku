import { useRef } from 'preact/hooks'
import type { JSX } from 'preact'
import { DIGITS, PEERS, hasNote } from '@/features/sudoku/board'
import {
  board,
  conflictCells,
  crossTargets,
  focusDigit,
  mode,
  selectCell,
  selection,
} from '@/features/sudoku/store'

/** Cell index of the k-th cell (0–8) inside box b (0–8). */
const cellInBox = (b: number, k: number) =>
  (Math.floor(b / 3) * 3 + Math.floor(k / 3)) * 9 + (b % 3) * 3 + (k % 3)

// Touch pointers stay captured by the cell the touch began on, so find the
// cell under the finger by position instead of trusting the event target.
function cellAt(e: PointerEvent): number | null {
  const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-cell]')
  return el ? Number(el.dataset.cell) : null
}

function Cell({ i }: { i: number }) {
  const { givens, values, notes } = board.value
  const value = values[i]
  const sel = selection.value
  const isSelected = sel.includes(i)
  const focus = focusDigit.value

  // One tint per cell, strongest reason wins.
  const tint = isSelected
    ? 'bg-lime/30'
    : mode.value === 'cross' && crossTargets.value.has(i)
      ? 'bg-flame/15'
      : focus && value === focus
        ? 'bg-sky/20'
        : sel.length === 1 && PEERS[sel[0]].has(i)
          ? 'bg-ink/[0.06]'
          : ''

  const valueColor = conflictCells.value.has(i)
    ? 'text-flame'
    : givens[i]
      ? 'text-ink'
      : 'text-sky'

  return (
    <div data-cell={i} class="relative aspect-square bg-void">
      <div class={`absolute inset-0 ${tint}`} />
      {value ? (
        <span
          class={`absolute inset-0 flex items-center justify-center text-[min(6.5vw,1.75rem)] leading-none ${
            givens[i] ? 'font-semibold' : 'font-normal'
          } ${valueColor}`}
        >
          {value}
        </span>
      ) : (
        <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 p-px">
          {DIGITS.map((d) => {
            const marked = hasNote(notes[i], d)
            return (
              <span
                key={d}
                class={`flex items-center justify-center font-mono text-[min(2.6vw,0.7rem)] leading-none ${
                  marked && d === focus
                    ? 'rounded-sm bg-lime font-semibold text-accent-ink'
                    : 'text-ink-dim'
                }`}
              >
                {marked ? d : ''}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Grid() {
  const dragging = useRef(false)

  const onPointerDown = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    const i = cellAt(e)
    if (i === null) return
    dragging.current = true
    selectCell(i)
  }

  const onPointerMove = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const i = cellAt(e)
    if (i !== null) selectCell(i, true)
  }

  const stopDrag = () => (dragging.current = false)

  return (
    <div
      class="grid touch-none select-none grid-cols-3 gap-[2px] bg-ink-dim p-[2px]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      {DIGITS.map((_, b) => (
        <div key={b} class="grid grid-cols-3 gap-px bg-void-line">
          {DIGITS.map((_, k) => (
            <Cell key={k} i={cellInBox(b, k)} />
          ))}
        </div>
      ))}
    </div>
  )
}
