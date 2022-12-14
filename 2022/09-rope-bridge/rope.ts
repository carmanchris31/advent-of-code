/**
 * @see https://adventofcode.com/2022/day/9
 */

import { movePosition, newPosition, Position } from "../../lib/position.js";

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
      history: [],
    },
    tail: {
      position: initialPosition,
      history: [],
    },
  };
}

const convertStepToDelta = (step: Step): Position => {
  switch (step.direction) {
    case "U":
      return newPosition(0, -step.amount);
    case "D":
      return newPosition(0, step.amount);
    case "L":
      return newPosition(-step.amount, 0);
    case "R":
      return newPosition(step.amount, 0);
  }
};

const moveHead = (rope: Rope, step: Step): Rope => {
  const newPosition = movePosition(
    rope.head.position,
    convertStepToDelta(step)
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
  const newPosition = rope.tail.position;

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

  rope = moveHead(rope, step);

  return rope;
}
