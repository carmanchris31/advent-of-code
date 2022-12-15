/**
 * @see https://adventofcode.com/2022/day/9
 */

import {
  getDelta,
  movePosition,
  newPosition,
  Position,
} from "../../lib/position.js";

interface Rope {
  head: {
    position: Position;
    history: Position[];
  };
  tail: {
    position: Position;
    history: Position[];
  };
}

export type Direction = "R" | "U" | "L" | "D";

export interface Step {
  direction: Direction;
  amount: number;
}

export function newStep(direction: Direction, amount: number) {
  return {
    direction,
    amount,
  };
}

export function newRope(initialPosition: Position): Rope {
  return {
    head: {
      position: initialPosition,
      history: [initialPosition],
    },
    tail: {
      position: initialPosition,
      history: [initialPosition],
    },
  };
}

const convertDirectionToDelta = (direction: Direction): Position => {
  switch (direction) {
    case "U":
      return newPosition(0, -1);
    case "D":
      return newPosition(0, 1);
    case "L":
      return newPosition(-1, 0);
    case "R":
      return newPosition(1, 0);
  }
};

const moveHead = (rope: Rope, direction: Direction): Rope => {
  const newPosition = movePosition(
    rope.head.position,
    convertDirectionToDelta(direction)
  );

  return {
    ...rope,
    head: {
      position: newPosition,
      history: rope.head.history.concat(newPosition),
    },
  };
};

// If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step in that direction so it remains close enough:
// if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:
const moveTail = (rope: Rope): Rope => {
  let newPosition = rope.tail.position;

  const delta = getDelta(rope.tail.position, rope.head.position);
  if (Math.abs(delta.x) > 1 && delta.y === 0) {
    newPosition = movePosition(rope.tail.position, {
      x: delta.x > 0 ? 1 : -1,
      y: 0,
    });
  } else if (Math.abs(delta.y) > 1 && delta.x === 0) {
    newPosition = movePosition(rope.tail.position, {
      y: delta.y > 0 ? 1 : -1,
      x: 0,
    });
  } else if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {
    newPosition = movePosition(rope.tail.position, {
      x: delta.x > 0 ? 1 : -1,
      y: delta.y > 0 ? 1 : -1,
    });
  }

  return {
    ...rope,
    tail: {
      position: newPosition,
      history: rope.tail.history.concat(newPosition),
    },
  };
};

export function moveRope(rope: Rope, step: Step | Step[]): Rope {
  if (Array.isArray(step)) {
    return step.reduce((r, s) => moveRope(r, s), rope);
  }

  for (let i = 0; i < step.amount; i++) {
    rope = moveHead(rope, step.direction);

    rope = moveTail(rope);
  }

  return rope;
}

export const countVisited = (
  positions: Position[]
): Record<number, Record<number, number>> => {
  const visited: Record<number, Record<number, number>> = {};

  positions.forEach((pos) => {
    if (!visited[pos.y]) {
      visited[pos.y] = [];
    }

    if (!visited[pos.y][pos.x]) {
      visited[pos.y][pos.x] = 0;
    }

    visited[pos.y][pos.x] += 1;
  });

  return visited;
};
