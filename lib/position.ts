export interface Position {
  x: number;
  y: number;
}

export type Delta = Position;

export function newPosition(x: number, y: number): Position {
  return {
    x,
    y,
  };
}

export function movePosition(initial: Position, delta: Position): Position {
  return newPosition(initial.x + delta.x, initial.y + delta.y);
}

export function getDelta(start: Position, end: Position): Delta {
  return {
    x: end.x - start.x,
    y: end.y - start.y,
  };
}

export function getDistance(start: Position, end: Position): Delta {
  const delta = getDelta(start, end);
  return {
    x: Math.abs(delta.x),
    y: Math.abs(delta.y),
  };
}
