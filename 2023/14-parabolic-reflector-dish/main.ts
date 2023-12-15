/*
0 = rounded rocks (rolls)
# = cube-shaped rock (stays)
. = empty space
 */

import { rotate2DArray } from "../../lib/array-2d/rotate-2d-array.js";
import { splitLines } from "../../lib/string/split-lines.js";
const tiles = {
  roundRock: "O",
  squareRock: "#",
  emptySpace: ".",
} as const;
type Tile = (typeof tiles)[keyof typeof tiles];

const directions = ["north", "east", "south", "west"] as const;
type Direction = (typeof directions)[number];

export type Board = Tile[][];
export function parseBoard(input: string): Board {
  return splitLines(input.trim()).map((line) => [...line.trim()] as Tile[]);
}

export function tiltBoard(input: Board, direction: Direction): Board {
  let board = [...input].map((row) => [...row]);
  const rotations = (
    {
      west: 0,
      south: 1,
      east: 2,
      north: 3,
    } as const
  )[direction];
  for (const i of Array.from({ length: rotations })) {
    // Rotate board so that we're always sliding rocks in the same direction
    board = rotate2DArray(board);
  }

  for (const [r, row] of board.entries()) {
    for (const [c, tile] of row.entries()) {
      // Slide round rocks to the left
      if (tile === tiles.emptySpace) {
        const nextRockIndex =
          c +
          row
            .slice(c)
            .findIndex((t) => t === tiles.roundRock || t === tiles.squareRock);
        if (nextRockIndex < c) {
          // No more rocks in this row
          break;
        } else if (row[nextRockIndex] === tiles.roundRock) {
          row[c] = tiles.roundRock;
          row[nextRockIndex] = tiles.emptySpace;
        }
      }
    }
  }

  for (const i of Array.from({
    length: (directions.length - rotations) % directions.length,
  })) {
    // Rotate board back to original orientation
    board = rotate2DArray(board);
  }

  return board;
}

export function getNorthLoad(board: Board) {
  let total = 0;
  for (const [index, row] of board.entries()) {
    const count = row.filter((t) => t === tiles.roundRock).length;
    const load = board.length - index;
    total += count * load;
  }
  return total;
}

function serialize(board: Board): string {
  return board.map((r) => r.join("")).join("\n");
}
export function spinBoard(input: Board, cycles: number) {
  const serializedInput = serialize(input);
  let board = input;
  const history: string[] = [];
  for (let i = 0; i < cycles; i++) {
    board = tiltBoard(board, "north");
    board = tiltBoard(board, "west");
    board = tiltBoard(board, "south");
    board = tiltBoard(board, "east");

    const serialized = serialize(board);
    const repeatsFrom = history.indexOf(serialized);
    if (repeatsFrom >= 0) {
      // Found a repeating pattern!
      const patternSize = history.slice(repeatsFrom).length;
      const cyclesNeeded = (cycles - i - 1) % patternSize;
      return spinBoard(board, cyclesNeeded);
    }
    history.push(serialized);
  }

  return board;
}
