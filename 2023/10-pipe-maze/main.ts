/*
The pipes are arranged in a two-dimensional grid of tiles:

| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */

import { splitLines } from "../../lib/string/split-lines.js";

interface Tile {
  position: [number, number];
  type: string;
}
type Grid = Tile[][];

interface PathNode {
  tile: Tile;
  parent?: PathNode;
}
type Loop = Tile[];

const allDirections = ["north", "east", "south", "west"] as const;
type Direction = (typeof allDirections)[number];
const tileConnectionsMap: ReadonlyMap<string, Direction[]> = new Map([
  ["|", ["north", "south"]],
  ["-", ["east", "west"]],
  ["L", ["north", "east"]],
  ["J", ["north", "west"]],
  ["7", ["south", "west"]],
  ["F", ["south", "east"]],
  [".", []],
  ["S", ["north", "east", "south", "west"]], // Start tile can connect in any direction
]);

type Position = [row: number, col: number];
function movePosition(position: Position, direction: Direction): Position {
  let [row, col] = position;
  switch (direction) {
    case "north":
      return [row - 1, col];
    case "east":
      return [row, col + 1];
    case "south":
      return [row + 1, col];
    case "west":
      return [row, col - 1];
  }
}

function tileAtPosition(grid: Grid, position: Position): Tile | undefined {
  const [row, col] = position;
  return grid[row]?.[col];
}

export function parseGrid(input: string): Grid {
  const lines = splitLines(input.trim()).map((line) => line.trim());

  const grid: Tile[][] = lines.map((line, r) =>
    [...line].map((type, c) => ({
      position: [r, c],
      type,
    }))
  );

  return grid;
}

export function findStart(grid: Grid): Tile {
  const start = grid.flat().find((tile) => tile.type === "S");
  if (!start) {
    throw new Error("Unable to find start tile");
  }
  return start;
}

function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "north":
      return "south";
    case "east":
      return "west";
    case "south":
      return "north";
    case "west":
      return "east";
  }
}
function getConnections(grid: Grid, tile: Tile): ReadonlyMap<Direction, Tile> {
  const directions = tileConnectionsMap.get(tile.type) ?? [];
  const connections = new Map<Direction, Tile>();

  for (const direction of directions) {
    const other = tileAtPosition(grid, movePosition(tile.position, direction));
    if (!other) {
      continue;
    }

    const isConnected = tileConnectionsMap
      .get(other.type)
      ?.includes(getOppositeDirection(direction));
    if (isConnected) {
      connections.set(direction, other);
    }
  }
  return connections;
}

function* walk(grid: Grid, start: Tile): Generator<PathNode> {
  const nodes: Map<Tile, PathNode> = new Map();
  const queue: Tile[] = [];

  function getNode(tile: Tile): PathNode {
    let node = nodes.get(tile);
    if (!node) {
      node = { tile };
      nodes.set(tile, node);
    }
    return node;
  }

  let parent: Tile | undefined = start;
  while (parent) {
    const parentNode = getNode(parent);
    const children = getConnections(grid, parent);
    for (const [, child] of children) {
      const childNode = getNode(child);
      if (child === parentNode.parent?.tile) {
        // Don't go back the way we came
        continue;
      } else {
        childNode.parent = parentNode;
      }

      yield childNode;
      queue.push(child);
    }

    parent = queue.pop();
  }
}

export function findLoop(grid: Grid, start: Tile): Loop {
  const walker = walk(grid, start);
  for (const path of walker) {
    if (path.tile === start) {
      // Found our loop!
      const loop: Loop = [];
      let node: PathNode | undefined = path;
      while (node) {
        loop.push(node.tile);
        node = node.parent;
        if (node?.tile === start) {
          break;
        }
      }
      return loop;
    }
  }
  throw new Error("Unable to find loop");
}

export function findEnclosedTiles(grid: Grid, loop: Loop): Tile[] {
  const loopTiles = new Set(loop);
  const enclosed: Tile[] = [];

  for (const row of grid) {
    let inside = false;
    for (const tile of row) {
      if (loopTiles.has(tile)) {
        const northTile = getConnections(grid, tile).get("north");
        const isCrossing = northTile && loopTiles.has(northTile);
        if (isCrossing) {
          inside = !inside;
        }
      } else {
        if (inside) {
          enclosed.push(tile);
        }
      }
    }
  }

  return enclosed;
}
