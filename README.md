# Sudoku

A Sudoku game built for solving the way you would on paper: pencil marks, ruling digits out
across several cells at once, and a fresh puzzle whenever you want one.

**Play it: [wbruntra.github.io/sudoku](https://wbruntra.github.io/sudoku/)**

## Features

- **Pen, Pencil and Cross modes.** Pen writes an answer, Pencil jots candidates in the corner of
  a cell, and Cross rules a digit out of every cell that can see all of the selected cells.
- **Multi-cell selection.** Drag across cells, or turn on Multi and tap them one at a time. Turning
  Multi off collapses the selection back to a single cell.
- **Pair and triple helpers.** Notes fills in every candidate that isn't already ruled out, and
  Lock crosses a naked pair, triple, etc. off the rest of its row, column or box.
- **Puzzles.** A built-in library of puzzles, plus a generator that produces new ones with a
  unique solution at easy, medium or hard difficulty.
- **Undo, error highlighting and autosave.** Digits that break the rules turn red (answers are
  never checked against the solution), and progress on each puzzle is kept in your browser.
- **Keyboard and touch.** `1`–`9` digit, `v` pen, `p` pencil, `x` cross, arrows move,
  `⌫` erase, `ctrl+z` undo, `esc` deselect. Light, dark and solarized themes.

The in-game **How to play** dialog explains each mode in more detail.

## Running locally

Requires **Bun 1.4 or newer** (currently the canary build: `bun upgrade --canary`).

```bash
bun install
bun run dev       # starts the Vite dev server (and the API, which the game doesn't need)
```

The game itself is a static Preact app and runs entirely in the browser.

## Commands

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `bun run dev`             | Run the frontend and backend in parallel                        |
| `bun run frontend:preact` | Run just the frontend                                           |
| `bun run phone`           | Dev server bound to the Tailscale IP, for testing on a phone    |
| `bun run check`           | Format check, typecheck, lint, test — what CI runs              |
| `bun run test`            | Run the test suites                                             |
| `bun run build`           | Production build of the frontend                                |
| `bun run deploy`          | Build with the `/sudoku/` base path and publish to GitHub Pages |
| `bun run format`          | Format everything with `bun fmt`                                |

## Project layout

```
preact-frontend/   The game: Preact, Preact Signals, Tailwind, Vite
  src/features/sudoku/
    board.ts         board model: placing, notes, crossing, conflicts, Lock
    generator.ts     puzzle generator with unique-solution checking
    store.ts         signals for board, selection, mode and history
    Controls.tsx     digit pad and mode buttons
puzzles.txt        Built-in puzzle library, one puzzle per line
backend/           Hono API (inherited from the project template; unused by the game)
database/          Kysely + SQLite (likewise unused by the game)
shared/            Constants shared across workspaces
```

## Deploying

`bun run deploy` builds with `VITE_BASE=/sudoku/` and pushes `preact-frontend/dist` to the
`gh-pages` branch, which GitHub Pages serves at the link above.
