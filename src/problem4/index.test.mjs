// Unit tests for sum_to_n — imports directly from index.ts.
// Run with: node --experimental-strip-types src/problem4/index.test.mjs
import assert from "node:assert/strict";
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index.ts";

// ── Test helpers ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`  ✓ ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${label}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ── Test cases ────────────────────────────────────────────────────────────────

// n=100000 → 5000050000, well under Number.MAX_SAFE_INTEGER (2^53-1)
const BIG_N      = 100_000;
const BIG_RESULT = 5_000_050_000;

// sum_to_n_c will stack-overflow above ~10 000 — tested separately below
const safeImplementations = [
  ["sum_to_n_a (Gauss formula)", sum_to_n_a],
  ["sum_to_n_b (iterative)    ", sum_to_n_b],
];

for (const [name, fn] of safeImplementations) {
  console.log(`\n${name}`);

  test("sum_to_n(1)  === 1",  () => assert.equal(fn(1),  1));
  test("sum_to_n(5)  === 15", () => assert.equal(fn(5),  15));
  test("sum_to_n(10) === 55", () => assert.equal(fn(10), 55));
  test("sum_to_n(100) === 5050", () => assert.equal(fn(100), 5050));
  test(`sum_to_n(${BIG_N.toLocaleString()}) === ${BIG_RESULT.toLocaleString()} (big number)`,
    () => assert.equal(fn(BIG_N), BIG_RESULT));
  test("sum_to_n(0)  === 0 (edge: zero)",     () => assert.equal(fn(0), 0));
  test("sum_to_n(-1) === 0 (edge: negative)", () => assert.equal(fn(-1), 0));
}

// sum_to_n_c: verify it works for normal inputs, then confirm it throws on a
// big number (stack overflow is expected — this is a known limitation).
console.log(`\nsum_to_n_c (recursive)    `);
test("sum_to_n(1)  === 1",  () => assert.equal(sum_to_n_c(1),  1));
test("sum_to_n(5)  === 15", () => assert.equal(sum_to_n_c(5),  15));
test("sum_to_n(10) === 55", () => assert.equal(sum_to_n_c(10), 55));
test("sum_to_n(100) === 5050", () => assert.equal(sum_to_n_c(100), 5050));
test("sum_to_n(0)  === 0 (edge: zero)",     () => assert.equal(sum_to_n_c(0), 0));
test("sum_to_n(-1) === 0 (edge: negative)", () => assert.equal(sum_to_n_c(-1), 0));
test(`sum_to_n(${BIG_N.toLocaleString()}) throws RangeError (stack overflow — expected)`,
  () => assert.throws(() => sum_to_n_c(BIG_N), RangeError));

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
