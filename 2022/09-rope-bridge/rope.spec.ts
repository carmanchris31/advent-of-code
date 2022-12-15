import test from "ava";
import { count } from "../../lib/array.js";
import { values } from "../../lib/object.js";
import { newPosition } from "../../lib/position.js";
import { countVisited, moveRope, newRope, newStep } from "./rope.js";

test("tail starts at same position as head", (t) => {
  const rope = newRope({ x: 4, y: 4 });

  t.deepEqual(rope.head.position, { x: 4, y: 4 });
  t.deepEqual(rope.tail.position, { x: 4, y: 4 });
});

test("head ends up in the right place", (t) => {
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
});

test("tail ends up in the right place", (t) => {
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

  t.deepEqual(rope.tail.position, newPosition(1, 2));
});

test("head has correct history", (t) => {
  const initialPosition = newPosition(0, 4);
  const rope = moveRope(newRope(initialPosition), [
    newStep("R", 4),
    newStep("U", 2),
  ]);

  t.deepEqual(rope.head.history, [
    newPosition(0, 4),
    // Right 4
    newPosition(1, 4),
    newPosition(2, 4),
    newPosition(3, 4),
    newPosition(4, 4),
    // Up 2
    newPosition(4, 3),
    newPosition(4, 2),
  ]);
});

test("tail has correct history", (t) => {
  const initialPosition = newPosition(0, 4);
  const rope = moveRope(newRope(initialPosition), [
    newStep("R", 4),
    newStep("U", 4),
    newStep("L", 3),
    newStep("D", 1),
    newStep("R", 4),
  ]);

  t.deepEqual(rope.tail.history, [
    newPosition(0, 4),
    // Right 4
    newPosition(0, 4),
    newPosition(1, 4),
    newPosition(2, 4),
    newPosition(3, 4),
    // Up 4
    newPosition(3, 4),
    newPosition(4, 3),
    newPosition(4, 2),
    newPosition(4, 1),
    // Left 3
    newPosition(4, 1),
    newPosition(3, 0),
    newPosition(2, 0),
    // Down 1
    newPosition(2, 0),
    // Right 4
    newPosition(2, 0),
    newPosition(2, 0),
    newPosition(3, 1),
    newPosition(4, 1),
  ]);
});

test("counts visited positions", (t) => {
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

  const visits = countVisited(rope.tail.history);

  const totalVisited = count(values(visits).flatMap((row) => values(row)));

  t.is(totalVisited, 13);
});
