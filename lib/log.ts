import { createWriteStream } from "node:fs";

const logFile = createWriteStream("log.txt", { flags: "a" });

export function log(message: string) {
  logFile.write(`${message}\n`);
}
