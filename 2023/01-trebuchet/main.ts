import { log } from "../../lib/log.js";
import { splitLines } from "../../lib/string/split-lines.js";
import { wordMap } from "./word-map.js";

export function findCalibrations(input: string) {
  const lines = splitLines(input).map((line) => line.trim());

  let calibrations: number[] = [];
  for (const line of lines) {
    let firstDigit: number | undefined;
    let lastDigit: number | undefined;
    log(`searching for first digit: ${line}`);
    firstDigitLoop: for (const [index, letter] of [...line].entries()) {
      log(`letter: ${letter}, index: ${index}`);
      if (!isNaN(Number(letter))) {
        firstDigit = Number(letter);
        log(`found digit: ${firstDigit}`);
        break firstDigitLoop;
      }

      for (const [word, value] of wordMap) {
        if (line.slice(0, index + 1).endsWith(word)) {
          log(`found word digit: ${word} -> ${value}`);
          firstDigit = value;
          break firstDigitLoop;
        }
      }
    }

    log(`searching for last digit: ${line}`);
    lastDigitLoop: for (const [index, letter] of [...line]
      .reverse()
      .entries()) {
      log(`letter: ${letter}, index: ${-index}`);
      if (!isNaN(Number(letter))) {
        lastDigit = Number(letter);
        log(`found digit: ${lastDigit}`);
        break lastDigitLoop;
      }

      for (const [word, value] of wordMap) {
        if (line.slice(-index - 1).startsWith(word)) {
          log(`found word digit: ${word} -> ${value}`);
          lastDigit = value;
          break lastDigitLoop;
        }
      }
    }

    if (firstDigit === undefined) {
      throw new Error(`Could not find first digit in line: ${line}`);
    }
    if (lastDigit === undefined) {
      throw new Error(`Could not find last digit in line: ${line}`);
    }

    const calibration = firstDigit * 10 + lastDigit;
    calibrations.push(calibration);
  }

  log(`calibrations: ${calibrations.join(", ")}`);
  return calibrations;
}
