/**
 * cubes are either red, green, or blue
 * 
 
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green

Count number of games possible if only have X red cubes, Y green cubes, and Z blue cubes?
 */

import { log } from "../../lib/log.js";
import { splitLines } from "../../lib/string/split-lines.js";

interface ColorCount {
  [color: string]: number;
}

interface Game {
  id: number;
  counts: ColorCount[];
}

export function parseGames(input: string): Game[] {
  const lines = splitLines(input.trim()).map((input) => input.trim());
  const games = lines.map((line) => {
    log(`line: ${line}`);
    const gameId = Number(line.split(":")[0].split(" ")[1]);
    const counts = line
      .split(":")[1]
      .split(";")
      .map((pull) => {
        log(`pull: ${pull}`);
        const counts: Record<string, number> = {};
        for (const pair of pull.split(",")) {
          const [count, color] = pair.trim().split(" ");
          log(`pair: ${pair}; color: ${color}; count: ${count}`);
          if (!color) {
            throw new Error(
              `Missing color in ${pair}; pull: ${pull}, line: ${line}`
            );
          }
          counts[color] = Number(count);
        }
        log(`pull counts: ${JSON.stringify(counts)}`);
        return counts;
      });

    return {
      id: gameId,
      counts,
    };
  });
  return games;
}

export function isGamePossible(game: Game, maxColors: ColorCount) {
  const neededColors = new Set<string>(
    game.counts.flatMap((pull) => {
      const colors = Object.keys(pull);
      return colors;
    })
  );

  for (const neededColor of neededColors) {
    if (!maxColors[neededColor]) {
      return false;
    }
  }

  for (const [color, maxColor] of Object.entries(maxColors)) {
    if (game.counts.some((count) => count[color] > maxColor)) {
      return false;
    }
  }

  return true;
}

export function getMinColorsNeeded(game: Game): ColorCount {
  const minColors: ColorCount = {};

  log(`finding min colors needed`);
  for (const pull of game.counts) {
    for (const [color, count] of Object.entries(pull)) {
      const existing = minColors[color] ?? 0;
      log(`comparing ${count} for ${color} to ${existing}`);
      if (count > existing) {
        log(`new minimum for ${color}: ${count}`);
        minColors[color] = count;
      }
    }
  }

  return minColors;
}
