import { useRef } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { useSignalEffect } from '@preact/signals'
import { helpOpen } from '@/features/sudoku/store'

function Section({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <section class="flex flex-col gap-1.5">
      <h3 class="font-mono text-xs uppercase tracking-widest text-lime">{title}</h3>
      <div class="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-dim">{children}</div>
    </section>
  )
}

const Key = ({ children }: { children: ComponentChildren }) => (
  <span class="font-mono text-ink">{children}</span>
)

export default function HelpDialog() {
  const ref = useRef<HTMLDialogElement>(null)

  useSignalEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (helpOpen.value && !dialog.open) dialog.showModal()
    else if (!helpOpen.value && dialog.open) dialog.close()
  })

  return (
    <dialog
      ref={ref}
      onClose={() => (helpOpen.value = false)}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(e) => e.target === ref.current && (helpOpen.value = false)}
      class="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-md border border-void-line bg-void-raised p-0 text-ink backdrop:bg-void/80"
    >
      <div class="flex flex-col gap-5 p-5">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-2xl text-ink">How to play</h2>
          <button
            type="button"
            onClick={() => (helpOpen.value = false)}
            class="font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink"
          >
            Close
          </button>
        </div>

        <Section title="Selecting">
          <p>
            Tap a cell to select it. Drag across cells to select several, or turn on{' '}
            <Key>Multi</Key> and tap cells one at a time. The digit pad acts on everything
            selected, according to the mode.
          </p>
        </Section>

        <Section title="Pen — write an answer">
          <p>
            Tapping a digit writes it in the cell, the way you'd ink in a number you're sure of.
            That digit is also rubbed out of the pencil marks in the cell's row, column and box.
            Tap the same digit again to remove it. The small number under each digit is how many
            are left to place.
          </p>
        </Section>

        <Section title="Pencil — note possibilities">
          <p>
            Tapping a digit jots it in the corner of the cell as a possibility. Tap a digit the
            cell already has to cross it off. With several cells selected it adds the digit to all
            of them, or removes it from all if they all have it.
          </p>
          <p>For a pair: select the two cells, Erase them, then pencil in both digits.</p>
        </Section>

        <Section title="Cross — rule a digit out">
          <p>
            Tapping a digit crosses it off every cell that can see <em>all</em> the selected cells.
            Those cells are tinted red so you can see what will change before you tap.
          </p>
          <p>
            Select a written 7 and Cross 7 to clear 7 from its row, column and box. Or, if the only
            places for 5 in a box are two cells in the same row, select those two and Cross 5. The
            rest of that row loses its 5s.
          </p>
          <p>
            Select several cells that all hold the <em>same</em> written digit (say, every 7 you
            can see) and the tint shows every cell any of them rules out. Tap that digit to cross
            it off all of them at once.
          </p>
        </Section>

        <Section title="Shortcuts">
          <p>
            <Key>Notes</Key> pencils in every digit that isn't already ruled out by a written
            number. It works on the selection, or the whole board if nothing is selected.
          </p>
          <p>
            <Key>Lock</Key> is for pairs, triples and so on. Select N cells in a row, column or box
            whose pencil marks share just N digits between them (say two cells that both read 3 7).
            Lock crosses those digits off the rest of the row, column or box.
          </p>
          <p>
            <Key>Undo</Key> steps back one change. <Key>Erase</Key> clears the selected cells.
            Digits that break the rules turn red, but nothing checks your answers against the
            solution.
          </p>
        </Section>

        <Section title="Keyboard">
          <p>
            <Key>1–9</Key> digit, <Key>v</Key> pen, <Key>p</Key> pencil, <Key>x</Key> cross,{' '}
            <Key>arrows</Key> move, <Key>⌫</Key> erase, <Key>ctrl+z</Key> undo, <Key>esc</Key>{' '}
            deselect.
          </p>
        </Section>
      </div>
    </dialog>
  )
}
