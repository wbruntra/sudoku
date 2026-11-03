import { parseGrid } from '@/features/sudoku/board'
import puzzlesText from '../../../../puzzles.txt?raw'

export interface Puzzle {
  id: string
  name: string
  givens: number[]
}

/** Parses blocks of a `Grid NN` header followed by nine rows of digits. */
export function parsePuzzles(text: string): Puzzle[] {
  return text
    .split(/^(?=Grid )/m)
    .filter((block) => block.trim())
    .map((block) => {
      const [header, ...rows] = block.trim().split('\n')
      const name = header.trim()
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        givens: parseGrid(rows.join('')),
      }
    })
}

export const PUZZLES = parsePuzzles(puzzlesText)

const GENERATED = /^gen-([0-9]{81})$/

/** A generated puzzle carries its printed digits in its id, so it can be rebuilt from storage. */
export function generatedPuzzle(givens: number[]): Puzzle {
  const clues = givens.filter(Boolean).length
  return { id: `gen-${givens.join('')}`, name: `Generated · ${clues} clues`, givens }
}

export function findPuzzle(id: string | null): Puzzle | undefined {
  const match = id ? GENERATED.exec(id) : null
  return match ? generatedPuzzle(parseGrid(match[1])) : PUZZLES.find((p) => p.id === id)
}
