// Problem 4: Three ways to sum to n

// Implementation 1: Gauss's formula (mathematical)
// Time: O(1) | Space: O(1)
// Uses the closed-form arithmetic series formula: n*(n+1)/2.
// Constant time and space — the most efficient approach.
// Guard for n <= 0: (-1 * 0) / 2 would produce JS's -0 without it.
export function sum_to_n_a(n: number): number {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}

// Implementation 2: Iterative loop
// Time: O(n) | Space: O(1)
// Accumulates the sum in a single pass from 1 to n.
// Linear time, but constant space — straightforward and easy to reason about.
// For negative n the loop body never executes, returning 0 rather than the
// negative series; adjust the loop bounds if negative support is needed.
export function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Implementation 3: Recursive
// Time: O(n) | Space: O(n) — one stack frame per call
// Elegant but least efficient: each recursive call adds a frame to the call
// stack, so large n risks a stack overflow. No tail-call optimisation in
// standard TS/JS runtimes, so this is purely for illustration.
export function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
