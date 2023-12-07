import { createWriteStream } from "node:fs";

const logFile = createWriteStream("log.txt", { flags: "w" });

export function log(message: string) {
  logFile.write(`${message}\n`);
}
