import test from "ava";
import { newPosition } from "../../lib/position.js";
import { moveRope, newRope, newStep } from "./rope.js";

test("tail starts at same position as head", (t) => {
  const rope = newRope({ x: 4, y: 4 });

  t.deepEqual(rope.head.position, { x: 4, y: 4 });
  t.deepEqual(rope.tail.position, { x: 4, y: 4 });
});

test("tail follows head correctly", (t) => {
  const initialPosition = newPosition(0, 4);
  const rope = moveRope(newRope(initialPosition), [
    newStep("R", 4),
    newStep("U", 4),
    newStep("L", 3),
    newStep("D", 1),
    newStep("R", 4),
    newStep("D", 1),
    newStep("L", 5),
    newStep("R", 2),
  ]);

  t.deepEqual(rope.head.position, newPosition(2, 2));
  t.deepEqual(rope.tail.position, newPosition(1, 2));
});
