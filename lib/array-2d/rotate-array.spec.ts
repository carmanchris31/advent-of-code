import { expect, test } from "@jest/globals";
import { rotate2DArray } from "./rotate-2d-array.js";

test("equal rows and columns", () => {
  const input = [
    ["0,0", "0,1", "0,2"],
    ["1,0", "1,1", "1,2"],
    ["2,0", "2,1", "2,2"],
  ];
  const expected = [
    ["2,0", "1,0", "0,0"],
    ["2,1", "1,1", "0,1"],
    ["2,2", "1,2", "0,2"],
  ];

  expect(rotate2DArray(input)).toEqual(expected);
});

test("more rows than columns", () => {
  const input = [
    ["0,0", "0,1"],
    ["1,0", "1,1"],
    ["2,0", "2,1"],
  ];
  const expected = [
    ["2,0", "1,0", "0,0"],
    ["2,1", "1,1", "0,1"],
  ];

  expect(rotate2DArray(input)).toEqual(expected);
});

test("more columns than rows", () => {
  const input = [
    ["0,0", "0,1", "0,2"],
    ["1,0", "1,1", "1,2"],
  ];
  const expected = [
    ["1,0", "0,0"],
    ["1,1", "0,1"],
    ["1,2", "0,2"],
  ];

  expect(rotate2DArray(input)).toEqual(expected);
});
