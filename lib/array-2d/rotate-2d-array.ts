/**
 * Rotates a 2D array clockwise
 */
export function rotate2DArray<T>(source: T[][]): T[][] {
  const result: T[][] = [];
  for (const oldY of source.keys()) {
    for (const oldX of source[oldY].keys()) {
      const newY = oldX;
      const newX = source.length - oldY - 1;
      if (!result[newY]) {
        result[newY] = [];
      }
      result[newY][newX] = source[oldY][oldX];
    }
  }
  return result;
}
