import type { ComponentChildren } from 'preact'
import { DIGITS, hasNote } from '@/features/sudoku/board'
import HelpDialog from '@/features/sudoku/HelpDialog'
import {
  autoNotes,
  board,
  canLock,
  erase,
  helpOpen,
  history,
  lock,
  mode,
  multiSelect,
  pressDigit,
  selection,
  toggleMultiSelect,
  undo,
  type Mode,
} from '@/features/sudoku/store'

const modes: { id: Mode; label: string; hint: string }[] = [
  { id: 'pen', label: 'Pen', hint: 'Tap a digit to write it in as your answer.' },
  {
    id: 'pencil',
    label: 'Pencil',
    hint: 'Tap a digit to note it as a possibility. Tap again to cross it off.',
  },
  {
    id: 'cross',
    label: 'Cross',
    hint: 'Tap a digit to cross it off the red cells, which see every selected cell.',
  },
]

function ModeSwitch() {
  const current = modes.find((m) => m.id === mode.value)
  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-1">
        <div
          role="radiogroup"
          aria-label="Input mode"
          class="grid flex-1 grid-cols-3 border border-void-line"
        >
          {modes.map(({ id, label }) => {
            const active = mode.value === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => (mode.value = id)}
                class={`py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  active ? 'bg-lime text-accent-ink' : 'text-ink-dim hover:text-ink'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          aria-label="How to play"
          onClick={() => (helpOpen.value = true)}
          class="w-10 border border-void-line font-mono text-sm text-ink-dim transition-colors hover:border-lime hover:text-lime"
        >
          ?
        </button>
      </div>
      <p class="min-h-[2lh] text-xs leading-snug text-ink-dim">{current?.hint}</p>
    </div>
  )
}

function DigitPad() {
  const { values, notes } = board.value
  const emptySelected = selection.value.filter((i) => !values[i])

  return (
    <div class="grid grid-cols-9 gap-1">
      {DIGITS.map((d) => {
        const remaining = 9 - values.filter((v) => v === d).length
        // In pencil mode, light up digits every selected empty cell already has marked.
        const marked =
          mode.value === 'pencil' &&
          emptySelected.length > 0 &&
          emptySelected.every((i) => hasNote(notes[i], d))
        return (
          <button
            key={d}
            type="button"
            onClick={() => pressDigit(d)}
            class={`flex aspect-[3/4] flex-col items-center justify-center gap-1 border text-2xl leading-none transition-colors active:bg-lime active:text-accent-ink ${
              marked ? 'border-lime bg-lime/15 text-lime' : 'border-void-line bg-void-raised'
            } ${remaining <= 0 ? 'opacity-35' : ''} ${
              mode.value === 'cross' ? 'text-flame line-through decoration-2' : ''
            }`}
          >
            {d}
            {mode.value === 'pen' ? (
              <span class="font-mono text-[0.6rem] text-ink-dim">{Math.max(remaining, 0)}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

interface ActionProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  title: string
  children: ComponentChildren
}

function Action({ onClick, disabled, active, title, children }: ActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      class={`border py-2 font-mono text-[0.7rem] uppercase tracking-widest transition-colors disabled:opacity-35 ${
        active
          ? 'border-lime bg-lime text-accent-ink'
          : 'border-void-line text-ink-dim enabled:hover:border-lime enabled:hover:text-lime'
      }`}
    >
      {children}
    </button>
  )
}

export default function Controls() {
  const hasSelection = selection.value.length > 0
  return (
    <div class="flex flex-col gap-2">
      <HelpDialog />
      <ModeSwitch />
      <DigitPad />
      <div class="grid grid-cols-5 gap-1">
        <Action onClick={undo} disabled={history.value.length === 0} title="Undo the last change">
          Undo
        </Action>
        <Action onClick={erase} disabled={!hasSelection} title="Erase the selected cells">
          Erase
        </Action>
        <Action
          onClick={autoNotes}
          title="Pencil in every possibility for the selection (or the whole board)"
        >
          Notes
        </Action>
        <Action
          onClick={lock}
          disabled={!canLock.value}
          title="N cells holding only N digits: cross those digits off the rest of their unit"
        >
          Lock
        </Action>
        <Action
          onClick={toggleMultiSelect}
          active={multiSelect.value}
          title="Tap cells to add them to the selection"
        >
          Multi
        </Action>
      </div>
    </div>
  )
}
