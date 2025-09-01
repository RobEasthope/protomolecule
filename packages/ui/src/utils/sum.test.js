"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sum_1 = require("./sum");
(0, vitest_1.describe)("sum", function () {
    (0, vitest_1.it)("adds positive numbers correctly", function () {
        (0, vitest_1.expect)((0, sum_1.sum)(1, 2)).toBe(3);
        (0, vitest_1.expect)((0, sum_1.sum)(10, 20)).toBe(30);
    });
    (0, vitest_1.it)("handles negative numbers", function () {
        (0, vitest_1.expect)((0, sum_1.sum)(-1, -2)).toBe(-3);
        (0, vitest_1.expect)((0, sum_1.sum)(-5, 5)).toBe(0);
    });
    (0, vitest_1.it)("handles zero", function () {
        (0, vitest_1.expect)((0, sum_1.sum)(0, 0)).toBe(0);
        (0, vitest_1.expect)((0, sum_1.sum)(5, 0)).toBe(5);
        (0, vitest_1.expect)((0, sum_1.sum)(0, -5)).toBe(-5);
    });
});
