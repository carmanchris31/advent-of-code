import { splitLines } from "../../lib/string/split-lines.js";

type History = number[];

function diffHistory(history: History): History {
  const diffs: number[] = [];
  for (const [index, value] of history.entries()) {
    if (index === 0) {
      continue;
    }

    diffs.push(value - history[index - 1]);
  }
  return diffs;
}

function getDiffs(history: History): History[] {
  const diffs: History[] = [];
  let diff: History = history;
  do {
    diff = diffHistory(diff);
    diffs.push(diff);
  } while (diff.some((v) => v !== 0));

  return diffs;
}

export function getNextValue(history: History): number {
  const diffs = [history, ...getDiffs(history)].reverse();
  const newValues: number[] = [0];

  for (const [index, diff] of diffs.entries()) {
    if (index === 0) {
      continue;
    }
    const lastValue = newValues[newValues.length - 1];
    const diffValue = diff[diff.length - 1];
    const newValue = lastValue + diffValue;
    newValues.push(newValue);
  }

  return newValues[newValues.length - 1];
}

export function parseHistories(input: string): History[] {
  const lines = splitLines(input.trim()).map((line) => line.trim());
  const histories = lines.map((line) => line.split(" ").map((v) => Number(v)));
  return histories;
}
