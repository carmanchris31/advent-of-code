export function hash(input: string): number {
  let hash = 0;
  for (const index of [...input].keys()) {
    const charCode = input.charCodeAt(index);
    hash += charCode;
    hash *= 17;
    hash %= 256;
  }
  return hash;
}

/*
boxes 0-255
focal length 1-9
each step
  label of the lens
    result has on label to get destination box for step
  operation (=) or (-)
    if -
      go to box, remove lens with the given label; do not leave a hole
    if =
      followed by number indicating the focal length of the lens that needs to go in the box
      if the lens already exists in the box, replace it
      else add lens to the end of the box
*/
interface Lens {
  label: string;
  focalLength: number;
}
type Box = Lens[];
export function getBoxes(steps: string[]): Box[] {
  const boxes: Box[] = [];

  for (const step of steps) {
    const operation = step.match(/[=-]/)?.toString();
    if (!operation) {
      throw new Error("Missing operation");
    }
    const label = step.split(operation)[0];
    const boxIndex = hash(label);
    if (!boxes[boxIndex]) {
      boxes[boxIndex] = [];
    }
    switch (operation) {
      case "-": {
        boxes[boxIndex] = boxes[boxIndex].filter(
          (lens) => lens.label !== label
        );
        break;
      }
      case "=": {
        const existing = boxes[boxIndex].find((lens) => lens.label === label);
        const focalLength = Number(step.split(operation)[1]);
        if (existing) {
          existing.focalLength = focalLength;
        } else {
          boxes[boxIndex].push({ label, focalLength });
        }
        break;
      }
    }
  }

  return boxes;
}

export function serialize(boxes: Box[]): string {
  return boxes
    .map((box, i) => {
      if (box.length > 0) {
        const lenses = box.map((lens) => `[${lens.label} ${lens.focalLength}]`);
        return `Box ${i}: ${lenses.join(" ")}`;
      }
    })
    .filter(Boolean)
    .join("\n");
}

export function getFocusingPower(boxes: Box[]): Map<string, number> {
  const totals = new Map<string, number>();

  for (const [boxIndex, box] of boxes.entries()) {
    if (!box) {
      // skip holes
      continue;
    }
    for (const [lensIndex, lens] of box.entries()) {
      const lensPower = (1 + boxIndex) * (1 + lensIndex) * lens.focalLength;
      totals.set(lens.label, (totals.get(lens.label) ?? 0) + lensPower);
    }
  }
  return totals;
}
